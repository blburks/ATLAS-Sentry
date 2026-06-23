# ATLAS-Sentry

**Autonomous Terrain-Linked Aerial System**
**Solar-Enabled Networked Tactical Response System**

ATLAS-Sentry is a JavaScript/TypeScript simulation of an autonomous property-monitoring drone network. Drones, motion sensors, geofencing boundaries, and solar-powered charging stations work together as a coordinated, self-directed system — responding to events, assigning missions, and maintaining coverage without human intervention.

---

## What This Project Demonstrates

This capstone project applies and extends skills developed across the web development and computer science curriculum:

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

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Real-Time | Socket.io (WebSocket) |
| Frontend | React, TypeScript |
| Data Visualization | Chart.js / Recharts |
| Version Control | Git / GitHub |

---

## Project Structure

```
atlas-sentry/
├── src/
│   ├── classes/        # Drone, Sensor, Station, Geofence classes
│   ├── server/         # Express server, Socket.io, API routes
│   └── types/          # Shared TypeScript interfaces and types
├── client/             # React frontend dashboard (Phase 3)
├── package.json
├── tsconfig.json
└── README.md
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

## Problem Statement

Large properties, wildlife refuges, farms, and remote facilities often lack affordable automated monitoring solutions. Traditional systems rely on static cameras or human patrols, which provide limited coverage and slow response times. ATLAS-Sentry simulates a distributed autonomous drone network capable of responding to motion events, coordinating tasks across multiple drones, and maintaining persistent coverage through solar-powered charging.

---

## Out of Scope

This project is a simulation. The following are intentionally excluded from this version:

- Physical drone hardware or flight control
- Real motion sensors or solar charging hardware
- Swarm intelligence or cooperative path planning
- AI-driven threat classification or object recognition

These represent natural future expansions beyond the scope of this capstone.

---

## Author

**Brad Burks**
Capstone Project — Web Development / Computer Science
Washington State University
