/**
 * Optimal (Belady's) Page Replacement
 * Evicts the page that won't be used for the longest time in the future
 * (or never used again). Theoretical best-case algorithm.
 *
 * @param {number[]} referenceString - sequence of page numbers requested
 * @param {number} frameCount - number of available frames
 * @returns {{ steps: Array, hits: number, faults: number, hitRatio: number, faultRatio: number }}
 */
function optimal(referenceString, frameCount) {
  const frames = [];
  const steps = [];
  let hits = 0;
  let faults = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];
    const isHit = frames.includes(page);
    let evicted = null;

    if (isHit) {
      hits++;
    } else {
      faults++;
      if (frames.length >= frameCount) {
        // For each page in frames, find the index of its next use after i
        let farthestIndex = -1;
        let pageToEvict = frames[0];

        for (const f of frames) {
          let nextUse = referenceString.indexOf(f, i + 1);
          if (nextUse === -1) {
            // This page is never used again — evict it immediately
            pageToEvict = f;
            farthestIndex = Infinity;
            break;
          }
          if (nextUse > farthestIndex) {
            farthestIndex = nextUse;
            pageToEvict = f;
          }
        }

        const removeIdx = frames.indexOf(pageToEvict);
        evicted = frames.splice(removeIdx, 1)[0];
      }
      frames.push(page);
    }

    steps.push({
      step: i,
      page,
      frames: [...frames],
      hit: isHit,
      evicted,
    });
  }

  return {
    steps,
    hits,
    faults,
    hitRatio: +(hits / referenceString.length).toFixed(3),
    faultRatio: +(faults / referenceString.length).toFixed(3),
  };
}

module.exports = { optimal };
