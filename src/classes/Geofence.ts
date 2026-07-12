import type { Position, GeofenceEnvironment, GeofenceSnapshot } from '../types/index';

export class Geofence {
  readonly id: string;
  readonly name: string;
  readonly type: 'patrol' | 'restricted';
  readonly environment: GeofenceEnvironment;

  private boundary: Position[];

  constructor(
    id: string,
    name: string,
    type: 'patrol' | 'restricted',
    environment: GeofenceEnvironment,
    boundary: Position[]
  ) {
    if (boundary.length < 3) {
      throw new Error(`Geofence ${id} requires at least 3 points to form a boundary`);
    }
    this.id = id;
    this.name = name;
    this.type = type;
    this.environment = environment;
    this.boundary = boundary;
  }

  // Ray casting algorithm — fires an imaginary ray from the point and counts
  // how many times it crosses the boundary polygon edges.
  // Odd crossings = inside, even crossings = outside.
  contains(point: Position): boolean {
    const { x, y } = point;
    const vertices = this.boundary;
    let inside = false;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i]!.x;
      const yi = vertices[i]!.y;
      const xj = vertices[j]!.x;
      const yj = vertices[j]!.y;

      const intersects =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersects) inside = !inside;
    }

    return inside;
  }

  getBoundary(): Position[] {
    return this.boundary;
  }

  snapshot(): GeofenceSnapshot {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      environment: this.environment,
      boundary: this.boundary.map(p => ({ ...p })),
    };
  }
}
