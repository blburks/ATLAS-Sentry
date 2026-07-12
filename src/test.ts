import { Drone } from './classes/Drone';
import { ChargingStation } from './classes/ChargingStation';
import { Sensor } from './classes/Sensor';
import { Geofence } from './classes/Geofence';

console.log('=== ATLAS-Sentry System Test ===\n');

// Step 1 — Create a charging station
const station = new ChargingStation('station-01', { x: 0, y: 0 }, 2);
console.log(`Station created: ${station.id}`);
console.log(`Position: (${station.getPosition().x}, ${station.getPosition().y})`);
console.log(`Capacity: ${station.getDockedDroneIds().length} / 2 drones docked\n`);

// Step 2 — Create a drone assigned to that station
const drone = new Drone('drone-01', 'Alpha-1', 'A', { x: 10, y: 10 }, station.id);
console.log(`Drone created: ${drone.name}`);
console.log(`State: ${drone.getState()}`);
console.log(`Battery: ${drone.getBattery()}%\n`);

// Step 3 — Create a geofence zone
const zone = new Geofence('zone-01', 'North Perimeter', 'patrol', [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
]);
console.log(`Geofence created: ${zone.name} (${zone.type})`);
console.log(`Contains point (50, 50): ${zone.contains({ x: 50, y: 50 })}`);
console.log(`Contains point (200, 200): ${zone.contains({ x: 200, y: 200 })}\n`);

// Step 4 — Create a sensor and trigger it
const sensor = new Sensor('sensor-01', { x: 55, y: 60 });
console.log(`Sensor created: ${sensor.id}`);
console.log(`State: ${sensor.getState()}`);

const triggered = sensor.trigger(Date.now());
console.log(`Triggered: ${triggered}`);
console.log(`State after trigger: ${sensor.getState()}\n`);

// Step 5 — Assign the drone a mission based on the sensor position
const mission = {
  sensorId: sensor.id,
  targetPosition: sensor.getPosition(),
  assignedAt: Date.now(),
};
drone.assignMission(mission);
console.log(`Mission assigned to ${drone.name}`);
console.log(`State: ${drone.getState()}`);
console.log(`Target: (${mission.targetPosition.x}, ${mission.targetPosition.y})\n`);

// Step 6 — Run 5 ticks to drain battery
console.log('Running 5 ticks...');
for (let i = 1; i <= 5; i++) {
  drone.tick();
  console.log(`  Tick ${i} — Battery: ${drone.getBattery()}%`);
}
console.log();

// Step 7 — Complete the mission
drone.completeMission();
console.log(`Mission complete — State: ${drone.getState()}`);

// Put sensor into cooldown
sensor.startCooldown();
console.log(`Sensor state: ${sensor.getState()}\n`);

// Step 8 — Dock the drone at its station
drone.returnToStation();
const docked = station.dockDrone(drone.id);
console.log(`Drone returning to station — State: ${drone.getState()}`);
console.log(`Docked successfully: ${docked}`);
console.log(`Station docked count: ${station.getDockedDroneIds().length} / 2\n`);

// Step 9 — Charge until full
console.log('Charging...');
let chargeTicks = 0;
while (drone.getBattery() < 100) {
  drone.tick();
  chargeTicks++;
  if (chargeTicks % 5 === 0) {
    console.log(`  Tick ${chargeTicks} — Battery: ${drone.getBattery()}%`);
  }
}
console.log(`  Full charge reached in ${chargeTicks} ticks\n`);

// Step 10 — Release the drone back to idle
drone.finishCharging();
station.releaseDrone(drone.id);
console.log(`Drone released — State: ${drone.getState()}`);
console.log(`Battery: ${drone.getBattery()}%`);
console.log(`Station docked count: ${station.getDockedDroneIds().length} / 2`);

console.log('\n=== All systems operational ===');
