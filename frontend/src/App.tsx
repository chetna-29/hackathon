
import { Header } from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 grid grid-cols-12 gap-4">
        {/* Map Section */}
        <div className="col-span-12 lg:col-span-8 bg-gray-800 rounded-xl border border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Live Disaster Map</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 text-xs rounded bg-danger/20 text-danger border border-danger/50">High Risk Zone</span>
              <span className="px-2 py-1 text-xs rounded bg-safe/20 text-safe border border-safe/50">Safe Shelter</span>
            </div>
          </div>
          <div className="flex-1 bg-gray-900 min-h-[500px] flex items-center justify-center">
            {/* Map Placeholder for MVP setup */}
            <p className="text-gray-500 italic">Leaflet Map Initialization...</p>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <h2 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-3">Priority Rescue Queue</h2>
            <div className="space-y-3">
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-danger text-lg">#1 H101</h3>
                    <p className="text-xs text-gray-400">Score: 94.6 | Critical Severity</p>
                  </div>
                  <button className="bg-danger hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                    Dispatch
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
            <h2 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-3">Hackathon Demo Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Simulate Rainfall (mm)</label>
                <input type="range" min="0" max="250" defaultValue="25" className="w-full accent-warning" />
              </div>
              <button className="w-full bg-warning text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-400 transition-colors">
                Trigger ML Assessment
              </button>
              <button className="w-full border border-danger text-danger font-bold py-2 rounded-lg hover:bg-danger/10 transition-colors">
                Trigger Offline Mesh SOS
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
