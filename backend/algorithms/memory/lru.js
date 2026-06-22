/**
 * LRU (Least Recently Used) Page Replacement
 * Evicts the page that hasn't been used for the longest time.
 *
 * @param {number[]} referenceString - sequence of page numbers requested
 * @param {number} frameCount - number of available frames
 * @returns {{ steps: Array, hits: number, faults: number, hitRatio: number, faultRatio: number }}
 */
function lru(referenceString, frameCount) {
  const frames = []; // current frame contents
  const lastUsed = {}; // page -> index of last use
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
        // Find the least recently used page currently in frames
        let lruPage = frames[0];
        let lruIndex = lastUsed[lruPage] ?? -1;
        for (const f of frames) {
          const usedAt = lastUsed[f] ?? -1;
          if (usedAt < lruIndex) {
            lruIndex = usedAt;
            lruPage = f;
          }
        }
        const removeIdx = frames.indexOf(lruPage);
        evicted = frames.splice(removeIdx, 1)[0];
      }
      frames.push(page);
    }

    lastUsed[page] = i;

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

module.exports = { lru };
