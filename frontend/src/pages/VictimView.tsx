import React, { useState, useEffect } from "react";
import { ShieldAlert, MapPin, HeartPulse, Activity, Navigation, Phone, WifiOff } from "lucide-react";
import { shelterApi, sosApi, disasterApi, meshApi } from "../services/api";
import { wsService } from "../services/websocket";
import { Link } from "react-router-dom";
import { VictimSOSModal } from "../components/VictimSOSModal";

export const VictimView: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [shelters, setShelters] = useState<any[]>([]);
  const [riskZone, setRiskZone] = useState<any | null>(null);
  const [showSOSModal, setShowSOSModal] = useState(false);

  useEffect(() => {
    wsService.setConnectionHandler(setIsOnline);
    wsService.connect();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err),
      );
    }

    shelterApi.getShelters().then(setShelters).catch(console.error);
    disasterApi.getZones().then((zones) => {
      if (zones.length > 0) setRiskZone(zones[0]);
    }).catch(console.error);

    return () => wsService.disconnect();
  }, []);

  const handleSOSSubmit = async (data: { emergency_type: string; severity: string; notes: string; household_code?: string; }) => {
    try {
      const payload = {
        household_code: data.household_code || undefined,
        latitude: location ? location.lat : 30.3165,
        longitude: location ? location.lng : 78.0322,
        emergency_type: data.emergency_type,
        severity: data.severity,
        notes: data.notes || (location ? "EMERGENCY: Immediate assistance required" : "EMERGENCY: Immediate assistance required (Location unknown)"),
        via_mesh: navigator.onLine ? "FALSE" : "TRUE",
      };

      if (navigator.onLine) {
        await sosApi.createSOS(payload);
      } else {
        await meshApi.triggerSimulatedSOS({
          message_id: `mesh-${Date.now()}`,
          sender_id: "VictimClient",
          type: "SOS",
          household_id: data.household_code || "H104",
          latitude: location ? location.lat : 30.3165,
          longitude: location ? location.lng : 78.0322,
          severity: data.severity,
          timestamp: Math.floor(Date.now() / 1000),
          payload: {
            vulnerabilities: [],
            people_count: 1,
            battery_level: 100,
          },
        });
      }

      setShowSOSModal(false);
      setSosSent(true);
      setTimeout(() => setSosSent(false), 5000);
    } catch (e) {
      console.error(e);
      alert("Failed to send SOS. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <h1 className="text-xl font-medium tracking-tight text-gray-900 dark:text-gray-100">
            Fire-Eye
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {isOnline ? (
              <span className="text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded">
                <Activity className="w-4 h-4" /> Online
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1 font-medium bg-red-50 px-2 py-1 rounded">
                <WifiOff className="w-4 h-4" /> Offline Mesh Active
              </span>
            )}
          </div>
          <Link to="/login" className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100 transition-colors font-medium">
            Officer Login
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-2xl mx-auto w-full gap-8">
        <div className="flex flex-col items-center justify-center text-center">
          <button
            onClick={() => setShowSOSModal(true)}
            className={`w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md dark:shadow-none ${sosSent ? "bg-green-50 border-4 border-green-500 text-green-700" : "bg-red-600 hover:bg-red-700 text-white"}`}
          >
            <HeartPulse className={`w-20 h-20 mb-2 ${sosSent ? "animate-pulse" : ""}`} />
            <span className="text-4xl font-medium tracking-tight">
              {sosSent ? "SENT" : "SOS"}
            </span>
            <span className="text-base font-medium opacity-90 mt-2">
              {sosSent ? "Help is on the way" : "Tap for Emergency"}
            </span>
          </button>

          <p className="mt-8 text-gray-600 dark:text-gray-400 dark:text-gray-600 text-sm max-w-sm">
            Pressing this button alerts nearby rescue teams and command centers immediately. Works offline via Mesh Network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col shadow-sm dark:shadow-none">
            <h3 className="text-gray-500 dark:text-gray-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-blue-500" /> Current Status
            </h3>
            {riskZone ? (
              <>
                <div className="text-xl font-medium text-gray-900 dark:text-gray-100 truncate">
                  {riskZone.name}
                </div>
                <div className="text-base font-medium text-red-600 mt-1">
                  Risk Level: {riskZone.risk_level}
                </div>
                <div className="mt-auto pt-6 text-sm text-gray-500 dark:text-gray-500">
                  Based on real-time data
                </div>
              </>
            ) : (
              <>
                <div className="text-xl font-medium text-gray-900 dark:text-gray-100">Unknown Zone</div>
                <div className="text-base font-medium text-yellow-600 mt-1">
                  Cannot fetch real-time data
                </div>
                <div className="mt-auto pt-6 text-sm text-gray-500 dark:text-gray-500">
                  Offline mode
                </div>
              </>
            )}
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col shadow-sm dark:shadow-none">
            <h3 className="text-gray-500 dark:text-gray-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2 mb-4">
              <Navigation className="w-4 h-4 text-green-500" /> Nearest Safe Shelter
            </h3>
            {shelters.length > 0 ? (
              <>
                <div className="text-xl font-medium text-gray-900 dark:text-gray-100 truncate">
                  {shelters[0].name}
                </div>
                <div className="text-base text-gray-600 dark:text-gray-400 dark:text-gray-600 mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {shelters[0].contact_info}
                </div>
                <div className="mt-auto pt-6 text-base text-green-600 font-medium flex justify-between">
                  <span>{shelters[0].available_beds} beds available</span>
                </div>
              </>
            ) : (
              <div className="text-base text-gray-600 dark:text-gray-400 dark:text-gray-600">
                Locating nearest shelter...
              </div>
            )}
          </div>
        </div>
      </main>

      {showSOSModal && (
        <VictimSOSModal onClose={() => setShowSOSModal(false)} onSubmit={handleSOSSubmit} />
      )}
    </div>
  );
};
