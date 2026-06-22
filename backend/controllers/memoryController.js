const { fifo } = require("../algorithms/memory/fifo");
const { lru } = require("../algorithms/memory/lru");
const { optimal } = require("../algorithms/memory/optimal");

const ALGORITHMS = { FIFO: fifo, LRU: lru, OPTIMAL: optimal };

function validateMemoryRequest(body) {
  const { algorithm, referenceString, frames } = body;

  if (!algorithm || !ALGORITHMS[algorithm.toUpperCase()]) {
    return `Invalid algorithm. Supported: ${Object.keys(ALGORITHMS).join(", ")}`;
  }
  if (!Array.isArray(referenceString) || referenceString.length === 0) {
    return "referenceString must be a non-empty array of page numbers";
  }
  if (!referenceString.every((p) => Number.isInteger(p) && p >= 0)) {
    return "referenceString must contain only non-negative integers";
  }
  if (!frames || frames <= 0) {
    return "frames must be a positive integer";
  }

  return null;
}

/** POST /api/memory/page-replacement */
function runPageReplacement(req, res) {
  try {
    const error = validateMemoryRequest(req.body);
    if (error) return res.status(400).json({ error });

    const { algorithm, referenceString, frames } = req.body;
    const algo = ALGORITHMS[algorithm.toUpperCase()];
    const result = algo(referenceString, Number(frames));

    return res.json({ algorithm: algorithm.toUpperCase(), frameCount: Number(frames), ...result });
  } catch (err) {
    console.error("runPageReplacement error:", err);
    return res.status(500).json({ error: "Simulation failed", message: err.message });
  }
}

module.exports = { runPageReplacement, validateMemoryRequest, ALGORITHMS };
