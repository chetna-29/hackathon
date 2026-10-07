import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Map as MapIcon, Ambulance, Users, Home, Network, Cpu } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#05080D] border-r border-gray-800 flex flex-col h-full shrink-0 font-sans">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800 flex items-center gap-3 bg-[#0B1118]">
        <ShieldAlert className="w-8 h-8 text-danger glow-danger animate-pulse" fill="currentColor" />
        <div>
          <h1 className="text-xl font-black tracking-widest text-white leading-none uppercase">FIRE-EYE</h1>
          <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-1">Command Center</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar bg-[#05080D]">
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-info/10 text-info border border-info/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Command Center
        </NavLink>
        
        <NavLink 
          to="/map" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-info/10 text-info border border-info/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}
        >
          <MapIcon className="w-4 h-4" /> Live Disaster Map
        </NavLink>

        <NavLink 
          to="/rescue" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-info/10 text-info border border-info/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}
        >
          <Ambulance className="w-4 h-4" /> Rescue Operations
        </NavLink>

        <NavLink 
          to="/households" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-info/10 text-info border border-info/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}
        >
          <Users className="w-4 h-4" /> Vuln. Households
        </NavLink>

        <NavLink 
          to="/shelters" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-info/10 text-info border border-info/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}
        >
          <Home className="w-4 h-4" /> Shelters & Hospitals
        </NavLink>

        <NavLink 
          to="/mesh" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-info/10 text-info border border-info/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}
        >
          <Network className="w-4 h-4" /> Mesh Network
        </NavLink>
      </nav>

      {/* System Status Block */}
      <div className="p-4 border-t border-gray-800 bg-[#0B1118]">
        <h3 className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-3 flex items-center gap-2">
          <Cpu className="w-3 h-3 text-gray-400" /> System Status
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse"></span> API ONLINE
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse"></span> ML ENGINE ONLINE
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span> MESH STANDBY
          </div>
        </div>
      </div>
    </aside>
  );
};
