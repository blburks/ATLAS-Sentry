// Defines the valid states a drone can be in at any point in time
export type DroneState =
  | 'idle'
  | 'patrolling'
  | 'responding'
  | 'returning'
  | 'charging';

// Defines the valid states a motion sensor can be in
export type SensorState = 'active' | 'triggered' | 'cooldown';

// A coordinate on the simulation grid
export interface Position {
  x: number;
  y: number;
}

// Represents an active mission assigned to a drone
export interface Mission {
  sensorId: string;
  targetPosition: Position;
  assignedAt: number;
}

// The data snapshot sent to the frontend for a single drone
export interface DroneSnapshot {
  id: string;
  name: string;
  state: DroneState;
  battery: number;
  position: Position;
  mission: Mission | null;
}

// The data snapshot sent to the frontend for a single sensor
export interface SensorSnapshot {
  id: string;
  position: Position;
  state: SensorState;
  lastTriggered: number | null;
}

// The data snapshot sent to the frontend for a charging station
export interface StationSnapshot {
  id: string;
  position: Position;
  dockedCount: number;
  capacity: number;
}

// The data snapshot sent to the frontend for a geofence zone
export interface GeofenceSnapshot {
  id: string;
  name: string;
  type: 'patrol' | 'restricted';
  boundary: Position[];
}
