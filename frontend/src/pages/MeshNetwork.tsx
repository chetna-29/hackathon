import React, { useEffect, useState } from "react";
import { Smartphone, Network, Radio, WifiOff, RefreshCcw, Play } from "lucide-react";
import { useDisasterData } from "../hooks/useDisasterData";
import { meshApi } from "../services/api";

export const MeshNetwork: React.FC = () => {
  const { activeSos, loading } = useDisasterData();
  const [lastSync, setLastSync] = useState(
    new Date().toLocaleTimeString("en-US", { hour12: false }),
  );

  // Simulation State: 
  // 0: IDLE, 1: NODE_A, 2: TRANSIT_A_B, 3: NODE_B, 4: TRANSIT_B_C, 5: NODE_C, 6: TRANSIT_C_GW, 7: GATEWAY, 8: SUCCESS
  const [simState, setSimState] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const runSimulation = async () => {
    if (simState !== 0) return;
    
    // Step 1: Node A
    setSimState(1);
    await new Promise(r => setTimeout(r, 1000));
    
    // Step 2: Transit A->B
    setSimState(2);
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 3: Node B
    setSimState(3);
    await new Promise(r => setTimeout(r, 1000));
    
    // Step 4: Transit B->C
    setSimState(4);
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 5: Node C
    setSimState(5);
    await new Promise(r => setTimeout(r, 1000));
    
    // Step 6: Transit C->GW
    setSimState(6);
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 7: Gateway
    setSimState(7);
    await new Promise(r => setTimeout(r, 1000));
    
    // Step 8: Call API
    try {
      await meshApi.triggerSimulatedSOS({
        message_id: `SOS-DEMO-${Math.floor(Math.random() * 10000)}`,
        sender_id: "DEVICE-A",
        type: "SOS",
        household_id: "H101",
        latitude: 11.6082,
        longitude: 76.0921,
        severity: "CRITICAL",
        timestamp: Math.floor(Date.now() / 1000),
        payload: {
          vulnerabilities: ["ELDERLY", "MOBILITY_IMPAIRED"],
          people_count: 4,
          battery_level: 82,
        },
      });
      setSimState(8);
      setTimeout(() => setSimState(0), 4000); // reset after 4s
    } catch (e) {
      console.error("Simulation failed", e);
      setSimState(0);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-black text-gray-500">
        Loading Network Data...
      </div>
    );
  }

  const activeMesh = activeSos.filter((s) => s.via_mesh).length > 0 || simState > 0;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black font-sans p-6">
      <style>{`
        @keyframes travel {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .packet-animation {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background-color: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 10px #3b82f6, 0 0 20px #3b82f6;
          animation: travel 1.5s linear forwards;
          z-index: 20;
        }
        .packet-green {
          background-color: #22c55e;
          box-shadow: 0 0 10px #22c55e, 0 0 20px #22c55e;
        }
      `}</style>
      
      {/* Header Stats */}
      <div className="flex items-center justify-between shrink-0 bg-white dark:bg-[#0a0a0a] p-6 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Radio
              className={`w-5 h-5 ${activeMesh ? "text-green-600 animate-pulse" : "text-gray-400"}`}
            />
            Network Topology
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            LoRa / BLE Communications
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={runSimulation}
            disabled={simState !== 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Play className="w-4 h-4" />
            Simulate SOS Mesh Packet
          </button>
        </div>

        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">
              Active Nodes
            </p>
            <p className="text-2xl font-medium text-gray-900 dark:text-gray-100">
              {activeMesh ? "3" : "1"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">
              Mesh Status
            </p>
            <span
              className={`inline-block text-xs px-2 py-1 rounded font-medium border ${activeMesh ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 dark:bg-zinc-900 text-gray-600 border-gray-200 dark:border-zinc-800"}`}
            >
              {activeMesh ? "RELAY ACTIVE" : "STANDBY"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Topology Visualizer */}
        <div className="flex-1 bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between w-full max-w-4xl relative z-10">
            {/* Node A (Origin) */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600 font-medium mb-3">
                Node A
              </span>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white dark:bg-[#0a0a0a] ${simState >= 1 ? "border-green-500 shadow-md ring-4 ring-green-50" : "border-gray-200 dark:border-zinc-800"}`}
              >
                <Smartphone
                  className={`w-6 h-6 ${simState >= 1 ? "text-green-600" : "text-gray-400"}`}
                />
              </div>
              <span className="text-sm font-medium mt-4 text-gray-900 dark:text-gray-100">
                Origin
              </span>
            </div>

            {/* Connection A-B */}
            <div className="flex-1 flex items-center px-4 relative">
              <div className="w-full h-0.5 bg-gray-200 dark:bg-zinc-800 relative overflow-hidden">
                {simState > 1 && (
                  <div className="absolute top-0 left-0 h-full w-full bg-green-500 origin-left"></div>
                )}
              </div>
              {simState === 2 && <div className="packet-animation packet-green"></div>}
            </div>

            {/* Node B (Relay) */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600 font-medium mb-3">
                Node B
              </span>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white dark:bg-[#0a0a0a] ${simState >= 3 ? "border-blue-500 shadow-md ring-4 ring-blue-50" : "border-gray-200 dark:border-zinc-800"}`}
              >
                <Smartphone
                  className={`w-6 h-6 ${simState >= 3 ? "text-blue-600" : "text-gray-400"}`}
                />
              </div>
              <span className="text-sm font-medium mt-4 text-gray-500">
                Relay
              </span>
            </div>

            {/* Connection B-C */}
            <div className="flex-1 flex items-center px-4 relative">
              <div className="w-full h-0.5 bg-gray-200 dark:bg-zinc-800 relative overflow-hidden">
                {simState > 3 && (
                  <div className="absolute top-0 left-0 h-full w-full bg-blue-500 origin-left"></div>
                )}
              </div>
              {simState === 4 && <div className="packet-animation"></div>}
            </div>

            {/* Node C (Relay) */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600 font-medium mb-3">
                Node C
              </span>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white dark:bg-[#0a0a0a] ${simState >= 5 ? "border-blue-500 shadow-md ring-4 ring-blue-50" : "border-gray-200 dark:border-zinc-800"}`}
              >
                <Smartphone
                  className={`w-6 h-6 ${simState >= 5 ? "text-blue-600" : "text-gray-400"}`}
                />
              </div>
              <span className="text-sm font-medium mt-4 text-gray-500">
                Relay
              </span>
            </div>

            {/* Connection C-Gateway */}
            <div className="flex-1 flex items-center px-4 relative">
              <div className="w-full h-0.5 bg-gray-200 dark:bg-zinc-800 relative overflow-hidden">
                {simState > 5 && (
                  <div className="absolute top-0 left-0 h-full w-full bg-blue-500 origin-left"></div>
                )}
              </div>
              {simState === 6 && <div className="packet-animation"></div>}
            </div>

            {/* Gateway */}
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-900 dark:text-gray-100 font-medium mb-3">
                Gateway
              </span>
              <div
                className={`w-20 h-20 rounded-lg flex items-center justify-center border-2 transition-all duration-500 bg-white dark:bg-[#0a0a0a] ${simState >= 7 ? "border-indigo-600 shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-50" : "border-gray-200 dark:border-zinc-800"}`}
              >
                <Network
                  className={`w-8 h-8 ${simState >= 7 ? "text-indigo-600 animate-bounce" : "text-gray-400"}`}
                />
              </div>
              <span className="text-sm font-medium mt-4 text-gray-900 dark:text-gray-100">
                Command Center
              </span>
            </div>
          </div>

          {/* Status Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 px-6 py-3 rounded-full flex items-center gap-3 shadow-sm">
            {simState === 8 ? (
              <>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                  Packet Ingested Successfully!
                </p>
              </>
            ) : simState > 0 ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                  Transmitting Packet...
                </p>
              </>
            ) : activeMesh ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                  Mesh Connected
                </p>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-gray-400" />
                <p className="text-gray-500 font-medium text-sm">
                  No Active Transmissions
                </p>
              </>
            )}
          </div>
        </div>

        {/* Message Log */}
        <div className="w-[350px] bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden shrink-0 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-black flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Transmission Log
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <RefreshCcw className="w-3 h-3" /> {lastSync}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeSos.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No Transmissions
              </div>
            ) : (
              activeSos.map((s, i) => (
                <div
                  key={s.sos_code || i}
                  className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      MSG-{s.sos_code || `10${i}`}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${s.via_mesh ? "bg-green-50 text-green-700" : "bg-gray-100 dark:bg-zinc-900 text-gray-600"}`}
                    >
                      {s.via_mesh ? "DELIVERED" : "DIRECT"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    {s.via_mesh ? "A → B → C → Gateway" : "Direct API Uplink"}
                  </div>
                  <div className="pt-3 border-t border-gray-100 dark:border-zinc-900 flex justify-between text-sm">
                    <span className="text-gray-600">
                      Source: HH-{s.household_code}
                    </span>
                    <span className="text-blue-600 font-medium">{s.severity}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
