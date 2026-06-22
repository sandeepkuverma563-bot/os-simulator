/**
 * Priority Scheduling - Non Preemptive
 * Lower priority number = higher priority.
 * At each decision point, picks the available process with the highest priority.
 */
function priority(processes) {
  const remaining = processes.map((p) => ({ ...p }));
  const timeline = [];
  let currentTime = 0;
  const completed = new Set();

  while (completed.size < processes.length) {
    const available = remaining.filter(
      (p) => p.arrivalTime <= currentTime && !completed.has(p.pid)
    );

    if (available.length === 0) {
      const nextArrival = Math.min(
        ...remaining.filter((p) => !completed.has(p.pid)).map((p) => p.arrivalTime)
      );
      currentTime = nextArrival;
      continue;
    }

    available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
    const selected = available[0];

    const start = currentTime;
    const end = currentTime + selected.burstTime;
    timeline.push({ pid: selected.pid, start, end });
    currentTime = end;
    completed.add(selected.pid);
  }

  return timeline;
}

module.exports = { priority };
