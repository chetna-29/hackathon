import React from "react";
import { AlertTriangle, Navigation, Home as HomeIcon, PhoneCall, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useDisasterData } from "../hooks/useDisasterData";
import { routingApi } from "../services/api";
import { CitizenMap } from "../components/CitizenMap";
import type { RouteResponse } from "../types";

export const CitizenSafety: React.FC = () => {
  const { shelters } = useDisasterData();
  const nearestShelter = shelters.length > 0 ? shelters[0] : null;
  const [route, setRoute] = React.useState<RouteResponse | null>(null);
  const [calculating, setCalculating] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState<[number, number] | null>(null);

  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setCurrentLocation([30.3165, 78.0322]) // fallback
      );
    } else {
      setCurrentLocation([30.3165, 78.0322]); // fallback
    }
  }, []);

  const handleGetRoute = async () => {
    if (!nearestShelter) return;
    setCalculating(true);
    try {
      const originLat = currentLocation ? currentLocation[0] : 30.3165;
      const originLng = currentLocation ? currentLocation[1] : 78.0322;
      const res = await routingApi.getSafeRoute(
        { lat: originLat, lng: originLng },
        undefined,
        nearestShelter.shelter_code
      );
      setRoute(res);
    } catch (e) {
      console.error(e);
      alert("Failed to calculate safe route.");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-y-auto font-sans text-gray-900 dark:text-gray-100 pb-20">
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-zinc-800 p-4 sticky top-0 z-50">
        <h1 className="text-xl font-medium tracking-tight">Safety Center</h1>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-lg mx-auto w-full flex flex-col gap-6">
        {/* CURRENT RISK */}
        <div className="bg-white dark:bg-[#0a0a0a] rounded-lg p-6 border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
          <p className="text-sm text-gray-500 dark:text-gray-500 uppercase font-medium tracking-wider mb-4">
            Current Risk
          </p>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-600 font-medium text-4xl tracking-tight mb-1">
                HIGH
              </p>
              <p className="text-base font-medium">Landslide Risk</p>
            </div>
            <div className="w-12 h-12 rounded bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* ACTIVE ALERTS */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-500 uppercase font-medium tracking-wider mb-3">
            Active Alerts
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex items-start gap-4 shadow-sm dark:shadow-none">
            <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 uppercase tracking-wider mb-1">
                Landslide Warning
              </p>
              <p className="text-sm text-yellow-700">
                High risk detected in your area. Avoid steep slopes and follow marked safe routes.
              </p>
            </div>
          </div>
        </div>

        {/* EMERGENCY INSTRUCTIONS */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-500 uppercase font-medium tracking-wider mb-3">
            Emergency Instructions
          </p>
          <div className="bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm dark:shadow-none">
            <div className="p-5 border-b border-gray-200 dark:border-zinc-800 bg-green-50/50">
              <p className="text-sm font-medium text-green-700 mb-3">DO:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> 
                  Move away from steep slopes
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> 
                  Follow marked safe routes
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" /> 
                  Stay away from blocked roads
                </li>
              </ul>
            </div>
            <div className="p-5 bg-red-50/50">
              <p className="text-sm font-medium text-red-700 mb-3">DON'T:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" /> 
                  Do not cross debris
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" /> 
                  Do not approach unstable slopes
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" /> 
                  Do not ignore evacuation instructions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SAFE SHELTERS */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-500 uppercase font-medium tracking-wider mb-3">
            Safe Shelters
          </p>
          <div className="bg-white dark:bg-[#0a0a0a] rounded-lg p-5 border border-gray-200 dark:border-zinc-800 flex items-center justify-between shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-gray-600 dark:text-gray-400 dark:text-gray-600" />
              </div>
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {nearestShelter?.name || "Relief Center"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {route ? `${route.distance_km} km` : "2.8 km"} away • <span className="text-green-600 font-medium">Open</span>
                </p>
              </div>
            </div>
            <button 
              onClick={handleGetRoute}
              disabled={calculating}
              className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
          {route && (
            <div className="mt-3 flex flex-col gap-3">
              <div className="h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                <CitizenMap 
                  origin={currentLocation || [30.3165, 78.0322]} 
                  destination={nearestShelter ? [nearestShelter.latitude, nearestShelter.longitude] : null} 
                  route={route} 
                />
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded border border-green-200 dark:border-green-800 text-sm shadow-sm">
                <div className="font-medium mb-1">Evacuation Route Ready</div>
                <div>Head towards {route.destination_name}</div>
                <div>Est. Distance: {route.distance_km} km</div>
                <div>Est. Time: {route.duration_minutes} mins</div>
                <div className="mt-2 text-xs font-medium bg-white/50 p-2 rounded">{route.hazard_status.replace(/_/g, " ")}</div>
              </div>
            </div>
          )}
        </div>

        {/* EMERGENCY CONTACTS */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-500 uppercase font-medium tracking-wider mb-3">
            Emergency Contacts
          </p>
          <div className="grid grid-cols-1 gap-3">
            <button className="w-full bg-white dark:bg-[#0a0a0a] rounded-lg p-5 border border-gray-200 dark:border-zinc-800 flex items-center justify-between hover:bg-gray-50 dark:bg-black transition-colors text-left shadow-sm dark:shadow-none">
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  NDRF Emergency Line
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  National Disaster Response
                </p>
              </div>
              <PhoneCall className="w-5 h-5 text-red-600" />
            </button>
            <button className="w-full bg-white dark:bg-[#0a0a0a] rounded-lg p-5 border border-gray-200 dark:border-zinc-800 flex items-center justify-between hover:bg-gray-50 dark:bg-black transition-colors text-left shadow-sm dark:shadow-none">
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  Medical Assistance
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Ambulance & First Aid
                </p>
              </div>
              <PhoneCall className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
