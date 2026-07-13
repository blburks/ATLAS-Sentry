# ATLAS-Sentry — Learning Log
## New Territory Beyond Prior Coursework

This document tracks every concept, method, or technique used in this project
that goes beyond what was covered in prior coursework. Each entry includes
what the concept is, where the idea came from, how it was researched and applied,
and what problem it solved in the system.

Research and application guidance was provided with the assistance of Claude (Anthropic AI).
All design decisions, direction, and understanding of the material are my own.

---

## Step 2 — Core Classes (Drone, Sensor, ChargingStation, Geofence)

---

### 1. State Machines

**What it is:**
A state machine is a pattern that defines a fixed set of states an object can be
in, and strict rules about which transitions between states are allowed. Only one
state is active at a time.

**Where the idea came from:**
Prior coursework covered object properties and conditionals but not formalized
state control. The problem was: how do you prevent a drone from doing two things
at once, or jumping to an invalid state? State machines solve this by making
illegal transitions impossible, not just unlikely.

**How it was researched and applied:**
Researched the concept of finite state machines (FSM) in the context of JavaScript
and game/simulation logic. Applied it using a `ALLOWED_TRANSITIONS` map in
`Drone.ts` — a plain object where each key is a current state and the value is
an array of states it is allowed to move to. A private `transition()` method
checks the map before allowing any state change, and throws a descriptive error
if the transition is invalid.

**Where it appears in the project:**
`src/classes/Drone.ts` — `ALLOWED_TRANSITIONS` constant and `transition()` method.

---

### 2. Ray Casting Algorithm (Point-in-Polygon)

**What it is:**
A computational geometry algorithm used to determine whether a point lies inside
a polygon. It works by firing an imaginary ray in one direction from the point
and counting how many times the ray crosses the edges of the polygon. If the
count is odd, the point is inside. If even, it is outside.

**Where the idea came from:**
Geofencing requires knowing whether a drone's position is inside a defined
boundary zone. Prior coursework did not cover spatial or geometric logic.
The challenge was: how do you check if an (x, y) coordinate is inside an
irregular polygon made of multiple points?

**How it was researched and applied:**
Researched standard point-in-polygon detection methods used in mapping and GIS
software. The ray casting approach was chosen because it works for any polygon
shape, requires no external library, and is explainable with basic geometry.
Applied it in `Geofence.ts` as the `contains(point)` method using a for-loop
that iterates through each edge of the boundary polygon.

**Where it appears in the project:**
`src/classes/Geofence.ts` — `contains()` method.

---

### 3. Simulation Ticks

**What it is:**
A simulation tick is one cycle of a repeating loop that advances the state of
the entire system by one unit of time. Each tick, every active object in the
simulation updates itself — drones drain or gain battery, sensors count down
cooldowns, missions progress.

**Where the idea came from:**
Prior coursework used event-driven logic (respond when something happens) but
not time-driven simulation loops (advance the whole system on a clock). The
challenge was modeling things that change over time, like battery draining
gradually rather than all at once.

**How it was researched and applied:**
Researched how game engines and simulation systems model time using a game loop
or tick interval. Applied it by giving both `Drone` and `Sensor` a `tick()`
method that is called on every loop cycle. Battery drain and cooldown countdown
are handled inside these methods, keeping the logic inside each class rather
than scattered across the simulation.

**Where it appears in the project:**
`src/classes/Drone.ts` — `tick()` method.
`src/classes/Sensor.ts` — `tick()` method.

---

### 4. Snapshot Pattern for WebSocket-Safe Data

**What it is:**
A snapshot is a plain JavaScript object copy of a class instance's current state.
Because WebSockets can only transmit plain data (not class instances with methods),
each class exposes a `snapshot()` method that returns only the data, ready to send.

**Where the idea came from:**
Prior coursework used APIs to send data but did not deal with the difference
between a live class object and data-safe representations of it. The challenge
was: how do you send a `Drone` object over a WebSocket connection when WebSocket
cannot serialize class methods?

**How it was researched and applied:**
Researched the concept of data transfer objects (DTO) and serialization boundaries
in full-stack applications. Applied it as a `snapshot()` method on every class
that returns a typed plain object matching the snapshot interfaces defined in
`src/types/index.ts`. Position objects are spread (`{ ...this.position }`) to
avoid sending a reference to internal data.

**Where it appears in the project:**
`src/classes/Drone.ts`, `src/classes/Sensor.ts`, `src/classes/ChargingStation.ts`,
`src/classes/Geofence.ts` — each `snapshot()` method.

---

### 5. TypeScript `import type`

**What it is:**
`import type` is a TypeScript-only import that brings in a type or interface for
use in type annotations, but is completely erased at compile time. It leaves no
trace in the compiled JavaScript output.

**Where the idea came from:**
Prior coursework used regular imports. The question was: if a class only needs
a type for its TypeScript annotations and not an actual value at runtime, is there
a cleaner way to import it?

**How it was researched and applied:**
Researched TypeScript's `import type` syntax and when to use it versus a standard
import. Applied it in every class file — since the classes only need `Position`,
`DroneState`, etc. for type checking and not as runtime values, `import type`
keeps the compiled output clean and signals intent clearly to anyone reading the code.

**Where it appears in the project:**
`src/classes/Drone.ts`, `src/classes/Sensor.ts`, `src/classes/ChargingStation.ts`,
`src/classes/Geofence.ts` — top of each file.

---

## Step 3 — Mission Assignment, Simulation Loop, and Real-Time Server

---

### 6. Centralized Tick Orchestration (Simulator / Mediator Pattern)

**What it is:**
Step 2 gave individual classes their own `tick()` method (a drone drains its own
battery, a sensor counts down its own cooldown). A centralized orchestrator goes
further — one class ticks every entity in a fixed order each cycle, then reacts
to the combined result (a drone that just finished responding gets routed home,
a newly triggered sensor gets dispatched a drone). No single class knows about
this coordination; it lives entirely in the orchestrator.

**Where the idea came from:**
Prior coursework covered simulating a single object's behavior over time, not
coordinating many independent objects that need to react to each other's state
changes on the same clock. The problem was: how do you keep every entity's state
consistent within one simulation cycle without objects directly calling into
each other?

**How it was researched and applied:**
Researched the mediator pattern — a design where objects don't reference each
other directly, but instead a central coordinator reads their state and issues
commands. Applied it in `Simulator.tick()`: it ticks every drone, sensor, and
in-progress service queue, then runs two coordination passes (complete/route
home responding drones past their response window, release fully-charged
drones) before dispatching any newly triggered sensors through the
`MissionEngine`. Drones and sensors never reference the `Simulator` or each
other.

**Source:**
Refactoring.Guru — Mediator Design Pattern — conceptual reference for
centralizing object coordination behind one orchestrator instead of letting
objects reference each other directly.

**Where it appears in the project:**
`src/classes/Simulator.ts` — `tick()`, `advanceResponses()`, `releaseCharged()`,
`dispatchNewMissions()`.

---

### 7. Express.js HTTP Server

**What it is:**
Express is a minimal Node.js web framework for defining HTTP routes (e.g.
`GET /health`) and handling requests/responses without writing raw Node `http`
module boilerplate for routing.

**Where the idea came from:**
Prior coursework did not cover building or exposing a backend server — only
consuming existing APIs. The problem was: how does a browser-based dashboard
(Phase 3) get simulation data out of a Node.js process running the simulation?

**How it was researched and applied:**
Researched Express's routing and middleware model as the standard, widely
documented choice for a Node/TypeScript backend. Applied it as a small set of
routes (`/health`, `/api/state`) sitting on top of the same Node `http` server
instance that Socket.io attaches to, so both HTTP requests and WebSocket
connections share one listening port.

**Source:**
Express.js Official Documentation (expressjs.com) — routing, middleware, and
attaching Express to an existing Node `http.Server` instance.

**Where it appears in the project:**
`src/server/index.ts`.

---

### 8. Socket.io Real-Time Broadcast

**What it is:**
Socket.io is a library built on top of WebSockets that adds automatic
reconnection, an event-based send/receive API, and room-based broadcasting
(sending the same message to every connected client at once) without manually
managing raw socket connections.

**Where the idea came from:**
Already identified during the proposal phase as the tool for pushing live
simulation state to a future dashboard without the dashboard needing to poll
the server on a timer. The problem, once actually building it: how does the
server send an updated snapshot to every connected browser the instant the
simulation state changes, not just when a browser asks?

**How it was researched and applied:**
Researched Socket.io's server API — attaching it to an existing `http.Server`
instance, emitting named events, and broadcasting to all connected clients with
a single `io.emit()` call. Applied it so that every simulation tick, the server
builds one snapshot object and emits it to every connected client at once; a
newly connecting client also immediately receives the current snapshot instead
of waiting for the next tick.

**Source:**
Socket.io Official Documentation — event-driven communication model, room
broadcasting, and connection lifecycle management. Same source cited in the
README's Independent Research section for the original tool selection; this
entry documents how it was actually applied in code.

**Where it appears in the project:**
`src/server/index.ts` — `io.on('connection', ...)`, `io.emit('state', ...)`.

---

### 9. Environment-Based Configuration (dotenv)

**What it is:**
Instead of hard-coding values like a server's port number directly in source
code, `dotenv` loads key/value pairs from a `.env` file into `process.env` at
startup, so configuration can change per environment (local machine, grading
environment, future deployment) without editing code.

**Where the idea came from:**
Prior coursework did not separate configuration from code — scripts ran with
fixed values. The problem: a hard-coded port number (or simulation tick speed)
means anyone running the project has to edit source code just to change it.

**How it was researched and applied:**
Researched the standard `dotenv` pattern of a git-ignored `.env` file for real
values and a committed `.env.example` documenting what variables exist.
Applied it for `PORT` and `TICK_INTERVAL_MS`, both read from `process.env` with
sensible fallback defaults if no `.env` file is present.

**Source:**
dotenv package documentation (npmjs.com/package/dotenv, github.com/motdotla/dotenv)
— `.env` file convention, `.env.example` as a committed template, and loading
values into `process.env` at process startup.

**Where it appears in the project:**
`src/server/index.ts` (`import 'dotenv/config'`), `.env.example`.

---
*Entries will be added after each completed project step.*
