import React, { useState } from 'react';
import { useDisasterData } from '../hooks/useDisasterData';
import type { Household } from '../types';

export const Households: React.FC = () => {
  const { households, queue, loading } = useDisasterData();
  const [selected, setSelected] = useState<Household | null>(null);

  if (loading) {
    return <div className="p-8 text-center text-gray-400 animate-pulse">Loading households...</div>;
  }

  const isSos = (code: string) => queue.some(q => q.household_code === code);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Filters (Mocked visual) */}
      <div className="flex gap-4 shrink-0 p-3 bg-gray-900/80 rounded-lg border border-gray-800 text-xs">
        <select className="bg-gray-800 text-gray-200 px-3 py-1.5 rounded border border-gray-700 outline-none">
          <option>All Districts</option>
          <option>Rudraprayag</option>
          <option>Chamoli</option>
        </select>
        <select className="bg-gray-800 text-gray-200 px-3 py-1.5 rounded border border-gray-700 outline-none">
          <option>All Risk Levels</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <div className="flex items-center gap-4 text-gray-400 px-2">
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-blue-500" /> Elderly</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-blue-500" /> Children</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-blue-500" /> Disabled</label>
        </div>
        <input type="text" placeholder="Search households..." className="ml-auto bg-gray-800 text-gray-200 px-3 py-1.5 rounded border border-gray-700 outline-none" />
      </div>

      {/* Table */}
      <div className="flex-1 bg-gray-900/80 rounded-lg border border-gray-800 overflow-hidden flex flex-col">
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-500 uppercase bg-gray-900 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Risk Zone</th>
                <th className="px-4 py-3 font-medium text-center">Residents</th>
                <th className="px-4 py-3 font-medium text-center">Elderly</th>
                <th className="px-4 py-3 font-medium text-center">Children</th>
                <th className="px-4 py-3 font-medium text-center">Disabled</th>
                <th className="px-4 py-3 font-medium text-center">SOS</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {households.map((h, i) => {
                const sosStatus = isSos(h.household_code);
                const isHighRisk = i % 3 === 0; // Simulated risk mapping for visual matching
                const isMediumRisk = i % 3 === 1;

                return (
                  <tr key={h.household_code} className={`hover:bg-gray-800/50 cursor-pointer ${selected?.household_code === h.household_code ? 'bg-gray-800' : ''}`} onClick={() => setSelected(h)}>
                    <td className="px-4 py-3 font-mono font-bold text-white">{h.household_code}</td>
                    <td className="px-4 py-3">Rudraprayag Sector 4</td>
                    <td className="px-4 py-3">
                      <span className={isHighRisk ? 'text-danger' : isMediumRisk ? 'text-warning' : 'text-safe'}>
                        {isHighRisk ? 'High' : isMediumRisk ? 'Medium' : 'Low'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{h.members_count}</td>
                    <td className="px-4 py-3 text-center">{h.elderly_count}</td>
                    <td className="px-4 py-3 text-center">{h.children_count}</td>
                    <td className="px-4 py-3 text-center">{h.disabled_count}</td>
                    <td className="px-4 py-3 text-center">
                      {sosStatus ? <span className="bg-danger/20 text-danger px-2 py-0.5 rounded text-[10px] font-bold">SOS</span> : '-'}
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

      {/* Bottom Profile Panel */}
      {selected && (
        <div className="h-48 bg-gray-900/80 rounded-lg border border-gray-800 p-4 shrink-0 flex gap-6">
          <div className="w-1/3 border-r border-gray-800 pr-6 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-4">Household Profile - {selected.household_code}</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-gray-400">Location:</span>
              <span className="text-white text-right">Rudraprayag Sector 4</span>
              
              <span className="text-gray-400">Residents:</span>
              <span className="text-white text-right">{selected.members_count}</span>
              
              <span className="text-gray-400">Vulnerability:</span>
              <span className={`text-right font-bold ${selected.vulnerability_score > 0.7 ? 'text-danger' : 'text-warning'}`}>
                {selected.vulnerability_score > 0.7 ? 'High' : 'Moderate'}
              </span>
              
              <span className="text-gray-400">SOS Status:</span>
              <span className="text-right">{isSos(selected.household_code) ? <span className="text-danger font-bold">Active</span> : <span className="text-gray-500">None</span>}</span>
            </div>
          </div>
          <div className="flex-1 flex gap-4">
             {/* Mock Images to match the requested design layout */}
             <div className="flex-1 bg-black rounded-lg border border-gray-700 overflow-hidden relative">
               <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1544253303-34e819b1bb4a?q=80&w=600')] bg-cover bg-center"></div>
               <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 px-2 py-1 rounded font-bold text-white">House Reference</span>
             </div>
             <div className="flex-1 bg-black rounded-lg border border-gray-700 overflow-hidden relative">
               <div className="absolute inset-0 opacity-40 bg-[url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3445/5860')] bg-cover bg-center"></div>
               <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 px-2 py-1 rounded font-bold text-white">Satellite View</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
