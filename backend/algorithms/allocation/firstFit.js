const { buildAllocationResult } = require("./allocationUtils");

/**
 * First Fit Memory Allocation
 * Allocates each process to the first memory block (in given order)
 * large enough to hold it.
 */
function firstFit(blocks, processes) {
  const blockState = blocks.map((b) => ({ ...b, remainingSize: b.size, allocatedTo: [] }));
  const allocations = [];

  for (const p of processes) {
    let allocated = false;

    for (const b of blockState) {
      if (b.remainingSize >= p.size) {
        allocations.push({
          processId: p.id,
          processSize: p.size,
          blockId: b.id,
          internalFragmentation: b.remainingSize - p.size,
        });
        b.allocatedTo.push({ processId: p.id, size: p.size });
        b.remainingSize -= p.size;
        allocated = true;
        break;
      }
    }

    if (!allocated) {
      allocations.push({ processId: p.id, processSize: p.size, blockId: null, internalFragmentation: 0 });
    }
  }

  return buildAllocationResult(blockState, allocations, blocks, processes);
}

module.exports = { firstFit };
