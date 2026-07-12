import { Drone } from './classes/Drone';
import { Geofence } from './classes/Geofence';
import { Sensor } from './classes/Sensor';
import { MissionEngine } from './classes/MissionEngine';

console.log('=== MissionEngine Test ===\n');

const outdoorZone = new Geofence('zone-outdoor', 'North Perimeter', 'patrol', 'outdoor', [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
]);

const indoorZone = new Geofence('zone-indoor', 'Warehouse Floor', 'restricted', 'indoor', [
  { x: 200, y: 0 },
  { x: 300, y: 0 },
  { x: 300, y: 100 },
  { x: 200, y: 100 },
]);

const near = new Drone('drone-near', 'Alpha-Near', 'A', { x: 10, y: 10 }, 'station-01');
const far = new Drone('drone-far', 'Alpha-Far', 'A', { x: 90, y: 90 }, 'station-01');
const indoorDrone = new Drone('drone-indoor', 'Bravo-1', 'B', { x: 210, y: 10 }, 'station-02');
const lowBattery = new Drone('drone-low', 'Alpha-Low', 'A', { x: 12, y: 12 }, 'station-01');
for (let i = 0; i < 85; i++) lowBattery.tick(); // drain below LOW_BATTERY threshold

const drones = [near, far, indoorDrone, lowBattery];
const geofences = [outdoorZone, indoorZone];
const engine = new MissionEngine(drones, geofences);

// Case 1 — outdoor sensor picks the nearest Class A drone, skipping the low-battery one
const outdoorSensor = new Sensor('sensor-outdoor', { x: 15, y: 15 });
outdoorSensor.trigger(Date.now());
const assigned1 = engine.assignMission(outdoorSensor);
console.log(`Case 1 — outdoor sensor assigned: ${assigned1 ? assigned1.name : 'none'} (expected: Alpha-Near)`);
console.log(`  Low-battery drone still idle: ${lowBattery.getState() === 'idle'} (expected: true, skipped)\n`);

// Case 2 — sensor outside any geofence gets no assignment
const strayCandidateSensor = new Sensor('sensor-stray', { x: 500, y: 500 });
strayCandidateSensor.trigger(Date.now());
const assigned2 = engine.assignMission(strayCandidateSensor);
console.log(`Case 2 — sensor outside all zones assigned: ${assigned2 ? assigned2.name : 'none'} (expected: none)\n`);

// Case 3 — indoor sensor picks the Class B drone, not the (busy) Class A ones
const indoorSensor = new Sensor('sensor-indoor', { x: 220, y: 20 });
indoorSensor.trigger(Date.now());
const assigned3 = engine.assignMission(indoorSensor);
console.log(`Case 3 — indoor sensor assigned: ${assigned3 ? assigned3.name : 'none'} (expected: Bravo-1)\n`);

// Case 4 — no remaining available drone of the required class
const secondOutdoorSensor = new Sensor('sensor-outdoor-2', { x: 50, y: 50 });
secondOutdoorSensor.trigger(Date.now());
const assigned4 = engine.assignMission(secondOutdoorSensor);
console.log(`Case 4 — second outdoor sensor (Alpha-Near now busy, Alpha-Far should respond): ${assigned4 ? assigned4.name : 'none'} (expected: Alpha-Far)`);

const thirdOutdoorSensor = new Sensor('sensor-outdoor-3', { x: 60, y: 60 });
thirdOutdoorSensor.trigger(Date.now());
const assigned5 = engine.assignMission(thirdOutdoorSensor);
console.log(`Case 5 — third outdoor sensor (all Class A busy or low battery): ${assigned5 ? assigned5.name : 'none'} (expected: none)`);

console.log('\n=== MissionEngine test complete ===');
