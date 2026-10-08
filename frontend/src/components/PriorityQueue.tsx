import React from "react";
import type { PriorityItem } from "../types";

interface Props {
  queue: PriorityItem[];
  onSelect: (item: PriorityItem) => void;
}

export const PriorityQueue: React.FC<Props> = ({ queue, onSelect }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-end bg-gray-50 dark:bg-black">
        <div>
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 tracking-wider uppercase mb-1">
            Rescue Priority Queue
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
            {queue.length} active requests
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-medium text-red-700 uppercase tracking-wider">
            Live
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {queue.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-500 italic p-6 text-center text-sm">
            No active requests.
          </div>
        ) : (
          queue.map((item) => {
            const isCritical = item.severity === "CRITICAL";
            const isHigh = item.severity === "HIGH";
            const isLow = item.severity === "LOW";

            const colorClass = isCritical
              ? "border-red-500"
              : isHigh
                ? "border-yellow-500"
                : isLow
                  ? "border-green-500"
                  : "border-gray-500";
            
            const badgeClass = isCritical
              ? "bg-red-50 text-red-700 border-red-200"
              : isHigh
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : isLow
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-gray-50 dark:bg-black text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-800";

            return (
              <div
                key={item.sos_id}
                onClick={() => onSelect(item)}
                className={`p-4 bg-white dark:bg-[#0a0a0a] border-l-4 ${colorClass} border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between group hover:bg-gray-50 dark:bg-black transition-colors cursor-pointer`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-2xl font-medium ${isCritical ? "text-red-600" : isHigh ? "text-yellow-600" : isLow ? "text-green-600" : "text-gray-500 dark:text-gray-500"}`}
                  >
                    {item.rank}.
                  </span>
                  <div>
                    <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {item.household_code}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate max-w-[120px] mt-0.5">
                      {item.elderly_count > 0
                        ? "Critical elderly patient"
                        : "Medical emergency"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 font-medium">
                      {(Math.random() * 5 + 1).toFixed(1)} km away
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase ${badgeClass}`}
                  >
                    {item.severity}
                  </span>
                  {item.via_mesh === "TRUE" && (
                    <span className="text-[10px] px-2 py-0.5 rounded border font-medium bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 dark:text-gray-600 border-gray-200 dark:border-zinc-800">
                      MESH
                    </span>
                  )}
                  <div className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-600 font-mono font-medium mt-1">
                    SCORE: {item.priority_score.toFixed(1)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-zinc-800 text-center bg-gray-50 dark:bg-black">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View All Requests →
        </button>
      </div>
    </div>
  );
};
