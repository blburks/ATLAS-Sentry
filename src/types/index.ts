// Defines the valid states a drone can be in at any point in time
export type DroneState =
  | 'idle'
  | 'patrolling'
  | 'responding'
  | 'returning'
  | 'charging';

// Deployment class — determines which geofence zones a drone can be dispatched to.
// Class C and D are Tier 3 and do not exist in code yet.
export type DroneClass = 'A' | 'B';

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
  droneClass: DroneClass;
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

// The maintenance jobs a ServiceStation runs on a docked drone
export type ServiceTaskType =
  | 'recharge'
  | 'lens_clean'
  | 'retardant_refill'
  | 'systems_check';

// A single maintenance job within a drone's service queue
export interface ServiceTask {
  type: ServiceTaskType;
  ticksRequired: number;
  ticksElapsed: number;
}

// Per-drone service status included in a ServiceStation snapshot
export interface ActiveServiceStatus {
  droneId: string;
  currentTask: ServiceTaskType | null;
  tasksRemaining: number;
}

// The data snapshot sent to the frontend for a service station
export interface ServiceStationSnapshot extends StationSnapshot {
  assignedDroneIds: string[];
  activeServices: ActiveServiceStatus[];
}

// Which drone class a geofence zone is built for — separate from `type`,
// which describes the response policy (patrol vs. restricted), not the environment.
export type GeofenceEnvironment = 'outdoor' | 'indoor';

// The data snapshot sent to the frontend for a geofence zone
export interface GeofenceSnapshot {
  id: string;
  name: string;
  type: 'patrol' | 'restricted';
  environment: GeofenceEnvironment;
  boundary: Position[];
}
