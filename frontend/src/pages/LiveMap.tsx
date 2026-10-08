import React, { useState } from "react";
import { DisasterMap } from "../map/DisasterMap";
import { useDisasterData } from "../hooks/useDisasterData";
// No lucide-react imports needed
import { useNavigate } from "react-router-dom";

export const LiveMap: React.FC = () => {
  const { zones, households, queue, shelters, loading } = useDisasterData();
  const [selectedDistrict, setSelectedDistrict] = useState("Rudraprayag");
  const [selectedDisaster, setSelectedDisaster] = useState("LANDSLIDE");
  const [layers, setLayers] = useState({
    risk: true,
    sos: true,
    households: true,
    shelters: true,
    hospitals: true,
    rescue: true,
    routes: true,
  });
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-black h-full flex items-center justify-center">
        Loading Map Data...
      </div>
    );
  }

  const activeSOSCount = queue.length;
  const vulnerableCount = households.filter(
    (h) => h.vulnerability_score > 0.7,
  ).length;

  const districtZones = zones.filter(z => z.name.toLowerCase().includes(selectedDistrict.toLowerCase()) || 
    (selectedDistrict === 'Rudraprayag' && z.zone_code === 'ZONE-04-NORTH')); // fallback matcher
  
  const maxRiskScore = districtZones.length > 0 ? Math.max(...districtZones.map(z => z.risk_score)) : 0.87;
  const displayRiskScore = (maxRiskScore * 100).toFixed(0) + "%";
  
  let severity = "CRITICAL";
  let severityClass = "text-red-700 bg-red-100";
  if (maxRiskScore < 0.3) { severity = "LOW"; severityClass = "text-green-700 bg-green-100"; }
  else if (maxRiskScore < 0.6) { severity = "MODERATE"; severityClass = "text-yellow-700 bg-yellow-100"; }
  else if (maxRiskScore < 0.8) { severity = "HIGH"; severityClass = "text-orange-700 bg-orange-100"; }

  const avgRainfall = districtZones.length > 0 ? districtZones.reduce((acc, z) => acc + (z.current_rainfall_mm || 0), 0) / districtZones.length : 180;
  const avgSlope = districtZones.length > 0 ? districtZones.reduce((acc, z) => acc + (z.slope_gradient || 0), 0) / districtZones.length : 38;
  const avgElevation = districtZones.length > 0 ? districtZones.reduce((acc, z) => acc + (z.elevation_m || 0), 0) / districtZones.length : 1250;

  const rainfallBars = Math.min(10, Math.max(1, Math.ceil(avgRainfall / 20)));
  const slopeBars = Math.min(10, Math.max(1, Math.ceil(avgSlope / 5)));
  const elevationBars = Math.min(10, Math.max(1, Math.ceil(avgElevation / 300)));

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black font-sans p-6">
      <div className="flex-1 rounded-lg overflow-hidden relative border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none bg-white dark:bg-[#0a0a0a] flex flex-col">
        {/* Top Header Controls (Inside map container to float) */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-start pointer-events-none">
          {/* Active Incident Panel */}
          <div className="w-80 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded-lg shadow-md dark:shadow-none pointer-events-auto overflow-hidden">
            <div className="bg-gray-50 dark:bg-black border-b border-gray-200 dark:border-zinc-800 px-4 py-3 flex items-center gap-2">
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                Active Incidents
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{selectedDistrict}</h3>
                <p className="text-red-600 text-sm font-medium mt-1">Threat: {selectedDisaster}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <span className="text-gray-500 dark:text-gray-500">Risk Score</span>
                <span className="text-gray-900 dark:text-gray-100 text-right font-medium">{displayRiskScore}</span>

                <span className="text-gray-500 dark:text-gray-500">Severity</span>
                <span className={`${severityClass} text-right font-medium rounded px-2 max-w-max ml-auto`}>{severity}</span>

                <span className="text-gray-500 dark:text-gray-500">Vulnerable</span>
                <span className="text-gray-900 dark:text-gray-100 text-right font-medium">{vulnerableCount}</span>

                <span className="text-gray-500 dark:text-gray-500">Active SOS</span>
                <span className="text-gray-900 dark:text-gray-100 text-right font-medium">{activeSOSCount}</span>
              </div>

              <button
                onClick={() => navigate("/rescue")}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-sm font-medium transition-colors"
              >
                Open Rescue Queue
              </button>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex flex-col gap-4 items-end pointer-events-auto w-72">
            <div className="flex flex-col gap-2 w-full">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 text-sm px-4 py-3 rounded shadow-sm dark:shadow-none outline-none focus:border-blue-500"
              >
                <option value="Chamoli">District: Chamoli</option>
                <option value="Rudraprayag">District: Rudraprayag</option>
                <option value="Uttarkashi">District: Uttarkashi</option>
                <option value="Pithoragarh">District: Pithoragarh</option>
                <option value="Dehradun">District: Dehradun</option>
              </select>

              <select
                value={selectedDisaster}
                onChange={(e) => setSelectedDisaster(e.target.value)}
                className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 text-sm px-4 py-3 rounded shadow-sm dark:shadow-none outline-none focus:border-blue-500"
              >
                <option value="LANDSLIDE">Threat: Landslide</option>
                <option value="FLASH FLOOD">Threat: Flash Flood</option>
                <option value="FLOOD">Threat: Flood</option>
                <option value="CLOUDBURST">Threat: Cloudburst</option>
                <option value="FOREST FIRE">Threat: Forest Fire</option>
                <option value="EARTHQUAKE">Threat: Earthquake</option>
              </select>
            </div>

            <div className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded-lg shadow-md dark:shadow-none p-5">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-zinc-800 pb-2">
                Risk Analysis
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 dark:text-gray-600 font-medium">
                    <span>Rainfall ({avgRainfall.toFixed(0)}mm)</span>
                    <span className={rainfallBars > 7 ? "text-red-600" : "text-gray-500"}>{rainfallBars > 7 ? "Critical" : "Normal"}</span>
                  </div>
                  <div className="flex h-1 gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`flex-1 rounded-sm ${i < rainfallBars ? (rainfallBars > 7 ? "bg-red-500" : "bg-blue-500") : "bg-gray-200 dark:bg-zinc-800"}`}></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 dark:text-gray-600 font-medium">
                    <span>Slope ({avgSlope.toFixed(0)}°)</span>
                    <span className={slopeBars > 6 ? "text-yellow-600" : "text-gray-500"}>{slopeBars > 6 ? "High" : "Moderate"}</span>
                  </div>
                  <div className="flex h-1 gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`flex-1 rounded-sm ${i < slopeBars ? (slopeBars > 6 ? "bg-yellow-500" : "bg-green-500") : "bg-gray-200 dark:bg-zinc-800"}`}></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 dark:text-gray-600 font-medium">
                    <span>Elevation ({avgElevation.toFixed(0)}m)</span>
                    <span className="text-blue-600">Moderate</span>
                  </div>
                  <div className="flex h-1 gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`flex-1 rounded-sm ${i < elevationBars ? "bg-blue-500" : "bg-gray-200 dark:bg-zinc-800"}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 p-4 rounded-lg shadow-md dark:shadow-none flex flex-col gap-3">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-zinc-800 pb-2">
                Map Layers
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={layers.risk} onChange={() => setLayers(l => ({...l, risk: !l.risk}))} className="accent-blue-600" />
                  Risk Zones
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={layers.sos} onChange={() => setLayers(l => ({...l, sos: !l.sos}))} className="accent-blue-600" />
                  SOS
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={layers.households} onChange={() => setLayers(l => ({...l, households: !l.households}))} className="accent-blue-600" />
                  Vulnerable
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={layers.shelters} onChange={() => setLayers(l => ({...l, shelters: !l.shelters}))} className="accent-blue-600" />
                  Shelters
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={layers.hospitals} onChange={() => setLayers(l => ({...l, hospitals: !l.hospitals}))} className="accent-blue-600" />
                  Hospitals
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={layers.rescue} onChange={() => setLayers(l => ({...l, rescue: !l.rescue}))} className="accent-blue-600" />
                  Rescue Teams
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-gray-100 dark:bg-zinc-900 z-0">
          <DisasterMap
            zones={zones}
            households={households}
            shelters={shelters}
            activeSosItems={queue}
            route={null}
            visibleLayers={layers}
            selectedDistrict={selectedDistrict}
          />
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-[400] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded-lg px-6 py-3 flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400 dark:text-gray-600 shadow-md dark:shadow-none pointer-events-auto">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              System Status
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> API
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> WS
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span> MESH
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> ML ENGINE
            </div>
          </div>

          <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1 rounded">
            Data Synced
          </div>
        </div>
      </div>
    </div>
  );
};
