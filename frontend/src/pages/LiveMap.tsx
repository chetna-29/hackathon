import React, { useState } from 'react';
import { DisasterMap } from '../map/DisasterMap';
import { useDisasterData } from '../hooks/useDisasterData';
import { Layers, AlertTriangle, Brain, Database, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LiveMap: React.FC = () => {
  const { zones, households, queue, shelters, loading } = useDisasterData();
  const [selectedDistrict, setSelectedDistrict] = useState('Chamoli');
  const [selectedDisaster, setSelectedDisaster] = useState('LANDSLIDE');
  const [layers, setLayers] = useState({ risk: true, sos: true, households: true, shelters: true, hospitals: true, rescue: true, routes: true });
  const navigate = useNavigate();

  if (loading) {
    return <div className="p-8 text-center text-gray-400 animate-pulse">Loading Live Operations Map...</div>;
  }

  const activeSOSCount = queue.length;
  const vulnerableCount = households.filter(h => h.vulnerability_score > 0.7).length;

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden relative border border-gray-800 bg-black animate-fade-in-up">
      
      {/* Top Map Header - Floating Controls */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-start pointer-events-none">
        
        {/* Left Side: Active Incident Panel */}
        <div className="w-80 cinematic-card backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl pointer-events-auto overflow-hidden">
          <div className="bg-danger/20 border-b border-danger/30 px-4 py-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger animate-pulse glow-danger" />
            <h2 className="text-sm font-bold text-danger tracking-widest uppercase">Live Incidents</h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">{selectedDistrict}</h3>
              <p className="text-warning text-xs font-bold uppercase tracking-widest mt-1">Primary Threat: {selectedDisaster}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 text-xs tracking-widest uppercase">
              <span className="text-gray-500">Risk Score</span>
              <span className="text-white text-right font-numbers font-bold text-xl leading-none">87%</span>
              
              <span className="text-gray-500">Severity</span>
              <span className="text-danger text-right font-bold bg-danger/10 border border-danger/30 rounded px-2 py-0.5 max-w-max ml-auto">CRITICAL</span>
              
              <span className="text-gray-500">Vulnerable</span>
              <span className="text-warning text-right font-numbers font-bold text-lg">{vulnerableCount}</span>
              
              <span className="text-gray-500">Active SOS</span>
              <span className="text-danger text-right font-numbers font-bold text-lg">{activeSOSCount}</span>
            </div>

            <button 
              onClick={() => navigate('/rescue')}
              className="w-full mt-2 bg-danger hover:bg-danger-dark text-white shadow-[0_0_15px_rgba(255,59,48,0.3)] py-3 rounded text-[10px] transition-colors font-bold tracking-widest uppercase"
            >
              Open Rescue Queue →
            </button>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex flex-col gap-4 items-end pointer-events-auto w-72">
          
          {/* Selectors */}
          <div className="flex flex-col gap-2 w-full">
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-gray-900/90 backdrop-blur border border-gray-700 text-[10px] font-bold tracking-widest uppercase text-white px-4 py-3 rounded-lg shadow-xl outline-none hover:border-gray-500 cursor-pointer transition-colors"
            >
              <option value="Chamoli">District: Chamoli</option>
              <option value="Rudraprayag">District: Rudraprayag</option>
              <option value="Uttarkashi">District: Uttarkashi</option>
              <option value="Pithoragarh">District: Pithoragarh</option>
              <option value="Dehradun">District: Dehradun</option>
            </select>

            <select 
              value={selectedDisaster}
              onChange={(e) => setSelectedDisaster(e.target.value)}
              className="w-full bg-danger/10 backdrop-blur border border-danger/30 text-[10px] font-bold tracking-widest uppercase text-danger px-4 py-3 rounded-lg shadow-xl outline-none hover:bg-danger/20 cursor-pointer transition-colors"
            >
              <option value="LANDSLIDE">Threat: Landslide</option>
              <option value="FLASH FLOOD">Threat: Flash Flood</option>
              <option value="FLOOD">Threat: Flood</option>
              <option value="CLOUDBURST">Threat: Cloudburst</option>
              <option value="FOREST FIRE">Threat: Forest Fire</option>
              <option value="EARTHQUAKE">Threat: Earthquake</option>
            </select>
          </div>

          {/* AI Risk Analysis Mini-Panel */}
          <div className="w-full cinematic-card backdrop-blur border border-gray-700 rounded-xl shadow-xl p-5">
             <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-info mb-4 border-b border-gray-800 pb-3">
                <Brain className="w-4 h-4" />
                <span className="font-bold">AI Risk Analysis</span>
             </div>
             
             <div className="space-y-4">
               <div className="space-y-1.5">
                 <div className="flex justify-between text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                   <span>Rainfall</span><span className="text-danger">Critical</span>
                 </div>
                 <div className="flex h-1 gap-0.5">
                   {[...Array(10)].map((_, i) => <div key={i} className={`flex-1 rounded-sm ${i < 9 ? 'bg-danger glow-danger' : 'bg-gray-800'}`}></div>)}
                 </div>
               </div>
               
               <div className="space-y-1.5">
                 <div className="flex justify-between text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                   <span>Slope</span><span className="text-warning">High</span>
                 </div>
                 <div className="flex h-1 gap-0.5">
                   {[...Array(10)].map((_, i) => <div key={i} className={`flex-1 rounded-sm ${i < 8 ? 'bg-warning' : 'bg-gray-800'}`}></div>)}
                 </div>
               </div>
               
               <div className="space-y-1.5">
                 <div className="flex justify-between text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                   <span>Elevation</span><span className="text-info">Moderate</span>
                 </div>
                 <div className="flex h-1 gap-0.5">
                   {[...Array(10)].map((_, i) => <div key={i} className={`flex-1 rounded-sm ${i < 5 ? 'bg-info' : 'bg-gray-800'}`}></div>)}
                 </div>
               </div>
             </div>
          </div>
          
          {/* Layer Controls */}
          <div className="w-full cinematic-card backdrop-blur border border-gray-700 p-4 rounded-xl shadow-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest mb-1 border-b border-gray-800 pb-2">
              <Layers className="w-3 h-3 text-gray-400" />
              <span className="font-bold text-gray-200">Operational Layers</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={layers.risk} onChange={() => setLayers(l => ({...l, risk: !l.risk}))} className="accent-info" /> 
                <span className="w-2 h-2 rounded-full bg-danger"></span> Risk Zones
              </label>
              <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={layers.sos} onChange={() => setLayers(l => ({...l, sos: !l.sos}))} className="accent-info" /> 
                <span>🚨 SOS</span>
              </label>
              <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={layers.households} onChange={() => setLayers(l => ({...l, households: !l.households}))} className="accent-info" /> 
                <span>👤 Vuln.</span>
              </label>
              <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={layers.shelters} onChange={() => setLayers(l => ({...l, shelters: !l.shelters}))} className="accent-info" /> 
                <span>🏠 Shelters</span>
              </label>
              <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={layers.hospitals} onChange={() => setLayers(l => ({...l, hospitals: !l.hospitals}))} className="accent-info" /> 
                <span>🏥 Hospitals</span>
              </label>
              <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={layers.rescue} onChange={() => setLayers(l => ({...l, rescue: !l.rescue}))} className="accent-info" /> 
                <span>🚑 Teams</span>
              </label>
              <label className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-300 cursor-pointer hover:text-white transition-colors col-span-2">
                <input type="checkbox" checked={layers.routes} onChange={() => setLayers(l => ({...l, routes: !l.routes}))} className="accent-info" /> 
                <div className="w-3 h-0 border-t-2 border-dashed border-info glow-safe"></div> Routes
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* The actual Map - z-index ensures it sits below floating panels */}
      <div className="flex-1 z-0 relative">
        <DisasterMap 
          zones={zones} 
          households={households} 
          shelters={shelters} 
          activeSosItems={queue}
          route={null}
          visibleLayers={layers}
          selectedDistrict={selectedDistrict}
        />
      </div>

      {/* Bottom Information Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] bg-gray-900/90 backdrop-blur border border-gray-800 rounded-xl px-6 py-3 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-auto">
        <div className="flex items-center gap-6">
          <span className="text-gray-500 flex items-center gap-2"><Cpu className="w-3 h-3 text-info" /> SYSTEM STATUS:</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse"></span>
            <span className="text-white">API</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse"></span>
            <span className="text-white">WEBSOCKET</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse"></span>
            <span className="text-white">MESH</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse"></span>
            <span className="text-white">ML ENGINE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-info bg-info/10 px-3 py-1 rounded border border-info/30">
          <Database className="w-3 h-3" />
          <span>DATA SYNCED</span>
        </div>
      </div>

    </div>
  );
};
