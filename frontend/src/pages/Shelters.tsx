import React, { useState } from 'react';
import { useDisasterData } from '../hooks/useDisasterData';
import type { Shelter } from '../types';
import { Home, Navigation, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const Shelters: React.FC = () => {
  const { shelters, loading } = useDisasterData();
  const [selected, setSelected] = useState<Shelter | null>(null);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Home className="w-12 h-12 text-info animate-pulse mb-4" />
        <div className="text-info font-mono tracking-widest uppercase animate-pulse">Loading Infrastructure...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 p-2 animate-fade-in-up">
      {/* Left: Infrastructure List */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Tabs */}
        <div className="flex gap-6 shrink-0 border-b border-gray-800 px-2 text-sm font-bold uppercase tracking-widest text-gray-400">
          <button className="text-white border-b-2 border-info pb-3 px-2 glow-text shadow-info">SHELTERS</button>
          <button className="hover:text-gray-200 pb-3 px-2 transition-colors">HOSPITALS</button>
          <button className="hover:text-gray-200 pb-3 px-2 transition-colors ml-auto text-[10px]">MAP VIEW</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 xl:grid-cols-2 gap-4">
          {shelters.map((s) => {
            const isAvailable = s.available_beds > 0;
            const isNearFull = s.available_beds > 0 && s.available_beds < 50;
            const percentage = (s.current_occupancy / s.capacity) * 100;

            return (
              <div 
                key={s.shelter_code} 
                onClick={() => setSelected(s)}
                className={`cinematic-card p-5 rounded-xl border cursor-pointer transition-all ${
                  selected?.shelter_code === s.shelter_code ? 'border-info shadow-[0_0_20px_rgba(0,212,255,0.15)] bg-info/5' : 'border-[var(--color-border-card)]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wider">{s.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mt-1">ID: {s.shelter_code}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[9px] font-bold tracking-widest uppercase border ${
                    !isAvailable ? 'bg-danger/20 text-danger border-danger/30' : 
                    isNearFull ? 'bg-warning/20 text-warning border-warning/30' : 
                    'bg-safe/20 text-safe border-safe/30 glow-safe'
                  }`}>
                    {!isAvailable ? 'FULL CAPACITY' : isNearFull ? 'NEAR FULL' : 'AVAILABLE'}
                  </span>
                </div>

                {/* Capacity Visualizer */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono mb-2 uppercase tracking-widest">
                    <span>Occupancy</span>
                    <span>{s.current_occupancy} / {s.capacity}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                    <div 
                      className={`h-full transition-all duration-1000 ${!isAvailable ? 'bg-danger glow-danger' : isNearFull ? 'bg-warning' : 'bg-safe'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-right">
                    <span className={`text-xs font-bold font-numbers ${!isAvailable ? 'text-danger' : 'text-safe'}`}>
                      {s.available_beds} BEDS FREE
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-gray-800 pt-3">
                  {s.has_medical_staff && <span className="text-[10px] text-gray-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-info" /> Med Staff</span>}
                  {s.has_oxygen && <span className="text-[10px] text-gray-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-info" /> Oxygen</span>}
                  {s.has_power_backup && <span className="text-[10px] text-gray-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-info" /> Power</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Selected Shelter Detail */}
      {selected ? (
        <div className="w-[350px] shrink-0 cinematic-card rounded-xl border border-[var(--color-border-card)] flex flex-col overflow-hidden animate-[fade-in-up_0.3s_ease-out_forwards]">
          <div className="p-6 border-b border-gray-800 bg-gray-900/50">
            <h3 className="text-xl font-black text-white uppercase tracking-wider leading-tight">{selected.name}</h3>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest mt-2 uppercase flex items-center gap-2">
              <Navigation className="w-3 h-3 text-info" /> 12.4 km from active incident
            </p>
          </div>

          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            
            {/* Visual map placeholder */}
            <div className="h-32 bg-black relative border border-gray-800 rounded-lg overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-info/10 mix-blend-overlay"></div>
              <button className="absolute bottom-2 right-2 bg-info/80 hover:bg-info text-black text-[9px] font-bold px-3 py-1.5 rounded transition-colors uppercase tracking-widest backdrop-blur-md">
                View on Map
              </button>
            </div>

            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2">Facility Status</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Capacity</span>
                  <span className="font-numbers text-white">{selected.capacity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Occupied</span>
                  <span className="font-numbers text-white">{selected.current_occupancy}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-900 -mx-2 px-2 py-1 rounded">
                  <span className="text-xs text-gray-300 uppercase tracking-wider font-bold">Available</span>
                  <span className={`font-numbers font-bold text-lg ${selected.available_beds > 0 ? 'text-safe glow-safe' : 'text-danger glow-danger'}`}>{selected.available_beds}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Structural Integrity</span>
                  <span className="text-xs font-bold text-safe uppercase tracking-wider flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Safe</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-800 space-y-3">
              <button className="w-full bg-info hover:bg-info/80 text-black font-bold py-3 rounded text-[10px] tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                Assign to Rescue Route
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded text-[10px] tracking-widest uppercase transition-colors border border-gray-600">
                Contact Facility
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="w-[350px] shrink-0 border border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-600 bg-black/20">
          <Home className="w-16 h-16 mb-4 opacity-20" />
          <p className="font-mono text-[10px] uppercase tracking-widest">Select facility for details</p>
        </div>
      )}

    </div>
  );
};
