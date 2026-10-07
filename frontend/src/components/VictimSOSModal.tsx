import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSubmit: (data: { emergency_type: string; severity: string; notes: string; household_code?: string }) => void;
}

export const VictimSOSModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [emergencyType, setEmergencyType] = useState('GENERAL_EMERGENCY');
  const [severity, setSeverity] = useState('HIGH');
  const [notes, setNotes] = useState('');
  const [householdCode, setHouseholdCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ emergency_type: emergencyType, severity, notes, household_code: householdCode });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-red-900/50 bg-red-900/20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-danger font-bold">
            <ShieldAlert className="w-5 h-5" />
            <span>EMERGENCY SOS REQUEST</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Household Code (Optional)</label>
            <input 
              type="text" 
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 outline-none"
              placeholder="e.g. H101"
              value={householdCode}
              onChange={(e) => setHouseholdCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Emergency Type</label>
            <select 
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-blue-500 outline-none"
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
            <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Severity Level</label>
            <select 
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-blue-500 outline-none"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="CRITICAL">CRITICAL - Life Threatening</option>
              <option value="HIGH">HIGH - Severe Risk</option>
              <option value="MEDIUM">MEDIUM - Moderate Risk</option>
              <option value="LOW">LOW - Non-life Threatening</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Additional Notes</label>
            <textarea 
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 outline-none h-24 resize-none"
              placeholder="Number of people, injuries, specific location details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-4 py-3 bg-danger hover:bg-red-600 text-white rounded-lg font-bold tracking-wider transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)]"
          >
            SEND SOS NOW
          </button>
        </form>
      </div>
    </div>
  );
};
