import React, { useState } from 'react';
import { useDisasterData } from '../hooks/useDisasterData';
import { routingApi } from '../services/api';
import type { PriorityItem, RouteResponse } from '../types';
import { AlertTriangle, MapPin, Navigation, Ambulance, Activity, ShieldAlert, Home } from 'lucide-react';

export const RescueCenter: React.FC = () => {
  const { queue, loading } = useDisasterData();
  const [selectedSOS, setSelectedSOS] = useState<PriorityItem | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [calculating, setCalculating] = useState(false);

  const handleCalculateRoute = async () => {
    if (!selectedSOS) return;
    setCalculating(true);
    try {
      const res = await routingApi.getSafeRoute({lat: selectedSOS.latitude, lng: selectedSOS.longitude});
      setRoute(res);
    } catch (e) {
      console.error("Routing failed", e);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Activity className="w-12 h-12 text-info animate-pulse mb-4" />
        <div className="text-info font-mono tracking-widest uppercase animate-pulse">Loading Priority Matrix...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 p-2 animate-fade-in-up">
      {/* Left: Priority Queue List */}
      <div className="w-1/3 min-w-[400px] flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <h2 className="text-sm font-bold tracking-widest uppercase text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger" />
            Active Priority Queue
          </h2>
          <span className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-400 font-mono tracking-widest">{queue.length} INCIDENTS</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
          {queue.length === 0 ? (
            <div className="h-32 border border-dashed border-gray-700 rounded-xl flex items-center justify-center text-gray-500 font-mono text-xs uppercase tracking-widest">
              No Active SOS Requests
            </div>
          ) : (
            queue.map((item, index) => (
              <div 
                key={item.sos_id} 
                onClick={() => { setSelectedSOS(item); setRoute(null); }}
                className={`cinematic-card p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSOS?.sos_id === item.sos_id ? 'border-info shadow-[0_0_20px_rgba(0,212,255,0.15)] bg-info/5' : 'border-[var(--color-border-card)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1 block">INCIDENT #{item.sos_code || `10${index}`}</span>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Location HH-{item.household_code}</h3>
                    <div className="flex gap-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${item.severity === 'CRITICAL' ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-warning/20 text-warning border border-warning/30'}`}>
                        {item.severity}
                      </span>
                      {item.elderly_count > 0 && <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest bg-gray-800 text-gray-300 border border-gray-700">Elderly</span>}
                      {item.disabled_count > 0 && <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest bg-gray-800 text-gray-300 border border-gray-700">Disabled</span>}
                    </div>
                  </div>
                  
                  {/* Priority Score Vis */}
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-danger/50 bg-danger/10 shadow-[0_0_15px_rgba(255,59,48,0.2)]">
                    <span className="text-xl font-numbers font-black text-danger">{item.priority_score.toFixed(0)}</span>
                    <span className="text-[8px] text-danger/80 uppercase font-bold tracking-widest">Score</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Selected Incident Detail */}
      <div className="flex-1 cinematic-card rounded-xl border border-[var(--color-border-card)] flex flex-col overflow-hidden">
        {selectedSOS ? (
          <>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <div>
                <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-1">INCIDENT HH-{selectedSOS.household_code}</h2>
                <p className="text-xs text-gray-400 font-mono uppercase tracking-widest"><MapPin className="inline w-3 h-3 mr-1" /> Chamoli District, Sector 4</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">System Priority Rank</p>
                <p className="text-3xl font-numbers font-black text-danger">#{selectedSOS.rank}</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-4 gap-6 bg-black/40 border-b border-gray-800">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Severity Risk</p>
                <p className="text-sm font-bold text-danger uppercase tracking-wider">{selectedSOS.severity}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Vulnerability</p>
                <p className="text-sm font-bold text-warning uppercase tracking-wider">{selectedSOS.elderly_count > 0 ? 'High' : 'Moderate'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Isolation Risk</p>
                <p className="text-sm font-bold text-danger uppercase tracking-wider">High</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Required Action</p>
                <p className="text-sm font-bold text-info uppercase tracking-wider">Immediate Evac</p>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-danger hover:bg-danger-dark text-white font-bold py-3 px-4 rounded text-xs tracking-widest uppercase transition-colors shadow-[0_0_20px_rgba(255,59,48,0.3)] flex items-center justify-center gap-2">
                  <Ambulance className="w-4 h-4" /> Dispatch Rescue Team
                </button>
                <button 
                  onClick={handleCalculateRoute}
                  disabled={calculating}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-info font-bold py-3 px-4 rounded text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" /> 
                  {calculating ? 'Analyzing Terrain...' : 'Calculate Safe Route'}
                </button>
              </div>

              {/* Route Preview */}
              {route ? (
                <div className="mt-4 border border-info/30 bg-info/5 rounded-xl overflow-hidden flex flex-col animate-fade-in-up">
                  <div className="p-3 bg-info/10 border-b border-info/30 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-info tracking-widest uppercase flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Safe Evacuation Route Generated
                    </h3>
                    <span className="text-[10px] font-bold bg-safe/20 text-safe px-2 py-0.5 rounded uppercase tracking-widest">Verified</span>
                  </div>
                  
                  <div className="flex h-48">
                    <div className="flex-1 p-4 grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Distance</p>
                         <p className="text-xl font-numbers font-bold text-white">{route.distance_km.toFixed(1)} <span className="text-xs text-gray-400 font-sans">km</span></p>
                       </div>
                       <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Est. Time</p>
                         <p className="text-xl font-numbers font-bold text-white">{(route.distance_km * 4).toFixed(0)} <span className="text-xs text-gray-400 font-sans">min</span></p>
                       </div>
                       <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Hazard Status</p>
                         <p className="text-sm font-bold text-safe uppercase">{route.hazard_status || 'Clear'}</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Destination</p>
                         <p className="text-sm font-bold text-info uppercase truncate">{route.destination_name || 'Nearest Shelter'}</p>
                       </div>
                    </div>
                    
                    {/* Visual map placeholder */}
                    <div className="w-64 bg-black relative border-l border-info/20">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400')] bg-cover bg-center opacity-30 grayscale filter"></div>
                      <div className="absolute inset-0 bg-info/10 mix-blend-overlay"></div>
                      <div className="absolute top-1/2 left-1/4 right-1/4 h-1 border-t-2 border-dashed border-info -translate-y-1/2 glow-danger route-flow-animation"></div>
                      <MapPin className="absolute top-1/2 left-1/4 w-4 h-4 text-danger -translate-x-1/2 -translate-y-1/2" />
                      <Home className="absolute top-1/2 right-1/4 w-4 h-4 text-safe translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex-1 border border-dashed border-gray-800 rounded-xl flex items-center justify-center text-gray-600 font-mono text-[10px] uppercase tracking-widest">
                  Route data not yet generated
                </div>
              )}

            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiLz48L3N2Zz4=')]">
            <Activity className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-mono text-xs uppercase tracking-widest">Select an incident from the queue to view operations</p>
          </div>
        )}
      </div>

    </div>
  );
};
