import React from 'react';
import { StatCard, WeatherCard } from '../components/StatCard';
import { DisasterMap } from '../map/DisasterMap';
import { Bell, Users, Ambulance, Home, AlertTriangle, MapPin, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDisasterData } from '../hooks/useDisasterData';

export const Dashboard: React.FC = () => {
  const { zones, households, queue, shelters, loading } = useDisasterData();

  if (loading) {
    return <div className="p-8 text-center text-gray-400 animate-pulse">Loading command center...</div>;
  }

  const vulnerableCount = households.filter(h => h.vulnerability_score > 0.7).length;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Row: Stats */}
      <div className="flex gap-4 shrink-0">
        <StatCard label="High Risk Zones" value={zones.filter(z => z.risk_level === 'HIGH').length} isDonut={true} />
        <StatCard label="Active SOS" value={queue.length} icon={<Bell className="w-6 h-6 text-danger" />} />
        <StatCard label="Vulnerable People" value={vulnerableCount} icon={<Users className="w-6 h-6 text-warning" />} />
        <StatCard label="Safe Shelters" value={shelters.filter(s => s.available_beds > 0).length} icon={<Home className="w-6 h-6 text-safe" />} />
        <StatCard label="Rescue Teams" value="6" icon={<Ambulance className="w-6 h-6 text-safe" />} />
        <WeatherCard />
      </div>

      {/* Middle Row: Overview Map and Alerts */}
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="w-2/3 bg-gray-900/80 rounded-xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900">
            <h3 className="text-xs font-bold tracking-widest uppercase">Live Situation Overview</h3>
            <Link to="/map" className="text-[10px] text-blue-400 hover:text-blue-300">Open Full Map →</Link>
          </div>
          <div className="flex-1 relative">
            <DisasterMap 
              zones={zones} 
              households={households} 
              shelters={shelters} 
              activeSosItems={queue}
              route={null}
            />
          </div>
        </div>

        <div className="w-1/3 bg-gray-900/80 rounded-xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-800 bg-gray-900">
            <h3 className="text-xs font-bold tracking-widest uppercase">Recent Alerts</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {queue.slice(0, 5).map(item => (
              <div key={item.sos_id} className="p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-danger mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-danger">New SOS Request</h4>
                  <p className="text-[10px] text-gray-400">Household {item.household_code}</p>
                </div>
              </div>
            ))}
            {zones.filter(z => z.risk_level === 'HIGH').slice(0, 2).map(z => (
              <div key={z.zone_code} className="p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-warning">High Risk Zone Detected</h4>
                  <p className="text-[10px] text-gray-400">{z.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Access */}
      <div className="shrink-0 bg-gray-900/80 rounded-xl border border-gray-800 p-4">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-3 text-gray-500">Quick Access</h3>
        <div className="grid grid-cols-5 gap-4">
          <Link to="/map" className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex flex-col items-center justify-center text-center transition-colors">
            <MapPin className="w-6 h-6 text-blue-400 mb-2" />
            <span className="text-xs font-bold text-gray-200">Live Disaster Map</span>
            <span className="text-[9px] text-gray-500 mt-1">View risk zones</span>
          </Link>
          <Link to="/rescue" className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex flex-col items-center justify-center text-center transition-colors">
            <Ambulance className="w-6 h-6 text-danger mb-2" />
            <span className="text-xs font-bold text-gray-200">Rescue Center</span>
            <span className="text-[9px] text-gray-500 mt-1">Manage SOS & Teams</span>
          </Link>
          <Link to="/households" className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex flex-col items-center justify-center text-center transition-colors">
            <Users className="w-6 h-6 text-warning mb-2" />
            <span className="text-xs font-bold text-gray-200">Vulnerable Households</span>
            <span className="text-[9px] text-gray-500 mt-1">View and filter population</span>
          </Link>
          <Link to="/shelters" className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex flex-col items-center justify-center text-center transition-colors">
            <Home className="w-6 h-6 text-safe mb-2" />
            <span className="text-xs font-bold text-gray-200">Shelters & Hospitals</span>
            <span className="text-[9px] text-gray-500 mt-1">Check capacity & status</span>
          </Link>
          <Link to="/mesh" className="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex flex-col items-center justify-center text-center transition-colors">
            <Network className="w-6 h-6 text-blue-400 mb-2" />
            <span className="text-xs font-bold text-gray-200">Mesh Network</span>
            <span className="text-[9px] text-gray-500 mt-1">Monitor offline comms</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
