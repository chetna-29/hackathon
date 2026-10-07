import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Map as MapIcon, Ambulance, Users, Home, Network } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[var(--color-bg-base)] border-r border-gray-800 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800 flex items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-danger" fill="currentColor" />
        <div>
          <h1 className="text-xl font-bold tracking-normal text-white leading-none">FIRE-EYE</h1>
          <p className="text-[9px] text-gray-500 font-mono tracking-normal uppercase mt-1">Uttarakhand, India</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <NavLink 
          to="/app/dashboard" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-danger/20 text-danger border border-danger/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </NavLink>
        
        <NavLink 
          to="/app/map" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-danger/20 text-danger border border-danger/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          <MapIcon className="w-4 h-4" /> Live Map
        </NavLink>

        <NavLink 
          to="/app/rescue" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-danger/20 text-danger border border-danger/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          <Ambulance className="w-4 h-4" /> Rescue Center
        </NavLink>

        <NavLink 
          to="/app/households" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-danger/20 text-danger border border-danger/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          <Users className="w-4 h-4" /> Households
        </NavLink>

        <NavLink 
          to="/app/shelters" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-danger/20 text-danger border border-danger/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          <Home className="w-4 h-4" /> Shelters & Hospitals
        </NavLink>

        <NavLink 
          to="/app/mesh" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-danger/20 text-danger border border-danger/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          <Network className="w-4 h-4" /> Mesh Network
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={async () => {
            const { supabase } = await import('../lib/supabaseClient');
            await supabase.auth.signOut();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

