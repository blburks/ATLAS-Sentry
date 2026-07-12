import { ServiceStation } from './classes/ServiceStation';

console.log('=== ServiceStation Test ===\n');

// Step 1 — Create a service station with an assigned roster
const station = new ServiceStation('service-01', { x: 0, y: 0 }, 2, ['drone-01']);
console.log(`Station created: ${station.id}`);
console.log(`Assigned roster: ${station.getAssignedDroneIds().join(', ')}`);
console.log(`Is 'drone-01' assigned: ${station.isAssigned('drone-01')}`);
console.log(`Is 'drone-99' assigned: ${station.isAssigned('drone-99')}\n`);

// Step 2 — Reject starting service before the drone is docked
console.log(`Start service before docking: ${station.startService('drone-01')}`);

// Step 3 — Dock the drone, then start service
const docked = station.dockDrone('drone-01');
console.log(`Docked successfully: ${docked}`);
const started = station.startService('drone-01');
console.log(`Service started: ${started}`);
console.log(`Is in service: ${station.isInService('drone-01')}\n`);

// Step 4 — Reject starting service for a non-roster drone
station.dockDrone('drone-99');
console.log(`Start service for non-roster drone: ${station.startService('drone-99')}\n`);

// Step 5 — Tick through the full service queue
console.log('Running ticks...');
let ticks = 0;
while (station.isInService('drone-01')) {
  station.tick();
  ticks++;
  const queue = station.getServiceQueue('drone-01');
  const current = queue?.find((t) => t.ticksElapsed < t.ticksRequired);
  console.log(`  Tick ${ticks} — current task: ${current ? current.type : 'none (queue complete)'}`);

  if (!current) {
    const completed = station.completeService('drone-01');
    console.log(`  All tasks done — completeService() returned: ${completed}`);
  }
}
console.log(`Service finished in ${ticks} ticks\n`);

// Step 6 — Confirm the drone is still docked after service, and release it
console.log(`Is in service after completion: ${station.isInService('drone-01')}`);
console.log(`Still docked: ${station.getDockedDroneIds().includes('drone-01')}`);
station.releaseDrone('drone-01');
console.log(`Docked after release: ${station.getDockedDroneIds().includes('drone-01')}\n`);

// Step 7 — Snapshot shape
console.log('Snapshot:', JSON.stringify(station.snapshot(), null, 2));

console.log('\n=== ServiceStation test complete ===');
