const { firstFit } = require("../algorithms/allocation/firstFit");
const { bestFit } = require("../algorithms/allocation/bestFit");
const { worstFit } = require("../algorithms/allocation/worstFit");

const ALGORITHMS = { FIRST_FIT: firstFit, BEST_FIT: bestFit, WORST_FIT: worstFit };

function validateAllocationRequest(body) {
  const { algorithm, blocks, processes } = body;

  if (!algorithm || !ALGORITHMS[algorithm.toUpperCase()]) {
    return `Invalid algorithm. Supported: ${Object.keys(ALGORITHMS).join(", ")}`;
  }
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "blocks must be a non-empty array";
  }
  if (!Array.isArray(processes) || processes.length === 0) {
    return "processes must be a non-empty array";
  }
  for (const b of blocks) {
    if (!b.id) return "Each block must have an id";
    if (!b.size || b.size <= 0) return `Block ${b.id}: size must be > 0`;
  }
  for (const p of processes) {
    if (!p.id) return "Each process must have an id";
    if (!p.size || p.size <= 0) return `Process ${p.id}: size must be > 0`;
  }

  return null;
}

/** POST /api/memory/allocation */
function runAllocation(req, res) {
  try {
    const error = validateAllocationRequest(req.body);
    if (error) return res.status(400).json({ error });

    const { algorithm, blocks, processes } = req.body;
    const algo = ALGORITHMS[algorithm.toUpperCase()];
    const result = algo(blocks, processes);

    return res.json({ algorithm: algorithm.toUpperCase(), ...result });
  } catch (err) {
    console.error("runAllocation error:", err);
    return res.status(500).json({ error: "Simulation failed", message: err.message });
  }
}

module.exports = { runAllocation, validateAllocationRequest, ALGORITHMS };
