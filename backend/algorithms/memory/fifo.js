/**
 * FIFO Page Replacement
 * Evicts the page that has been in memory the longest.
 *
 * @param {number[]} referenceString - sequence of page numbers requested
 * @param {number} frameCount - number of available frames
 * @returns {{ steps: Array, hits: number, faults: number, hitRatio: number, faultRatio: number }}
 */
function fifo(referenceString, frameCount) {
  const frames = []; // current frame contents (array acts as queue, front = oldest)
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
        evicted = frames.shift(); // remove oldest (front of queue)
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

module.exports = { fifo };
