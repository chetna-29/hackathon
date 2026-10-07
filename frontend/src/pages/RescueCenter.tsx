import React, { useState } from 'react';
import { useDisasterData } from '../hooks/useDisasterData';
import { PriorityQueue } from '../components/PriorityQueue';
import { SOSPanel } from '../components/SOSPanel';
import type { PriorityItem, RouteResponse } from '../types';
import { routingApi } from '../services/api';

export const RescueCenter: React.FC = () => {
  const { queue, loading } = useDisasterData();
  const [selectedSOS, setSelectedSOS] = useState<PriorityItem | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);

  const handleCalculateRoute = async () => {
    if (!selectedSOS) return;
    try {
      const res = await routingApi.getSafeRoute({lat: selectedSOS.latitude, lng: selectedSOS.longitude});
      setRoute(res);
    } catch (e) {
      console.error("Routing failed", e);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400 animate-pulse">Loading rescue center...</div>;
  }

  return (
    <div className="flex h-full gap-4">
      {/* Left: Queue */}
      <div className="w-1/2 min-w-[400px]">
        <PriorityQueue queue={queue} onSelect={setSelectedSOS} />
      </div>

      {/* Right: Selected Details & Route */}
      <div className="flex-1 flex flex-col gap-4">
        {selectedSOS ? (
          <>
            <div className="flex-1 min-h-0">
              <SOSPanel 
                item={selectedSOS} 
                onClose={() => { setSelectedSOS(null); setRoute(null); }}
                onCalculateRoute={handleCalculateRoute}
              />
            </div>
            
            {/* Recommended Route Panel (Mocked for visual structure as per design) */}
            {route && (
              <div className="h-64 bg-gray-900/80 rounded-xl border border-gray-800 p-4 flex flex-col shrink-0">
                <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">Recommended Route</h3>
                <div className="flex gap-4 h-full">
                  <div className="flex-1 bg-black rounded-lg border border-gray-700 relative overflow-hidden flex items-center justify-center text-gray-600 font-mono text-sm">
                    {/* Simulated small route map placeholder */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3445/5860')] bg-cover"></div>
                    <span className="relative z-10">Route Visualization Loaded</span>
                  </div>
                  <div className="w-48 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> Rescue Team
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full bg-danger"></span> Household (SOS)
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full bg-safe"></span> Shelter
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800">
                      <div>
                        <p className="text-[10px] text-gray-500">Distance</p>
                        <p className="text-sm font-bold text-white">{route.distance_km.toFixed(1)} km</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Estimated Time</p>
                        <p className="text-sm font-bold text-white">35 mins</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Risk Level</p>
                        <p className="text-sm font-bold text-safe">Low</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Blocked Roads</p>
                        <p className="text-sm font-bold text-white">0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-center text-gray-500">
            Select an SOS request to view details
          </div>
        )}
      </div>
    </div>
  );
};
