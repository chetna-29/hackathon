import logging
import math
from typing import Any

import requests
from app.config import settings
from app.models.risk_zone import RiskZone
from app.models.shelter import Shelter
from sqlalchemy.orm import Session

logger = logging.getLogger("fire-eye.routing")


def calculate_haversine_distance(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def generate_safe_evacuation_route(
    db: Session,
    origin_lat: float,
    origin_lng: float,
    dest_lat: float | None = None,
    dest_lng: float | None = None,
    target_shelter_code: str | None = None,
    avoid_high_risk: bool = True,
) -> dict[str, Any]:

    destination_name = "Emergency Safe Shelter"
    target_shelter = None

    if target_shelter_code:
        target_shelter = (
            db.query(Shelter)
            .filter(Shelter.shelter_code == target_shelter_code)
            .first()
        )

    if not target_shelter and (dest_lat is None or dest_lng is None):
        shelters = (
            db.query(Shelter)
            .filter(
                Shelter.is_safe == True, Shelter.current_occupancy < Shelter.capacity
            )
            .all()
        )
        if shelters:
            target_shelter = min(
                shelters,
                key=lambda s: calculate_haversine_distance(
                    origin_lat, origin_lng, s.latitude, s.longitude
                ),
            )

    if target_shelter:
        dest_lat = target_shelter.latitude
        dest_lng = target_shelter.longitude
        destination_name = target_shelter.name
    elif dest_lat is None or dest_lng is None:
        dest_lat = origin_lat - 0.02
        dest_lng = origin_lng + 0.03
        destination_name = "Civil Defense Base Camp"

    # Gather High Risk Zones
    high_risk_zones = db.query(RiskZone).filter(RiskZone.risk_level == "HIGH").all()
    bypassed_zones = []

    avoid_polygons = []
    if avoid_high_risk:
        for zone in high_risk_zones:
            # Create a 2km bounding box polygon around the hazard center for ORS
            offset = 0.018  # roughly 2km
            polygon = [
                [zone.center_lng - offset, zone.center_lat - offset],
                [zone.center_lng + offset, zone.center_lat - offset],
                [zone.center_lng + offset, zone.center_lat + offset],
                [zone.center_lng - offset, zone.center_lat + offset],
                [zone.center_lng - offset, zone.center_lat - offset],
            ]
            # MultiPolygon expects [[[lon, lat], ...]]
            avoid_polygons.append([polygon])

            # Check if straight line crosses
            dist = calculate_haversine_distance(
                (origin_lat + dest_lat) / 2,
                (origin_lng + dest_lng) / 2,
                zone.center_lat,
                zone.center_lng,
            )
            if dist < 3.0:
                bypassed_zones.append(f"{zone.name} ({zone.zone_code})")

    hazard_status = "DETOUR_SAFE" if bypassed_zones else "DIRECT_SAFE"

    # Call OpenRouteService
    api_key = settings.ORS_API_KEY
    url = "https://api.openrouteservice.org/v2/directions/driving-car"

    headers = {"Authorization": api_key, "Content-Type": "application/json"}

    payload = {
        "coordinates": [[origin_lng, origin_lat], [dest_lng, dest_lat]],
        "instructions": True,
    }

    if avoid_polygons:
        payload["options"] = {
            "avoid_polygons": {"coordinates": avoid_polygons, "type": "MultiPolygon"}
        }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        data = resp.json()

        if "error" in data:
            logger.error(f"ORS Error: {data['error']}")
            raise Exception("ORS Routing Error")

        route = data["routes"][0]
        geom = route["geometry"]
        import polyline

        path_coords = polyline.decode(geom)

        total_dist_km = route["summary"]["distance"] / 1000.0
        duration_min = int(route["summary"]["duration"] / 60.0)

        steps = []
        for segment in route["segments"][0]["steps"]:
            steps.append(
                {
                    "instruction": segment["instruction"],
                    "distance_m": segment["distance"],
                    "safety_status": "MONITORED"
                    if "avoid" not in segment["instruction"].lower()
                    else "SAFE_HIGH_GROUND",
                }
            )

        return {
            "origin": {"lat": origin_lat, "lng": origin_lng},
            "destination": {"lat": dest_lat, "lng": dest_lng},
            "destination_name": destination_name,
            "distance_km": round(total_dist_km, 2),
            "duration_minutes": duration_min,
            "hazard_status": hazard_status,
            "bypassed_hazard_zones": bypassed_zones,
            "path": path_coords,
            "steps": steps,
        }

    except Exception as e:
        logger.error(f"Failed to fetch ORS route: {e}. Falling back to straight line.")

        # Fallback straight line
        total_dist = calculate_haversine_distance(
            origin_lat, origin_lng, dest_lat, dest_lng
        )
        return {
            "origin": {"lat": origin_lat, "lng": origin_lng},
            "destination": {"lat": dest_lat, "lng": dest_lng},
            "destination_name": destination_name,
            "distance_km": round(total_dist, 2),
            "duration_minutes": int((total_dist / 25.0) * 60),
            "hazard_status": hazard_status,
            "bypassed_hazard_zones": bypassed_zones,
            "path": [[origin_lat, origin_lng], [dest_lat, dest_lng]],
            "steps": [
                {
                    "instruction": f"Drive directly to {destination_name}",
                    "distance_m": total_dist * 1000,
                    "safety_status": "MONITORED",
                }
            ],
        }
