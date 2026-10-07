import React from 'react';
import type { PriorityItem } from '../types';
import { X, User } from 'lucide-react';

interface Props {
  item: PriorityItem;
  onClose: () => void;
  onCalculateRoute: () => void;
  onResolve: () => void;
  onDispatch: () => void;
}

// Reverse Geocoding Component for SOS Panel
const AddressDisplay = ({ lat, lng }: { lat: number, lng: number }) => {
  const [address, setAddress] = React.useState('Fetching address...');
  React.useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(r => r.json())
      .then(d => {
        const parts = [];
        if (d.address.village || d.address.town || d.address.city) parts.push(d.address.village || d.address.town || d.address.city);
        if (d.address.county || d.address.state_district) parts.push(d.address.county || d.address.state_district);
        setAddress(parts.length > 0 ? parts.join(', ') : d.display_name || 'Unknown Location');
      })
      .catch(() => setAddress('Location lookup failed'));
  }, [lat, lng]);
  return <span className="text-[10px] text-gray-400 mt-1">{address}</span>;
};

export const SOSPanel: React.FC<Props> = ({ item, onClose, onCalculateRoute, onResolve, onDispatch }) => {
  return (
    <div className="flex flex-col h-full bg-gray-900/80 rounded-lg border border-gray-800">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-sm font-bold text-gray-200 tracking-normal uppercase">Selected SOS Request</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-danger/20 p-2 rounded-full border border-danger/30">
            <User className="w-6 h-6 text-danger" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{item.household_code}</h3>
          </div>
          <div className="ml-auto">
            <span className={`text-[10px] px-2 py-1 rounded border font-bold tracking-normal ${
              item.severity === 'CRITICAL' ? 'bg-danger/20 text-danger border-danger/30' : 
              item.severity === 'HIGH' ? 'bg-warning/20 text-warning border-warning/30' : 
              'bg-safe/20 text-safe border-safe/30'
            }`}>
              {item.severity}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Household ID</span>
            <span className="text-gray-200 text-right">{item.household_code}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Priority Score</span>
            <span className="text-blue-400 font-bold text-right text-lg">{item.priority_score.toFixed(1)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Severity</span>
            <span className="text-gray-200 text-right">{item.elderly_count > 0 ? 'Critical elderly patient' : 'Medical emergency'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Residents</span>
            <span className="text-gray-200 text-right">{Math.max(item.elderly_count + item.disabled_count, 4)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Elderly</span>
            <span className="text-gray-200 text-right">{item.elderly_count}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Children</span>
            <span className="text-gray-200 text-right">0</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Disabled</span>
            <span className="text-gray-200 text-right">{item.disabled_count}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Location</span>
            <div className="text-right flex flex-col items-end">
               <span className="text-gray-200 font-mono text-xs">{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</span>
               <AddressDisplay lat={item.latitude} lng={item.longitude} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Risk Zone</span>
            <span className="text-danger font-bold text-right">HIGH</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Source Type</span>
            <span className="text-gray-200 text-right font-bold">{item.source_type || 'MOBILE'}</span>
          </div>
          {item.via_mesh === "TRUE" && (
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-400">Mesh Hops</span>
              <span className="text-danger font-bold text-right">{item.hops_count || 0}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Communication</span>
            <span className={`font-bold text-right ${item.via_mesh === "TRUE" ? "text-danger" : "text-safe"}`}>
              {item.via_mesh === "TRUE" ? "OFFLINE MESH" : "ONLINE"}
            </span>
          </div>
          {item.notes && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-800">
              <span className="text-gray-400">Notes / Vulnerabilities</span>
              <span className="text-gray-300 text-right text-xs">{item.notes}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-400">Status</span>
            <span className="text-danger font-bold text-right">WAITING FOR RESCUE</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 border-t border-gray-800">
        <button 
          onClick={onCalculateRoute}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          Calculate Safe Route
        </button>
        <button 
          onClick={onDispatch}
          className="w-full py-3 bg-safe hover:bg-safe/80 text-white rounded-lg font-medium transition-colors"
        >
          Assign Rescue Team
        </button>
        <button 
          onClick={onResolve}
          className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium border border-gray-700 transition-colors"
        >
          Mark Resolved
        </button>
      </div>
    </div>
  );
};
