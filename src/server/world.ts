import { Drone } from '../classes/Drone';
import { Sensor } from '../classes/Sensor';
import { ChargingStation } from '../classes/ChargingStation';
import { Geofence } from '../classes/Geofence';
import { MissionEngine } from '../classes/MissionEngine';
import { Simulator } from '../classes/Simulator';

// A small, hard-coded starting world — one station, one drone, one outdoor
// zone, one sensor. Matches the same setup used in the manual test scripts.
// A future step could load this from config instead of hard-coding it here.

const station = new ChargingStation('station-01', { x: 0, y: 0 }, 2);
const drone = new Drone('drone-01', 'Alpha-1', 'A', { x: 5, y: 5 }, station.id);
const zone = new Geofence('zone-01', 'North Perimeter', 'patrol', 'outdoor', [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
]);
const sensor = new Sensor('sensor-01', { x: 20, y: 20 });

export const drones = [drone];
export const sensors = [sensor];
export const stations: ChargingStation[] = [station];
export const geofences = [zone];

export const missionEngine = new MissionEngine(drones, geofences);
export const simulator = new Simulator(drones, sensors, stations, missionEngine);

export function worldSnapshot() {
  return {
    tick: simulator.getTickCount(),
    drones: drones.map((d) => d.snapshot()),
    sensors: sensors.map((s) => s.snapshot()),
    stations: stations.map((s) => s.snapshot()),
    geofences: geofences.map((g) => g.snapshot()),
  };
}
