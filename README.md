# ATLAS-Sentry

**Autonomous Terrain-Linked Aerial System**
**Networked Tactical Response System**

---

## Team Members

**Brad Burks** — Solo Developer
Capstone Project — Software Development, Bates Technical College

---

## Project Description

ATLAS-Sentry is a JavaScript and TypeScript simulation of a coordinated, autonomous property monitoring network. Drones, motion sensors, geofencing boundaries, and power-adaptive charging stations operate together as a self-directed ecosystem — detecting activity, assigning missions, and maintaining coverage without human intervention.

Each component has a defined role, communicates through shared system data, and responds to events using programmed logic rather than human direction. The final deliverable is an interactive dashboard that visualizes drone movement, sensor activity, charging behavior, geofence interactions, and mission events in real time.

---

## The Problem This Project Addresses

Large properties, critical infrastructure, remote facilities, and high-traffic public spaces share a common problem — traditional security systems have too many limitations to cover them effectively. Stationary cameras offer some visual coverage but cannot respond to what they detect. Human patrols can react but are slow to deploy and costly to sustain. Wired systems require infrastructure that remote environments simply do not have.

ATLAS-Sentry addresses that gap by simulating a distributed drone network that adapts to its environment — responding to motion events, coordinating across multiple units, and sustaining continuous coverage without human intervention. It is a monitoring solution that scales to the environment, rather than forcing the environment to work around the system.

---

## Target Users and Use Cases

- Property owners managing large or remote areas
- Wildlife refuge and conservation operators
- Agricultural facilities requiring perimeter monitoring
- Industrial warehouses and controlled indoor environments
- Emergency management teams needing rapid area coverage
- Military installations
- Restricted areas
- Power grid and pipeline corridor monitoring
- Solar and wind farms perimeter security
- Water treatment and reservoir facilities
- Border patrol and coastal monitoring support
- Correctional facilities perimeter surveillance
- National park and protected land enforcement
- Large outdoor event security (festivals, concerts, stadiums)
- Disaster relief and search-and-rescue coordination
- Construction site after-hours security
- Mining and resource extraction sites
- Shipping ports and freight yards
- Data center campus monitoring
- University research campuses
- Remote scientific field stations

---

## System Components and Their Roles

**Drones**
Independent agents that patrol assigned zones, respond to sensor alerts, and return to charge automatically. Decision-making is based on current location, mission status, and incoming system events. Adding more drones scales coverage without adding human workload.

**Motion Sensors**
The detection layer of the network. Sensors identify activity and generate events that drive autonomous responses throughout the system. They do not make decisions — they provide the trigger that sets everything else in motion.

**Charging Stations**
The backbone of continuous operation. Stations guide drones in for recharging when needed, ensuring units remain mission-ready without manual battery management.

**Service Stations (Tier 2)**
The ServiceStation extends the base ChargingStation into a full maintenance cycle. Each station manages an assigned roster of drones and runs a service queue on their return — battery recharge, lens cleaning, fire retardant refill, and a systems check. A drone remains unavailable to the mission engine until its complete service cycle finishes, not just until its battery reaches full charge. This ensures every unit returning from a mission is fully operational before being dispatched again.

**Geofences**
Virtual boundaries that define zones and shape drone behavior. When a sensor detects activity, the geofence context tells the system which drone class and response type is appropriate for that location.

**Mission Engine**
The brain of the operation. Evaluates all available drones, selects the best candidate based on proximity, battery level, and class, then dispatches it to the event location. If a drone becomes unavailable mid-mission, another unit is automatically assigned to maintain coverage.

---

## Drone Classification System

ATLAS-Sentry supports multiple drone classes, each matched to a specific deployment environment. The mission engine selects the appropriate class automatically based on the active geofence zone and sensor event location.

**Class A — Outdoor / Heavy Duty**
Class A drones are the primary field unit of the ATLAS-Sentry network, built for open environments where conditions are unpredictable and coverage areas are large. Designed to manage wind, weather, and extended range patrol. Class A units operate continuously across outdoor zones — cycling through assigned waypoints, responding to sensor events, and returning to their service station autonomously when battery levels drop.

Each Class A drone is equipped with a proximity ping system that broadcasts its last known GPS coordinates if contact is lost — critical for recovery when a unit goes offline across a large area. When a threat code is triggered, the ping transmits before any auto-response executes, ensuring the drone's last confirmed position is captured and flagged on the dashboard regardless of what happens next.

Class A is the default deployment class for outdoor environments including farms, wildlife refuges, pipeline corridors, wildfire perimeters, and remote facilities. When multiple Class A units are active, the mission engine coordinates their assignments to prevent overlap, ensuring full zone coverage without redundant dispatches.

**Class B — Indoor / Compact**
Designed for controlled spaces where size and noise matter. A smaller frame allows access to tight corridors and restricted areas, while quieter motors support discreet operation. Obstacle avoidance sensors replace the need for a ping system since the environment is known and contained. In sensitive environments, acoustic masking such as white noise systems may be used alongside Class B drones to further reduce detection — a real-world deployment consideration beyond the scope of this simulation.

Class B drones are the designated indoor unit of the ATLAS-Sentry network, deployed in warehouses, secure facilities, correctional perimeters, and data centers where full-size outdoor drones would be impractical. Because the environment is known and contained, Class B units navigate using fixed floor plan coordinates rather than GPS — moving between defined waypoints within their assigned zone and rerouting automatically when an obstruction is detected. When a motion sensor triggers inside an indoor geofence, the mission engine filters by drone class and prioritizes the nearest available Class B unit, ensuring the right drone is always dispatched to the right environment.

**Class C — Hybrid (Tier 3)**
Bridges outdoor and transitional environments by adapting its flight mode based on surroundings — planned for a future build phase.

**Class D — Aquatic / Maritime (Tier 3)**
Extends coverage to water surfaces, shorelines, and flood zones alongside Class A drones — planned for a future build phase.

---

*What it takes to build — Hardware:*

Hardware requirements vary by deployment class. Outdoor units require a commercial grade frame rated for wind and weather resistance, high-capacity battery, GPS module with redundant signal support, weatherproof electronics housing, and a proximity ping system for last known location tracking. Indoor units require a lightweight micro frame, ultrasonic or infrared obstacle avoidance sensors, and a low-noise motor system. Power source is determined at deployment — solar and generator for outdoor, hardwired and generator for indoor.

*What it takes to build — Software:*

Both classes share the same core software foundation — a state machine governing patrolling, responding, returning, and charging states, battery drain per tick with automatic low-battery return trigger, and full mission engine integration for receiving assignments, navigating to target, and reporting completion. Class A extends this with weather threshold detection, patrol waypoint logic across outdoor geofence zones, and proximity ping on threat detection. Class B extends it with indoor navigation logic, obstacle avoidance handling, and geofence-based assignment prioritizing the nearest available indoor unit.

*What it takes to build — Code:*

ATLAS-Sentry is built exclusively in JavaScript and TypeScript, which oversee the full autonomy stack from mission logic to the operator dashboard. This is possible because the simulation runs on a companion computer layer rather than flight controller firmware — the layer that would otherwise require C++ is managed by the existing flight controller hardware in a real deployment.

Both classes are built from the same `Drone.ts` base class, sharing the core state machine, `tick()` cycle, `assignMission()`, `completeMission()`, and `returnToStation()` methods. Class A adds `proximityPing()`, weather threshold checks, and outdoor waypoint patrol logic. Class B adds `obstacleCheck()`, indoor floor plan navigation, and class-filtered dispatch through the mission engine. The shared foundation means adding drone classes in future tiers requires extending the base class rather than rebuilding from scratch.

In a full hardware deployment, this JS/TS stack would sit on a companion computer alongside a C++ flight controller such as PX4 or ArduPilot, communicating through MAVLink. The autonomy logic, ground control station, and operator interface would remain JS/TS — only the low-level motor control and sensor firmware would require C++.

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

**Manual Override Protocol** *(Emergency Shutdown)*
A manual override is always available. Triggering it immediately grounds every active drone, halts mission assignment, and directs all units back to their assigned charging stations. No autonomous process can override this command — the system always defers to the operator. If system behavior ever appears abnormal or even slightly "Skynet-ish," this protocol enforces an immediate transition from autonomous operations to full operator control.

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
| Runtime | ts-node | Runs TypeScript directly in Node.js without a separate compile step during development |
| Backend | Node.js, Express, TypeScript | Event-driven architecture built for real-time systems |
| Real-Time | Socket.io (WebSocket) | Live two-way communication without page refresh |
| Build | Vite | Fast frontend build tool optimized for React and TypeScript |
| Frontend | React, TypeScript | Component-based UI ideal for dynamic data display |
| Styling | Tailwind CSS | Utility-first styling for rapid, consistent UI development |
| Data Visualization | Chart.js / Recharts | Lightweight charting libraries native to React |
| Mapping | Leaflet.js | Interactive map for geofence and drone position overlays |
| Utilities | UUID | Unique ID generation for drones, sensors, and stations |
| Utilities | Day.js | Timestamp formatting for event logs |
| Configuration | dotenv | Manages environment variables for server configuration |
| Code Quality | ESLint | Enforces consistent code style and catches common errors across the codebase |
| Testing | Jest | Unit testing for drone state machines, mission logic, and charging cycles |
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
- ServiceStation — assigned drone maintenance bays with service cycles, payload management, and inspection checks

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
| Week 7 | Final testing, documentation, pitch deck, and self-evaluation |

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
- The emergency shutdown returns all drones to their assigned stations instantly on command
- GitHub history reflects consistent week-by-week progress
- Documentation and pitch deck are ready for presentation

---

## Foundation and Independent Research

The Software Development program at Bates Technical College provided the foundational skills applied throughout this project, including object-oriented programming, data structures, web development, database design, and exposure to tools such as TypeScript, Node.js, React, Tailwind, and geofencing concepts. Where the curriculum introduced a topic, this project extended it. Where gaps existed, independent research filled them — particularly in the areas of WebSocket communication, state machine architecture, autonomous system design, and technology stack architecture.

**Technology Stack Architecture**
Most autonomous drone systems split logic across multiple languages — Python for AI and mission logic, C++ for flight controller firmware, and JavaScript for the ground control interface. Building ATLAS-Sentry entirely in JavaScript and TypeScript required understanding where that boundary exists and why, since the simulation needed to model the autonomy and interface layers without depending on flight controller firmware. This research clarified why JS/TS is sufficient for the simulation scope while flight control remains outside it in a physical deployment.
- *Source:* PX4 and ArduPilot documentation — flight controller architecture and MAVLink communication standards

**WebSocket Communication**
Real-time two-way communication between the backend simulation and the React dashboard required research beyond what was covered in the program. Socket.io was selected after reviewing its documentation and comparing it against native WebSocket implementations.
- *Source:* Socket.io Official Documentation — event-driven communication model, room broadcasting, and connection lifecycle management

**State Machine Architecture**
Managing drone and sensor behavior through defined states required understanding finite state machine design patterns not covered in depth in coursework. This same state machine approach extends to the ServiceStation's maintenance cycle, ensuring a drone remains unavailable until every stage of its service queue completes.
- *Source:* MDN Web Docs — JavaScript Classes — applied to state transition logic
- *Source:* Statecharts.dev — visual and conceptual reference for hierarchical state machines

**Autonomous System Design**
Designing a network of independent agents that coordinate without human input required research into how real autonomous drone systems are architected.
- *Source:* FAA Unmanned Aircraft Systems — real-world drone classifications, operational boundaries, and safety protocols
- *Source:* IEEE Xplore — Autonomous Multi-Agent Systems — academic research on distributed autonomous coordination

---

## Conclusion

ATLAS-Sentry demonstrates how autonomous systems can coordinate independent components into a unified, self-managing network. By building drones, sensors, charging stations, and service stations as cooperative agents governed by state machines and a central mission engine, the project applies object-oriented programming, real-time communication, and event-driven design to a practical and scalable concept. The tiered roadmap ensures the project remains honest about its current scope while documenting a clear path for future growth.

What began as a question — can software alone simulate a self-sustaining drone network? — became a structured answer: YES, if every component has a defined role, every state has a defined transition, and every decision defers to the mission engine. ATLAS-Sentry is that answer in code.

---

## Author

**Brad Burks**
Capstone Project — Software Development, Bates Technical College
