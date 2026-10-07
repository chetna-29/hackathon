import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { wsService } from '../services/websocket';
import { MapPin, ShieldAlert } from 'lucide-react';

export const Layout: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(false);
  const location = useLocation();

  useEffect(() => {
    wsService.setConnectionHandler(setIsOnline);
    wsService.connect();

    const handleNewSOS = () => {
      setHasNewAlert(true);
      setTimeout(() => setHasNewAlert(false), 6000); // blink for 6 seconds
    };
    wsService.on("NEW_SOS", handleNewSOS);

    return () => {
      wsService.disconnect();
      wsService.off("NEW_SOS", handleNewSOS);
    };
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'AI MULTI-DISASTER RESPONSE COMMAND CENTER';
      case '/map': return 'LIVE DISASTER MAP';
      case '/rescue': return 'RESCUE COMMAND CENTER';
      case '/households': return 'VULNERABLE HOUSEHOLDS';
      case '/shelters': return 'SHELTERS & HOSPITALS';
      case '/mesh': return 'OFFLINE MESH NETWORK';
      default: return 'COMMAND CENTER';
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-[var(--color-bg-base)] text-gray-200 transition-all duration-300 ${hasNewAlert ? 'border-4 border-danger shadow-[inset_0_0_50px_rgba(220,38,38,0.5)]' : ''}`}>
      {hasNewAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-danger text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3 animate-bounce">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          NEW EMERGENCY SOS RECEIVED!
        </div>
      )}
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 bg-gray-900/40">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold tracking-normal text-white uppercase">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-normal">Disaster Type</label>
              <select className="bg-gray-800 text-xs text-white px-3 py-1 rounded border border-gray-700 outline-none hover:border-gray-500 focus:border-blue-500 transition-colors cursor-pointer">
                <option>Landslide</option>
                <option>Flash Flood</option>
                <option>Flood</option>
                <option>Cloudburst</option>
                <option>Forest Fire</option>
                <option>Earthquake</option>
              </select>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-safe shadow-[0_0_8px_#10b981]' : 'bg-danger'}`}></div>
                <span className="text-[10px] font-bold tracking-normal text-white uppercase">
                  {isOnline ? 'SYSTEM ONLINE' : 'CONNECTION LOST'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-[9px] font-bold tracking-normal uppercase">
                <MapPin className="w-3 h-3 text-danger" /> Uttarakhand, India
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
