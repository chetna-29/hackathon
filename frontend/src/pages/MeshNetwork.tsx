import React, { useEffect, useState } from 'react';
import { Smartphone, Network, Radio, WifiOff, RefreshCcw } from 'lucide-react';
import { useDisasterData } from '../hooks/useDisasterData';

export const MeshNetwork: React.FC = () => {
  const { activeSos, loading } = useDisasterData();
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Network className="w-12 h-12 text-info animate-pulse mb-4" />
        <div className="text-info font-mono tracking-widest uppercase animate-pulse">Establishing Mesh Topology...</div>
      </div>
    );
  }

  const activeMesh = activeSos.filter(s => s.via_mesh).length > 0;

  return (
    <div className="flex flex-col h-full gap-6 p-2 animate-fade-in-up">
      
      {/* Header Stats */}
      <div className="flex items-center justify-between shrink-0 bg-gray-900/50 p-4 rounded-xl border border-[var(--color-border-card)]">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Radio className={`w-4 h-4 ${activeMesh ? 'text-safe animate-pulse' : 'text-gray-500'}`} /> 
            Network Topology Simulation
          </h2>
          <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">LoRa / BLE Disaster Comms</p>
        </div>
        
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">Active Nodes</p>
            <p className="text-xl font-numbers font-bold text-info">{activeMesh ? '3' : '1'}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">Mesh Status</p>
            <span className={`inline-block mt-1 text-[10px] px-3 py-1 rounded font-bold uppercase tracking-widest border ${activeMesh ? 'bg-safe/20 text-safe border-safe/30 glow-safe' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
              {activeMesh ? 'RELAY ACTIVE' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Topology Visualizer */}
        <div className="flex-1 cinematic-card rounded-xl border border-[var(--color-border-card)] flex flex-col items-center justify-center p-8 relative overflow-hidden">
          
          {/* Faint tech background grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]"></div>

          <div className="flex items-center justify-between w-full max-w-4xl relative z-10">
            {/* Node A (Origin) */}
            <div className="flex flex-col items-center group">
              <div className="mb-4 bg-gray-900 border border-gray-700 px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 whitespace-nowrap z-20">
                <p className="text-[9px] text-gray-400 font-mono">MAC: A4:C1:38:XX</p>
                <p className="text-[10px] text-white font-bold">Signal: -85dBm</p>
              </div>
              <span className="text-[10px] text-info font-mono mb-2 uppercase tracking-widest">Node A</span>
              <div className={`p-5 rounded-full border-2 transition-all duration-500 relative ${activeMesh ? 'border-safe bg-safe/10 shadow-[0_0_30px_rgba(48,209,88,0.3)]' : 'border-gray-700 bg-gray-800'}`}>
                {activeMesh && <div className="absolute inset-0 rounded-full border border-safe animate-ping opacity-30"></div>}
                <Smartphone className={`w-8 h-8 relative z-10 ${activeMesh ? 'text-safe' : 'text-gray-500'}`} />
              </div>
              <span className="text-xs font-bold mt-4 text-white uppercase tracking-wider">Origin (SOS)</span>
            </div>

            {/* Connection A-B */}
            <div className="flex-1 flex items-center px-2">
              <div className="w-full relative h-1 bg-gray-800 rounded-full overflow-hidden">
                {activeMesh && (
                  <>
                    <div className="absolute top-0 left-0 h-full bg-safe w-full opacity-30"></div>
                    <div className="absolute top-0 left-0 h-full w-4 bg-white rounded-full animate-data-packet shadow-[0_0_10px_white]"></div>
                  </>
                )}
              </div>
            </div>

            {/* Node B (Relay) */}
            <div className="flex flex-col items-center group">
              <div className="mb-4 bg-gray-900 border border-gray-700 px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 whitespace-nowrap z-20">
                <p className="text-[9px] text-gray-400 font-mono">MAC: B2:F4:11:XX</p>
                <p className="text-[10px] text-white font-bold">Battery: 82%</p>
              </div>
              <span className="text-[10px] text-info font-mono mb-2 uppercase tracking-widest">Node B</span>
              <div className={`p-5 rounded-full border-2 transition-all duration-500 relative ${activeMesh ? 'border-info bg-info/10 shadow-[0_0_30px_rgba(0,212,255,0.2)]' : 'border-gray-700 bg-gray-800'}`}>
                <Smartphone className={`w-8 h-8 relative z-10 ${activeMesh ? 'text-info' : 'text-gray-500'}`} />
              </div>
              <span className="text-xs font-bold mt-4 text-gray-400 uppercase tracking-wider">Relay</span>
            </div>

            {/* Connection B-C */}
            <div className="flex-1 flex items-center px-2">
              <div className="w-full relative h-1 bg-gray-800 rounded-full overflow-hidden">
                {activeMesh && (
                  <>
                    <div className="absolute top-0 left-0 h-full bg-info w-full opacity-30"></div>
                    <div className="absolute top-0 left-0 h-full w-4 bg-white rounded-full animate-data-packet shadow-[0_0_10px_white]" style={{ animationDelay: '0.5s' }}></div>
                  </>
                )}
              </div>
            </div>

            {/* Node C (Relay) */}
            <div className="flex flex-col items-center group">
              <span className="text-[10px] text-info font-mono mb-2 uppercase tracking-widest">Node C</span>
              <div className={`p-5 rounded-full border-2 transition-all duration-500 relative ${activeMesh ? 'border-info bg-info/10 shadow-[0_0_30px_rgba(0,212,255,0.2)]' : 'border-gray-700 bg-gray-800'}`}>
                <Smartphone className={`w-8 h-8 relative z-10 ${activeMesh ? 'text-info' : 'text-gray-500'}`} />
              </div>
              <span className="text-xs font-bold mt-4 text-gray-400 uppercase tracking-wider">Relay</span>
            </div>

            {/* Connection C-Gateway */}
            <div className="flex-1 flex items-center px-2">
              <div className="w-full relative h-1 bg-gray-800 rounded-full overflow-hidden">
                {activeMesh && (
                  <>
                    <div className="absolute top-0 left-0 h-full bg-info w-full opacity-30"></div>
                    <div className="absolute top-0 left-0 h-full w-4 bg-white rounded-full animate-data-packet shadow-[0_0_10px_white]" style={{ animationDelay: '1.0s' }}></div>
                  </>
                )}
              </div>
            </div>

            {/* Gateway */}
            <div className="flex flex-col items-center group">
              <div className="mb-4 bg-gray-900 border border-gray-700 px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 whitespace-nowrap z-20">
                <p className="text-[9px] text-info font-mono">Uplink: Active</p>
                <p className="text-[10px] text-white font-bold">Latency: 42ms</p>
              </div>
              <span className="text-[10px] text-danger font-mono mb-2 uppercase tracking-widest">Gateway</span>
              <div className={`p-6 rounded-2xl border-2 transition-all duration-500 relative ${activeMesh ? 'border-white bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'border-gray-700 bg-gray-800'}`}>
                <Network className={`w-10 h-10 relative z-10 ${activeMesh ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <span className="text-xs font-bold mt-4 text-white uppercase tracking-wider">Command Center</span>
            </div>
          </div>
          
          {/* Status Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur border border-gray-700 px-6 py-3 rounded-full flex items-center gap-4">
            {activeMesh ? (
               <>
                 <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-safe"></span></span>
                 <p className="text-white font-bold text-sm tracking-widest uppercase">3-Hop Connection Established</p>
               </>
            ) : (
               <>
                 <WifiOff className="w-4 h-4 text-gray-500" />
                 <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">No Active Mesh Tunnels</p>
               </>
            )}
          </div>
        </div>

        {/* Message Log */}
        <div className="w-[350px] cinematic-card rounded-xl border border-[var(--color-border-card)] flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
            <h3 className="text-xs font-bold tracking-widest uppercase text-white">Transmission Log</h3>
            <div className="flex items-center gap-1 text-[9px] text-gray-500 uppercase tracking-widest font-mono">
              <RefreshCcw className="w-3 h-3" /> {lastSync}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {activeSos.length === 0 ? (
               <div className="h-full flex items-center justify-center text-gray-600 font-mono text-[10px] uppercase tracking-widest">
                 Awaiting Transmissions
               </div>
            ) : (
              activeSos.map((s, i) => (
                <div key={s.sos_code || i} className="bg-black/40 border border-gray-800 p-3 rounded-lg hover:border-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-numbers font-bold text-white">MSG-{s.sos_code || `10${i}`}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${s.via_mesh ? 'bg-safe/20 text-safe border border-safe/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                      {s.via_mesh ? 'DELIVERED' : 'DIRECT'}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                    {s.via_mesh ? 'A → B → C → Gateway' : 'Direct API Uplink'}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between text-[9px]">
                    <span className="text-gray-500">Source: HH-{s.household_code}</span>
                    <span className="text-info">{s.severity}</span>
                  </div>
                </div>
              ))
            )}
            
            {/* Mock pending packet if active */}
            {activeMesh && (
               <div className="bg-info/5 border border-info/30 p-3 rounded-lg opacity-70">
                 <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-numbers font-bold text-info">MSG-SYNC</span>
                   <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest bg-info/20 text-info border border-info/30 animate-pulse">
                     QUEUED
                   </span>
                 </div>
                 <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                   A → B
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
