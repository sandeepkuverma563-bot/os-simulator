/**
 * Round Robin (RR) - Preemptive with configurable time quantum.
 * Each ready process gets a CPU slice of at most `quantum` time units, cyclically.
 */
function rr(processes, quantum = 2) {
  const remaining = processes.map((p) => ({ ...p, remaining: p.burstTime }));
  const timeline = [];
  let currentTime = 0;
  const queue = [];
  const enqueued = new Set();
  let completed = 0;
  const n = processes.length;

  const sorted = [...remaining].sort((a, b) => a.arrivalTime - b.arrivalTime);

  sorted
    .filter((p) => p.arrivalTime <= currentTime)
    .forEach((p) => {
      queue.push(p.pid);
      enqueued.add(p.pid);
    });

  while (completed < n) {
    if (queue.length === 0) {
      const notDone = sorted.filter((p) => p.remaining > 0 && !enqueued.has(p.pid));
      if (notDone.length === 0) break;
      currentTime = notDone[0].arrivalTime;
      notDone
        .filter((p) => p.arrivalTime <= currentTime)
        .forEach((p) => {
          queue.push(p.pid);
          enqueued.add(p.pid);
        });
      continue;
    }

    const pid = queue.shift();
    const proc = remaining.find((p) => p.pid === pid);

    const execTime = Math.min(quantum, proc.remaining);
    const start = currentTime;
    const end = currentTime + execTime;

    timeline.push({ pid, start, end });

    proc.remaining -= execTime;
    currentTime = end;

    sorted
      .filter((p) => p.arrivalTime > start && p.arrivalTime <= currentTime && !enqueued.has(p.pid))
      .forEach((p) => {
        queue.push(p.pid);
        enqueued.add(p.pid);
      });

    if (proc.remaining > 0) {
      queue.push(pid);
    } else {
      completed++;
    }
  }

  return timeline;
}

module.exports = { rr };
