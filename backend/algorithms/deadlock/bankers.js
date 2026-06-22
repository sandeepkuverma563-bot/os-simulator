/**
 * Banker's Algorithm — Deadlock Avoidance
 *
 * @param {Array<Array<number>>} allocation - allocation[i][j] = resource j currently held by process i
 * @param {Array<Array<number>>} max - max[i][j] = max resource j process i may ever need
 * @param {Array<number>} available - available[j] = currently free units of resource j
 * @returns {{
 *   need: Array<Array<number>>,
 *   safe: boolean,
 *   safeSequence: string[],
 *   steps: Array,
 *   unsafeReason: string|null
 * }}
 */
function bankers(allocation, max, available) {
  const n = allocation.length; // number of processes
  const m = available.length; // number of resource types

  // Step 1: Compute Need matrix = Max - Allocation
  const need = max.map((row, i) => row.map((v, j) => v - allocation[i][j]));

  // Validate: no negative need (max must be >= allocation)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (need[i][j] < 0) {
        return {
          need,
          safe: false,
          safeSequence: [],
          steps: [],
          unsafeReason: `Invalid input: Process P${i} allocation exceeds its maximum claim for resource R${j}.`,
        };
      }
    }
  }

  const work = [...available];
  const finish = new Array(n).fill(false);
  const safeSequence = [];
  const steps = [];

  let progress = true;
  while (progress && safeSequence.length < n) {
    progress = false;

    for (let i = 0; i < n; i++) {
      if (finish[i]) continue;

      const canRun = need[i].every((needVal, j) => needVal <= work[j]);

      if (canRun) {
        // Process i can complete — reclaim its allocated resources
        const workBefore = [...work];
        for (let j = 0; j < m; j++) {
          work[j] += allocation[i][j];
        }

        steps.push({
          process: `P${i}`,
          workBefore,
          needRow: [...need[i]],
          allocationRow: [...allocation[i]],
          workAfter: [...work],
          canExecute: true,
        });

        finish[i] = true;
        safeSequence.push(`P${i}`);
        progress = true;
      }
    }
  }

  const allFinished = finish.every((f) => f);

  if (!allFinished) {
    const stuckProcesses = finish
      .map((f, i) => (!f ? `P${i}` : null))
      .filter(Boolean);

    return {
      need,
      safe: false,
      safeSequence: [],
      steps,
      unsafeReason: `No safe sequence exists. Processes ${stuckProcesses.join(", ")} cannot acquire enough resources to complete — the system would deadlock if these requests were granted.`,
    };
  }

  return {
    need,
    safe: true,
    safeSequence,
    steps,
    unsafeReason: null,
  };
}

module.exports = { bankers };
