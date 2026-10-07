import React from 'react';
import type { PriorityItem } from '../types';

interface Props {
  item: PriorityItem;
  onClose: () => void;
  onCalculateRoute: () => void;
  onAssignRescue: () => void;
}

export const SOSModal: React.FC<Props> = ({ item, onClose, onCalculateRoute, onAssignRescue }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
        <div className={`p-4 border-b ${item.severity === 'CRITICAL' ? 'bg-danger/20 border-danger/50' : 'bg-warning/20 border-warning/50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white tracking-normal">EMERGENCY REQUEST</h2>
              <p className="text-gray-300 font-mono text-sm mt-1">{item.sos_code}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Household</p>
              <p className="text-lg font-semibold text-white">{item.household_code || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Severity</p>
              <p className={`text-lg font-bold ${item.severity === 'CRITICAL' ? 'text-danger' : 'text-warning'}`}>{item.severity}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-800 p-3 rounded border border-gray-700">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Elderly</p>
              <p className="text-base text-gray-200">{item.elderly_count}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Disabled</p>
              <p className="text-base text-gray-200">{item.disabled_count}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Location (Lat / Lng)</p>
            <p className="text-base text-gray-300 font-mono">{item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Priority Score</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="bg-danger h-full" style={{ width: `${item.priority_score}%` }}></div>
              </div>
              <span className="text-white font-bold">{item.priority_score.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-800 border-t border-gray-700 flex flex-col gap-3">
          <button 
            onClick={onCalculateRoute}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold tracking-wide transition-colors"
          >
            CALCULATE SAFE ROUTE
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onAssignRescue}
              className="flex-1 py-2 border border-safe text-safe hover:bg-safe/10 rounded font-bold transition-colors"
            >
              ASSIGN RESCUE
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-2 border border-gray-500 text-gray-300 hover:bg-gray-700 rounded font-bold transition-colors"
            >
              DISMISS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
