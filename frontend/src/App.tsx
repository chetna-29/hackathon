import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { CitizenLayout } from "./components/CitizenLayout";
import { CitizenDashboard } from "./pages/CitizenDashboard";
import { CitizenSafety } from "./pages/CitizenSafety";
import { CitizenProfile } from "./pages/CitizenProfile";
import { LiveMap } from "./pages/LiveMap";
import { Dashboard } from "./pages/Dashboard";
import { RescueCenter } from "./pages/RescueCenter";
import { Households } from "./pages/Households";
import { Shelters } from "./pages/Shelters";
import { MeshNetwork } from "./pages/MeshNetwork";
import { Login } from "./pages/Login";
import { wsService } from "./services/websocket";

import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  useEffect(() => {
    wsService.connect();
    return () => wsService.disconnect();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Responder Command Center Flow */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<LiveMap />} />
            <Route path="rescue" element={<RescueCenter />} />
            <Route path="households" element={<Households />} />
            <Route path="shelters" element={<Shelters />} />
            <Route path="mesh" element={<MeshNetwork />} />
          </Route>
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
