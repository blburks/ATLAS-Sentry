import type { Position, StationSnapshot } from '../types/index';

export class ChargingStation {
  readonly id: string;

  private position: Position;
  private capacity: number;
  private dockedDroneIds: Set<string>;

  constructor(id: string, position: Position, capacity: number = 2) {
    this.id = id;
    this.position = position;
    this.capacity = capacity;
    this.dockedDroneIds = new Set();
  }

  // Docks a drone if there is an open slot — returns true if successful
  dockDrone(droneId: string): boolean {
    if (this.isFull()) return false;
    this.dockedDroneIds.add(droneId);
    return true;
  }

  // Releases a drone from the station when it finishes charging
  releaseDrone(droneId: string): void {
    this.dockedDroneIds.delete(droneId);
  }

  isFull(): boolean {
    return this.dockedDroneIds.size >= this.capacity;
  }

  hasAvailableSlot(): boolean {
    return !this.isFull();
  }

  getPosition(): Position {
    return this.position;
  }

  getDockedDroneIds(): string[] {
    return Array.from(this.dockedDroneIds);
  }

  snapshot(): StationSnapshot {
    return {
      id: this.id,
      position: { ...this.position },
      dockedCount: this.dockedDroneIds.size,
      capacity: this.capacity,
    };
  }
}
