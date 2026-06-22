const { runAlgorithm } = require("./schedulingController");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validatePerformanceRequest(body) {
  const { numProcesses, arrivalRange, burstRange, priorityRange } = body;

  if (!numProcesses || numProcesses < 2 || numProcesses > 50) {
    return "numProcesses must be between 2 and 50";
  }
  if (!Array.isArray(arrivalRange) || arrivalRange.length !== 2 || arrivalRange[0] > arrivalRange[1]) {
    return "arrivalRange must be [min, max] with min <= max";
  }
  if (!Array.isArray(burstRange) || burstRange.length !== 2 || burstRange[0] < 1 || burstRange[0] > burstRange[1]) {
    return "burstRange must be [min, max] with 1 <= min <= max";
  }
  if (!Array.isArray(priorityRange) || priorityRange.length !== 2 || priorityRange[0] > priorityRange[1]) {
    return "priorityRange must be [min, max] with min <= max";
  }

  return null;
}

function generateWorkload({ numProcesses, arrivalRange, burstRange, priorityRange }) {
  const processes = [];
  for (let i = 1; i <= numProcesses; i++) {
    processes.push({
      pid: `P${i}`,
      arrivalTime: randomInt(arrivalRange[0], arrivalRange[1]),
      burstTime: randomInt(burstRange[0], burstRange[1]),
      priority: randomInt(priorityRange[0], priorityRange[1]),
    });
  }
  return processes;
}

/** POST /api/performance/generate */
function generatePerformanceTest(req, res) {
  try {
    const error = validatePerformanceRequest(req.body);
    if (error) return res.status(400).json({ error });

    const { numProcesses, arrivalRange, burstRange, priorityRange, quantum } = req.body;
    const processes = generateWorkload({ numProcesses, arrivalRange, burstRange, priorityRange });

    const algorithms = ["FCFS", "SJF", "SRTF", "PRIORITY", "RR"];
    const results = algorithms.map((algoName) =>
      runAlgorithm(algoName, processes, quantum || 2)
    );

    // Build leaderboard sorted by avgWT (lower is better)
    const leaderboard = results
      .map((r) => ({
        algorithm: r.algorithm,
        avgWT: r.summary.avgWT,
        avgTAT: r.summary.avgTAT,
        avgRT: r.summary.avgRT,
        cpuUtilization: r.summary.cpuUtilization,
        throughput: r.summary.throughput,
      }))
      .sort((a, b) => a.avgWT - b.avgWT)
      .map((entry, idx) => ({ rank: idx + 1, ...entry }));

    return res.json({ processes, results, leaderboard });
  } catch (err) {
    console.error("generatePerformanceTest error:", err);
    return res.status(500).json({ error: "Performance test generation failed", message: err.message });
  }
}

module.exports = { generatePerformanceTest, generateWorkload, validatePerformanceRequest };
