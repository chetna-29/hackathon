import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { CitizenLayout } from './components/CitizenLayout';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { CitizenSafety } from './pages/CitizenSafety';
import { CitizenProfile } from './pages/CitizenProfile';
import { LiveMap } from './pages/LiveMap';
import { Dashboard } from './pages/Dashboard';
import { RescueCenter } from './pages/RescueCenter';
import { Households } from './pages/Households';
import { Shelters } from './pages/Shelters';
import { MeshNetwork } from './pages/MeshNetwork';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Responder Command Center Flow */}
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<LiveMap />} />
          <Route path="rescue" element={<RescueCenter />} />
          <Route path="households" element={<Households />} />
          <Route path="shelters" element={<Shelters />} />
          <Route path="mesh" element={<MeshNetwork />} />
        </Route>

        {/* Citizen Emergency Flow */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<CitizenDashboard />} />
          <Route path="safety" element={<CitizenSafety />} />
          <Route path="profile" element={<CitizenProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
