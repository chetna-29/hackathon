import React, { useState } from "react";
import { useDisasterData } from "../hooks/useDisasterData";
import type { Shelter } from "../types";
import { Home, Navigation, ShieldAlert, CheckCircle2 } from "lucide-react";

export const Shelters: React.FC = () => {
  const { shelters, loading } = useDisasterData();
  const [selected, setSelected] = useState<Shelter | null>(null);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-black text-gray-500 dark:text-gray-500">
        Loading Shelters...
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 p-6 bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100">
      {/* Left: Infrastructure List */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Tabs */}
        <div className="flex gap-6 shrink-0 border-b border-gray-200 dark:border-zinc-800 mb-6">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-3 px-2 font-medium text-sm">
            Shelters
          </button>
          <button className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100 pb-3 px-2 font-medium text-sm transition-colors">
            Hospitals
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 xl:grid-cols-2 gap-4">
          {shelters.map((s) => {
            const isAvailable = s.available_beds > 0;
            const isNearFull = s.available_beds > 0 && s.available_beds < 50;
            const percentage = (s.current_occupancy / s.capacity) * 100;

            return (
              <div
                key={s.shelter_code}
                onClick={() => setSelected(s)}
                className={`bg-white dark:bg-[#0a0a0a] p-5 rounded-lg border cursor-pointer transition-shadow shadow-sm dark:shadow-none ${
                  selected?.shelter_code === s.shelter_code
                    ? "border-blue-500 ring-1 ring-blue-500 shadow-md dark:shadow-none"
                    : "border-gray-200 dark:border-zinc-800 hover:shadow-md dark:shadow-none"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {s.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      ID: {s.shelter_code}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium border ${
                      !isAvailable
                        ? "bg-red-50 text-red-700 border-red-200"
                        : isNearFull
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {!isAvailable
                      ? "FULL CAPACITY"
                      : isNearFull
                        ? "NEAR FULL"
                        : "AVAILABLE"}
                  </span>
                </div>

                {/* Capacity Visualizer */}
                <div className="mb-5">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 dark:text-gray-600 mb-2">
                    <span>Occupancy</span>
                    <span className="font-medium">
                      {s.current_occupancy} / {s.capacity}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${!isAvailable ? "bg-red-500" : isNearFull ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-right">
                    <span
                      className={`text-sm font-medium ${!isAvailable ? "text-red-600" : "text-green-600"}`}
                    >
                      {s.available_beds} beds free
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-gray-100 dark:border-zinc-900 pt-4">
                  {s.has_medical_staff && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-600 flex items-center gap-1 bg-gray-50 dark:bg-black px-2 py-1 rounded border border-gray-200 dark:border-zinc-800">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" /> Med Staff
                    </span>
                  )}
                  {s.has_oxygen && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-600 flex items-center gap-1 bg-gray-50 dark:bg-black px-2 py-1 rounded border border-gray-200 dark:border-zinc-800">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" /> Oxygen
                    </span>
                  )}
                  {s.has_power_backup && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-600 flex items-center gap-1 bg-gray-50 dark:bg-black px-2 py-1 rounded border border-gray-200 dark:border-zinc-800">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" /> Power
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Selected Shelter Detail */}
      {selected ? (
        <div className="w-[350px] shrink-0 bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden shadow-sm dark:shadow-none">
          <div className="p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-black">
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 leading-tight">
              {selected.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-500" /> 12.4 km from incident
            </p>
          </div>

          <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-500 uppercase font-medium tracking-wider mb-4 border-b border-gray-200 dark:border-zinc-800 pb-2">
                Facility Status
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Capacity</span>
                  <span className="font-medium">{selected.capacity}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Occupied</span>
                  <span className="font-medium">{selected.current_occupancy}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 dark:bg-black -mx-4 px-4 py-3 border-y border-gray-100 dark:border-zinc-900">
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">Available</span>
                  <span
                    className={`font-medium text-lg ${selected.available_beds > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {selected.available_beds}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-600">Integrity</span>
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4" /> Safe
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-zinc-800 space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded text-sm transition-colors">
                Assign to Rescue Route
              </button>
              <button className="w-full bg-white dark:bg-[#0a0a0a] hover:bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-medium py-3 rounded text-sm transition-colors border border-gray-300 dark:border-zinc-700">
                Contact Facility
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[350px] shrink-0 border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-black">
          <Home className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
            Select a facility for details
          </p>
        </div>
      )}
    </div>
  );
};
