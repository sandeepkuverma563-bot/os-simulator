import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colorFor } from "../../utils/colors";

export default function FrameVisualizer({ steps, currentStep, frameCount }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-sm font-mono" style={{ color: "var(--text-muted)" }}>
        Run simulation to see frame animation
      </div>
    );
  }

  const visibleSteps = steps.slice(0, currentStep + 1);
  const activeStepData = steps[currentStep];

  // Build a stable color map across all unique pages seen
  const uniquePages = [...new Set(steps.map((s) => s.page))].sort((a, b) => a - b);
  const colorMap = {};
  uniquePages.forEach((p, i) => (colorMap[p] = colorFor(i)));

  return (
    <div>
      {/* Reference string strip with current position highlighted */}
      <div className="flex flex-wrap gap-1.5 mb-6 overflow-x-auto pb-1">
        {steps.map((s, i) => {
          const isPast = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-center w-9 h-9 rounded-md text-xs font-mono font-semibold flex-shrink-0 transition-all duration-200"
              style={{
                backgroundColor: isActive ? colorMap[s.page] : isPast ? `${colorMap[s.page]}33` : "var(--surface-2)",
                border: `1px solid ${isActive ? colorMap[s.page] : isPast ? `${colorMap[s.page]}66` : "var(--border-color)"}`,
                color: isActive ? "#0a0a0f" : isPast ? colorMap[s.page] : "var(--text-muted)",
                opacity: i > currentStep ? 0.35 : 1,
              }}
            >
              {s.page}
            </div>
          );
        })}
      </div>

      {/* Frame grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${frameCount}, minmax(0, 1fr))`, maxWidth: `${frameCount * 110}px` }}>
        {Array.from({ length: frameCount }).map((_, frameIdx) => {
          const value = activeStepData?.frames?.[frameIdx];
          const isOccupied = value !== undefined;
          const justFilled =
            isOccupied &&
            activeStepData &&
            !activeStepData.hit &&
            activeStepData.frames[frameIdx] === activeStepData.page;

          return (
            <div key={frameIdx} className="flex flex-col items-center gap-1">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>F{frameIdx + 1}</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${frameIdx}-${value}-${currentStep}`}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full aspect-square rounded-lg flex items-center justify-center font-mono font-bold text-lg"
                  style={{
                    backgroundColor: isOccupied ? `${colorMap[value]}26` : "var(--surface-2)",
                    border: `2px solid ${isOccupied ? colorMap[value] : "var(--border-color)"}`,
                    color: isOccupied ? colorMap[value] : "var(--text-muted)",
                    boxShadow: justFilled ? `0 0 16px ${colorMap[value]}70` : "none",
                  }}
                >
                  {isOccupied ? value : "—"}
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Current step status */}
      {activeStepData && (
        <div className="flex items-center gap-3 mt-5">
          <div
            className="px-3 py-1.5 rounded-lg font-mono text-sm font-semibold"
            style={{
              backgroundColor: activeStepData.hit ? "rgba(34,211,162,0.12)" : "rgba(248,113,113,0.12)",
              color: activeStepData.hit ? "#22d3a2" : "#f87171",
              border: `1px solid ${activeStepData.hit ? "rgba(34,211,162,0.3)" : "rgba(248,113,113,0.3)"}`,
            }}
          >
            {activeStepData.hit ? "HIT" : "FAULT"}
          </div>
          <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
            Page <span style={{ color: colorMap[activeStepData.page] }}>{activeStepData.page}</span>
            {activeStepData.evicted !== null && activeStepData.evicted !== undefined && (
              <> · Evicted page <span style={{ color: colorMap[activeStepData.evicted] }}>{activeStepData.evicted}</span></>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
