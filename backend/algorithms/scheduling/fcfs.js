/**
 * First Come First Serve (FCFS) - Non Preemptive
 * Processes are executed strictly in arrival order.
 */
function fcfs(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const timeline = [];
  let currentTime = 0;

  for (const p of sorted) {
    if (currentTime < p.arrivalTime) currentTime = p.arrivalTime;
    const start = currentTime;
    const end = currentTime + p.burstTime;
    timeline.push({ pid: p.pid, start, end });
    currentTime = end;
  }

  return timeline;
}

module.exports = { fcfs };
