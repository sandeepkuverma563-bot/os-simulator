import React from "react";

const ALGORITHMS = [
  { value: "FIFO", label: "FIFO", desc: "First In First Out" },
  { value: "LRU", label: "LRU", desc: "Least Recently Used" },
  { value: "OPTIMAL", label: "Optimal", desc: "Belady's Optimal (theoretical best)" },
];

export { ALGORITHMS as PAGE_ALGORITHMS };

export default function PageAlgorithmSelector({ algorithm, setAlgorithm }) {
  return (
    <div className="glass-card p-5">
      <p className="section-label">Algorithm</p>
      <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>Page Replacement Strategy</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
    </div>
  );
}
