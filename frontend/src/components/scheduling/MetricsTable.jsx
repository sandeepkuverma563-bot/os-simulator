import React from "react";
import { motion } from "framer-motion";
import { buildColorMap } from "../../utils/colors";
import { StatBox } from "../common/Feedback";

export default function MetricsTable({ metrics, summary, processes }) {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="glass-card p-5">
        <p className="section-label">Metrics</p>
        <div className="text-sm font-mono text-center py-8" style={{ color: "var(--text-muted)" }}>
          Run simulation to see metrics
        </div>
      </div>
    );
  }

  const colorMap = processes ? buildColorMap(processes, "pid") : {};

  return (
    <div className="glass-card p-5">
      <p className="section-label">Metrics</p>
      <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>Performance Metrics</h2>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
          <StatBox label="Avg Waiting Time" value={summary.avgWT} color="#00d4ff" />
          <StatBox label="Avg Turnaround" value={summary.avgTAT} color="#a855f7" />
          <StatBox label="Avg Response" value={summary.avgRT} color="#22d3a2" />
          <StatBox label="CPU Utilization" value={summary.cpuUtilization} color="#fbbf24" suffix="%" />
          <StatBox label="Throughput" value={summary.throughput} color="#fb923c" suffix="/u" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["PID", "Arrival", "Burst", "CT", "TAT", "WT", "RT"].map((h) => (
                <th key={h} className="text-left font-mono text-xs pb-2 pr-4" style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, idx) => (
              <motion.tr
                key={m.pid}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colorMap[m.pid] || "#fff" }} />
                    <span className="font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{m.pid}</span>
                  </div>
                </td>
                <td className="py-2 pr-4 font-mono" style={{ color: "var(--text-secondary)" }}>{m.arrivalTime}</td>
                <td className="py-2 pr-4 font-mono" style={{ color: "var(--text-secondary)" }}>{m.burstTime}</td>
                <td className="py-2 pr-4 font-mono text-accent-cyan">{m.ct}</td>
                <td className="py-2 pr-4 font-mono text-accent-purple">{m.tat}</td>
                <td className="py-2 pr-4 font-mono text-accent-green">{m.wt}</td>
                <td className="py-2 pr-4 font-mono text-accent-amber">{m.rt}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
        <span>CT = Completion Time</span>
        <span>TAT = Turnaround Time</span>
        <span>WT = Waiting Time</span>
        <span>RT = Response Time</span>
      </div>
    </div>
  );
}
