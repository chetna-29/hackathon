import React, { useState } from "react";
import { useDisasterData } from "../hooks/useDisasterData";
import { meshApi, sosApi, routingApi } from "../services/api";
import { CitizenMap } from "../components/CitizenMap";
import type { RouteResponse } from "../types";

export const CitizenDashboard: React.FC = () => {
  const { shelters, activeSos } = useDisasterData();
  const [sosState, setSosState] = useState<
    "IDLE" | "HOLDING" | "TRANSMITTING" | "SENT"
  >("IDLE");
  const [holdProgress, setHoldProgress] = useState(0);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

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

  const hasActiveSos =
    activeSos.some((s) => s.household_code === "H104") || sosState === "SENT";

  const handlePointerDown = () => {
    if (hasActiveSos) return;
    setSosState("HOLDING");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        triggerSos();
      }
    }, 100);

    const handlePointerUp = () => {
      clearInterval(interval);
      if (progress < 100 && sosState !== "TRANSMITTING") {
        setSosState("IDLE");
        setHoldProgress(0);
      }
      document.removeEventListener("pointerup", handlePointerUp);
    };
    document.addEventListener("pointerup", handlePointerUp);
  };

  const triggerSos = async () => {
    setSosState("TRANSMITTING");
    setHoldProgress(100);
    try {
      const payload = {
        household_code: "H104", // Or dynamically fetched
        latitude: currentLocation ? currentLocation[0] : 30.3165,
        longitude: currentLocation ? currentLocation[1] : 78.0322,
        emergency_type: "MEDICAL",
        severity: "CRITICAL",
        notes: "Citizen SOS triggered via Mobile Web",
        via_mesh: navigator.onLine ? "FALSE" : "TRUE",
      };

      if (navigator.onLine) {
        await sosApi.createSOS(payload);
      } else {
        await meshApi.triggerSimulatedSOS({
          message_id: `mesh-${Date.now()}`,
          sender_id: "VictimClient",
          type: "SOS",
          household_id: "H104",
          latitude: currentLocation ? currentLocation[0] : 30.3165,
          longitude: currentLocation ? currentLocation[1] : 78.0322,
          severity: "CRITICAL",
          timestamp: Math.floor(Date.now() / 1000),
          payload: {
            vulnerabilities: [],
            people_count: 1,
            battery_level: 100,
          },
        });
      }
      setSosState("SENT");
    } catch (e) {
      console.error(e);
      setSosState("IDLE");
      setHoldProgress(0);
      alert("Failed to send SOS");
    }
  };

  const handleGetRoute = async () => {
    setCalculatingRoute(true);
    try {
      const originLat = currentLocation ? currentLocation[0] : 30.3165;
      const originLng = currentLocation ? currentLocation[1] : 78.0322;
      const res = await routingApi.getSafeRoute(
        { lat: originLat, lng: originLng },
        undefined,
        nearestShelter?.shelter_code
      );
      setRoute(res);
    } catch (e) {
      console.error(e);
      alert("Failed to calculate route");
    } finally {
      setCalculatingRoute(false);
    }
  };

  const nearestShelter = shelters.length > 0 ? shelters[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans flex flex-col selection:bg-blue-100">
      <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-medium tracking-tight">Fire-Eye</h1>
        <div className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
          System Connected
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* SOS Section */}
        <section className="bg-white dark:bg-[#0a0a0a] p-8 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none flex flex-col items-center justify-center min-h-[400px]">
          {!hasActiveSos ? (
            <>
              <h2 className="text-2xl font-medium mb-2 text-center">Need Emergency Help?</h2>
              <p className="text-gray-500 dark:text-gray-500 mb-8 text-center max-w-xs">Press and hold the button below to alert rescue teams.</p>
              
              <button
                onPointerDown={handlePointerDown}
                onContextMenu={(e) => e.preventDefault()}
                className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-colors select-none ${
                  sosState === "TRANSMITTING"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                style={{ touchAction: "none" }}
              >
                {sosState === "HOLDING" && (
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-white/30"
                    style={{ clipPath: `inset(${100 - holdProgress}% 0 0 0)` }}
                  />
                )}
                <span className="text-3xl font-medium">SOS</span>
                {sosState === "TRANSMITTING" && <span className="text-sm mt-2">Transmitting...</span>}
              </button>
            </>
          ) : (
            <div className="w-full text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
              <h2 className="text-2xl font-medium text-red-600 mb-2">SOS Sent Successfully</h2>
              <p className="text-gray-500 dark:text-gray-500 mb-6">Rescue teams have been notified and are on their way.</p>
              <div className="bg-gray-50 dark:bg-black p-4 rounded border border-gray-200 dark:border-zinc-800 text-left space-y-2">
                <div className="text-sm font-medium">Status Updates:</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-600">• Request logged in mesh network</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-600">• Command center acknowledged</div>
                <div className="text-sm text-green-600 font-medium">• Rescue team dispatched</div>
              </div>
            </div>
          )}
        </section>

        {/* Info Section */}
        <section className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-4 uppercase tracking-wider">Safety Status</h3>
            <div className="text-3xl font-medium text-red-600 mb-1">High Risk</div>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-600 mb-4">Landslide warnings active in your region.</p>
            <div className="bg-gray-50 dark:bg-black p-4 rounded text-sm text-gray-600 dark:text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-zinc-800">
              <ul className="space-y-2">
                <li>• Heavy rainfall expected</li>
                <li>• Avoid steep slopes</li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-4 uppercase tracking-wider">Nearest Shelter</h3>
            <div className="text-xl font-medium mb-1">{nearestShelter?.name || "Govt Relief Center"}</div>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-600 mb-4">2.8 km away</p>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-gray-50 dark:bg-black p-3 rounded border border-gray-200 dark:border-zinc-800">
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Capacity</div>
                <div className="font-medium">{nearestShelter?.capacity || 120}</div>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-black p-3 rounded border border-gray-200 dark:border-zinc-800">
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Available</div>
                <div className="font-medium text-green-600">{nearestShelter?.available_beds || 64}</div>
              </div>
            </div>

            <button 
              onClick={handleGetRoute}
              disabled={calculatingRoute}
              className="w-full py-3 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded font-medium transition-colors text-sm disabled:opacity-50"
            >
              {calculatingRoute ? "Calculating..." : "Get Safe Route"}
            </button>
            {route && (
              <div className="mt-4 flex flex-col gap-3">
                <div className="h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800">
                  <CitizenMap 
                    origin={currentLocation || [30.3165, 78.0322]} 
                    destination={nearestShelter ? [nearestShelter.latitude, nearestShelter.longitude] : null} 
                    route={route} 
                  />
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 text-sm">
                  <div className="font-medium mb-1">Route to {route.destination_name}</div>
                  <div>Distance: {route.distance_km} km</div>
                  <div>Est. Time: {route.duration_minutes} mins</div>
                  <div className="mt-2 font-medium">Status: {route.hazard_status.replace(/_/g, " ")}</div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
