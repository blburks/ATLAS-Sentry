import type { Position, ServiceTask, ServiceTaskType, ServiceStationSnapshot } from '../types/index';
import { ChargingStation } from './ChargingStation';

// Fixed duration of each maintenance job, in simulation ticks
const TASK_DURATIONS: Record<ServiceTaskType, number> = {
  recharge: 5,
  lens_clean: 2,
  retardant_refill: 3,
  systems_check: 1,
};

// The order every drone's service queue runs in
const TASK_ORDER: ServiceTaskType[] = ['recharge', 'lens_clean', 'retardant_refill', 'systems_check'];

export class ServiceStation extends ChargingStation {
  private assignedDroneIds: Set<string>;
  private serviceQueues: Map<string, ServiceTask[]>;

  constructor(id: string, position: Position, capacity: number = 2, assignedDroneIds: string[] = []) {
    super(id, position, capacity);
    this.assignedDroneIds = new Set(assignedDroneIds);
    this.serviceQueues = new Map();
  }

  isAssigned(droneId: string): boolean {
    return this.assignedDroneIds.has(droneId);
  }

  getAssignedDroneIds(): string[] {
    return Array.from(this.assignedDroneIds);
  }

  // Begins the service cycle for a docked, roster-assigned drone.
  // Returns false instead of throwing, matching ChargingStation.dockDrone().
  startService(droneId: string): boolean {
    if (!this.isAssigned(droneId)) return false;
    if (!this.getDockedDroneIds().includes(droneId)) return false;
    if (this.serviceQueues.has(droneId)) return false;

    const queue: ServiceTask[] = TASK_ORDER.map((type) => ({
      type,
      ticksRequired: TASK_DURATIONS[type],
      ticksElapsed: 0,
    }));
    this.serviceQueues.set(droneId, queue);
    return true;
  }

  // Advances every active service queue by one tick
  tick(): void {
    for (const [droneId, queue] of this.serviceQueues) {
      const currentTask = queue.find((task) => task.ticksElapsed < task.ticksRequired);
      if (!currentTask) continue;
      currentTask.ticksElapsed += 1;
    }
  }

  // Marks a drone's service cycle finished once every task is complete.
  // Does not release the dock — that remains a separate, explicit step.
  completeService(droneId: string): boolean {
    const queue = this.serviceQueues.get(droneId);
    if (!queue) return false;
    const allDone = queue.every((task) => task.ticksElapsed >= task.ticksRequired);
    if (!allDone) return false;
    this.serviceQueues.delete(droneId);
    return true;
  }

  isInService(droneId: string): boolean {
    return this.serviceQueues.has(droneId);
  }

  getServiceQueue(droneId: string): ServiceTask[] | undefined {
    return this.serviceQueues.get(droneId);
  }

  snapshot(): ServiceStationSnapshot {
    const base = super.snapshot();
    const activeServices = Array.from(this.serviceQueues.entries()).map(([droneId, queue]) => {
      const currentTask = queue.find((task) => task.ticksElapsed < task.ticksRequired);
      const tasksRemaining = queue.filter((task) => task.ticksElapsed < task.ticksRequired).length;
      return {
        droneId,
        currentTask: currentTask ? currentTask.type : null,
        tasksRemaining,
      };
    });

    return {
      ...base,
      assignedDroneIds: this.getAssignedDroneIds(),
      activeServices,
    };
  }
}
