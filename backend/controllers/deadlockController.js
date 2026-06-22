const { bankers } = require("../algorithms/deadlock/bankers");

function validateBankersRequest(body) {
  const { allocation, max, available } = body;

  if (!Array.isArray(allocation) || allocation.length === 0) {
    return "allocation must be a non-empty 2D array";
  }
  if (!Array.isArray(max) || max.length === 0) {
    return "max must be a non-empty 2D array";
  }
  if (!Array.isArray(available) || available.length === 0) {
    return "available must be a non-empty array";
  }

  const n = allocation.length;
  const m = available.length;

  if (max.length !== n) {
    return "max matrix must have the same number of rows as allocation (one row per process)";
  }

  for (let i = 0; i < n; i++) {
    if (!Array.isArray(allocation[i]) || allocation[i].length !== m) {
      return `allocation[${i}] must have ${m} columns (one per resource type)`;
    }
    if (!Array.isArray(max[i]) || max[i].length !== m) {
      return `max[${i}] must have ${m} columns (one per resource type)`;
    }
    for (let j = 0; j < m; j++) {
      if (typeof allocation[i][j] !== "number" || allocation[i][j] < 0) {
        return `allocation[${i}][${j}] must be a non-negative number`;
      }
      if (typeof max[i][j] !== "number" || max[i][j] < 0) {
        return `max[${i}][${j}] must be a non-negative number`;
      }
    }
  }

  for (const a of available) {
    if (typeof a !== "number" || a < 0) {
      return "available values must be non-negative numbers";
    }
  }

  return null;
}

/** POST /api/deadlock/bankers */
function runBankers(req, res) {
  try {
    const error = validateBankersRequest(req.body);
    if (error) return res.status(400).json({ error });

    const { allocation, max, available } = req.body;
    const result = bankers(allocation, max, available);

    return res.json(result);
  } catch (err) {
    console.error("runBankers error:", err);
    return res.status(500).json({ error: "Simulation failed", message: err.message });
  }
}

module.exports = { runBankers, validateBankersRequest };
