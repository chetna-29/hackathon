
import { ShieldAlert, Activity, WifiOff } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-danger" />
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white">FIRE-EYE</h1>
            <p className="text-xs text-gray-400">Disaster Command Center</p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
            <Activity className="w-4 h-4 text-warning" />
            <span className="text-sm">Risk Engine: <span className="text-warning font-semibold">Active</span></span>
          </div>
          <div className="flex items-center gap-2 bg-danger/10 px-4 py-2 rounded-lg border border-danger/20 text-danger">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-semibold">Mesh Gateway Linked</span>
          </div>
        </div>
      </div>
    </header>
  );
};
