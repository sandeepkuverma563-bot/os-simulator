/**
 * Shortest Remaining Time First (SRTF) - Preemptive SJF
 * Evaluates every time unit and preempts to the process with the least remaining time.
 * Consecutive ticks for the same process are merged into single timeline segments.
 */
function srtf(processes) {
  const remaining = processes.map((p) => ({ ...p, remaining: p.burstTime }));
  const timeline = [];
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;
  let lastPid = null;
  let segStart = 0;

  const maxTime =
    processes.reduce((s, p) => s + p.burstTime, 0) +
    Math.max(...processes.map((p) => p.arrivalTime));

  while (completed < n && currentTime <= maxTime) {
    const available = remaining.filter(
      (p) => p.arrivalTime <= currentTime && p.remaining > 0
    );

    if (available.length === 0) {
      if (lastPid !== null) {
        timeline.push({ pid: lastPid, start: segStart, end: currentTime });
        lastPid = null;
      }
      currentTime++;
      continue;
    }

    available.sort((a, b) => a.remaining - b.remaining || a.arrivalTime - b.arrivalTime);
    const selected = available[0];

    if (selected.pid !== lastPid) {
      if (lastPid !== null) {
        timeline.push({ pid: lastPid, start: segStart, end: currentTime });
      }
      lastPid = selected.pid;
      segStart = currentTime;
    }

    selected.remaining--;
    currentTime++;

    if (selected.remaining === 0) {
      timeline.push({ pid: selected.pid, start: segStart, end: currentTime });
      lastPid = null;
      completed++;
    }
  }

  return timeline;
}

module.exports = { srtf };
