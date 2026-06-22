// Shared, stable color palette used across scheduling, memory, and allocation visualizers.
export const PALETTE = [
  "#00d4ff", "#a855f7", "#22d3a2", "#fbbf24",
  "#f87171", "#ec4899", "#60a5fa", "#fb923c",
  "#34d399", "#818cf8", "#f472b6", "#facc15",
];

export function colorFor(index) {
  return PALETTE[index % PALETTE.length];
}

/**
 * Builds a stable pid/id -> color map given an ordered list of items
 * (each with a `pid` or `id` field).
 */
export function buildColorMap(items, key = "pid") {
  const map = {};
  items.forEach((item, i) => {
    map[item[key]] = colorFor(i);
  });
  return map;
}
