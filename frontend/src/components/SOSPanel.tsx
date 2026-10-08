import React from "react";
import type { PriorityItem } from "../types";
import { X, User } from "lucide-react";

interface Props {
  item: PriorityItem;
  onClose: () => void;
  onCalculateRoute: () => void;
  onResolve: () => void;
  onDispatch: () => void;
}

// Reverse Geocoding Component for SOS Panel
const AddressDisplay = ({ lat, lng }: { lat: number; lng: number }) => {
  const [address, setAddress] = React.useState("Fetching address...");
  React.useEffect(() => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    )
      .then((r) => r.json())
      .then((d) => {
        const parts = [];
        if (d.address.village || d.address.town || d.address.city)
          parts.push(d.address.village || d.address.town || d.address.city);
        if (d.address.county || d.address.state_district)
          parts.push(d.address.county || d.address.state_district);
        setAddress(
          parts.length > 0
            ? parts.join(", ")
            : d.display_name || "Unknown Location",
        );
      })
      .catch(() => setAddress("Location lookup failed"));
  }, [lat, lng]);
  return <span className="text-sm text-gray-500 dark:text-gray-500 mt-1 block">{address}</span>;
};

export const SOSPanel: React.FC<Props> = ({
  item,
  onClose,
  onCalculateRoute,
  onResolve,
  onDispatch,
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-black">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          Selected Request
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-red-50 p-3 rounded-full">
            <User className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              {item.household_code}
            </h3>
          </div>
          <div className="ml-auto">
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                item.severity === "CRITICAL"
                  ? "bg-red-100 text-red-700"
                  : item.severity === "HIGH"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {item.severity}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Household ID</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.household_code}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Priority Score</span>
            <span className="text-blue-600 font-medium text-lg">
              {item.priority_score.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Severity</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.elderly_count > 0
                ? "Critical elderly patient"
                : "Medical emergency"}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Residents</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {Math.max(item.elderly_count + item.disabled_count, 4)}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Elderly</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.elderly_count}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Children</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">0</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Disabled</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.disabled_count}
            </span>
          </div>
          <div className="flex justify-between items-start border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600 mt-1">Location</span>
            <div className="text-right flex flex-col items-end">
              <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </span>
              <AddressDisplay lat={item.latitude} lng={item.longitude} />
            </div>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Risk Zone</span>
            <span className="text-red-600 font-medium">HIGH</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Source Type</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.source_type || "MOBILE"}
            </span>
          </div>
          {item.via_mesh === "TRUE" && (
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
              <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Mesh Hops</span>
              <span className="text-red-600 font-medium">
                {item.hops_count || 0}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-900 pb-3">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Communication</span>
            <span
              className={`font-medium ${item.via_mesh === "TRUE" ? "text-red-600" : "text-green-600"}`}
            >
              {item.via_mesh === "TRUE" ? "OFFLINE MESH" : "ONLINE"}
            </span>
          </div>
          {item.notes && (
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-zinc-900 pb-3">
              <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Notes</span>
              <span className="text-gray-900 dark:text-gray-100 max-w-[60%] text-right">
                {item.notes}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 dark:text-gray-600">Status</span>
            <span className="text-yellow-600 font-medium">
              WAITING FOR RESCUE
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-black">
        <button
          onClick={onCalculateRoute}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
        >
          Calculate Safe Route
        </button>
        <button
          onClick={onDispatch}
          className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
        >
          Assign Rescue Team
        </button>
        <button
          onClick={onResolve}
          className="w-full py-2.5 bg-white dark:bg-[#0a0a0a] hover:bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded font-medium border border-gray-300 dark:border-zinc-700 transition-colors"
        >
          Mark Resolved
        </button>
      </div>
    </div>
  );
};
