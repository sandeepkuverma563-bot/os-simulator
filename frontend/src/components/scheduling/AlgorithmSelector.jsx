import React from "react";

const ALGORITHMS = [
  { value: "FCFS", label: "FCFS", desc: "First Come First Serve" },
  { value: "SJF", label: "SJF", desc: "Shortest Job First" },
  { value: "SRTF", label: "SRTF", desc: "Shortest Remaining Time First" },
  { value: "PRIORITY", label: "Priority", desc: "Priority Scheduling" },
  { value: "RR", label: "Round Robin", desc: "Preemptive with Quantum" },
];

export { ALGORITHMS };

export default function AlgorithmSelector({ algorithm, setAlgorithm, quantum, setQuantum }) {
  return (
    <div className="glass-card p-5">
      <p className="section-label">Algorithm</p>
      <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>Scheduling Algorithm</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        {ALGORITHMS.map((a) => {
          const active = algorithm === a.value;
          return (
            <button
              key={a.value}
              onClick={() => setAlgorithm(a.value)}
              className="p-3 rounded-lg text-left transition-all duration-200"
              style={{
                border: active ? "1px solid rgba(0,212,255,0.5)" : "1px solid var(--border-color)",
                backgroundColor: active ? "rgba(0,212,255,0.1)" : "var(--surface-2)",
                color: active ? "#00d4ff" : "var(--text-secondary)",
              }}
            >
              <div className="font-mono font-semibold text-sm">{a.label}</div>
              <div className="text-xs opacity-70 mt-0.5 leading-tight">{a.desc}</div>
            </button>
          );
        })}
      </div>

      {algorithm === "RR" && (
        <div className="flex items-center gap-3 mt-2">
          <label className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>Time Quantum:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={quantum}
            onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
            className="input-field w-24"
          />
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>ms</span>
        </div>
      )}
    </div>
  );
}
