# 🔥 FIRE-EYE — System Architecture

## 1. High-Level Architecture

```text
                         FIRE-EYE
                            │
             ┌──────────────┴──────────────┐
             │                             │
        ONLINE SYSTEM                OFFLINE SYSTEM
             │                             │
             ▼                             ▼
        React Web App               Mobile / Nodes
             │                             │
             ▼                        BLE / Wi-Fi
          FastAPI                         │
             │                            ▼
       ┌─────┼────────┐              Mesh Layer
       │     │        │                   │
       ▼     ▼        ▼                   ▼
      ML   Database  Routing           Gateway
       │     │        │                   │
       └─────┼────────┘                   │
             │                            │
             └────────────┬───────────────┘
                          ▼
                   Rescue Dashboard
```

---

# 2. Frontend Architecture

```text
React Application
│
├── Dashboard
├── Risk Map
├── SOS
├── Rescue Operations
├── Shelters
├── Hospitals
└── Route Planner
```

Technologies:

- React
- TypeScript
- Tailwind
- Leaflet

---

# 3. Backend Architecture

```text
                   FastAPI
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   Auth Service   Disaster API   SOS API
        │             │             │
        │             ▼             ▼
        │         ML Service   Priority Engine
        │             │             │
        └─────────────┼─────────────┘
                      │
              PostgreSQL/PostGIS
```

---

# 4. ML Architecture

```text
Historical Data
      │
      ▼
Data Cleaning
      │
      ▼
Feature Engineering
      │
      ▼
Train/Test Split
      │
      ▼
XGBoost / Random Forest
      │
      ▼
Model Evaluation
      │
      ▼
joblib Model
      │
      ▼
FastAPI
```

Production flow:

```text
Current Environmental Data
          │
          ▼
       FastAPI
          │
          ▼
      ML Model
          │
          ▼
    Risk Probability
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
   LOW  MEDIUM HIGH
```

---

# 5. GIS Architecture

```text
                PostGIS
                   │
        ┌──────────┼──────────┐
        │          │          │
     Houses      Roads     Shelters
        │          │          │
        └──────────┼──────────┘
                   │
              Risk Zones
                   │
                   ▼
              Leaflet Map
```

---

# 6. Offline Mesh Architecture

```text
                  RESCUE GATEWAY
                        │
                  Wi-Fi / Internet
                        │
                       D
                      / \
                     C   E
                    /
                   B
                  /
                 A
              👵 SOS
```

A message travels:

```text
A → B → C → D → Gateway
```

No internet is required between A, B, C and D.

---

# 7. Device Architecture

Each device contains:

```text
┌─────────────────────────────┐
│        FIRE-EYE APP         │
├─────────────────────────────┤
│ SOS Interface               │
│ Location                    │
├─────────────────────────────┤
│ Mesh Manager                │
│                             │
│ Device Discovery            │
│ Connection Manager          │
│ Message Router              │
│ Duplicate Detection         │
│ TTL Manager                 │
├─────────────────────────────┤
│ SQLite / Local Storage      │
├──────────────┬──────────────┤
│ Bluetooth    │ Wi-Fi Direct │
└──────────────┴──────────────┘
```

---

# 8. Message Structure

```json
{
  "messageId": "SOS-123",
  "senderId": "DEVICE-A",
  "type": "SOS",
  "latitude": 30.3165,
  "longitude": 78.0322,
  "severity": "CRITICAL",
  "timestamp": 1791370200,
  "ttl": 8
}
```

---

# 9. Store-and-Forward

```text
Device A
   │
   ▼
Create SOS
   │
   ▼
Broadcast / Send
   │
   ▼
Device B
   │
   ├── Already seen?
   │       │
   │      YES → Ignore
   │
   └── NO
       │
       ▼
     Store
       │
       ▼
     TTL--
       │
       ▼
    Forward
```

---

# 10. Duplicate Prevention

Every message contains:

`messageId`

Each device maintains:

```text
seenMessages
```

If:

```text
messageId ∈ seenMessages
```

then:

```text
DROP MESSAGE
```

Otherwise:

```text
STORE
FORWARD
```

---

# 11. TTL

TTL prevents infinite message propagation.

Example:

```text
A → B → C → D

TTL:
A = 8
B = 7
C = 6
D = 5
```

When:

```text
TTL = 0
```

the message is no longer forwarded.

---

# 12. SOS Flow

```text
User
 │
 ▼
Press SOS
 │
 ▼
Create Message
 │
 ▼
Try Internet
 │
 ├── Available ──→ FastAPI
 │
 └── Unavailable
          │
          ▼
      Mesh Manager
          │
          ▼
   Nearby Devices
          │
          ▼
       Gateway
          │
          ▼
       FastAPI
          │
          ▼
    Rescue Dashboard
```

---

# 13. Rescue Priority Architecture

```text
SOS Requests
     │
     ▼
Priority Engine
     │
     ├── Severity
     ├── Elderly
     ├── Child
     ├── Disability
     ├── Risk Zone
     └── Isolation
     │
     ▼
Priority Score
     │
     ▼
Sorted Rescue Queue
```

---

# 14. Routing Architecture

```text
SOS Location
      │
      ▼
Risk Map
      │
      ▼
Blocked / Dangerous Roads
      │
      ▼
Apply Road Penalties
      │
      ▼
OSRM
      │
      ▼
Safest Available Route
      │
      ▼
Shelter / Hospital
```

---

# 15. Real-Time Architecture

```text
SOS
 │
 ▼
FastAPI
 │
 ▼
Redis
 │
 ▼
WebSocket
 │
 ▼
Rescue Dashboard
```

---

# 16. Complete Data Flow

```text
Weather / Historical Data
          │
          ▼
      ML Model
          │
          ▼
    Risk Prediction
          │
          ▼
       Risk Map
          │
          ▼
 Vulnerable Population
          │
          ▼
      SOS / Alert
          │
          ▼
 Offline Mesh / Internet
          │
          ▼
      Rescue Team
          │
          ▼
 Priority Engine
          │
          ▼
    Safe Route
          │
          ▼
 Shelter / Hospital
```

---

# 17. Security Architecture

```text
User
 │
 ▼
JWT Authentication
 │
 ▼
Role-Based Access
 │
 ├── USER
 ├── VOLUNTEER
 ├── RESCUE
 └── ADMIN
```

Sensitive victim data should only be visible to authorized personnel.

---

# 18. Deployment Architecture

```text
              Internet
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
     Vercel              FastAPI
    Frontend             Backend
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
            PostgreSQL    Redis       OSRM
             + PostGIS
```

---

# 19. Offline Architecture

The offline mesh must continue working without:

- Internet
- Cloud
- Mobile network

Only the following are required:

- Nearby devices
- Bluetooth / Wi-Fi Direct
- Local storage
- Mesh forwarding logic

The gateway synchronizes data with the cloud once connectivity is restored.
