import React, { useState } from "react";
import { useDisasterData } from "../hooks/useDisasterData";
import { DisasterMap } from "../map/DisasterMap";

export const Dashboard: React.FC = () => {
  const { zones, households, queue, shelters, loading } = useDisasterData();
  const [assignedTeams, setAssignedTeams] = useState<number[]>([]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-black text-gray-500 dark:text-gray-500">
        Loading dashboard data...
      </div>
    );
  }

  const activeIncidents = zones.filter(
    (z) => z.risk_level === "HIGH" || z.risk_level === "MEDIUM",
  );
  const criticalSOS = queue.length;
  const vulnerablePeople = households
    .filter((h) => h.vulnerability_score > 0.7)
    .reduce((acc, h) => acc + h.members_count, 0);
  const activeTeamsCount = 0;
  const safeSheltersCount = shelters.filter((s) => s.available_beds > 0).length;

  const handleAssignTeam = (id: number) => {
    if (!assignedTeams.includes(id)) {
      setAssignedTeams([...assignedTeams, id]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 overflow-y-auto p-6 font-sans">
      <header className="flex justify-between items-end border-b border-gray-200 dark:border-zinc-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Command Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-500">Uttarakhand Disaster Response</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-500">
          System Operational
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: "Active Incidents", val: activeIncidents.length },
          { label: "Critical SOS", val: criticalSOS },
          { label: "Vulnerable People", val: vulnerablePeople },
          { label: "Rescue Teams", val: activeTeamsCount },
          { label: "Safe Shelters", val: safeSheltersCount },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-[#0a0a0a] p-4 rounded border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">{kpi.label}</p>
            <p className="text-3xl font-medium">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-6 h-[500px] mb-6">
        {/* Active Incidents */}
        <div className="w-[300px] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded flex flex-col shadow-sm dark:shadow-none">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-black flex justify-between items-center">
            <span className="text-sm font-medium">Active Incidents</span>
            <span className="text-xs bg-gray-200 dark:bg-zinc-800 px-2 py-1 rounded">{activeIncidents.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeIncidents.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-500 text-center mt-4">No Active Incidents</div>
            ) : (
              activeIncidents.map((zone) => (
                <div key={zone.zone_code} className="p-3 border border-gray-200 dark:border-zinc-800 rounded hover:bg-gray-50 dark:bg-black cursor-pointer">
                  <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-500">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{zone.risk_level === "HIGH" ? "Landslide" : "Flash Flood"}</span>
                    <span>Recent</span>
                  </div>
                  <h4 className="text-sm font-medium mb-2">{zone.name}</h4>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-500">Risk: {(zone.risk_score * 100).toFixed(0)}%</span>
                    <span className={zone.risk_level === "HIGH" ? "text-red-600 font-medium" : "text-yellow-600 font-medium"}>{zone.risk_level}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded shadow-sm dark:shadow-none overflow-hidden flex flex-col relative">
           <div className="absolute top-4 left-4 z-[400] bg-white dark:bg-[#0a0a0a] px-3 py-1.5 border border-gray-200 dark:border-zinc-800 rounded shadow-sm dark:shadow-none text-sm font-medium">
             Disaster Map
           </div>
           <DisasterMap
              zones={zones}
              households={households}
              shelters={shelters}
              activeSosItems={queue}
              route={null}
              selectedDistrict={undefined}
            />
        </div>

        {/* Priority Queue */}
        <div className="w-[340px] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded flex flex-col shadow-sm dark:shadow-none">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-black">
            <h3 className="text-sm font-medium">Rescue Priority</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {queue.map((item, index) => {
              const isAssigned = assignedTeams.includes(item.sos_id);
              return (
                <div key={item.sos_id} className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded">Priority {index + 1}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">Score: {item.priority_score.toFixed(1)}</span>
                  </div>
                  <h4 className="text-sm font-medium mb-1">Sector {item.household_code}</h4>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                    {item.elderly_count + item.disabled_count + 1} People
                  </div>
                  <button
                    onClick={() => handleAssignTeam(item.sos_id)}
                    disabled={isAssigned}
                    className={`w-full py-2 rounded text-xs font-medium transition-colors ${
                      isAssigned ? "bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isAssigned ? "Team Assigned" : "Assign Team"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
