import React from "react";
import type { Shelter } from "../types";
import { Home } from "lucide-react";

interface Props {
  shelter: Shelter;
  distanceKm: string;
}

export const ShelterCard: React.FC<Props> = ({ shelter, distanceKm }) => {
  const isAvailable = shelter.available_beds > 0;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-900 last:border-0 hover:bg-gray-50 dark:bg-black transition-colors bg-white dark:bg-[#0a0a0a]">
      <div className="flex items-center gap-3">
        <div className="bg-gray-50 dark:bg-black p-2 rounded-full border border-gray-200 dark:border-zinc-800">
          <Home className="w-4 h-4 text-gray-600 dark:text-gray-400 dark:text-gray-600" />
        </div>
        <div>
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{shelter.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-medium">
            Capacity: {shelter.capacity} <span className="mx-1 text-gray-300">|</span>{" "}
            Occupied: {shelter.current_occupancy}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <span
          className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase ${
            isAvailable
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {shelter.available_beds} available
        </span>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-500 font-medium">
          {distanceKm} km
        </span>
      </div>
    </div>
  );
};
