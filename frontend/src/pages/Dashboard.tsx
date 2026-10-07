import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, Ambulance, Activity, CheckCircle2, ChevronRight, Brain, Clock, Home } from 'lucide-react';
import { useDisasterData } from '../hooks/useDisasterData';
import { DisasterMap } from '../map/DisasterMap';

export const Dashboard: React.FC = () => {
  const { zones, households, queue, shelters, loading } = useDisasterData();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [assignedTeams, setAssignedTeams] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-info animate-pulse mb-4" />
        <div className="text-info font-mono tracking-widest uppercase animate-pulse">Initializing Command Center...</div>
      </div>
    );
  }

  const activeIncidents = zones.filter(z => z.risk_level === 'HIGH' || z.risk_level === 'MEDIUM');
  const criticalSOS = queue.length;
  const vulnerablePeople = households.filter(h => h.vulnerability_score > 0.7).reduce((acc, h) => acc + h.members_count, 0);
  const activeTeamsCount = 8;
  const safeSheltersCount = shelters.filter(s => s.available_beds > 0).length;

  const handleAssignTeam = (id: number) => {
    if (!assignedTeams.includes(id)) {
      setAssignedTeams([...assignedTeams, id]);
    }
  };

  return (
    <div className="flex flex-col h-full gap-3 p-3 bg-[#05080D] text-gray-200 overflow-y-auto custom-scrollbar font-sans">
      
      {/* TOP BAR */}
      <div className="flex justify-between items-end shrink-0 border-b border-gray-800 pb-3 px-2">
        <div>
          <h1 className="text-xl font-black text-white tracking-widest uppercase">Command Center</h1>
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Uttarakhand Disaster Response</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border border-safe/30 bg-safe/10 px-3 py-1.5 rounded text-[10px] font-bold text-safe uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-safe shadow-[0_0_8px_rgba(48,209,88,0.8)] animate-pulse"></span>
            System Operational
          </div>
          <div className="text-right border-l border-gray-800 pl-6">
            <p className="text-xs text-danger font-bold tracking-widest uppercase animate-pulse">LIVE</p>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest">
              {currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} <br/>
              {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1 - OPERATIONAL KPIs */}
      <div className="flex gap-3 shrink-0">
        {[
          { label: "Active Incidents", val: activeIncidents.length, color: "text-danger", border: "border-danger/30", bg: "bg-danger/10", icon: <AlertTriangle className="w-4 h-4" /> },
          { label: "Critical SOS", val: criticalSOS, color: "text-danger", border: "border-danger/30", bg: "bg-danger/10", icon: <ShieldAlert className="w-4 h-4" /> },
          { label: "Vulnerable People", val: vulnerablePeople || 142, color: "text-warning", border: "border-warning/30", bg: "bg-warning/10", icon: <Activity className="w-4 h-4" /> },
          { label: "Rescue Teams", val: activeTeamsCount, color: "text-info", border: "border-info/30", bg: "bg-info/10", icon: <Ambulance className="w-4 h-4" /> },
          { label: "Safe Shelters", val: safeSheltersCount, color: "text-safe", border: "border-safe/30", bg: "bg-safe/10", icon: <CheckCircle2 className="w-4 h-4" /> },
        ].map((kpi, i) => (
          <div key={i} className={`flex-1 flex items-center justify-between p-3 rounded-lg border ${kpi.border} bg-[#0B1118]`}>
             <div>
               <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-1">{kpi.label}</p>
               <p className={`text-2xl font-numbers font-black leading-none ${kpi.color}`}>
                 {kpi.val.toString().padStart(2, '0')}
               </p>
             </div>
             <div className={`p-2 rounded flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
               {kpi.icon}
             </div>
          </div>
        ))}
      </div>

      {/* SECTION 2 - MAIN COMMAND CENTER (3 Columns) */}
      <div className="flex gap-3 h-[500px] shrink-0">
        
        {/* LEFT: ACTIVE INCIDENTS */}
        <div className="w-[280px] bg-[#0B1118] border border-gray-800 rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-black/40">
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">Active Incidents</span>
            <span className="text-[10px] font-mono text-danger font-bold bg-danger/20 px-2 py-0.5 rounded">{activeIncidents.length} ACTIVE</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {activeIncidents.length === 0 ? (
               <div className="p-4 text-center text-gray-600 text-xs font-mono uppercase">No Active Incidents</div>
            ) : activeIncidents.map((zone, i) => (
              <div key={zone.zone_code} className="p-3 rounded bg-black/40 border border-gray-800 hover:border-gray-600 cursor-pointer transition-colors relative overflow-hidden group">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${zone.risk_level === 'HIGH' ? 'bg-danger' : 'bg-warning'}`}></div>
                
                <div className="pl-2">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className={`w-3 h-3 ${zone.risk_level === 'HIGH' ? 'text-danger' : 'text-warning'}`} />
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${zone.risk_level === 'HIGH' ? 'text-danger' : 'text-warning'}`}>
                        {zone.risk_level === 'HIGH' ? 'LANDSLIDE' : 'FLASH FLOOD'}
                      </span>
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono">{i * 6 + 4} min ago</span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-white tracking-wider">{zone.name}</h4>
                  
                  <div className="flex justify-between mt-2 pt-2 border-t border-gray-800/50 text-[10px] font-mono">
                    <span className="text-gray-400">Risk {(zone.risk_score * 100).toFixed(0)}%</span>
                    <span className={zone.risk_level === 'HIGH' ? 'text-danger' : 'text-warning'}>{zone.risk_level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: LIVE DISASTER MAP */}
        <div className="flex-1 bg-[#0B1118] border border-gray-800 rounded-lg overflow-hidden relative flex flex-col">
          <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 pointer-events-none bg-black/60 backdrop-blur px-3 py-1.5 rounded border border-gray-700">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_8px_rgba(255,59,48,0.8)]"></span>
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">Live Disaster Map</span>
          </div>
          
          <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
            <div className="bg-black/80 backdrop-blur border border-gray-700 rounded p-3 pointer-events-auto">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 block border-b border-gray-800 pb-1">Layers</span>
              <div className="space-y-1.5">
                {['Risk Zones', 'SOS', 'Vulnerable Households', 'Rescue Teams', 'Shelters', 'Hospitals'].map((l, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-300 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-info" /> {l}
                  </label>
                ))}
              </div>
            </div>
            
            <select className="bg-black/80 backdrop-blur border border-gray-700 text-[9px] font-bold uppercase tracking-widest text-white px-3 py-2 rounded outline-none pointer-events-auto">
              <option>All Disasters</option>
              <option>Landslide</option>
              <option>Flash Flood</option>
              <option>Cloudburst</option>
            </select>
          </div>
          
          <div className="flex-1 z-0 relative bg-gray-900">
             <DisasterMap 
               zones={zones} 
               households={households} 
               shelters={shelters} 
               activeSosItems={queue} 
               route={null} 
               selectedDistrict={undefined} 
             />
          </div>
        </div>

        {/* RIGHT: RESCUE PRIORITY QUEUE */}
        <div className="w-[340px] bg-[#0B1118] border border-gray-800 rounded-lg flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 bg-black/40">
            <h3 className="text-[10px] font-bold tracking-widest text-danger uppercase mb-1">Rescue Priority</h3>
            <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">AI-Assisted Dispatch Queue</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {queue.map((item, index) => {
              const priorityClass = index === 0 ? 'border-danger bg-danger/10 shadow-[0_0_15px_rgba(255,59,48,0.1)]' : 'border-gray-800 bg-black/40 hover:border-gray-600';
              const isAssigned = assignedTeams.includes(item.sos_id);
              
              return (
                <div key={item.sos_id} className={`p-4 rounded-lg border transition-colors ${priorityClass}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded ${index === 0 ? 'bg-danger text-white glow-danger' : 'bg-gray-800 text-gray-300'}`}>
                        P{index + 1}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${item.severity === 'CRITICAL' ? 'text-danger' : 'text-warning'}`}>
                        {item.severity}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">{(item.priority_score).toFixed(1)} SCORE</span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-white tracking-wider mb-2">Chamoli • Sector {item.household_code}</h4>
                  
                  <div className="text-[10px] uppercase tracking-widest text-info font-bold mb-3 border-b border-gray-800/50 pb-2">
                    {item.elderly_count + item.disabled_count + 1} PEOPLE
                  </div>

                  <div className="space-y-1 mb-4">
                    {item.elderly_count > 0 && <div className="text-[10px] text-gray-400 flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-warning" /> Elderly: {item.elderly_count}</div>}
                    {item.disabled_count > 0 && <div className="text-[10px] text-gray-400 flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-warning" /> Disability: {item.disabled_count}</div>}
                  </div>

                  <div className="flex justify-between text-[10px] font-mono mb-4 bg-black/30 p-2 rounded">
                    <div className="flex flex-col"><span className="text-gray-500">RISK</span><span className="text-danger font-bold">94%</span></div>
                    <div className="flex flex-col"><span className="text-gray-500">ISOLATION</span><span className="text-warning font-bold">HIGH</span></div>
                    <div className="flex flex-col"><span className="text-gray-500">DISTANCE</span><span className="text-info font-bold">2.4 km</span></div>
                  </div>

                  <button 
                    onClick={() => handleAssignTeam(item.sos_id)}
                    disabled={isAssigned}
                    className={`w-full py-2 rounded text-[10px] tracking-widest uppercase transition-all font-bold flex items-center justify-center gap-2
                      ${isAssigned 
                        ? 'bg-safe/20 text-safe border border-safe/30 cursor-not-allowed' 
                        : 'bg-danger hover:bg-danger-dark text-white shadow-lg shadow-danger/20'}`}
                  >
                    {isAssigned ? <><CheckCircle2 className="w-3 h-3" /> Team Assigned</> : <><Ambulance className="w-3 h-3" /> Assign Team</>}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-gray-800 bg-gray-900/50 cursor-pointer group">
            <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex justify-between items-center">
              How is Priority Calculated? <ChevronRight className="w-3 h-3 group-hover:text-white transition-colors" />
            </h4>
            {/* Expanded state can be toggled, mocked as slightly visible here */}
            <div className="mt-2 text-[9px] font-mono text-gray-400 flex justify-between hidden group-hover:flex">
               <span>Sev: 40%</span><span>Vul: 30%</span><span>Risk: 20%</span><span>Iso: 10%</span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3 - LOWER COMMAND AREA */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        
        {/* RESCUE TEAMS */}
        <div className="bg-[#0B1118] border border-gray-800 rounded-lg p-4">
          <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Ambulance className="w-4 h-4 text-info" /> Rescue Teams
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-200">TEAM ALPHA</p>
                <p className="text-[9px] text-gray-500 font-mono mt-0.5">Loc: Chamoli • Dist: 2.4 km</p>
              </div>
              <span className="text-[9px] font-bold text-safe uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-safe"></span> Available</span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-200">TEAM BRAVO</p>
                <p className="text-[9px] text-gray-500 font-mono mt-0.5">Loc: Rudraprayag</p>
              </div>
              <span className="text-[9px] font-bold text-warning uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-warning"></span> On Mission</span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-200">TEAM CHARLIE</p>
                <p className="text-[9px] text-gray-500 font-mono mt-0.5">Loc: Pauri</p>
              </div>
              <span className="text-[9px] font-bold text-safe uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-safe"></span> Available</span>
            </div>
          </div>
        </div>

        {/* SAFE SHELTERS */}
        <div className="bg-[#0B1118] border border-gray-800 rounded-lg p-4">
          <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Home className="w-4 h-4 text-safe" /> Safe Shelters
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-200">Govt Relief Center, Chamoli</p>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1 mb-1">
                <span>Capacity: 120</span><span className="text-safe font-bold">Avail: 64</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-safe w-[46%]"></div></div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-200">District Emergency Shelter, Rudraprayag</p>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1 mb-1">
                <span>Capacity: 200</span><span className="text-warning font-bold">Avail: 118</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-warning w-[41%]"></div></div>
            </div>
          </div>
        </div>

        {/* AI RISK ANALYSIS */}
        <div className="bg-[#0B1118] border border-gray-800 rounded-lg p-4 flex flex-col justify-between">
          <h3 className="text-[10px] font-bold tracking-widest text-white uppercase mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Brain className="w-4 h-4 text-info" /> AI Risk Analysis
          </h3>
          
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">Highest Risk</p>
              <p className="text-sm font-bold text-white tracking-wider">Chamoli</p>
              <p className="text-[10px] font-bold text-danger uppercase mt-0.5 tracking-widest">LANDSLIDE</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">Risk Score</p>
              <p className="text-xl font-numbers font-black text-danger">94%</p>
              <p className="text-[9px] font-bold text-danger uppercase mt-0.5">↑ Increasing</p>
            </div>
          </div>

          <div className="bg-black/30 p-2 rounded border border-gray-800 text-[9px] text-gray-400 font-mono">
            <span className="block text-white font-sans uppercase mb-1">Primary Factors:</span>
            Rainfall (Critical) • Slope (High) • Soil Saturation (High)
          </div>
        </div>

      </div>

      {/* SECTION 4 - LIVE RESPONSE ACTIVITY */}
      <div className="bg-[#0B1118] border border-gray-800 rounded-lg p-3 shrink-0 flex items-center gap-4 overflow-x-auto custom-scrollbar whitespace-nowrap">
        <div className="text-[9px] font-bold tracking-widest text-danger uppercase shrink-0 flex items-center gap-2 pr-4 border-r border-gray-800">
          <Clock className="w-3 h-3" /> Live Activity
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-mono text-gray-400">
          <span className="flex items-center gap-2"><span className="text-danger font-bold">15:42</span> SOS received (Chamoli) - P1 assigned</span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-2"><span className="text-warning font-bold">15:40</span> Risk score increased (Chamoli) 89% → 94%</span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-2"><span className="text-safe font-bold">15:37</span> Team Alpha status: Available</span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-2"><span className="text-info font-bold">15:31</span> Mesh packet received (Remote)</span>
        </div>
      </div>

    </div>
  );
};
