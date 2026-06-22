import React from "react";
import { motion } from "framer-motion";
import { HiOutlineStar } from "react-icons/hi";

const RANK_COLORS = ["#fbbf24", "#a3a3b8", "#fb923c", "#6c6c82", "#6c6c82"];

export default function Leaderboard({ leaderboard }) {
  if (!leaderboard || leaderboard.length === 0) return null;

  return (
    <div className="glass-card p-5">
      <p className="section-label">Algorithm Comparison</p>
      <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>
        Leaderboard <span className="text-xs font-normal opacity-60">(ranked by lowest avg waiting time)</span>
      </h2>

      <div className="space-y-2">
        {leaderboard.map((entry, idx) => (
          <motion.div
            key={entry.algorithm}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="flex items-center gap-4 p-3 rounded-lg"
            style={{
              backgroundColor: idx === 0 ? "rgba(251,191,36,0.08)" : "var(--surface-2)",
              border: `1px solid ${idx === 0 ? "rgba(251,191,36,0.3)" : "var(--border-color)"}`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: `${RANK_COLORS[idx] || "#6c6c82"}22`, color: RANK_COLORS[idx] || "#6c6c82" }}
            >
              {entry.rank}
            </div>

            <div className="font-mono font-semibold text-sm w-24 flex-shrink-0" style={{ color: "var(--text-primary)" }}>
              {entry.algorithm}
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span style={{ color: "var(--text-muted)" }}>Avg WT: </span>
                <span style={{ color: "#00d4ff" }}>{entry.avgWT}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Avg TAT: </span>
                <span style={{ color: "#a855f7" }}>{entry.avgTAT}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>CPU Util: </span>
                <span style={{ color: "#fbbf24" }}>{entry.cpuUtilization}%</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Throughput: </span>
                <span style={{ color: "#22d3a2" }}>{entry.throughput}</span>
              </div>
            </div>

            {idx === 0 && <HiOutlineStar className="w-5 h-5 flex-shrink-0" style={{ color: "#fbbf24" }} />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
