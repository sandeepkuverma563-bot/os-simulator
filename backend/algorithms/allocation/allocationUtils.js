/**
 * Shared result-building logic for memory allocation algorithms
 * (First Fit, Best Fit, Worst Fit). Computes fragmentation and
 * utilization stats from a finished allocation pass.
 *
 * @param {Array} blockState - blocks annotated with remainingSize and allocatedTo
 * @param {Array} allocations - per-process allocation records
 * @param {Array} originalBlocks - the original block list (for total memory)
 * @param {Array} processes - the original process list
 */
function buildAllocationResult(blockState, allocations, originalBlocks, processes) {
  const totalMemory = originalBlocks.reduce((s, b) => s + b.size, 0);

  const totalAllocated = allocations
    .filter((a) => a.blockId !== null)
    .reduce((s, a) => s + a.processSize, 0);

  // Internal fragmentation: leftover space inside blocks that DID receive an allocation
  const internalFragmentation = blockState
    .filter((b) => b.allocatedTo.length > 0)
    .reduce((s, b) => s + b.remainingSize, 0);

  // External fragmentation: space in blocks that received NO allocation at all
  // but are too small or simply unused (free blocks that sit idle)
  const externalFragmentation = blockState
    .filter((b) => b.allocatedTo.length === 0)
    .reduce((s, b) => s + b.size, 0);

  const freeMemory = blockState.reduce((s, b) => s + b.remainingSize, 0);
  const memoryUtilization = totalMemory > 0 ? +((totalAllocated / totalMemory) * 100).toFixed(2) : 0;
  const unallocatedProcesses = allocations.filter((a) => a.blockId === null).length;

  return {
    allocations,
    blockStates: blockState.map((b) => ({
      id: b.id,
      size: b.size,
      remainingSize: b.remainingSize,
      allocatedTo: b.allocatedTo,
      status: b.allocatedTo.length === 0 ? "free" : b.remainingSize > 0 ? "partial" : "full",
    })),
    stats: {
      totalMemory,
      totalAllocated,
      internalFragmentation,
      externalFragmentation,
      freeMemory,
      memoryUtilization,
      processesAllocated: processes.length - unallocatedProcesses,
      processesUnallocated: unallocatedProcesses,
    },
  };
}

module.exports = { buildAllocationResult };
