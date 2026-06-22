const { buildAllocationResult } = require("./allocationUtils");

/**
 * Best Fit Memory Allocation
 * Allocates each process to the smallest memory block that is still
 * large enough to hold it, minimizing leftover space per allocation.
 */
function bestFit(blocks, processes) {
  const blockState = blocks.map((b) => ({ ...b, remainingSize: b.size, allocatedTo: [] }));
  const allocations = [];

  for (const p of processes) {
    // Find the candidate block with the smallest remainingSize that still fits
    let bestBlock = null;
    for (const b of blockState) {
      if (b.remainingSize >= p.size) {
        if (bestBlock === null || b.remainingSize < bestBlock.remainingSize) {
          bestBlock = b;
        }
      }
    }

    if (bestBlock) {
      allocations.push({
        processId: p.id,
        processSize: p.size,
        blockId: bestBlock.id,
        internalFragmentation: bestBlock.remainingSize - p.size,
      });
      bestBlock.allocatedTo.push({ processId: p.id, size: p.size });
      bestBlock.remainingSize -= p.size;
    } else {
      allocations.push({ processId: p.id, processSize: p.size, blockId: null, internalFragmentation: 0 });
    }
  }

  return buildAllocationResult(blockState, allocations, blocks, processes);
}

module.exports = { bestFit };
