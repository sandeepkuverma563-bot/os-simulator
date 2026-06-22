import React from "react";
import { motion } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowRight } from "react-icons/hi";

export default function SafeSequenceView({ result, currentStep, resourceLabels }) {
  if (!result) return null;
  const { safe, safeSequence, steps, unsafeReason, need } = result;

  return (
    <div className="space-y-5">
      {/* Safe/Unsafe banner */}
      <div
        className="flex items-center gap-3 p-4 rounded-lg"
        style={{
          backgroundColor: safe ? "rgba(34,211,162,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${safe ? "rgba(34,211,162,0.3)" : "rgba(248,113,113,0.3)"}`,
        }}
      >
        {safe ? (
          <HiOutlineCheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: "#22d3a2" }} />
        ) : (
          <HiOutlineXCircle className="w-6 h-6 flex-shrink-0" style={{ color: "#f87171" }} />
        )}
        <div>
          <div className="font-mono font-bold text-sm" style={{ color: safe ? "#22d3a2" : "#f87171" }}>
            {safe ? "SAFE STATE" : "UNSAFE STATE"}
          </div>
          <div className="text-xs font-mono mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {safe
              ? "The system can satisfy all process requests without entering deadlock."
              : unsafeReason || "No safe sequence exists for the current resource state."}
          </div>
        </div>
      </div>

      {/* Safe sequence chain */}
      {safe && safeSequence.length > 0 && (
        <div>
          <p className="section-label">Safe Sequence</p>
          <div className="flex flex-wrap items-center gap-2">
            {safeSequence.map((pid, i) => {
              const isPast = i <= currentStep;
              return (
                <React.Fragment key={pid}>
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: isPast ? 1 : 0.35 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-3 py-2 rounded-lg font-mono font-semibold text-sm"
                    style={{
                      backgroundColor: isPast ? "rgba(0,212,255,0.12)" : "var(--surface-2)",
                      border: `1px solid ${isPast ? "rgba(0,212,255,0.4)" : "var(--border-color)"}`,
                      color: isPast ? "#00d4ff" : "var(--text-muted)",
                    }}
                  >
                    {pid}
                  </motion.div>
                  {i < safeSequence.length - 1 && (
                    <HiOutlineArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: isPast ? "#00d4ff" : "var(--text-muted)", opacity: isPast ? 1 : 0.35 }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Step-by-step execution trace */}
      {steps && steps.length > 0 && (
        <div>
          <p className="section-label">Execution Trace</p>
          <div className="space-y-2">
            {steps.slice(0, currentStep + 1).map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: i === currentStep ? "rgba(0,212,255,0.06)" : "var(--surface-2)",
                  border: `1px solid ${i === currentStep ? "rgba(0,212,255,0.3)" : "var(--border-color)"}`,
                }}
              >
                <div className="font-mono font-bold text-xs px-2 py-1 rounded" style={{ backgroundColor: "rgba(0,212,255,0.15)", color: "#00d4ff" }}>
                  {step.process}
                </div>
                <div className="font-mono text-xs flex-1" style={{ color: "var(--text-secondary)" }}>
                  Need [{step.needRow.join(",")}] ≤ Work [{step.workBefore.join(",")}] → executes, releases [{step.allocationRow.join(",")}]
                </div>
                <div className="font-mono text-xs" style={{ color: "#22d3a2" }}>
                  Work → [{step.workAfter.join(",")}]
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
