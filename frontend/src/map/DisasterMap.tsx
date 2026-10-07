import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RiskZone, Household, Shelter, RouteResponse, PriorityItem } from '../types';

// Fix Leaflet default icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons matching the cinematic design
const createCustomIcon = (emoji: string, bgColor: string, color: string = 'white', glow: string = 'none') => L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="font-size: 14px; color: ${color}; background: ${bgColor}; border-radius: 50%; border: 1px solid rgba(255,255,255,0.4); text-align: center; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: ${glow};">${emoji}</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

// Create an animated SOS pulse icon
const SosIcon = L.divIcon({
  className: 'sos-map-icon',
  html: `<div class="relative flex items-center justify-center w-8 h-8">
           <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
           <div class="relative flex items-center justify-center w-6 h-6 bg-red-600 border-2 border-white rounded-full text-white font-bold text-xs shadow-[0_0_15px_#ef4444]">!</div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const HouseholdIcon = createCustomIcon('👤', '#1f2937', '#9ca3af'); // gray
const VulnerableIcon = createCustomIcon('🧑‍🦯', '#f59e0b', 'white', '0 0 10px rgba(245, 158, 11, 0.5)'); // amber with glow
const ShelterIcon = createCustomIcon('🏡', '#10b981', 'white', '0 0 10px rgba(16, 185, 129, 0.5)'); // green
const HospitalIcon = createCustomIcon('🏥', '#3b82f6', 'white', '0 0 10px rgba(59, 130, 246, 0.5)'); // blue
const RescueIcon = createCustomIcon('🚑', '#ef4444', 'white', '0 0 10px rgba(239, 68, 68, 0.5)'); // red

interface VisibleLayers {
  risk: boolean;
  sos: boolean;
  households: boolean;
  shelters: boolean;
  hospitals: boolean;
  rescue: boolean;
  routes: boolean;
}

interface Props {
  zones: RiskZone[];
  households: Household[];
  shelters: Shelter[];
  activeSosItems: PriorityItem[];
  route: RouteResponse | null;
  visibleLayers?: VisibleLayers;
  selectedDistrict?: string;
}

// Component to handle flying to selected district
const DistrictFocus = ({ districtName }: { districtName?: string }) => {
  const map = useMap();
  useEffect(() => {
    // Rough coordinates for Uttarakhand districts
    const coordinates: Record<string, [number, number]> = {
      'Chamoli': [30.273, 79.324],
      'Rudraprayag': [30.2844, 78.9811],
      'Uttarkashi': [30.726, 78.435],
      'Pithoragarh': [29.582, 80.218],
      'Dehradun': [30.316, 78.032],
    };
    if (districtName && coordinates[districtName]) {
      map.flyTo(coordinates[districtName], 11, { duration: 2 });
    } else {
      map.flyTo([30.0668, 79.0193], 9, { duration: 2 }); // Default UK
    }
  }, [districtName, map]);
  return null;
};

// Reverse Geocoding Component
const ReverseGeocode = ({ lat, lng }: { lat: number, lng: number }) => {
  const [address, setAddress] = React.useState('Fetching location...');
  React.useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(r => r.json())
      .then(d => {
        // Just extract a shorter readable address
        const parts = [];
        if (d.address?.village || d.address?.town || d.address?.city) parts.push(d.address.village || d.address.town || d.address.city);
        if (d.address?.county || d.address?.state_district) parts.push(d.address.county || d.address.state_district);
        if (d.address?.state) parts.push(d.address.state);
        setAddress(parts.length > 0 ? parts.join(', ') : d.display_name || 'Location unknown');
      })
      .catch(() => setAddress('Location lookup failed'));
  }, [lat, lng]);
  return <p className="text-[10px] text-gray-300 mt-1 truncate max-w-[250px]" title={address}>📍 {address}</p>;
};

export const DisasterMap: React.FC<Props> = ({ 
  zones, 
  households, 
  shelters, 
  activeSosItems, 
  route,
  visibleLayers = { risk: true, sos: true, households: true, shelters: true, hospitals: true, rescue: true, routes: true },
  selectedDistrict
}) => {
  const defaultCenter: [number, number] = [30.0668, 79.0193]; 
  const bounds = L.latLngBounds([28.7, 77.5], [31.5, 81.1]); // Uttarakhand bounds
  
  const getZoneColor = (level: string) => {
    if (level === 'HIGH') return '#ef4444';
    if (level === 'MEDIUM') return '#f59e0b';
    return '#10b981';
  };

  const getHouseholdIcon = (hh: Household) => {
    if (hh.elderly_count > 0 || hh.disabled_count > 0 || hh.medical_needs) return VulnerableIcon;
    return HouseholdIcon;
  };

  // Mock a safe route if none is provided, to satisfy visual requirement (blue/cyan line)
  const mockRoutePositions: [number, number][] = [
    [30.2846, 78.9815], // Origin (SOS)
    [30.2860, 78.9850],
    [30.2880, 78.9880],
    [30.2900, 78.9900], // Destination (Shelter)
  ];

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={9} 
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      style={{ height: '100%', width: '100%', background: '#0b1120' }}
      zoomControl={false} // Clean up UI, we can add a custom positioned one if needed
    >
      <DistrictFocus districtName={selectedDistrict} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
        className="map-tiles-dark"
      />

      {/* Render Risk Zones */}
      {visibleLayers.risk && zones.map(zone => (
        <Circle
          key={zone.zone_code}
          center={[zone.center_lat, zone.center_lng]}
          radius={2500}
          pathOptions={{ 
            color: getZoneColor(zone.risk_level),
            fillColor: getZoneColor(zone.risk_level), 
            fillOpacity: zone.risk_level === 'HIGH' ? 0.4 : 0.2,
            weight: zone.risk_level === 'HIGH' ? 3 : 1,
            dashArray: '5, 5'
          }}
          className={zone.risk_level === 'HIGH' ? 'animate-pulse' : ''} // CSS pulse for high risk
        >
          <Popup className="cinematic-popup" offset={[0, -10]}>
            <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 p-4 w-64 rounded-lg shadow-2xl text-gray-200">
              <h3 className="font-bold text-lg text-white tracking-normal uppercase mb-1 border-b border-gray-800 pb-2">{zone.name}</h3>
              <div className="space-y-2 mt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Level</span>
                  <span className={`font-bold ${zone.risk_level === 'HIGH' ? 'text-danger' : 'text-warning'}`}>{zone.risk_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Score</span>
                  <span className="font-bold text-white">{(zone.risk_score * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vulnerable</span>
                  <span className="font-bold text-warning">{zone.vulnerable_population}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active SOS</span>
                  <span className="font-bold text-danger">{activeSosItems.length}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Circle>
      ))}

      {/* Render Households (Hide SOS ones as they will be rendered in SOS layer) */}
      {visibleLayers.households && households.filter(h => !activeSosItems.some(s => s.household_code === h.household_code)).map(hh => (
        <Marker 
          key={hh.household_code} 
          position={[hh.latitude, hh.longitude]}
          icon={getHouseholdIcon(hh)}
        />
      ))}

      {/* Render SOS Requests */}
      {visibleLayers.sos && activeSosItems.map(sos => (
        <Marker 
          key={sos.sos_id} 
          position={[sos.latitude, sos.longitude]}
          icon={SosIcon}
          zIndexOffset={1000} // Keep SOS markers on top
        >
          <Popup className="cinematic-popup" offset={[0, -16]}>
             <div className="bg-gray-900/95 backdrop-blur-md border-l-4 border-l-danger border-y border-y-gray-700 border-r border-r-gray-700 p-4 w-72 rounded-r-lg shadow-2xl text-gray-200">
               <div className="flex justify-between items-start mb-3 border-b border-gray-800 pb-2">
                 <div>
                   <h3 className="font-bold text-sm text-danger tracking-normal uppercase">SOS REQUEST</h3>
                   <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {sos.sos_code} | HH: {sos.household_code}</p>
                   <ReverseGeocode lat={sos.latitude} lng={sos.longitude} />
                 </div>
                 <span className="bg-danger/20 text-danger border border-danger/30 text-[9px] px-2 py-0.5 rounded font-bold">ACTIVE</span>
               </div>
               
               <div className="space-y-2 text-xs mb-4">
                 <div className="flex justify-between">
                   <span className="text-gray-400">Severity</span>
                   <span className="font-bold text-danger">{sos.severity}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-400">Vulnerability</span>
                   <span className="font-bold text-warning">{sos.elderly_count > 0 ? 'Elderly present' : 'High'}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-400">Priority Score</span>
                   <span className="font-bold text-danger font-mono">{sos.priority_score.toFixed(1)}</span>
                 </div>
               </div>

               <div className="flex gap-2">
                 <a href="/rescue" className="flex-1 block text-center bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white text-[10px] py-2 rounded font-bold tracking-normal transition-colors">
                   VIEW RESCUE
                 </a>
                 <a href="/rescue" className="flex-1 block text-center bg-blue-900/40 hover:bg-blue-800/60 border border-blue-800 text-blue-400 text-[10px] py-2 rounded font-bold tracking-normal transition-colors">
                   SAFE ROUTE
                 </a>
               </div>
             </div>
          </Popup>
        </Marker>
      ))}

      {/* Render Shelters */}
      {visibleLayers.shelters && shelters.map(sh => (
        <Marker 
          key={sh.shelter_code} 
          position={[sh.latitude, sh.longitude]}
          icon={ShelterIcon}
        >
          <Popup className="cinematic-popup" offset={[0, -10]}>
            <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 p-3 w-48 rounded-lg shadow-2xl text-gray-200">
              <h3 className="font-bold text-sm text-white mb-2">{sh.name}</h3>
              <p className="text-xs text-safe font-bold mb-3">{sh.available_beds} BEDS AVAILABLE</p>
              <a href="/shelters" className="block text-center w-full bg-gray-800 hover:bg-gray-700 text-white text-[10px] py-1.5 rounded font-medium border border-gray-600">
                VIEW SHELTER
              </a>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Mock Hospital */}
      {visibleLayers.hospitals && (
        <Marker position={[30.3, 79.0]} icon={HospitalIcon} />
      )}

      {/* Mock Rescue Team */}
      {visibleLayers.rescue && (
        <Marker position={[30.27, 78.96]} icon={RescueIcon} />
      )}

      {/* Render Route */}
      {visibleLayers.routes && (route || mockRoutePositions) && (
        <>
          {/* Glowing cyan line for safe route */}
          <Polyline 
            positions={(route ? route.path : mockRoutePositions) as [number, number][]} 
            pathOptions={{ color: '#06b6d4', weight: 4, opacity: 0.8, className: 'safe-route-line' }} 
          />
          {/* Animated dashed overlay for direction/flow */}
          <Polyline 
            positions={(route ? route.path : mockRoutePositions) as [number, number][]} 
            pathOptions={{ color: '#ffffff', weight: 2, dashArray: '5, 10', opacity: 0.5, className: 'route-flow-animation' }} 
          />
        </>
      )}
    </MapContainer>
  );
};
