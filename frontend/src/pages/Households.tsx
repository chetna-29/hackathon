import React, { useState } from "react";
import { useDisasterData } from "../hooks/useDisasterData";
import type { Household } from "../types";
import { ShieldAlert, X, MapPin, Phone } from "lucide-react";

export const Households: React.FC = () => {
  const { households, queue, loading } = useDisasterData();
  const [selected, setSelected] = useState<Household | null>(null);
  const [filter, setFilter] = useState("ALL");

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-black text-gray-500 dark:text-gray-500">
        Loading Households...
      </div>
    );
  }

  const isSos = (code: string) => queue.some((q) => q.household_code === code);

  const filteredHouseholds = households.filter((h) => {
    if (filter === "HIGH RISK") return h.vulnerability_score > 0.7;
    if (filter === "ELDERLY") return h.elderly_count > 0;
    if (filter === "CHILDREN") return h.children_count > 0;
    if (filter === "MEDICAL") return h.medical_needs !== null;
    if (filter === "SOS ACTIVE") return isSos(h.household_code);
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black font-sans p-6 text-gray-900 dark:text-gray-100">
      {/* Top Filter Chips */}
      <div className="flex gap-2 shrink-0 overflow-x-auto pb-4 mb-4 border-b border-gray-200 dark:border-zinc-800">
        {["ALL", "HIGH RISK", "ELDERLY", "CHILDREN", "MEDICAL", "SOS ACTIVE"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filter === f
                ? f === "SOS ACTIVE"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
                : "bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-zinc-900"
            }`}
          >
            {f === "SOS ACTIVE" && filter !== f && <span className="text-red-500 mr-2">●</span>}
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        {/* Main Grid */}
        <div className={`flex-1 overflow-y-auto pr-2 ${selected ? "w-2/3" : "w-full"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredHouseholds.map((h) => {
              const active = isSos(h.household_code);
              const highRisk = h.vulnerability_score > 0.7;

              return (
                <div
                  key={h.household_code}
                  onClick={() => setSelected(h)}
                  className={`p-5 rounded-lg border bg-white dark:bg-[#0a0a0a] cursor-pointer transition-shadow shadow-sm dark:shadow-none ${
                    selected?.household_code === h.household_code
                      ? "border-blue-500 shadow-md dark:shadow-none ring-1 ring-blue-500"
                      : "border-gray-200 dark:border-zinc-800 hover:shadow-md dark:shadow-none"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {h.household_code}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Chamoli Zone</p>
                    </div>
                    {active ? (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-medium">
                        SOS ACTIVE
                      </span>
                    ) : highRisk ? (
                      <span className="text-yellow-700 bg-yellow-100 text-xs px-2 py-1 rounded font-medium">
                        High Risk
                      </span>
                    ) : (
                      <span className="text-green-700 bg-green-100 text-xs px-2 py-1 rounded font-medium">
                        Monitored
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap mb-4">
                    {h.elderly_count > 0 && (
                      <span className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded border border-gray-200 dark:border-zinc-800">
                        Elderly ({h.elderly_count})
                      </span>
                    )}
                    {h.children_count > 0 && (
                      <span className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded border border-gray-200 dark:border-zinc-800">
                        Children ({h.children_count})
                      </span>
                    )}
                    {h.medical_needs && (
                      <span className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded border border-red-200">
                        Med Support
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-zinc-900">
                    <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-600">
                      Members: <span className="font-medium text-gray-900 dark:text-gray-100">{h.members_count}</span>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      View Profile →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Drawer */}
        {selected && (
          <div className="w-[400px] shrink-0 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm dark:shadow-none flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-black relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 text-gray-700 dark:text-gray-300 rounded flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <span className={`px-2 py-1 text-xs font-medium rounded ${selected.vulnerability_score > 0.7 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                Vulnerability: {(selected.vulnerability_score * 100).toFixed(0)}%
              </span>
              <h2 className="text-2xl font-medium mt-3">
                {selected.household_code}
              </h2>
            </div>

            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Sector 4, Hilltop Ridge<br />
                    Chamoli, Uttarakhand 246401
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 p-4 rounded text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Members</p>
                  <p className="text-2xl font-medium">{selected.members_count}</p>
                </div>
                <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 p-4 rounded text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Zone</p>
                  <p className="text-base font-medium text-red-600 mt-2">{selected.zone_id.replace("ZONE-", "")}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 dark:border-zinc-800 pb-2">
                  Vulnerability Factors
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Elderly (&gt;65y)</span>
                    <span className={`font-medium ${selected.elderly_count > 0 ? "text-yellow-600" : "text-gray-500 dark:text-gray-500"}`}>{selected.elderly_count}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Children (&lt;12y)</span>
                    <span className={`font-medium ${selected.children_count > 0 ? "text-blue-600" : "text-gray-500 dark:text-gray-500"}`}>{selected.children_count}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Disabled</span>
                    <span className={`font-medium ${selected.disabled_count > 0 ? "text-red-600" : "text-gray-500 dark:text-gray-500"}`}>{selected.disabled_count}</span>
                  </div>
                  {selected.medical_needs && (
                    <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700 font-medium">
                      Critical Medical: {selected.medical_needs}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-200 dark:border-zinc-800">
                {isSos(selected.household_code) ? (
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded text-sm transition-colors flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Go to Rescue Operations
                  </button>
                ) : (
                  <button className="w-full bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 font-medium py-3 rounded text-sm transition-colors flex items-center justify-center gap-2">
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
