const { fcfs } = require("../algorithms/scheduling/fcfs");
const { sjf } = require("../algorithms/scheduling/sjf");
const { srtf } = require("../algorithms/scheduling/srtf");
const { priority } = require("../algorithms/scheduling/priority");
const { rr } = require("../algorithms/scheduling/rr");
const { calculateSchedulingMetrics } = require("../utils/calculateSchedulingMetrics");

const ALGORITHMS = { FCFS: fcfs, SJF: sjf, SRTF: srtf, PRIORITY: priority, RR: rr };

function validateScheduleRequest(body) {
  const { algorithm, processes } = body;

  if (!algorithm || !ALGORITHMS[algorithm.toUpperCase()]) {
    return `Invalid algorithm. Supported: ${Object.keys(ALGORITHMS).join(", ")}`;
  }

  if (!Array.isArray(processes) || processes.length === 0) {
    return "processes must be a non-empty array";
  }

  for (const p of processes) {
    if (!p.pid) return "Each process must have a pid";
    if (p.arrivalTime == null || p.arrivalTime < 0) return `${p.pid}: arrivalTime must be >= 0`;
    if (!p.burstTime || p.burstTime <= 0) return `${p.pid}: burstTime must be > 0`;
    if (algorithm.toUpperCase() === "PRIORITY" && p.priority == null) {
      return `${p.pid}: priority is required for PRIORITY scheduling`;
    }
  }

  if (algorithm.toUpperCase() === "RR" && (!body.quantum || body.quantum <= 0)) {
    return "quantum must be > 0 for Round Robin";
  }

  return null;
}

function runAlgorithm(algorithmName, processes, quantum) {
  const algo = ALGORITHMS[algorithmName.toUpperCase()];
  const timeline = algorithmName.toUpperCase() === "RR" ? algo(processes, Number(quantum)) : algo(processes);
  const { metrics, summary } = calculateSchedulingMetrics(processes, timeline);
  return { algorithm: algorithmName.toUpperCase(), timeline, metrics, summary };
}

/** POST /api/scheduling/run */
function runScheduling(req, res) {
  try {
    const error = validateScheduleRequest(req.body);
    if (error) return res.status(400).json({ error });

    const { algorithm, processes, quantum } = req.body;
    const result = runAlgorithm(algorithm, processes, quantum);
    return res.json(result);
  } catch (err) {
    console.error("runScheduling error:", err);
    return res.status(500).json({ error: "Simulation failed", message: err.message });
  }
}

/** POST /api/scheduling/compare */
function compareScheduling(req, res) {
  try {
    const { algorithms, processes, quantum } = req.body;

    if (!Array.isArray(algorithms) || algorithms.length !== 2) {
      return res.status(400).json({ error: "Provide exactly 2 algorithms for comparison" });
    }

    const results = algorithms.map((algoName) => {
      const error = validateScheduleRequest({ algorithm: algoName, processes, quantum });
      if (error) throw new Error(`${algoName}: ${error}`);
      return runAlgorithm(algoName, processes, quantum);
    });

    return res.json({ results });
  } catch (err) {
    console.error("compareScheduling error:", err);
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { runScheduling, compareScheduling, validateScheduleRequest, runAlgorithm, ALGORITHMS };
