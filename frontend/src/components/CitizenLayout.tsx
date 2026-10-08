import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Home, Shield, User } from "lucide-react";

export const CitizenLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-gray-100">
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation - Visible on mobile, hidden on desktop (desktop will show full 3 columns in Home) */}
      <nav className="md:hidden shrink-0 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-zinc-800 flex items-center justify-around p-2 pb-safe">
        <NavLink
          to="/citizen"
          end
          className={({ isActive }) =>
            `flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? "text-blue-600" : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100"}`
          }
        >
          <Home
            className={`w-6 h-6 mb-1 ${window.location.pathname === "/citizen" ? "text-blue-600" : ""}`}
          />
          <span className="text-xs font-medium">
            Home
          </span>
        </NavLink>

        <NavLink
          to="/citizen/safety"
          className={({ isActive }) =>
            `flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? "text-blue-600" : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100"}`
          }
        >
          <Shield
            className={`w-6 h-6 mb-1 ${window.location.pathname === "/citizen/safety" ? "text-blue-600" : ""}`}
          />
          <span className="text-xs font-medium">
            Safety
          </span>
        </NavLink>

        <NavLink
          to="/citizen/profile"
          className={({ isActive }) =>
            `flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? "text-blue-600" : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100"}`
          }
        >
          <User
            className={`w-6 h-6 mb-1 ${window.location.pathname === "/citizen/profile" ? "text-blue-600" : ""}`}
          />
          <span className="text-xs font-medium">
            Profile
          </span>
        </NavLink>
      </nav>
    </div>
  );
};
