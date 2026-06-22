const { buildAllocationResult } = require("./allocationUtils");

/**
 * Worst Fit Memory Allocation
 * Allocates each process to the largest available memory block,
 * leaving the biggest possible leftover space (reduces future external fragmentation risk).
 */
function worstFit(blocks, processes) {
  const blockState = blocks.map((b) => ({ ...b, remainingSize: b.size, allocatedTo: [] }));
  const allocations = [];

  for (const p of processes) {
    // Find the candidate block with the largest remainingSize that still fits
    let worstBlock = null;
    for (const b of blockState) {
      if (b.remainingSize >= p.size) {
        if (worstBlock === null || b.remainingSize > worstBlock.remainingSize) {
          worstBlock = b;
        }
      }
    }

    if (worstBlock) {
      allocations.push({
        processId: p.id,
        processSize: p.size,
        blockId: worstBlock.id,
        internalFragmentation: worstBlock.remainingSize - p.size,
      });
      worstBlock.allocatedTo.push({ processId: p.id, size: p.size });
      worstBlock.remainingSize -= p.size;
    } else {
      allocations.push({ processId: p.id, processSize: p.size, blockId: null, internalFragmentation: 0 });
    }
  }

  return buildAllocationResult(blockState, allocations, blocks, processes);
}

module.exports = { worstFit };
