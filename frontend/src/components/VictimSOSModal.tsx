import React, { useState } from "react";
import { ShieldAlert, X } from "lucide-react";

interface Props {
  onClose: () => void;
  onSubmit: (data: {
    emergency_type: string;
    severity: string;
    notes: string;
    household_code?: string;
  }) => void;
}

export const VictimSOSModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [emergencyType, setEmergencyType] = useState("GENERAL_EMERGENCY");
  const [severity, setSeverity] = useState("HIGH");
  const [notes, setNotes] = useState("");
  const [householdCode, setHouseholdCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      emergency_type: emergencyType,
      severity,
      notes,
      household_code: householdCode,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-lg w-full max-w-md shadow-xl dark:shadow-none overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-zinc-800 bg-red-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-700 font-medium text-lg">
            <ShieldAlert className="w-5 h-5" />
            <span>Emergency Request</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Household Code (Optional)
            </label>
            <input
              type="text"
              className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="e.g. H101"
              value={householdCode}
              onChange={(e) => setHouseholdCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Emergency Type
            </label>
            <select
              className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
            >
              <option value="GENERAL_EMERGENCY">General Emergency</option>
              <option value="MEDICAL">Medical Emergency</option>
              <option value="TRAPPED">Trapped in Debris</option>
              <option value="FLOODING">Flooding / High Water</option>
              <option value="FIRE">Fire / Smoke</option>
              <option value="EVACUATION">Need Evacuation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Severity Level
            </label>
            <select
              className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="CRITICAL">Critical - Life Threatening</option>
              <option value="HIGH">High - Severe Risk</option>
              <option value="MEDIUM">Medium - Moderate Risk</option>
              <option value="LOW">Low - Non-life Threatening</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <textarea
              className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-24 resize-none transition-colors"
              placeholder="Number of people, injuries, specific location details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
          >
            Send SOS
          </button>
        </form>
      </div>
    </div>
  );
};
