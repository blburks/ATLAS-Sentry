import type { SensorState, Position, SensorSnapshot } from '../types/index';

// How long (in simulation ticks) a sensor stays in cooldown after triggering
const COOLDOWN_TICKS = 10;

export class Sensor {
  readonly id: string;

  private state: SensorState;
  private position: Position;
  private lastTriggered: number | null;
  private cooldownTicksRemaining: number;

  constructor(id: string, position: Position) {
    this.id = id;
    this.state = 'active';
    this.position = position;
    this.lastTriggered = null;
    this.cooldownTicksRemaining = 0;
  }

  // Triggers the sensor — only possible when active
  trigger(timestamp: number): boolean {
    if (this.state !== 'active') return false;

    this.state = 'triggered';
    this.lastTriggered = timestamp;
    return true;
  }

  // Moves sensor into cooldown — called after the system has handled the trigger
  startCooldown(): void {
    this.state = 'cooldown';
    this.cooldownTicksRemaining = COOLDOWN_TICKS;
  }

  // Called every simulation tick — counts down cooldown and resets when done
  tick(): void {
    if (this.state === 'cooldown') {
      this.cooldownTicksRemaining -= 1;
      if (this.cooldownTicksRemaining <= 0) {
        this.state = 'active';
        this.cooldownTicksRemaining = 0;
      }
    }
  }

  isActive(): boolean {
    return this.state === 'active';
  }

  getPosition(): Position {
    return this.position;
  }

  getState(): SensorState {
    return this.state;
  }

  snapshot(): SensorSnapshot {
    return {
      id: this.id,
      position: { ...this.position },
      state: this.state,
      lastTriggered: this.lastTriggered,
    };
  }
}
