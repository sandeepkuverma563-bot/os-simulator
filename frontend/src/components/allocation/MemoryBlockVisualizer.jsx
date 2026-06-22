import React from "react";
import { motion } from "framer-motion";
import { colorFor } from "../../utils/colors";

export default function MemoryBlockVisualizer({ blockStates, allocations }) {
  if (!blockStates || blockStates.length === 0) return null;

  // Stable color per process id, based on order of first appearance in allocations
  const processColorMap = {};
  allocations.forEach((a, i) => {
    if (!processColorMap[a.processId]) processColorMap[a.processId] = colorFor(Object.keys(processColorMap).length);
  });

  const maxSize = Math.max(...blockStates.map((b) => b.size));

  return (
    <div className="space-y-3">
      {blockStates.map((block) => {
        const widthPct = (block.size / maxSize) * 100;
        return (
          <div key={block.id} className="flex items-center gap-3">
            <div className="w-12 flex-shrink-0 text-xs font-mono text-right" style={{ color: "var(--text-muted)" }}>
              {block.id}
            </div>
            <div
              className="flex-1 h-10 rounded-md overflow-hidden flex relative"
              style={{ width: `${Math.max(widthPct, 15)}%`, backgroundColor: "var(--surface-2)", border: "1px solid var(--border-color)" }}
            >
              {block.allocatedTo.map((alloc, i) => {
                const segWidth = (alloc.size / block.size) * 100;
                const color = processColorMap[alloc.processId];
                return (
                  <motion.div
                    key={alloc.processId}
                    initial={{ width: 0 }}
                    animate={{ width: `${segWidth}%` }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="h-full flex items-center justify-center text-xs font-mono font-semibold flex-shrink-0"
                    style={{ backgroundColor: `${color}40`, borderRight: `1px solid ${color}`, color }}
                    title={`${alloc.processId}: ${alloc.size}KB`}
                  >
                    {segWidth > 8 && alloc.processId}
                  </motion.div>
                );
              })}
              {block.remainingSize > 0 && (
                <div
                  className="h-full flex items-center justify-center text-xs font-mono flex-shrink-0"
                  style={{
                    width: `${(block.remainingSize / block.size) * 100}%`,
                    color: "var(--text-muted)",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(128,128,128,0.08) 4px, rgba(128,128,128,0.08) 8px)",
                  }}
                >
                  {block.remainingSize}KB free
                </div>
              )}
            </div>
            <div className="w-16 flex-shrink-0 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              {block.size}KB
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2">
        {Object.entries(processColorMap).map(([pid, color]) => (
          <div key={pid} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{pid}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(128,128,128,0.3) 2px, rgba(128,128,128,0.3) 4px)", border: "1px solid var(--border-color)" }}
          />
          <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>Free / Fragmented</span>
        </div>
      </div>
    </div>
  );
}
