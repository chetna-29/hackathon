import React from "react";
import { NavLink } from "react-router-dom";
import {
  ShieldAlert,
  LayoutDashboard,
  Map as MapIcon,
  Ambulance,
  Users,
  Home,
  Network,
  Cpu,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-50 dark:bg-black border-r border-gray-200 dark:border-zinc-800 flex flex-col h-full shrink-0 font-sans text-gray-900 dark:text-gray-100">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-3 bg-white dark:bg-[#0a0a0a]">
        <ShieldAlert
          className="w-8 h-8 text-red-600"
        />
        <div>
          <h1 className="text-xl font-medium tracking-tight leading-none text-gray-900 dark:text-gray-100">
            Fire-Eye
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium mt-1">
            Command Center
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto bg-gray-50 dark:bg-black">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 dark:text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-zinc-900"}`
          }
        >
          <LayoutDashboard className="w-5 h-5" /> Command Center
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 dark:text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-zinc-900"}`
          }
        >
          <MapIcon className="w-5 h-5" /> Live Map
        </NavLink>

        <NavLink
          to="/rescue"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 dark:text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-zinc-900"}`
          }
        >
          <Ambulance className="w-5 h-5" /> Rescue Operations
        </NavLink>

        <NavLink
          to="/households"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 dark:text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-zinc-900"}`
          }
        >
          <Users className="w-5 h-5" /> Households
        </NavLink>

        <NavLink
          to="/shelters"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 dark:text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-zinc-900"}`
          }
        >
          <Home className="w-5 h-5" /> Shelters
        </NavLink>

        <NavLink
          to="/mesh"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 dark:text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:bg-zinc-900"}`
          }
        >
          <Network className="w-5 h-5" /> Mesh Network
        </NavLink>
      </nav>

      {/* System Status Block */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-gray-400 dark:text-gray-600" /> System Status
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 dark:text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            API ONLINE
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 dark:text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            ML ENGINE ONLINE
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 dark:text-gray-600">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            MESH STANDBY
          </div>
        </div>
      </div>
    </aside>
  );
};
