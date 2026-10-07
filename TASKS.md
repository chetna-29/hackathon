# 📋 FIRE-EYE Task & Progress Tracker

This document tracks everything that has been implemented, what is planned for the future, and the rationale behind the architectural decisions made for the FIRE-EYE disaster response system.

---

## ✅ Completed Tasks (What has been done so far)

### 1. Project Scaffolding & Root Configuration
- [x] Initialized Git repository and created standard `.gitignore`.
- [x] Created `README.md` with full project directory layout, startup instructions, and the 12-step hackathon demo flow.
- [x] Created technical documentation (`docs/API_SPEC.md`, `docs/OFFLINE_PROTOCOL.md`, `docs/DEMO_SCRIPT.md`).

### 2. Backend Engine (FastAPI)
- [x] **Database & Models:** Setup SQLAlchemy for SQLite/PostgreSQL with `User`, `Household`, `RiskZone`, `SOSRequest`, `Shelter`, and `MeshMessage` models.
- [x] **Pydantic Schemas:** Created validation schemas for all models to ensure strong typing.
- [x] **Core Services:**
  - `ml_service.py`: Integrates landslide risk ML model.
  - `priority_engine.py`: Calculates rescue priority using exact multi-factor formula: `Severity(40) + Vulnerability(30) + Risk(20) + Isolation(10)`.
  - `routing_engine.py`: Evaluates safe evacuation paths, avoids high-risk hazard zones, and assigns safe shelters.
  - `mesh_gateway.py`: Handles store-and-forward mesh packet ingestion, duplicate rejection, and SOS conversion.
  - `websocket_manager.py`: Live socket connection manager for dashboard updates.
- [x] **API Endpoints:** Implemented REST routers for Auth, Disaster Risk, Households, SOS, Priority Queue, Routing, Shelters, and Mesh Gateway.
- [x] **Seeding:** Created `seeds/seed_data.py` to instantly inject the "Wayanad Sector 4" demo scenario data for the hackathon pitch.

### 3. Machine Learning Pipeline
- [x] Created a synthetic but realistic `landslide_data.csv` dataset.
- [x] Built `train.py` to train a Random Forest model and save it to `.joblib`.
- [x] Built `predict.py` to run predictions and fall back to a hydrological heuristic if needed.

### 4. Offline Mesh Simulation
- [x] **`mesh_simulator.py`:** Simulated the core offline functionality (Device A -> Device B -> Device C -> Gateway) proving TTL decrement, duplicate packet dropping, and multi-hop forwarding logic.
- [x] **`scenario_runner.py`:** Automated the 12-step jury pitch presentation into a single terminal script outputting the end-to-end event sequence.

### 5. Frontend Dashboard (React + TypeScript)
- [x] Scaffolded the web app using Vite (`react-ts` template).
- [x] Initialized Tailwind CSS v4 and PostCSS for rapid aesthetic styling.
- [x] Configured global `index.css`.
- [x] Created core TS interfaces in `types/index.ts` to strictly match the backend schemas.
- [x] Built the `App.tsx` layout and `Header.tsx` Command Center MVP interface.

---

## 🚀 Future Tasks (What to do next)

### Frontend Integration
- [ ] **API Client:** Create `services/api.ts` utilizing `axios` to fetch live data from the FastAPI backend (Risk Zones, Priority Queue, Shelters).
- [ ] **Interactive Leaflet Map:** Implement `components/RiskMap.tsx` using `react-leaflet` to visually plot the `polygon_geojson` for risk zones, pin vulnerable households, and draw the safe evacuation route polylines.
- [ ] **Priority Queue UI:** Connect `components/PriorityQueue.tsx` to `GET /api/v1/priority/queue` and style the dynamic ranking updates.
- [ ] **WebSockets:** Wire up `ws://localhost:8000/ws` in the frontend to trigger blinking alerts when an SOS is received.
- [ ] **Offline SOS UI:** Implement `components/SosModal.tsx` to simulate creating a mesh packet.

### Backend Refinements
- [ ] **Authentication:** Replace the dummy hackathon auth with actual JWT validation for secure dashboard access if time permits.
- [ ] **PostGIS Migration:** Move from SQLite to PostgreSQL with PostGIS extension for more advanced geospatial queries (like polygon intersections) when preparing for production.

---

## 🧠 Architectural Rationale (Why these things were implemented this way)

1. **Why decouple Services from Routers in FastAPI?**
   *Rationale:* The priority algorithm and routing algorithm are complex and central to the system's value proposition. By extracting them into `services/priority_engine.py` and `services/routing_engine.py`, we can unit test them easily, run them from simulation scripts without HTTP calls, and keep the API endpoint files (`api/priority.py`) extremely clean.

2. **Why use a Python-based Offline Mesh Simulator?**
   *Rationale:* As explicitly noted in the `20-HOUR-WORKFLOW.md` (Phase 8/9), building a robust, real-world Bluetooth/Wi-Fi Direct mesh network across physical Android/iOS devices within a 20-hour hackathon is highly risky and prone to hardware failure. Building `simulation/mesh_simulator.py` allows the team to definitively prove to the jury that the *software logic* (Store-and-Forward, TTL, Duplicate Detection, Gateway Handoff) works perfectly and guarantees a smooth pitch.

3. **Why Vite + React + Tailwind for the Frontend?**
   *Rationale:* A dashboard requires a heavily component-driven interface (Map, Queue, Controls). React is perfect for this state management. Vite provides ultra-fast Hot Module Replacement (HMR) to save precious seconds during the hackathon. Tailwind was chosen because it allows for rapid, premium, dark-mode styling without writing thousands of lines of custom CSS.

4. **Why include a `seed_data.py` script?**
   *Rationale:* A common hackathon failure point is presenting a blank dashboard during the pitch. The seed script guarantees that a dramatic, realistic scenario (Wayanad Sector 4 Hill Range) is pre-loaded into the database so the dashboard looks populated and impressive from second #1.

5. **Why use a multi-factor Priority Formula?**
   *Rationale:* Standard SOS systems just use "first-come, first-served", which fails in mass casualty events. Implementing the `Priority = Severity(40) + Vulnerability(30) + Risk(20) + Isolation(10)` formula directly addresses the core problem statement of identifying and prioritizing highly vulnerable groups (elderly/disabled) who cannot self-evacuate.
