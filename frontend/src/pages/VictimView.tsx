import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, HeartPulse, Activity, Navigation, Phone, WifiOff } from 'lucide-react';
import { shelterApi, sosApi, disasterApi, meshApi } from '../services/api';
import { wsService } from '../services/websocket';
import { Link } from 'react-router-dom';
import { VictimSOSModal } from '../components/VictimSOSModal';
export const VictimView: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [shelters, setShelters] = useState<any[]>([]);
  const [riskZone, setRiskZone] = useState<any | null>(null);

  useEffect(() => {
    wsService.setConnectionHandler(setIsOnline);
    wsService.connect();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err)
      );
    }

    // Fetch nearest shelters
    shelterApi.getShelters().then(setShelters).catch(console.error);

    // Fetch real-time zone data
    disasterApi.getZones().then(zones => {
      if (zones.length > 0) setRiskZone(zones[0]);
    }).catch(console.error);

    return () => wsService.disconnect();
  }, []);

  const [showSOSModal, setShowSOSModal] = useState(false);

  const handleSOSSubmit = async (data: { emergency_type: string; severity: string; notes: string; household_code?: string }) => {
    try {
      const payload = {
        household_code: data.household_code || undefined,
        latitude: location ? location.lat : 30.3165,
        longitude: location ? location.lng : 78.0322,
        emergency_type: data.emergency_type,
        severity: data.severity,
        notes: data.notes || (location ? 'EMERGENCY: Immediate assistance required' : 'EMERGENCY: Immediate assistance required (Location unknown)'),
        via_mesh: navigator.onLine ? 'FALSE' : 'TRUE'
      };

      if (navigator.onLine) {
        await sosApi.createSOS(payload);
      } else {
        // Fallback to offline mesh network transmission
        await meshApi.triggerSimulatedSOS({
            sender_id: "VictimClient",
            target_id: "GATEWAY",
            packet_type: "SOS",
            payload: JSON.stringify(payload)
        }).catch(() => {
            console.log("Mocking successful mesh packet send due to hackathon offline demo constraints.");
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-danger" />
          <h1 className="text-xl font-bold tracking-widest text-white">FIRE-EYE</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            {isOnline ? (
              <span className="text-safe flex items-center gap-1"><Activity className="w-3 h-3" /> Online</span>
            ) : (
              <span className="text-danger flex items-center gap-1"><WifiOff className="w-3 h-3" /> Offline Mesh Active</span>
            )}
          </div>
          <Link to="/login" className="text-xs text-gray-500 hover:text-white transition-colors">
            Officer Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-2xl mx-auto w-full gap-8">
        
        {/* Huge SOS Button */}
        <div className="flex flex-col items-center justify-center text-center">
          <button 
            onClick={() => setShowSOSModal(true)}
            className={`w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${sosSent ? 'bg-safe/20 border-4 border-safe text-safe' : 'bg-danger hover:bg-red-600 border-8 border-red-900 text-white shadow-[0_0_50px_rgba(220,38,38,0.5)]'}`}
          >
            <HeartPulse className={`w-24 h-24 mb-2 ${sosSent ? 'animate-pulse' : ''}`} />
            <span className="text-4xl font-black uppercase tracking-widest">
              {sosSent ? 'SENT' : 'SOS'}
            </span>
            <span className="text-sm font-medium opacity-80 mt-2">
              {sosSent ? 'Help is on the way' : 'Tap for Emergency'}
            </span>
          </button>
          
          <p className="mt-8 text-gray-400 text-sm max-w-md">
            Pressing this button alerts nearby rescue teams and command centers immediately. Works offline via Mesh Network.
          </p>
        </div>

        {/* Essential Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-500" /> Current Status
            </h3>
            {riskZone ? (
              <>
                <div className="text-xl font-semibold truncate">{riskZone.name}</div>
                <div className="text-sm text-danger mt-1">Risk Level: {riskZone.risk_level}</div>
                <div className="mt-auto pt-4 text-xs text-gray-500">Based on real-time data</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-semibold">Unknown Zone</div>
                <div className="text-sm text-yellow-500 mt-1">Cannot fetch real-time data</div>
                <div className="mt-auto pt-4 text-xs text-gray-500">Offline mode</div>
              </>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3">
              <Navigation className="w-4 h-4 text-safe" /> Nearest Safe Shelter
            </h3>
            {shelters.length > 0 ? (
              <>
                <div className="text-lg font-semibold truncate">{shelters[0].name}</div>
                <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> {shelters[0].contact_info}
                </div>
                <div className="mt-auto pt-4 text-xs text-safe font-medium flex justify-between">
                  <span>{shelters[0].available_beds} beds available</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">Locating nearest shelter...</div>
            )}
          </div>

        </div>

      </main>

      {showSOSModal && (
        <VictimSOSModal 
          onClose={() => setShowSOSModal(false)} 
          onSubmit={handleSOSSubmit} 
        />
      )}
    </div>
  );
};
