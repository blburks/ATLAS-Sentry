import { Drone } from './Drone';
import { ServiceStation } from './ServiceStation';
import type { ChargingStation } from './ChargingStation';
import type { Sensor } from './Sensor';
import type { MissionEngine } from './MissionEngine';

// Ticks a drone spends "responding" before it automatically heads home.
// A fixed duration, matching how battery drain/charge and service tasks
// already advance on a per-tick basis elsewhere in this codebase.
const RESPONSE_DURATION_TICKS = 5;

export class Simulator {
  private drones: Drone[];
  private sensors: Sensor[];
  private stations: ChargingStation[];
  private missionEngine: MissionEngine;

  private responseTicksElapsed: Map<string, number>;
  private activeSensorMissions: Set<string>;
  private tickCount: number;

  constructor(drones: Drone[], sensors: Sensor[], stations: ChargingStation[], missionEngine: MissionEngine) {
    this.drones = drones;
    this.sensors = sensors;
    this.stations = stations;
    this.missionEngine = missionEngine;
    this.responseTicksElapsed = new Map();
    this.activeSensorMissions = new Set();
    this.tickCount = 0;
  }

  // Advances the entire simulation by one cycle
  tick(): void {
    this.tickCount += 1;

    for (const drone of this.drones) drone.tick();
    for (const sensor of this.sensors) sensor.tick();
    for (const station of this.stations) {
      if (station instanceof ServiceStation) station.tick();
    }

    this.advanceResponses();
    this.releaseCharged();
    this.dispatchNewMissions();
  }

  getTickCount(): number {
    return this.tickCount;
  }

  // Sends any triggered sensor without an active mission to the MissionEngine
  private dispatchNewMissions(): void {
    for (const sensor of this.sensors) {
      if (sensor.getState() !== 'triggered') continue;
      if (this.activeSensorMissions.has(sensor.id)) continue;

      const assigned = this.missionEngine.assignMission(sensor);
      if (assigned) {
        this.activeSensorMissions.add(sensor.id);
      }
    }
  }

  // Completes and routes home any drone that has finished its response window
  private advanceResponses(): void {
    for (const drone of this.drones) {
      if (drone.getState() !== 'responding') continue;

      const elapsed = (this.responseTicksElapsed.get(drone.id) ?? 0) + 1;
      this.responseTicksElapsed.set(drone.id, elapsed);
      if (elapsed < RESPONSE_DURATION_TICKS) continue;

      const mission = drone.getMission();
      drone.completeMission();
      this.responseTicksElapsed.delete(drone.id);

      if (mission) {
        this.activeSensorMissions.delete(mission.sensorId);
        const sensor = this.sensors.find((s) => s.id === mission.sensorId);
        sensor?.startCooldown();
      }

      drone.returnToStation();
      const homeStation = this.stations.find((s) => s.id === drone.getHomeStationId());
      homeStation?.dockDrone(drone.id);
    }
  }

  // Releases any docked, fully-charged drone back to idle
  private releaseCharged(): void {
    for (const drone of this.drones) {
      if (drone.getState() !== 'charging') continue;
      if (drone.getBattery() < Drone.FULL_BATTERY) continue;

      drone.finishCharging();
      const homeStation = this.stations.find((s) => s.id === drone.getHomeStationId());
      homeStation?.releaseDrone(drone.id);
    }
  }
}
