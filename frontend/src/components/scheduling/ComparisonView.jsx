import React from "react";
import { motion } from "framer-motion";
import GanttChart from "./GanttChart";
import { ALGORITHMS } from "./AlgorithmSelector";

const ALGO_OPTIONS = ALGORITHMS.map((a) => a.value);

function CompareBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs font-mono mb-1">
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-3)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function ComparisonView({
  compareAlgo1, setCompareAlgo1, compareAlgo2, setCompareAlgo2,
  compareResult, processes, currentStep,
}) {
  const r1 = compareResult?.[0];
  const r2 = compareResult?.[1];

  const maxWT = Math.max(r1?.summary?.avgWT ?? 0, r2?.summary?.avgWT ?? 0);
  const maxTAT = Math.max(r1?.summary?.avgTAT ?? 0, r2?.summary?.avgTAT ?? 0);
  const maxUtil = Math.max(r1?.summary?.cpuUtilization ?? 0, r2?.summary?.cpuUtilization ?? 0);

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <p className="section-label">Comparison Mode</p>
        <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>Select Two Algorithms</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono block mb-2" style={{ color: "var(--text-muted)" }}>Algorithm A</label>
            <select value={compareAlgo1} onChange={(e) => setCompareAlgo1(e.target.value)} className="input-field w-full">
              {ALGO_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono block mb-2" style={{ color: "var(--text-muted)" }}>Algorithm B</label>
            <select value={compareAlgo2} onChange={(e) => setCompareAlgo2(e.target.value)} className="input-field w-full">
              {ALGO_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
      </div>

      {compareResult && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {compareResult.map((result, i) => (
              <motion.div
                key={result.algorithm}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="px-2 py-0.5 rounded font-mono text-xs font-bold"
                    style={{
                      backgroundColor: i === 0 ? "rgba(0,212,255,0.13)" : "rgba(168,85,247,0.13)",
                      color: i === 0 ? "#00d4ff" : "#a855f7",
                      border: `1px solid ${i === 0 ? "rgba(0,212,255,0.3)" : "rgba(168,85,247,0.3)"}`,
                    }}
                  >
                    {result.algorithm}
                  </div>
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Gantt Chart</span>
                </div>
                <GanttChart timeline={result.timeline} currentStep={currentStep ?? result.timeline.length - 1} processes={processes} />
              </motion.div>
            ))}
          </div>

          <div className="glass-card p-5">
            <p className="section-label">Performance Comparison</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {compareResult.map((result, i) => (
                <div key={result.algorithm}>
                  <div className="text-sm font-mono font-semibold mb-3" style={{ color: i === 0 ? "#00d4ff" : "#a855f7" }}>
                    {result.algorithm}
                  </div>
                  <CompareBar label="Avg Waiting Time" value={result.summary.avgWT} max={maxWT} color={i === 0 ? "#00d4ff" : "#a855f7"} />
                  <CompareBar label="Avg Turnaround Time" value={result.summary.avgTAT} max={maxTAT} color={i === 0 ? "#22d3a2" : "#fbbf24"} />
                  <CompareBar label="CPU Utilization (%)" value={result.summary.cpuUtilization} max={maxUtil} color={i === 0 ? "#60a5fa" : "#f472b6"} />
                </div>
              ))}
            </div>

            {r1 && r2 && (
              <div className="mt-4 p-3 rounded-lg text-sm" style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border-color)" }}>
                <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>VERDICT · </span>
                {r1.summary.avgWT < r2.summary.avgWT ? (
                  <span>
                    <span className="font-semibold" style={{ color: "#00d4ff" }}>{r1.algorithm}</span>
                    <span style={{ color: "var(--text-secondary)" }}> has lower avg wait time (</span>
                    <span style={{ color: "#00d4ff" }}>{r1.summary.avgWT}</span>
                    <span style={{ color: "var(--text-secondary)" }}> vs </span>
                    <span style={{ color: "#a855f7" }}>{r2.summary.avgWT}</span>
                    <span style={{ color: "var(--text-secondary)" }}>)</span>
                  </span>
                ) : r2.summary.avgWT < r1.summary.avgWT ? (
                  <span>
                    <span className="font-semibold" style={{ color: "#a855f7" }}>{r2.algorithm}</span>
                    <span style={{ color: "var(--text-secondary)" }}> has lower avg wait time (</span>
                    <span style={{ color: "#a855f7" }}>{r2.summary.avgWT}</span>
                    <span style={{ color: "var(--text-secondary)" }}> vs </span>
                    <span style={{ color: "#00d4ff" }}>{r1.summary.avgWT}</span>
                    <span style={{ color: "var(--text-secondary)" }}>)</span>
                  </span>
                ) : (
                  <span style={{ color: "var(--text-secondary)" }}>Both algorithms have equal average wait time.</span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
