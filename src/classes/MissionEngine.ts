import type { DroneClass, GeofenceEnvironment, Mission, Position } from '../types/index';
import type { Drone } from './Drone';
import type { Geofence } from './Geofence';
import type { Sensor } from './Sensor';

function distance(a: Position, b: Position): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function requiredClassFor(environment: GeofenceEnvironment): DroneClass {
  return environment === 'outdoor' ? 'A' : 'B';
}

export class MissionEngine {
  private drones: Drone[];
  private geofences: Geofence[];

  constructor(drones: Drone[], geofences: Geofence[]) {
    this.drones = drones;
    this.geofences = geofences;
  }

  // Finds the first geofence zone that contains a given position, if any.
  // Overlapping zones are not resolved here — first match wins.
  findZone(position: Position): Geofence | null {
    return this.geofences.find((zone) => zone.contains(position)) ?? null;
  }

  // Evaluates all drones and dispatches the nearest available match to a triggered sensor.
  // Returns the assigned drone, or null if no zone covers the sensor or no drone qualifies.
  assignMission(sensor: Sensor): Drone | null {
    const zone = this.findZone(sensor.getPosition());
    if (!zone) return null;

    const requiredClass = requiredClassFor(zone.environment);

    const candidates = this.drones.filter(
      (drone) =>
        drone.isAvailable() &&
        drone.droneClass === requiredClass &&
        !drone.needsCharge()
    );

    if (candidates.length === 0) return null;

    const target = sensor.getPosition();
    const best = candidates.reduce((nearest, drone) =>
      distance(drone.getPosition(), target) < distance(nearest.getPosition(), target) ? drone : nearest
    );

    const mission: Mission = {
      sensorId: sensor.id,
      targetPosition: target,
      assignedAt: Date.now(),
    };
    best.assignMission(mission);
    return best;
  }
}
