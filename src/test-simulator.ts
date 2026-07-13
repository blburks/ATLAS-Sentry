import { Drone } from './classes/Drone';
import { ChargingStation } from './classes/ChargingStation';
import { Sensor } from './classes/Sensor';
import { Geofence } from './classes/Geofence';
import { MissionEngine } from './classes/MissionEngine';
import { Simulator } from './classes/Simulator';

console.log('=== Simulator Test — full autonomous cycle ===\n');

const station = new ChargingStation('station-01', { x: 0, y: 0 }, 2);
const drone = new Drone('drone-01', 'Alpha-1', 'A', { x: 5, y: 5 }, station.id);
const zone = new Geofence('zone-01', 'North Perimeter', 'patrol', 'outdoor', [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
]);
const sensor = new Sensor('sensor-01', { x: 20, y: 20 });

const drones = [drone];
const sensors = [sensor];
const stations = [station];
const engine = new MissionEngine(drones, [zone]);
const sim = new Simulator(drones, sensors, stations, engine);

console.log(`Initial — drone: ${drone.getState()}, sensor: ${sensor.getState()}\n`);

sensor.trigger(Date.now());
console.log(`Sensor triggered — state: ${sensor.getState()}\n`);

console.log('Running ticks...');
for (let i = 1; i <= 25; i++) {
  sim.tick();
  console.log(
    `  Tick ${i} — drone: ${drone.getState()} (battery ${drone.getBattery()}%), ` +
    `docked: ${station.getDockedDroneIds().includes(drone.id)}, sensor: ${sensor.getState()}`
  );

  // Re-trigger the sensor mid-cycle to confirm no double-dispatch while already assigned
  if (i === 2) {
    const reTriggered = sensor.trigger(Date.now());
    console.log(`    (attempted re-trigger while already triggered: ${reTriggered})`);
  }
}

console.log(`\nFinal — drone: ${drone.getState()}, battery: ${drone.getBattery()}%, sensor: ${sensor.getState()}`);
console.log(`Total ticks run: ${sim.getTickCount()}`);
console.log('\n=== Simulator test complete ===');
