import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

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
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<LiveMap />} />
          <Route path="rescue" element={<RescueCenter />} />
          <Route path="households" element={<Households />} />
          <Route path="shelters" element={<Shelters />} />
          <Route path="mesh" element={<MeshNetwork />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
