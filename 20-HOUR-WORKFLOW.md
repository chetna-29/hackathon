# 🔥 FIRE-EYE — 20-HOUR HACKATHON WORKFLOW

## Goal

Build a working MVP in 20 hours.

The final demo flow:

```text
Risk increases
      ↓
ML predicts HIGH risk
      ↓
Risk zone becomes RED
      ↓
Vulnerable households identified
      ↓
Elderly household sends SOS
      ↓
Internet OFF
      ↓
SOS travels through mesh
      ↓
Gateway receives SOS
      ↓
Rescue priority generated
      ↓
Safe route calculated
      ↓
Shelter recommended
```

---

# 👥 Team Split

## Person 1 — Backend + Database

- FastAPI
- PostgreSQL/PostGIS
- APIs
- SOS
- Priority engine

## Person 2 — Frontend

- React
- Dashboard
- Map
- SOS UI
- Rescue queue

## Person 3 — ML + Data

- Dataset
- Preprocessing
- Model
- Prediction API integration

## Person 4 — Offline Communication + Integration

- Mesh logic
- Message format
- BLE/Wi-Fi prototype
- Gateway
- Integration

---

# ⏱️ Phase 0 — 00:00–00:30

## Team Setup

Create:

```text
fire-eye/
│
├── frontend/
├── backend/
├── ml/
├── mobile/
├── docs/
└── README.md
```

Decide API contracts immediately.

---

# 🟢 Phase 1 — 00:30–03:00

## Backend Foundation

Set up:

- FastAPI
- PostgreSQL
- PostGIS
- SQLAlchemy
- Pydantic

Create tables:

```text
users
households
risk_zones
sos_requests
shelters
hospitals
rescue_teams
roads
messages
```

### Deliverable

Basic APIs working.

---

# 🟢 Phase 2 — 00:30–04:00

## Frontend Foundation

Build:

- Login
- Dashboard
- Map
- SOS
- Rescue Queue
- Shelters

Set up:

- React
- TypeScript
- Tailwind
- Leaflet

### Deliverable

Beautiful dashboard with dummy data.

Do not wait for backend integration.

---

# 🟢 Phase 3 — 01:00–05:00

## ML

Pipeline:

```text
Dataset
 ↓
Cleaning
 ↓
Feature Engineering
 ↓
Train/Test Split
 ↓
Random Forest / XGBoost
 ↓
Evaluation
 ↓
joblib
```

Create:

```text
POST /prediction/landslide
```

Example input:

```json
{
  "rainfall_24h": 180,
  "slope": 37,
  "elevation": 2100
}
```

Example output:

```json
{
  "risk_score": 0.87,
  "risk_level": "HIGH"
}
```

---

# 🟡 Phase 4 — 03:00–07:00

## Risk Map + Vulnerable Population

Integrate:

```text
ML
 ↓
FastAPI
 ↓
Frontend
 ↓
Map
```

Map should show:

- 🟢 LOW
- 🟡 MEDIUM
- 🔴 HIGH

Add household markers.

Click marker:

```text
H101
2 elderly
4 residents
Vulnerability: HIGH
```

---

# 🟡 Phase 5 — 05:00–08:00

## SOS System

Create:

```text
POST /sos
GET /sos/active
PATCH /sos/{id}
```

Frontend:

```text
🔴 SEND SOS
```

Rescue dashboard:

```text
🚨 NEW SOS
H101
Critical
Location
```

---

# 🟡 Phase 6 — 07:00–10:00

## Rescue Priority Engine

Example scoring:

```text
Priority =
Severity × 40
+
Vulnerability × 30
+
Risk × 20
+
Isolation × 10
```

Sort SOS requests.

Dashboard:

```text
#1 🔴 H101
#2 🔴 H205
#3 🟠 H112
```

---

# 🟠 Phase 7 — 09:00–12:00

## Routing + Shelter

Integrate:

- OpenStreetMap
- OSRM

Flow:

```text
SOS
 ↓
Nearest Safe Shelter
 ↓
Route
```

Add road risk.

### Deliverable

Map displays:

`🚑 Recommended Safe Route`

---

# 🔴 Phase 8 — 11:00–15:00

# OFFLINE MESH

This is the risky part.

## First implement simulation

```text
Device A
 ↓
Device B
 ↓
Device C
 ↓
Gateway
```

Implement:

- Message ID
- TTL
- Duplicate detection
- Store-and-forward
- ACK

Target logs:

```text
[A] SOS CREATED
[B] MESSAGE RECEIVED
[B] FORWARDED
[C] MESSAGE RECEIVED
[C] FORWARDED
[GATEWAY] SOS RECEIVED
```

---

# 🔴 Phase 9 — 14:00–17:00

## Real Device Communication

If time allows:

- Bluetooth
- Wi-Fi Direct

Test:

```text
Phone A
 ↓
Phone B
 ↓
Phone C
```

### IMPORTANT

If real mesh becomes unstable:

**Stop debugging it.**

Use the controlled mesh simulation for the main demo and explain the protocol clearly.

---

# 🔥 Phase 10 — 16:00–18:00

## Full Integration

Everything should connect:

```text
Risk
 ↓
Affected Zone
 ↓
Vulnerable People
 ↓
SOS
 ↓
Offline Communication
 ↓
Priority
 ↓
Safe Route
 ↓
Shelter
```

Run an end-to-end test.

---

# 🎨 Phase 11 — 17:00–19:00

## UI + Demo Polish

Main dashboard:

```text
┌───────────────────────────────────────────┐
│ 🔥 FIRE-EYE COMMAND CENTER                │
├───────────────────────────────────────────┤
│                                           │
│ 🔴 HIGH RISK        🚨 17 SOS             │
│                                           │
│ 👵 87 Vulnerable    🏥 3 Hospitals       │
│                                           │
│          LIVE DISASTER MAP                │
│                                           │
├───────────────────────────────────────────┤
│ PRIORITY RESCUE QUEUE                     │
│                                           │
│ #1 H101 🔴 Critical                       │
│ #2 H205 🔴 Child                          │
│ #3 H112 🟠 Medical                        │
└───────────────────────────────────────────┘
```

---

# 🏆 Phase 12 — 19:00–20:00

## Final Test + Pitch

Run exactly this demo:

### Step 1
Normal situation.

### Step 2
Increase rainfall.

### Step 3
ML predicts HIGH risk.

### Step 4
Zone turns RED.

### Step 5
Vulnerable households are identified.

### Step 6
Elderly household sends SOS.

### Step 7
Simulate internet/mobile network failure.

### Step 8
SOS travels through mesh.

### Step 9
Gateway receives SOS.

### Step 10
Rescue priority is generated.

### Step 11
Safe route is calculated.

### Step 12
Shelter is recommended.

---

# 🚫 DO NOT BUILD THESE IN 20 HOURS

Do not waste time on:

- ❌ Complex deep learning
- ❌ Huge datasets
- ❌ Full hospital integration
- ❌ Full satellite processing
- ❌ Complete LoRa network
- ❌ Advanced mesh routing protocol
- ❌ Android + iOS simultaneously
- ❌ Multiple disaster types
- ❌ Production-grade authentication

Pick **ONE disaster: Landslide**.

---

# 🏆 Final MVP Checklist

The project must have:

- [ ] ML Risk Prediction
- [ ] Live Risk Map
- [ ] Vulnerable Household Mapping
- [ ] SOS
- [ ] Offline Mesh / Mesh Simulation
- [ ] Rescue Priority
- [ ] Safe Evacuation Route
- [ ] Shelter Recommendation
- [ ] Rescue Dashboard

---

# 🎤 Final Pitch

> FIRE-EYE does not just predict where a disaster may happen. It identifies who is most vulnerable, keeps emergency communication alive when networks fail, prioritizes rescue operations, and guides people toward safer shelters.

---

# ⚠️ Scope Rule

If a feature is not directly contributing to the final demo flow, do not build it during the 20-hour sprint.
