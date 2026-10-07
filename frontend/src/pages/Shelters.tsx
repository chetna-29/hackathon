import React, { useState } from 'react';
import { useDisasterData } from '../hooks/useDisasterData';
import type { Shelter } from '../types';

export const Shelters: React.FC = () => {
  const { shelters, loading } = useDisasterData();
  const [selected, setSelected] = useState<Shelter | null>(null);

  if (loading) {
    return <div className="p-8 text-center text-gray-400 animate-pulse">Loading shelters & hospitals...</div>;
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Tabs */}
      <div className="flex gap-4 shrink-0 px-2 text-sm font-bold uppercase tracking-normal text-gray-400">
        <button className="text-white border-b-2 border-blue-500 pb-2 px-2">Shelters</button>
        <button className="hover:text-gray-200 pb-2 px-2 transition-colors">Hospitals</button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Table */}
        <div className="flex-1 bg-gray-900/80 rounded-lg border border-gray-800 overflow-hidden flex flex-col">
          <div className="overflow-y-auto custom-scrollbar flex-1">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-500 uppercase bg-gray-900 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium text-center">Capacity</th>
                  <th className="px-4 py-3 font-medium text-center">Occupied</th>
                  <th className="px-4 py-3 font-medium text-center">Available</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {shelters.map((s) => {
                  const isAvailable = s.available_beds > 0;
                  const isNearFull = s.available_beds > 0 && s.available_beds < 50;

                  return (
                    <tr key={s.shelter_code} className={`hover:bg-gray-800/50 cursor-pointer ${selected?.shelter_code === s.shelter_code ? 'bg-gray-800' : ''}`} onClick={() => setSelected(s)}>
                      <td className="px-4 py-3 font-bold text-white">{s.name}</td>
                      <td className="px-4 py-3">Rudraprayag</td>
                      <td className="px-4 py-3 text-center">{s.capacity}</td>
                      <td className="px-4 py-3 text-center">{s.current_occupancy}</td>
                      <td className="px-4 py-3 text-center font-bold">{s.available_beds}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-normal ${isAvailable && !isNearFull ? 'bg-safe/20 text-safe' : isNearFull ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'}`}>
                          {isAvailable && !isNearFull ? 'AVAILABLE' : isNearFull ? 'NEAR FULL' : 'FULL'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="bg-blue-900/40 text-blue-400 px-3 py-1 rounded text-xs hover:bg-blue-800/60 transition-colors">View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Detail Panel */}
        {selected && (
          <div className="w-80 bg-gray-900/80 rounded-lg border border-gray-800 p-4 shrink-0 flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-normal mb-4 border-b border-gray-800 pb-2">Shelter Details</h3>
            <div className="space-y-3 text-sm flex-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white text-right font-medium">{selected.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white text-right">Rudraprayag</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Capacity:</span>
                <span className="text-white text-right">{selected.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Occupied:</span>
                <span className="text-white text-right">{selected.current_occupancy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available:</span>
                <span className="text-white text-right font-bold">{selected.available_beds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`text-right font-bold ${selected.available_beds > 0 ? 'text-safe' : 'text-danger'}`}>
                  {selected.available_beds > 0 ? 'Available' : 'Full'}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-800 pt-3">
                <span className="text-gray-400">Distance from SOS:</span>
                <span className="text-white text-right font-mono">12.4 km</span>
              </div>
            </div>

            <div className="mt-4 h-40 bg-black rounded-lg border border-gray-700 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600')] bg-cover bg-center transition-opacity group-hover:opacity-70"></div>
              <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-colors">
                View on Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
