from pydantic import BaseModel
from typing import List, Optional

class LatLng(BaseModel):
    lat: float
    lng: float

class RouteRequest(BaseModel):
    origin: LatLng
    destination: Optional[LatLng] = None
    target_shelter_code: Optional[str] = None
    avoid_high_risk: bool = True

class RouteStep(BaseModel):
    instruction: str
    distance_m: float
    safety_status: str

class RouteResponse(BaseModel):
    origin: LatLng
    destination: LatLng
    destination_name: str
    distance_km: float
    duration_minutes: int
    hazard_status: str # SAFE, ELEVATED, BLOCKED
    bypassed_hazard_zones: List[str]
    path: List[List[float]] # [[lat, lng], [lat, lng], ...]
    steps: List[RouteStep]
