# ATLAS-Sentry

**Autonomous Terrain-Linked Aerial System**
**Solar-Enabled Networked Tactical Response System**

---

## Team Members

**Brad Burks** — Solo Developer
Capstone Project — Software Development, Bates Technical College

---

## Project Description

ATLAS-Sentry is a JavaScript and TypeScript simulation of a coordinated, autonomous property monitoring network. Drones, motion sensors, geofencing boundaries, and solar-powered charging stations operate together as a self-directed ecosystem — detecting activity, assigning missions, and maintaining coverage without human intervention.

Each component has a defined role, communicates through shared system data, and responds to events using programmed logic rather than human direction. The final deliverable is an interactive dashboard that visualizes drone movement, sensor activity, charging behavior, geofence interactions, and mission events in real time.

---

## The Problem This Project Addresses

Large properties, wildlife refuges, farms, and remote facilities often lack affordable, automated monitoring solutions. Static cameras offer limited coverage and human patrols are slow to respond. ATLAS-Sentry simulates a distributed drone network capable of responding to motion events, coordinating tasks across multiple units, and sustaining operations through solar-powered charging — providing continuous, scalable coverage that traditional security systems cannot match.

---

## Target Users and Use Cases

- Property owners managing large or remote areas
- Wildlife refuge and conservation operators
- Agricultural facilities requiring perimeter monitoring
- Industrial warehouses and controlled indoor environments
- Emergency management teams needing rapid area coverage and response
- Military installations

---

## System Components and Their Roles

**Drones**
Independent agents that patrol assigned zones, respond to sensor alerts, and return to charge automatically. Decision-making is based on current location, mission status, and incoming system events. Adding more drones scales coverage without adding human workload.

**Motion Sensors**
The detection layer of the network. Sensors identify activity and generate events that drive autonomous responses throughout the system. They do not make decisions — they provide the trigger that sets everything else in motion.

**Charging Stations**
The backbone of continuous operation. Stations guide drones in for recharging when needed, ensuring units remain mission-ready without manual battery management.

**Geofences**
Virtual boundaries that define zones and shape drone behavior. When a sensor detects activity, the geofence context tells the system which drone class and response type is appropriate for that location.

**Mission Engine**
The brain of the operation. Evaluates all available drones, selects the best candidate based on proximity, battery level, and class, then dispatches it to the event location. If a drone becomes unavailable mid-mission, another unit is automatically assigned to maintain coverage.

---

## Drone Classification System

ATLAS-Sentry supports multiple drone classes, each matched to a specific deployment environment. The mission engine selects the appropriate class automatically based on the active geofence zone and sensor event location.

**Class A — Outdoor / Heavy Duty**
Built for open environments where conditions are unpredictable. Handles wind, weather, and extended range patrol. Equipped with a proximity ping system that broadcasts the drone's last known location if contact is lost — critical for recovery when a unit goes offline across a large area.

*What it takes to build:*
- Commercial grade frame rated for wind and weather resistance
- High capacity LiPo or solid state battery
- GPS module with redundant signal support
- Weatherproof electronics housing
- Proximity ping system for last known location tracking
- Software: patrol range logic, weather threshold detection, outdoor geofence mapping, proximity ping on threat detection

**Class B — Indoor / Compact**
Designed for controlled spaces where size and noise matter. A smaller frame allows access to tight corridors and restricted areas, while quieter motors support discreet operation. Obstacle avoidance sensors replace the need for a ping system since the environment is known and contained. In sensitive environments, acoustic masking such as white noise systems may be used alongside Class B drones to further reduce detection — a real-world deployment consideration beyond the scope of this simulation.

*What it takes to build:*
- Lightweight micro drone frame
- Ultrasonic or infrared obstacle avoidance sensors
- Low-noise motor system
- Software: indoor navigation, zone mapping, fast geofence-based assignment

**Class C — Hybrid (Tier 3)**
Bridges outdoor and transitional environments by adapting its flight mode based on surroundings. Significantly more complex to build and program than Class A or B — requires a modular frame, dual environment sensors, and an extended state machine to manage transitions safely.

**Class D — Aquatic / Maritime (Tier 3)**
Extends coverage to water surfaces, shorelines, and flood zones. Works alongside Class A drones to eliminate blind spots between land and water. Requires a completely separate navigation class replacing flight logic with surface movement, while sharing the same mission engine interface as the rest of the fleet.

---

## Deployment Environment Options

**Outdoor / Remote**
- Primary Power: Solar panels
- Backup Power: Onsite generator
- Drone Class: A (and future C, D)
- Best for: farms, wildlife refuges, open and restricted areas

**Indoor / Controlled**
- Primary Power: Hardwired powerline
- Backup Power: Generator
- Drone Class: B
- Best for: warehouses, facilities, secure buildings

Power source is determined at deployment configuration. Outdoor environments favor solar given the lack of infrastructure, while indoor deployments benefit from the reliability of a direct power connection.

---

## Safety and Control Protocols

**Emergency Shutdown**
A manual override is available at all times. Triggering it immediately grounds every active drone, halts mission assignment, and directs all units to their nearest charging station. No autonomous process can override this command — the system always defers to the operator.

**Threat Detection and Alert System**
Each drone continuously logs its GPS position. When an issue is detected, a location ping fires immediately — capturing last known coordinates before any auto-response executes. The mainframe marks the position on the dashboard and personnel receive a classified threat code alongside the pinged location.

| Code | Threat | Auto Response |
|---|---|---|
| T-01 | Signal loss / RF jamming | Return to nearest charging station |
| T-02 | GPS spoofing detected | Lock to last verified position, await instructions |
| T-03 | Physical contact / impact | Ground immediately, flag for inspection |
| T-04 | Stationary object collision | Reroute, log obstruction coordinates |
| T-05 | Power loss / battery critical | Emergency land at nearest safe point |

Every triggered code produces three outputs: an automatic drone response, a system alert to the dashboard, and a real-time notification to the assigned personnel monitor.

---

## Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| Backend | Node.js, Express, TypeScript | Event-driven architecture built for real-time systems |
| Real-Time | Socket.io (WebSocket) | Live two-way communication without page refresh |
| Frontend | React, TypeScript | Component-based UI ideal for dynamic data display |
| Styling | Tailwind CSS | Utility-first styling for rapid, consistent UI development |
| Data Visualization | Chart.js / Recharts | Lightweight charting libraries native to React |
| Mapping | Leaflet.js | Interactive map for geofence and drone position overlays |
| Utilities | UUID | Unique ID generation for drones, sensors, and stations |
| Utilities | Day.js | Timestamp formatting for event logs |
| Version Control | Git / GitHub | Industry standard for source control and progress tracking |

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

## Project Tiers and Roadmap

**Tier 1 — This Project (Capstone)**
- Core Drone, Sensor, ChargingStation, and Geofence classes
- Autonomous simulation loop and mission assignment engine
- Battery drain and charging cycle management
- React dashboard with live WebSocket updates
- Emergency shutdown protocol
- Threat code classification with location ping
- Event logs and geofence overlays

**Tier 2 — Next Phase**
- Real power redundancy switching (solar / grid / generator)
- Class A and Class B drone selection based on deployment environment
- Drone fleet scaling and load balancing
- Historical data logging and incident reporting
- Mobile-friendly dashboard view
- User authentication and role-based access control

**Tier 3 — Fully Advanced**
- Class C hybrid drone with environment-adaptive flight modes
- Class D aquatic drone with surface navigation
- Physical drone hardware integration
- AI-driven threat classification and object recognition
- Swarm intelligence and multi-drone cooperative planning
- Infrared, thermal, and night vision sensor support
- Real-time weather adaptation
- Cloud deployment and remote management

---

## Milestones and Timeline

| Week | Focus |
|---|---|
| Week 1 | Project setup, core class definitions (Drone, Sensor, Station, Geofence) |
| Week 2 | State machines, TypeScript types, backend structure |
| Week 3 | Simulation loop and mission assignment engine |
| Week 4 | Battery drain, charging cycles, threat detection framework |
| Week 5 | React dashboard and WebSocket integration |
| Week 6 | Event logs, map overlays, geofence visualization |
| Week 7 | Final testing, documentation, and pitch deck |

---

## Challenges and Risks

| Challenge | Mitigation |
|---|---|
| Coordinating multiple drones without conflicts | Queue-based mission assignment ensures one drone per event |
| Keeping frontend and backend in sync | Socket.io handles live broadcasting without polling |
| Battery and charging logic across multiple units | State machines enforce strict drone states at all times |
| Scope expanding beyond what is achievable | Tier system clearly separates current work from future vision |

---

## Evaluation Criteria

The project is considered complete when:

- All drones respond to sensor events autonomously without human input
- Battery drain and charging cycles run continuously without errors
- The React dashboard displays live positions, sensor status, and mission events
- Threat codes trigger correctly with location pings and personnel alerts
- The emergency shutdown grounds all drones instantly on command
- GitHub history reflects consistent week-by-week progress
- Documentation and pitch deck are presentation ready

---

## Foundation and Independent Research

The Software Development program at Bates Technical College provided the foundational skills applied throughout this project, including object-oriented programming, data structures, web development, database design, and exposure to tools such as TypeScript, Node.js, React, Tailwind, and geofencing concepts. Where the curriculum introduced a topic, this project extended it. Where gaps existed, independent research filled them — particularly in the areas of WebSocket communication, state machine architecture, and autonomous system design.

**WebSocket Communication**
Real-time two-way communication between the backend simulation and the React dashboard required research beyond what was covered in the program. Socket.io was selected after reviewing its documentation and comparing it against native WebSocket implementations.
- *Source:* Socket.io Official Documentation — event-driven communication model, room broadcasting, and connection lifecycle management

**State Machine Architecture**
Managing drone and sensor behavior through defined states required understanding finite state machine design patterns not covered in depth in coursework.
- *Source:* MDN Web Docs — JavaScript Classes — applied to state transition logic
- *Source:* Statecharts.dev — visual and conceptual reference for hierarchical state machines

**Autonomous System Design**
Designing a network of independent agents that coordinate without human input required research into how real autonomous drone systems are architected.
- *Source:* FAA Unmanned Aircraft Systems — real-world drone classifications, operational boundaries, and safety protocols
- *Source:* IEEE Xplore — Autonomous Multi-Agent Systems — academic research on distributed autonomous coordination

---

## Conclusion

ATLAS-Sentry demonstrates how autonomous systems can coordinate independent components into a unified, self-managing network. By building drones, sensors, and charging stations as cooperative agents governed by state machines and a central mission engine, the project applies object-oriented programming, real-time communication, and event-driven design to a practical and scalable concept. The tiered roadmap ensures the project remains honest about its current scope while documenting a clear path for future growth.

Every great technological advancement ever created started as an idea. Recognizing where imagination ends and the reality of development begins is what transforms those ideas into tomorrow's innovations.

---

## Author

**Brad Burks**
Capstone Project — Software Development, Bates Technical College
