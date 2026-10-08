import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RouteResponse } from "../types";

// Fix Leaflet default icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createCustomIcon = (
  emoji: string,
  bgColor: string,
  color: string = "white",
) =>
  L.divIcon({
    className: "custom-map-icon",
    html: `<div style="font-size: 14px; color: ${color}; background: ${bgColor}; border-radius: 50%; border: 1px solid rgba(255,255,255,0.4); text-align: center; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">${emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

const OriginIcon = createCustomIcon("📍", "#3b82f6"); // Blue
const DestIcon = createCustomIcon("🏡", "#10b981"); // Green

// Fit bounds to route
const RouteFocus = ({ route, origin, dest }: { route: RouteResponse | null, origin: [number, number], dest: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.path && route.path.length > 0) {
      const bounds = L.latLngBounds(route.path as [number, number][]);
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (dest) {
      const bounds = L.latLngBounds([origin, dest]);
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      map.flyTo(origin, 14);
    }
  }, [route, origin, dest, map]);
  return null;
};

interface CitizenMapProps {
  origin: [number, number];
  destination?: [number, number] | null;
  route: RouteResponse | null;
}

export const CitizenMap: React.FC<CitizenMapProps> = ({ origin, destination, route }) => {
  return (
    <MapContainer
      center={origin}
      zoom={14}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />
      <RouteFocus route={route} origin={origin} dest={destination || null} />

      <Marker position={origin} icon={OriginIcon} />
      
      {destination && (
        <Marker position={destination} icon={DestIcon} />
      )}

      {route && (
        <Polyline
          positions={route.path as [number, number][]}
          pathOptions={{
            color: "#3b82f6", // Blue for route
            weight: 4,
            opacity: 0.8,
          }}
        />
      )}
    </MapContainer>
  );
};
