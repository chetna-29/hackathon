import React, { useState } from "react";
import { useDisasterData } from "../hooks/useDisasterData";
import { routingApi } from "../services/api";
import type { PriorityItem, RouteResponse } from "../types";

export const RescueCenter: React.FC = () => {
  const { queue, loading } = useDisasterData();
  const [selectedSOS, setSelectedSOS] = useState<PriorityItem | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [calculating, setCalculating] = useState(false);

  const handleCalculateRoute = async () => {
    if (!selectedSOS) return;
    setCalculating(true);
    try {
      const res = await routingApi.getSafeRoute({
        lat: selectedSOS.latitude,
        lng: selectedSOS.longitude,
      });
      setRoute(res);
    } catch (e) {
      console.error("Routing failed", e);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-black text-gray-500 dark:text-gray-500 font-sans">
        Loading Rescue Center...
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans">
      {/* Left Panel: Queue */}
      <div className="w-[350px] border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-medium tracking-tight">Active Requests</h2>
          <p className="text-sm text-gray-500 dark:text-gray-500">{queue.length} targets pending</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {queue.map((item, index) => (
            <div
              key={item.sos_id}
              onClick={() => {
                setSelectedSOS(item);
                setRoute(null);
              }}
              className={`p-4 rounded border cursor-pointer transition-colors ${
                selectedSOS?.sos_id === item.sos_id
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:bg-black"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-500">ID: {item.sos_code || `TGT-${index}`}</span>
                <span className={`text-xs px-2 py-1 rounded ${item.severity === "CRITICAL" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {item.severity}
                </span>
              </div>
              <h3 className="font-medium mb-1">Sector {item.household_code}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Score: {item.priority_score.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Operations */}
      <div className="flex-1 p-8 flex flex-col">
        {selectedSOS ? (
          <div className="max-w-4xl mx-auto w-full">
            <h2 className="text-2xl font-medium tracking-tight mb-6">Target: Sector {selectedSOS.household_code}</h2>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">Severity</div>
                <div className="text-xl font-medium">{selectedSOS.severity}</div>
              </div>
              <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">Vulnerable Occupants</div>
                <div className="text-xl font-medium">{selectedSOS.elderly_count + selectedSOS.disabled_count}</div>
              </div>
              <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
                <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">Coordinates</div>
                <div className="text-xl font-medium">{selectedSOS.latitude.toFixed(4)}, {selectedSOS.longitude.toFixed(4)}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Routing System</h3>
                <button
                  onClick={handleCalculateRoute}
                  disabled={calculating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {calculating ? "Calculating..." : "Calculate Route"}
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-black rounded border border-gray-200 dark:border-zinc-800 h-64 flex items-center justify-center">
                {route ? (
                  <div className="text-center">
                    <div className="text-3xl font-medium mb-2">{route.distance_km.toFixed(1)} km</div>
                    <p className="text-gray-500 dark:text-gray-500 mb-4">Estimated time: {(route.distance_km * 4).toFixed(0)} min</p>
                    <p className="text-sm text-green-600 font-medium">{route.hazard_status || "Path Clear"}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-500">Route not calculated yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
               <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded text-sm font-medium transition-colors">
                 Dispatch Rescue Team
               </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-500">
            Select a target from the queue to view details.
          </div>
        )}
      </div>
    </div>
  );
};
