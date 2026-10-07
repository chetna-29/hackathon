import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Shield, User } from 'lucide-react';

export const CitizenLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-black">
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation - Visible on mobile, hidden on desktop (desktop will show full 3 columns in Home) */}
      <nav className="md:hidden shrink-0 bg-[#1c1c1e] border-t border-[#2c2c2e] flex items-center justify-around p-2 pb-safe">
        <NavLink 
          to="/citizen" 
          end
          className={({isActive}) => `flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Home className={`w-6 h-6 mb-1 ${window.location.pathname === '/citizen' ? 'text-white' : ''}`} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
        </NavLink>
        
        <NavLink 
          to="/citizen/safety" 
          className={({isActive}) => `flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Shield className={`w-6 h-6 mb-1 ${window.location.pathname === '/citizen/safety' ? 'text-white' : ''}`} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Safety</span>
        </NavLink>

        <NavLink 
          to="/citizen/profile" 
          className={({isActive}) => `flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <User className={`w-6 h-6 mb-1 ${window.location.pathname === '/citizen/profile' ? 'text-white' : ''}`} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
