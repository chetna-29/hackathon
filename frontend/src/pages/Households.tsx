import React, { useState } from 'react';
import { useDisasterData } from '../hooks/useDisasterData';
import type { Household } from '../types';
import { Users, ShieldAlert, X, MapPin, Phone } from 'lucide-react';

export const Households: React.FC = () => {
  const { households, queue, loading } = useDisasterData();
  const [selected, setSelected] = useState<Household | null>(null);
  const [filter, setFilter] = useState('ALL');

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Users className="w-12 h-12 text-info animate-pulse mb-4" />
        <div className="text-info font-mono tracking-widest uppercase animate-pulse">Loading Vulnerability DB...</div>
      </div>
    );
  }

  const isSos = (code: string) => queue.some(q => q.household_code === code);

  const filteredHouseholds = households.filter(h => {
    if (filter === 'HIGH RISK') return h.vulnerability_score > 0.7;
    if (filter === 'ELDERLY') return h.elderly_count > 0;
    if (filter === 'CHILDREN') return h.children_count > 0;
    if (filter === 'MEDICAL') return h.medical_needs !== null;
    if (filter === 'SOS ACTIVE') return isSos(h.household_code);
    return true;
  });

  return (
    <div className="flex flex-col h-full gap-4 p-2 animate-fade-in-up">
      {/* Top Filter Chips */}
      <div className="flex gap-2 shrink-0 overflow-x-auto pb-2 custom-scrollbar">
        {['ALL', 'HIGH RISK', 'ELDERLY', 'CHILDREN', 'MEDICAL', 'SOS ACTIVE'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap border ${
              filter === f 
                ? f === 'SOS ACTIVE' ? 'bg-danger text-white border-danger shadow-[0_0_15px_rgba(255,59,48,0.4)]' : 'bg-info text-white border-info shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {f === 'SOS ACTIVE' && filter !== f ? <span className="text-danger mr-1">●</span> : ''}
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        
        {/* Main Grid */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar pr-2 transition-all ${selected ? 'w-2/3' : 'w-full'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredHouseholds.map(h => {
              const active = isSos(h.household_code);
              const highRisk = h.vulnerability_score > 0.7;
              
              return (
                <div 
                  key={h.household_code}
                  onClick={() => setSelected(h)}
                  className={`cinematic-card p-5 rounded-xl border cursor-pointer relative overflow-hidden transition-all ${
                    selected?.household_code === h.household_code 
                      ? 'border-info shadow-[0_0_20px_rgba(0,212,255,0.15)] bg-info/5' 
                      : active 
                        ? 'border-danger/50 shadow-[0_0_15px_rgba(255,59,48,0.1)]' 
                        : 'border-[var(--color-border-card)]'
                  }`}
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${active ? 'bg-danger glow-danger' : highRisk ? 'bg-warning' : 'bg-safe'}`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-numbers font-bold text-white tracking-wider">{h.household_code}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Chamoli Zone</p>
                    </div>
                    {active ? (
                      <span className="bg-danger/20 text-danger border border-danger/30 text-[9px] px-2 py-0.5 rounded font-bold tracking-widest animate-pulse">SOS ACTIVE</span>
                    ) : highRisk ? (
                      <span className="text-warning text-[10px] font-bold tracking-widest uppercase">High Risk</span>
                    ) : (
                      <span className="text-safe text-[10px] font-bold tracking-widest uppercase">Monitored</span>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap mb-4">
                    {h.elderly_count > 0 && <span className="bg-gray-800 text-gray-300 border border-gray-700 text-[10px] px-2 py-1 rounded-md flex items-center gap-1"><span className="text-warning">👵</span> Elderly ({h.elderly_count})</span>}
                    {h.children_count > 0 && <span className="bg-gray-800 text-gray-300 border border-gray-700 text-[10px] px-2 py-1 rounded-md flex items-center gap-1">👶 Children ({h.children_count})</span>}
                    {h.medical_needs && <span className="bg-danger/10 text-danger border border-danger/20 text-[10px] px-2 py-1 rounded-md flex items-center gap-1">🏥 Med Support</span>}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-800">
                    <div className="text-[10px] text-gray-400 font-mono">Members: <span className="text-white font-bold">{h.members_count}</span></div>
                    <div className="text-[10px] text-info hover:text-white uppercase tracking-widest font-bold transition-colors">View Profile →</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Drawer */}
        {selected && (
          <div className="w-[400px] shrink-0 bg-[#0B1118] border border-[var(--color-border-card)] rounded-xl flex flex-col overflow-hidden animate-[fade-in-up_0.3s_ease-out_forwards]">
            
            {/* Header Image/Map Mock */}
            <div className="h-40 relative bg-black">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544253303-34e819b1bb4a?q=80&w=800')] bg-cover bg-center opacity-40 grayscale"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1118] to-transparent"></div>
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-danger text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded border ${selected.vulnerability_score > 0.7 ? 'bg-danger/20 text-danger border-danger/30' : 'bg-warning/20 text-warning border-warning/30'}`}>
                  Vulnerability Score: {(selected.vulnerability_score * 100).toFixed(0)}%
                </span>
                <h2 className="text-3xl font-black text-white tracking-widest mt-2">{selected.household_code}</h2>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-info shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Registered Location</p>
                  <p className="text-sm text-gray-200">Sector 4, Hilltop Ridge<br/>Chamoli, Uttarakhand 246401</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Members</p>
                  <p className="text-2xl font-numbers font-bold text-white">{selected.members_count}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Risk Zone</p>
                  <p className="text-sm font-bold text-danger uppercase tracking-wider mt-1">{selected.zone_id.replace('ZONE-', '')}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2">Vulnerability Factors</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300 flex items-center gap-2">👵 Elderly (&gt;65y)</span>
                    <span className={`font-numbers font-bold ${selected.elderly_count > 0 ? 'text-warning' : 'text-gray-600'}`}>{selected.elderly_count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300 flex items-center gap-2">👶 Children (&lt;12y)</span>
                    <span className={`font-numbers font-bold ${selected.children_count > 0 ? 'text-info' : 'text-gray-600'}`}>{selected.children_count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300 flex items-center gap-2">🧑‍🦽 Disabled</span>
                    <span className={`font-numbers font-bold ${selected.disabled_count > 0 ? 'text-danger' : 'text-gray-600'}`}>{selected.disabled_count}</span>
                  </div>
                  {selected.medical_needs && (
                    <div className="mt-2 bg-danger/10 border border-danger/30 p-3 rounded text-xs text-danger font-mono">
                      CRITICAL MEDICAL: {selected.medical_needs}
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="mt-auto pt-4 border-t border-gray-800">
                {isSos(selected.household_code) ? (
                  <button className="w-full bg-danger hover:bg-danger-dark text-white font-bold py-3 rounded text-[10px] tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(255,59,48,0.4)] flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Go to Rescue Operations
                  </button>
                ) : (
                  <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded text-[10px] tracking-widest uppercase transition-colors border border-gray-600 flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Dispatch Welfare Check
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
