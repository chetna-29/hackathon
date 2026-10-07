import React, { useState } from 'react';
import { DisasterMap } from '../map/DisasterMap';
import { useDisasterData } from '../hooks/useDisasterData';
import { Layers, AlertTriangle, ShieldAlert, Brain, Activity, Clock, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LiveMap: React.FC = () => {
  const { zones, households, queue, shelters, loading } = useDisasterData();
  const [selectedDistrict, setSelectedDistrict] = useState('Chamoli');
  const [layers, setLayers] = useState({ risk: true, sos: true, households: true, shelters: true, hospitals: true, rescue: true, routes: true });
  const navigate = useNavigate();

  if (loading) {
    return <div className="p-8 text-center text-gray-400 animate-pulse">Loading Live Operations Map...</div>;
  }

  // Find the primary high risk zone to mock the active incident panel
  const highRiskZone = zones.find(z => z.risk_level === 'HIGH') || zones[0];
  const activeSOSCount = queue.length;
  const vulnerableCount = households.filter(h => h.vulnerability_score > 0.7).length;

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden relative border border-gray-800 bg-black">
      
      {/* Top Map Header - Floating */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-start pointer-events-none">
        
        {/* Left Side: Active Incident Panel */}
        <div className="w-80 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl pointer-events-auto overflow-hidden">
          <div className="bg-danger px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Active Incident</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">{selectedDistrict} ZONE</h3>
              <p className="text-danger text-xs font-bold uppercase tracking-widest">Landslide Risk</p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-gray-400">Risk Score</span>
              <span className="text-white text-right font-bold text-lg leading-none">{highRiskZone ? (highRiskZone.risk_score * 100).toFixed(0) : 87}%</span>
              
              <span className="text-gray-400">Severity</span>
              <span className="text-danger text-right font-bold">HIGH</span>
              
              <span className="text-gray-400">Vulnerable</span>
              <span className="text-warning text-right font-bold">{vulnerableCount}</span>
              
              <span className="text-gray-400">Active SOS</span>
              <span className="text-danger text-right font-bold">{activeSOSCount}</span>
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 py-2 rounded text-xs transition-colors font-medium tracking-widest uppercase"
            >
              View Details →
            </button>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex flex-col gap-4 items-end pointer-events-auto">
          
          {/* District Selector & Layer Control */}
          <div className="flex gap-4">
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-gray-900/90 backdrop-blur-md text-sm font-bold text-white px-4 py-2 rounded-lg border border-gray-700 shadow-xl outline-none hover:border-gray-500 cursor-pointer"
            >
              <option>Chamoli</option>
              <option>Rudraprayag</option>
              <option>Uttarkashi</option>
              <option>Pithoragarh</option>
              <option>Dehradun</option>
            </select>

            {/* Layer Control Dropdown Panel */}
            <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 p-3 rounded-lg shadow-xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest mb-1 border-b border-gray-700 pb-2">
                <Layers className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-gray-200">Map Layers</span>
              </div>
              <label className="flex items-center gap-3 text-xs text-gray-300 cursor-pointer hover:bg-gray-800/50 p-1 rounded">
                <input type="checkbox" checked={layers.risk} onChange={() => setLayers(l => ({...l, risk: !l.risk}))} className="accent-blue-500" /> 
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-danger shadow-[0_0_5px_#ef4444]"></span> Risk Zones</div>
              </label>
              <label className="flex items-center gap-3 text-xs text-gray-300 cursor-pointer hover:bg-gray-800/50 p-1 rounded">
                <input type="checkbox" checked={layers.sos} onChange={() => setLayers(l => ({...l, sos: !l.sos}))} className="accent-blue-500" /> 
                <div className="flex items-center gap-2">🚨 SOS Requests</div>
              </label>
              <label className="flex items-center gap-3 text-xs text-gray-300 cursor-pointer hover:bg-gray-800/50 p-1 rounded">
                <input type="checkbox" checked={layers.households} onChange={() => setLayers(l => ({...l, households: !l.households}))} className="accent-blue-500" /> 
                <div className="flex items-center gap-2">👤 Vulnerable</div>
              </label>
              <label className="flex items-center gap-3 text-xs text-gray-300 cursor-pointer hover:bg-gray-800/50 p-1 rounded">
                <input type="checkbox" checked={layers.shelters} onChange={() => setLayers(l => ({...l, shelters: !l.shelters}))} className="accent-blue-500" /> 
                <div className="flex items-center gap-2">🏠 Shelters</div>
              </label>
              <label className="flex items-center gap-3 text-xs text-gray-300 cursor-pointer hover:bg-gray-800/50 p-1 rounded">
                <input type="checkbox" checked={layers.hospitals} onChange={() => setLayers(l => ({...l, hospitals: !l.hospitals}))} className="accent-blue-500" /> 
                <div className="flex items-center gap-2">🏥 Hospitals</div>
              </label>
              <label className="flex items-center gap-3 text-xs text-gray-300 cursor-pointer hover:bg-gray-800/50 p-1 rounded">
                <input type="checkbox" checked={layers.rescue} onChange={() => setLayers(l => ({...l, rescue: !l.rescue}))} className="accent-blue-500" /> 
                <div className="flex items-center gap-2">🚑 Rescue Teams</div>
              </label>
              <label className="flex items-center gap-3 text-xs text-gray-300 cursor-pointer hover:bg-gray-800/50 p-1 rounded">
                <input type="checkbox" checked={layers.routes} onChange={() => setLayers(l => ({...l, routes: !l.routes}))} className="accent-blue-500" /> 
                <div className="flex items-center gap-2"><div className="w-3 h-0 border-t-2 border-cyan-400"></div> Safe Routes</div>
              </label>
            </div>
          </div>

          {/* AI Risk Analysis Mini-Panel */}
          <div className="w-64 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl p-4">
             <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-blue-400 mb-3 border-b border-gray-800 pb-2">
                <Brain className="w-4 h-4" />
                <span className="font-bold">AI Risk Analysis</span>
             </div>
             
             <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] text-gray-400 uppercase">Predicted Risk</span>
                 <span className="text-danger font-bold text-sm">87% (HIGH)</span>
               </div>
               
               <div className="space-y-1">
                 <div className="flex justify-between text-[9px] text-gray-400 uppercase">
                   <span>Rainfall</span><span>Critical</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-800 rounded overflow-hidden">
                   <div className="h-full bg-danger w-[90%]"></div>
                 </div>
               </div>
               
               <div className="space-y-1">
                 <div className="flex justify-between text-[9px] text-gray-400 uppercase">
                   <span>Slope</span><span>High</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-800 rounded overflow-hidden">
                   <div className="h-full bg-warning w-[75%]"></div>
                 </div>
               </div>
               
               <div className="space-y-1">
                 <div className="flex justify-between text-[9px] text-gray-400 uppercase">
                   <span>Elevation</span><span>Moderate</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-800 rounded overflow-hidden">
                   <div className="h-full bg-blue-500 w-[50%]"></div>
                 </div>
               </div>
               
               <div className="space-y-1">
                 <div className="flex justify-between text-[9px] text-gray-400 uppercase">
                   <span>Soil Saturation</span><span>High</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-800 rounded overflow-hidden">
                   <div className="h-full bg-warning w-[80%]"></div>
                 </div>
               </div>
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
        
        {/* Empty State Overlay if no SOS */}
        {activeSOSCount === 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1000] flex flex-col items-center opacity-50">
            <ShieldAlert className="w-16 h-16 text-safe mb-4 opacity-50" />
            <h2 className="text-xl font-bold tracking-widest text-safe uppercase">No Active SOS Requests</h2>
            <p className="text-xs text-gray-400 tracking-widest uppercase mt-2">System Monitoring Live Map</p>
          </div>
        )}
      </div>

      {/* Bottom Information Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[400] bg-gray-900/95 backdrop-blur-md border-t border-gray-800 px-6 py-2 flex items-center justify-between text-xs tracking-widest uppercase shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Active Risks</span>
            <span className="font-bold text-danger">{zones.filter(z => z.risk_level === 'HIGH').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">SOS</span>
            <span className="font-bold text-danger">{activeSOSCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Vulnerable</span>
            <span className="font-bold text-warning">{vulnerableCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Shelters</span>
            <span className="font-bold text-safe">{shelters.length}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Last Update: {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2 text-safe">
            <Network className="w-3 h-3" />
            <span className="font-bold">MESH STANDBY</span>
          </div>
          <div className="flex items-center gap-2 text-safe">
            <Activity className="w-3 h-3" />
            <span className="font-bold">API ONLINE</span>
          </div>
        </div>
      </div>

    </div>
  );
};
