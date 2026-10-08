import React from "react";
import type { PriorityItem } from "../types";

interface Props {
  item: PriorityItem;
  onClose: () => void;
  onCalculateRoute: () => void;
  onAssignRescue: () => void;
}

export const SOSModal: React.FC<Props> = ({
  item,
  onClose,
  onCalculateRoute,
  onAssignRescue,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-lg w-full max-w-md shadow-xl dark:shadow-none overflow-hidden">
        <div
          className={`p-5 border-b ${item.severity === "CRITICAL" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className={`text-lg font-medium ${item.severity === "CRITICAL" ? "text-red-900" : "text-yellow-900"}`}>
                Emergency Request
              </h2>
              <p className={`text-sm mt-1 ${item.severity === "CRITICAL" ? "text-red-700" : "text-yellow-700"}`}>
                {item.sos_code}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:text-gray-300 text-2xl leading-none"
            >
              &times;
            </button> 
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">
                Household
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {item.household_code || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">
                Severity
              </p>
              <p
                className={`text-lg font-medium ${item.severity === "CRITICAL" ? "text-red-600" : "text-yellow-600"}`}
              >
                {item.severity}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-black p-4 rounded border border-gray-200 dark:border-zinc-800">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">
                Elderly
              </p>
              <p className="text-base text-gray-900 dark:text-gray-100">{item.elderly_count}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">
                Disabled
              </p>
              <p className="text-base text-gray-900 dark:text-gray-100">{item.disabled_count}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">
              Location
            </p>
            <p className="text-base text-gray-900 dark:text-gray-100 font-mono">
              {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-2">
              Priority Score
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full"
                  style={{ width: `${item.priority_score}%` }}
                ></div>
              </div>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {item.priority_score.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-3">
          <button
            onClick={onCalculateRoute}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            Calculate Safe Route
          </button>
          <div className="flex gap-3">
            <button
              onClick={onAssignRescue}
              className="flex-1 py-2.5 border border-green-600 text-green-700 hover:bg-green-50 rounded font-medium transition-colors"
            >
              Assign Rescue
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-zinc-900 rounded font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
