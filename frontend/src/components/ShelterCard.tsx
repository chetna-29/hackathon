import React from 'react';
import type { Shelter } from '../types';
import { Home } from 'lucide-react';

interface Props {
  shelter: Shelter;
  distanceKm: string;
}

export const ShelterCard: React.FC<Props> = ({ shelter, distanceKm }) => {
  const isAvailable = shelter.available_beds > 0;
  
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="bg-safe/20 p-2 rounded-full border border-safe/30">
          <Home className="w-4 h-4 text-safe" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-200">{shelter.name}</h4>
          <p className="text-xs text-gray-500">
            Capacity: {shelter.capacity} <span className="mx-1">|</span> Occupied: {shelter.current_occupancy}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`text-[10px] px-2 py-1 rounded-full border font-bold tracking-normal ${
          isAvailable ? 'bg-safe/20 text-safe border-safe/30' : 'bg-warning/20 text-warning border-warning/30'
        }`}>
          {shelter.available_beds} available
        </span>
        <span className="text-xs font-mono text-gray-400 w-12 text-right">{distanceKm} km</span>
      </div>
    </div>
  );
};
