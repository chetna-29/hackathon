import React from 'react';
import type { PriorityItem } from '../types';

interface Props {
  queue: PriorityItem[];
  onSelect: (item: PriorityItem) => void;
}

export const PriorityQueue: React.FC<Props> = ({ queue, onSelect }) => {
  return (
    <div className="flex flex-col h-full bg-gray-900/80 rounded-xl border border-gray-800">
      <div className="p-4 border-b border-gray-800 flex justify-between items-end">
        <div>
          <h2 className="text-sm font-bold text-danger tracking-widest uppercase mb-1">Rescue Priority Queue</h2>
          <p className="text-xs text-blue-400">{queue.length} active requests</p>
        </div>
        <div className="flex items-center gap-1.5 bg-danger/10 px-2 py-0.5 rounded-full border border-danger/20">
          <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></div>
          <span className="text-[10px] font-bold text-danger uppercase tracking-wider">Live</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {queue.length === 0 ? (
          <div className="text-gray-500 italic p-4 text-center text-sm">No active requests.</div>
        ) : (
          queue.map((item) => {
            const isCritical = item.severity === 'CRITICAL';
            const isHigh = item.severity === 'HIGH';
            const isLow = item.severity === 'LOW';
            
            const colorClass = isCritical ? 'text-danger border-danger/30' : 
                               isHigh ? 'text-warning border-warning/30' : 
                               isLow ? 'text-safe border-safe/30' : 'text-yellow-400 border-yellow-400/30';
            const badgeClass = isCritical ? 'bg-danger/20 text-danger border-danger/30' : 
                               isHigh ? 'bg-warning/20 text-warning border-warning/30' : 
                               isLow ? 'bg-safe/20 text-safe border-safe/30' : 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';

            return (
              <div 
                key={item.sos_id} 
                className={`p-3 bg-gray-900 border-l-4 ${colorClass} rounded-r-lg border-y border-r border-y-gray-800 border-r-gray-800 flex items-center justify-between group hover:bg-gray-800 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-3xl font-bold ${isCritical ? 'text-danger' : isHigh ? 'text-warning' : isLow ? 'text-safe' : 'text-yellow-400'}`}>
                    {item.rank}.
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-200">{item.household_code}</h3>
                    <p className="text-xs text-gray-400 truncate max-w-[120px]">{item.elderly_count > 0 ? 'Critical elderly patient' : 'Medical emergency'}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{(Math.random() * 5 + 1).toFixed(1)} km away</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold tracking-wider ${badgeClass}`}>
                    {item.severity}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => onSelect(item)}
                      className="text-[10px] px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700 transition-colors"
                    >
                      View
                    </button>
                    <button 
                      className="text-[10px] px-2 py-1 bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 rounded border border-blue-900/50 transition-colors"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="p-3 border-t border-gray-800 text-center">
        <button className="text-xs text-blue-400 hover:text-blue-300">View All Requests →</button>
      </div>
    </div>
  );
};
