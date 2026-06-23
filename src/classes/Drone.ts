import type { DroneState, Mission, Position, DroneSnapshot } from '../types/index';

// Valid state transitions — a drone can only move between states in defined ways
const ALLOWED_TRANSITIONS: Record<DroneState, DroneState[]> = {
  idle:       ['patrolling', 'responding', 'charging'],
  patrolling: ['idle', 'responding', 'returning'],
  responding: ['returning', 'idle'],
  returning:  ['charging', 'idle'],
  charging:   ['idle'],
};

export class Drone {
  readonly id: string;
  readonly name: string;

  private state: DroneState;
  private battery: number;           // 0–100
  private position: Position;
  private mission: Mission | null;
  private homeStationId: string;

  // Battery thresholds that drive autonomous decisions
  static readonly LOW_BATTERY = 20;
  static readonly FULL_BATTERY = 100;
  static readonly DRAIN_PER_TICK = 1;    // battery lost each simulation tick
  static readonly CHARGE_PER_TICK = 5;   // battery gained while docked

  constructor(id: string, name: string, startPosition: Position, homeStationId: string) {
    this.id = id;
    this.name = name;
    this.state = 'idle';
    this.battery = Drone.FULL_BATTERY;
    this.position = startPosition;
    this.mission = null;
    this.homeStationId = homeStationId;
  }

  // Transitions the drone to a new state, enforcing valid paths
  private transition(next: DroneState): void {
    const allowed = ALLOWED_TRANSITIONS[this.state];
    if (!allowed.includes(next)) {
      throw new Error(`Invalid transition: ${this.state} → ${next} for drone ${this.id}`);
    }
    this.state = next;
  }

  startPatrol(destination: Position): void {
    this.transition('patrolling');
    this.position = destination;
  }

  assignMission(mission: Mission): void {
    this.mission = mission;
    this.transition('responding');
    this.position = mission.targetPosition;
  }

  completeMission(): void {
    this.mission = null;
    this.transition('returning');
  }

  returnToStation(): void {
    this.transition('charging');
  }

  finishCharging(): void {
    this.transition('idle');
  }

  // Called every simulation tick — drains battery or charges depending on state
  tick(): void {
    if (this.state === 'charging') {
      this.battery = Math.min(Drone.FULL_BATTERY, this.battery + Drone.CHARGE_PER_TICK);
    } else {
      this.battery = Math.max(0, this.battery - Drone.DRAIN_PER_TICK);
    }
  }

  needsCharge(): boolean {
    return this.battery <= Drone.LOW_BATTERY;
  }

  isAvailable(): boolean {
    return this.state === 'idle' || this.state === 'patrolling';
  }

  getHomeStationId(): string {
    return this.homeStationId;
  }

  getState(): DroneState {
    return this.state;
  }

  getBattery(): number {
    return this.battery;
  }

  getPosition(): Position {
    return this.position;
  }

  // Returns a plain object snapshot safe to send over WebSocket
  snapshot(): DroneSnapshot {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
      battery: this.battery,
      position: { ...this.position },
      mission: this.mission,
    };
  }
}
