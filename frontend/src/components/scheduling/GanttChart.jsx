import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { buildColorMap, colorFor } from "../../utils/colors";

export default function GanttChart({ timeline, currentStep, processes, label }) {
  const totalTime = useMemo(
    () => (timeline.length > 0 ? Math.max(...timeline.map((t) => t.end)) : 0),
    [timeline]
  );

  const colorMap = useMemo(() => {
    const map = processes && processes.length > 0 ? buildColorMap(processes, "pid") : {};
    let colorIdx = Object.keys(map).length;
    timeline.forEach(({ pid }) => {
      if (!map[pid]) map[pid] = colorFor(colorIdx++);
    });
    return map;
  }, [processes, timeline]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm font-mono" style={{ color: "var(--text-muted)" }}>
        Run simulation to see Gantt chart
      </div>
    );
  }

  const visibleTimeline = timeline.slice(0, currentStep + 1);
  const activeSegment = timeline[currentStep];

  return (
    <div>
      {label && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>{label}</span>
        </div>
      )}

      <div className="relative overflow-x-auto">
        <div className="flex items-stretch gap-0 min-w-max" style={{ minHeight: "52px" }}>
          {visibleTimeline.map((seg, idx) => {
            const width = ((seg.end - seg.start) / totalTime) * 100;
            const isActive = activeSegment && seg === activeSegment;
            const color = colorMap[seg.pid] || "#00d4ff";

            return (
              <motion.div
                key={`${seg.pid}-${seg.start}-${idx}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ width: `${Math.max(width, 2)}%`, minWidth: "36px", transformOrigin: "left center" }}
                className="relative flex flex-col"
              >
                <div
                  className="flex items-center justify-center font-mono font-semibold text-xs h-12 rounded-sm mx-0.5 transition-all duration-300 select-none"
                  style={{
                    backgroundColor: isActive ? color : `${color}33`,
                    border: `1px solid ${color}${isActive ? "ff" : "66"}`,
                    color: isActive ? "#0a0a0f" : color,
                    boxShadow: isActive ? `0 0 12px ${color}60` : "none",
                  }}
                  title={`${seg.pid}: ${seg.start} → ${seg.end} (${seg.end - seg.start} units)`}
                >
                  {seg.pid}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-0 mt-1 min-w-max">
          {visibleTimeline.map((seg, idx) => {
            const width = ((seg.end - seg.start) / totalTime) * 100;
            return (
              <div
                key={`t-${idx}`}
                className="flex justify-between text-xs font-mono"
                style={{ width: `${Math.max(width, 2)}%`, minWidth: "36px", color: "var(--text-muted)" }}
              >
                <span className="pl-1">{seg.start}</span>
                {idx === visibleTimeline.length - 1 && <span className="pr-1">{seg.end}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(colorMap).map(([pid, color]) => (
          <div key={pid} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{pid}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
