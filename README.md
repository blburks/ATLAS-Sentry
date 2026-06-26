# ATLAS-Sentry

**Autonomous Terrain-Linked Aerial System**
**Solar-Enabled Networked Tactical Response System**

ATLAS-Sentry is a JavaScript/TypeScript simulation of an autonomous property-monitoring drone network. Drones, motion sensors, geofencing boundaries, and solar-powered charging stations work together as a coordinated, self-directed system — responding to events, assigning missions, and maintaining coverage without human intervention.

---

## Team Members

**Brad Burks** — Solo Developer
Capstone Project — Software Development, Bates Technical College

---

## What This Project Demonstrates

This capstone project applies and extends skills developed across the Software Development curriculum:

- **Object-Oriented Programming** — Drone, Sensor, Station, and Geofence modeled as independent, cooperative classes
- **Data Structures** — Queue-based mission assignment, hash-based sensor lookup, event log management
- **State Machines** — Drones and sensors managed through defined states (idle, patrolling, responding, charging)
- **REST API Design** — Express endpoints exposing system data for frontend consumption
- **Real-Time Communication** — WebSocket (Socket.io) broadcasting live events to the dashboard
- **React Frontend** — Interactive dashboard displaying drone positions, sensor status, and mission events

---

## System Components

| Component | Role |
|---|---|
| **Drones** | Autonomous agents that patrol, respond to alerts, and return to charge |
| **Motion Sensors** | Detect activity and trigger system events |
| **Charging Stations** | Solar-powered stations that keep drones operational |
| **Geofences** | Virtual boundaries that shape drone behavior and zone awareness |
| **Mission Engine** | Assigns the best available drone to each sensor event |

---

## Tech Stack

| Layer | Technology | Justification |
|---|---|---|
| Backend | Node.js, Express, TypeScript | Industry standard for event-driven, real-time applications |
| Real-Time | Socket.io (WebSocket) | Enables live two-way communication between server and dashboard |
| Frontend | React, TypeScript | Component-based UI ideal for live data visualization |
| Data Visualization | Chart.js / Recharts | Lightweight charting libraries built for React |
| Version Control | Git / GitHub | Industry standard for source control and project tracking |

---

## Project Structure

```
C:/Users/bradl/ATLAS-Sentry/
├── src/
│   ├── classes/        # Drone, Sensor, Station, Geofence classes
│   ├── server/         # Express server, Socket.io, API routes (Phase 2)
│   └── types/          # Shared TypeScript interfaces and types
├── client/             # React frontend dashboard (Phase 3)
├── package.json
└── tsconfig.json
```

---

## Development Phases

**Phase 1 — Core System Foundation**
Node.js backend, class definitions, state machines, real-time communication setup.

**Phase 2 — Simulation Loop and Logic**
Mission assignment engine, event handling, battery drain and charging cycles, autonomous decision-making.

**Phase 3 — Dashboard and Final Integration**
React frontend, live WebSocket updates, event logs, geofence overlays, documentation and presentation materials.

---

## Milestones and Timeline

| Week | Goal |
|---|---|
| Week 1 | Project setup, core classes (Drone, Sensor, Station, Geofence) |
| Week 2 | State machines, TypeScript types, backend structure |
| Week 3 | Simulation loop, mission assignment engine |
| Week 4 | Battery drain, charging cycles, event handling |
| Week 5 | React dashboard, WebSocket integration |
| Week 6 | Event logs, map overlays, geofence visualization |
| Week 7 | Final testing, documentation, pitch deck |

---

## Challenges and Risks

| Challenge | Mitigation |
|---|---|
| Managing multiple drones simultaneously | Queue-based mission assignment ensures only one drone per event |
| Real-time sync between backend and frontend | Socket.io handles live broadcasting without page refresh |
| Battery and charging logic complexity | State machines enforce strict drone states preventing conflicts |
| Scope creep | Out of scope items clearly defined and documented from day one |

---

## Evaluation Criteria

The project is considered complete when:

- All drones respond autonomously to sensor events without human input
- Battery drain and charging cycles run continuously without errors
- The React dashboard displays live drone positions, sensor status, and mission events
- The emergency shutdown protocol successfully grounds all drones instantly
- Code is documented, GitHub history reflects consistent progress, and the pitch deck is presentation ready

---

## Safety and Control Protocols

ATLAS-Sentry is designed with safety as a priority. The system includes a manual emergency shutdown protocol that immediately grounds all active drones, halts all mission assignment, and directs drones to their nearest charging station. No autonomous process can override a shutdown command. This ensures that human control is always available regardless of the system's current state — the drones serve the operator, not the other way around.

---

## Problem Statement

Large properties, wildlife refuges, farms, and remote facilities often lack affordable automated monitoring solutions. Traditional systems rely on static cameras or human patrols, which provide limited coverage and slow response times. ATLAS-Sentry simulates a distributed autonomous drone network capable of responding to motion events, coordinating tasks across multiple drones, and maintaining persistent coverage through solar-powered charging.

---

## Deployment Environment Options

**Outdoor / Remote Deployment**
- Primary Power: Solar panels
- Backup Power: Onsite generator
- Best for: farms, wildlife refuges, large open properties

**Indoor / Controlled Deployment**
- Primary Power: Hardwired powerline
- Backup Power: Generator
- Best for: warehouses, facilities, controlled environments

---

## Project Tiers and Roadmap

**Tier 1 — This Project (Capstone)**
- Core drone, sensor, station, and geofence classes
- Simulation loop and autonomous mission assignment
- Battery drain and charging cycles
- React dashboard with live WebSocket updates
- Emergency shutdown protocol
- Basic event logs and geofence overlays

**Tier 2 — Next Phase Improvements**
- Real power redundancy switching (solar / grid / generator)
- Multiple deployment environment profiles (indoor / outdoor)
- Drone fleet scaling and load balancing
- Historical data logging and reporting
- Mobile-friendly dashboard
- User authentication and role-based access

**Tier 3 — Fully Advanced**
- Physical drone hardware integration
- AI-driven threat detection and classification
- Swarm intelligence and cooperative path planning
- Infrared, thermal, and night vision sensor support
- Hybrid mobility systems (ground-to-air)
- Real-time weather adaptation
- Cloud deployment and remote management

---

## Author

**Brad Burks**
Capstone Project — Software Development, Bates Technical College
