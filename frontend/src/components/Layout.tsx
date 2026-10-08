import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Sidebar } from "./Sidebar";
import { wsService } from "../services/websocket";
import { MapPin, ShieldAlert, Moon, Sun } from "lucide-react";

export const Layout: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (!session) {
        navigate("/login");
      }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

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
      case "/dashboard":
        return "Command Center";
      case "/map":
        return "Live Map";
      case "/rescue":
        return "Rescue Operations";
      case "/households":
        return "Households";
      case "/shelters":
        return "Shelters & Hospitals";
      case "/mesh":
        return "Mesh Network";
      default:
        return "Command Center";
    }
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-all duration-300 ${hasNewAlert ? "border-4 border-red-600 shadow-inner" : ""}`}
    >
      {hasNewAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full font-medium shadow-md dark:shadow-none flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          New Emergency SOS Received
        </div>
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 shrink-0 bg-white dark:bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium tracking-tight text-gray-900 dark:text-gray-100">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-500 dark:text-gray-500 font-medium">
                Disaster Type
              </label>
              <select className="bg-white dark:bg-[#0a0a0a] text-sm text-gray-900 dark:text-gray-100 px-3 py-1.5 rounded border border-gray-300 dark:border-zinc-700 outline-none hover:border-gray-400 focus:border-blue-500 transition-colors cursor-pointer">
                <option>Landslide</option>
                <option>Flash Flood</option>
                <option>Flood</option>
                <option>Cloudburst</option>
                <option>Forest Fire</option>
                <option>Earthquake</option>
              </select>
            </div>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 dark:text-gray-600 uppercase">
                  {isOnline ? "System Online" : "Connection Lost"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500 text-xs font-medium">
                <MapPin className="w-3 h-3 text-red-500" /> Uttarakhand, India
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
