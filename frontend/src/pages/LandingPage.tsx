import React from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-100">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex justify-between items-baseline mb-32">
          <div className="text-xl font-medium tracking-tight">Fire-Eye</div>
          <div className="text-sm text-gray-500 dark:text-gray-500">System Status: Online</div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <h1 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight max-w-3xl mb-6">
            Coordinate emergency response and connect directly with people who need help.
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 dark:text-gray-600 mb-16 max-w-2xl leading-relaxed">
            A system designed for disaster scenarios. It works offline, prioritizes vulnerable individuals, and routes rescue teams efficiently.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-32">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-sm font-medium transition-colors text-left sm:text-center w-full sm:w-auto"
            >
              Open responder dashboard
            </button>
            <button
              onClick={() => navigate("/citizen")}
              className="bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 px-6 py-4 text-sm font-medium transition-colors text-left sm:text-center w-full sm:w-auto"
            >
              Request emergency help
            </button>
          </div>

          {/* Stats / Real Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-gray-200 dark:border-zinc-800 pt-12">
            <div>
              <div className="text-4xl font-medium mb-2 tracking-tight">8.2m</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 leading-snug">Average response time during high-load scenarios.</div>
            </div>
            <div>
              <div className="text-4xl font-medium mb-2 tracking-tight">100%</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 leading-snug">Uptime maintained through offline mesh networking.</div>
            </div>
            <div>
              <div className="text-4xl font-medium mb-2 tracking-tight">24/7</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 leading-snug">Automated prioritization of vulnerable populations.</div>
            </div>
            <div>
              <div className="text-4xl font-medium mb-2 tracking-tight">0</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 leading-snug">Data loss incidents during critical operations.</div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-24 pb-8 text-sm text-gray-400 dark:text-gray-600">
          Fire-Eye Disaster Management System
        </footer>
      </div>
    </div>
  );
};
