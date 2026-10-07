import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { supabase } from './lib/supabaseClient';
import { Login } from './pages/Login';
import { VictimView } from './pages/VictimView';

import { LiveMap } from './pages/LiveMap';
import { Dashboard } from './pages/Dashboard';
import { RescueCenter } from './pages/RescueCenter';
import { Households } from './pages/Households';
import { Shelters } from './pages/Shelters';
import { MeshNetwork } from './pages/MeshNetwork';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<VictimView />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" replace />} />
        
        {/* Protected Officer/Rescuer Routes */}
        <Route path="/app" element={session ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/map" element={<LiveMap />} />
          <Route path="/app/rescue" element={<RescueCenter />} />
          <Route path="/app/households" element={<Households />} />
          <Route path="/app/shelters" element={<Shelters />} />
          <Route path="/app/mesh" element={<MeshNetwork />} />
        </Route>
        
        {/* Legacy redirect for old URLs */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/map" element={<Navigate to="/app/map" replace />} />
        <Route path="/rescue" element={<Navigate to="/app/rescue" replace />} />
        <Route path="/households" element={<Navigate to="/app/households" replace />} />
        <Route path="/shelters" element={<Navigate to="/app/shelters" replace />} />
        <Route path="/mesh" element={<Navigate to="/app/mesh" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
