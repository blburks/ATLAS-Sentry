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
*Entries will be added after each completed project step.*
