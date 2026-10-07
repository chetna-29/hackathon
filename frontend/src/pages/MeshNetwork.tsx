import React, { useState } from 'react';
import { Smartphone, Network, Radio } from 'lucide-react';
import { useDisasterData } from '../hooks/useDisasterData';
import { meshApi } from '../services/api';

export const MeshNetwork: React.FC = () => {
  const { activeSos, loading, refreshData } = useDisasterData();
  const [triggering, setTriggering] = useState(false);
  
  if (loading) {
    return <div className="p-8 text-center text-gray-400 animate-pulse">Loading mesh topology...</div>;
  }

  const activeMesh = activeSos.filter(s => s.via_mesh).length > 0;

  const handleTriggerSOS = async () => {
    setTriggering(true);
    try {
      const payload = {
        message_id: `SOS-${Math.floor(Date.now() / 1000)}-SIM`,
        sender_id: "DEVICE-A",
        household_id: "H101",
        latitude: 11.6082,
        longitude: 76.0921,
        severity: "CRITICAL",
        timestamp: Math.floor(Date.now() / 1000),
        ttl: 8,
        hops: ["DEVICE-A", "DEVICE-B", "DEVICE-C", "GATEWAY-RESCUE-TRUCK"],
        payload: {
          vulnerabilities: ["ELDERLY", "MOBILITY_IMPAIRED"],
          people_count: 4,
          battery_level: 82
        }
      };
      await meshApi.triggerSimulatedSOS(payload);
      refreshData();
    } catch (e) {
      console.error("Failed to trigger SOS", e);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-normal text-gray-300">Network Topology (Simulation)</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleTriggerSOS}
            disabled={triggering}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
          >
            <Radio className="w-3 h-3" />
            {triggering ? 'SIMULATING...' : 'TRIGGER MESH SOS'}
          </button>
          <span className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-normal ${activeMesh ? 'bg-safe/20 text-safe border-safe/30' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
            {activeMesh ? '● OFFLINE MESH ACTIVE' : 'STANDBY'}
          </span>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Topology Visualizer */}
        <div className="flex-1 bg-gray-900/80 rounded-lg border border-gray-800 flex items-center justify-center p-8 relative overflow-hidden">
          {/* Faint grid background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMzNzQxNTEiLz48L3N2Zz4=')] opacity-30"></div>

          <div className="flex items-center justify-between w-full max-w-3xl relative z-10">
            {/* Node A */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-mono mb-2">Node A</span>
              <div className={`p-4 rounded-full border-2 ${activeMesh ? 'border-safe bg-safe/10 shadow-[0_0_15px_#10b981]' : 'border-gray-600 bg-gray-800'}`}>
                <Smartphone className={`w-8 h-8 ${activeMesh ? 'text-safe' : 'text-gray-500'}`} />
              </div>
              <span className="text-xs font-bold mt-3 text-white">Origin (H104)</span>
            </div>

            {/* Line A-B */}
            <div className="flex-1 flex items-center px-4">
              <div className="w-full relative">
                <div className="h-0.5 w-full bg-gray-700"></div>
                {activeMesh && (
                  <div className="absolute top-0 left-0 h-0.5 bg-safe w-full origin-left animate-[scale-x_2s_infinite]"></div>
                )}
                {activeMesh && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-safe font-bold bg-gray-900 px-2 rounded-full border border-safe/30">PACKET</div>}
              </div>
            </div>

            {/* Node B */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-mono mb-2">Node B</span>
              <div className={`p-4 rounded-full border-2 ${activeMesh ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-800'}`}>
                <Smartphone className={`w-8 h-8 ${activeMesh ? 'text-blue-400' : 'text-gray-500'}`} />
              </div>
              <span className="text-xs font-bold mt-3 text-gray-300">Relay</span>
            </div>

            {/* Line B-C */}
            <div className="flex-1 flex items-center px-4">
              <div className="w-full relative">
                <div className="h-0.5 w-full bg-gray-700"></div>
                {activeMesh && (
                  <div className="absolute top-0 left-0 h-0.5 bg-blue-500 w-full origin-left animate-[scale-x_2s_infinite_0.5s]"></div>
                )}
              </div>
            </div>

            {/* Node C */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-mono mb-2">Node C</span>
              <div className={`p-4 rounded-full border-2 ${activeMesh ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-800'}`}>
                <Smartphone className={`w-8 h-8 ${activeMesh ? 'text-blue-400' : 'text-gray-500'}`} />
              </div>
              <span className="text-xs font-bold mt-3 text-gray-300">Relay</span>
            </div>

            {/* Line C-Gateway */}
            <div className="flex-1 flex items-center px-4">
              <div className="w-full relative">
                <div className="h-0.5 w-full bg-gray-700"></div>
                {activeMesh && (
                  <div className="absolute top-0 left-0 h-0.5 bg-blue-500 w-full origin-left animate-[scale-x_2s_infinite_1s]"></div>
                )}
              </div>
            </div>

            {/* Gateway */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-mono mb-2">Gateway</span>
              <div className={`p-4 rounded-lg border-2 ${activeMesh ? 'border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-gray-600 bg-gray-800'}`}>
                <Network className={`w-8 h-8 ${activeMesh ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <span className="text-xs font-bold mt-3 text-white">Command Center</span>
            </div>
          </div>
          
          {activeMesh && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="text-safe font-bold text-lg tracking-normal">3 HOPS</p>
              <p className="text-xs text-gray-400 uppercase tracking-normal mt-1">Connection Established via LoRa/BLE</p>
            </div>
          )}
        </div>

        {/* Message Log */}
        <div className="w-80 bg-gray-900/80 rounded-lg border border-gray-800 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-800 bg-gray-900">
            <h3 className="text-xs font-bold tracking-normal uppercase">Recent Messages</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[10px] text-gray-500 uppercase bg-gray-900 sticky top-0">
                <tr>
                  <th className="px-4 py-2 font-medium">ID</th>
                  <th className="px-2 py-2 font-medium text-center">Hops</th>
                  <th className="px-2 py-2 font-medium">Source</th>
                  <th className="px-4 py-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 font-mono">
                {activeSos.map((s, i) => (
                  <tr key={s.sos_code || i} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">{s.sos_code || `M10${i}`}</td>
                    <td className="px-2 py-3 text-center">{s.via_mesh ? 3 : '-'}</td>
                    <td className="px-2 py-3">{s.household_code}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-normal ${s.via_mesh ? 'bg-safe/20 text-safe' : 'bg-gray-800 text-gray-400'}`}>
                        {s.via_mesh ? 'Delivered' : 'Direct'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
