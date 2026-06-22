/**
 * Calculates CT, TAT, WT, RT for each process given a timeline,
 * plus CPU Utilization and Throughput for the whole schedule.
 *
 * @param {Array} processes - Original process list with pid, arrivalTime, burstTime
 * @param {Array} timeline  - [{pid, start, end}, ...]
 * @returns {{ metrics: Array, summary: Object }}
 */
function calculateSchedulingMetrics(processes, timeline) {
  const metricsMap = {};

  processes.forEach((p) => {
    metricsMap[p.pid] = {
      pid: p.pid,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      ct: 0,
      tat: 0,
      wt: 0,
      rt: -1,
    };
  });

  timeline.forEach(({ pid, start, end }) => {
    const m = metricsMap[pid];
    if (!m) return;
    if (end > m.ct) m.ct = end;
    if (m.rt === -1 || start < m.rt) m.rt = start;
  });

  const metrics = processes.map((p) => {
    const m = metricsMap[p.pid];
    m.tat = m.ct - p.arrivalTime;
    m.wt = m.tat - p.burstTime;
    m.rt = m.rt - p.arrivalTime;
    return m;
  });

  const avgWT = +(metrics.reduce((sum, m) => sum + m.wt, 0) / metrics.length).toFixed(2);
  const avgTAT = +(metrics.reduce((sum, m) => sum + m.tat, 0) / metrics.length).toFixed(2);
  const avgRT = +(metrics.reduce((sum, m) => sum + m.rt, 0) / metrics.length).toFixed(2);

  // CPU Utilization: total busy time / total elapsed time (including idle gaps)
  const totalBusyTime = timeline.reduce((sum, seg) => sum + (seg.end - seg.start), 0);
  const scheduleStart = Math.min(...timeline.map((t) => t.start));
  const scheduleEnd = Math.max(...timeline.map((t) => t.end));
  const totalElapsed = scheduleEnd - scheduleStart;
  const cpuUtilization = totalElapsed > 0 ? +((totalBusyTime / totalElapsed) * 100).toFixed(2) : 100;

  // Throughput: number of processes completed per unit time
  const throughput = totalElapsed > 0 ? +(processes.length / totalElapsed).toFixed(3) : processes.length;

  return {
    metrics,
    summary: { avgWT, avgTAT, avgRT, cpuUtilization, throughput },
  };
}

module.exports = { calculateSchedulingMetrics };
