import React from "react";

function RangeInput({ label, range, setRange, color }) {
  return (
    <div>
      <label className="text-xs font-mono block mb-2" style={{ color: "var(--text-muted)" }}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={range[0]}
          onChange={(e) => setRange([Number(e.target.value), range[1]])}
          className="input-field w-20"
          style={{ color }}
        />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>to</span>
        <input
          type="number"
          min="0"
          value={range[1]}
          onChange={(e) => setRange([range[0], Number(e.target.value)])}
          className="input-field w-20"
          style={{ color }}
        />
      </div>
    </div>
  );
}

export default function WorkloadGenerator({
  numProcesses, setNumProcesses,
  arrivalRange, setArrivalRange,
  burstRange, setBurstRange,
  priorityRange, setPriorityRange,
  quantum, setQuantum,
}) {
  return (
    <div className="glass-card p-5">
      <p className="section-label">Random Test Generator</p>
      <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>Workload Configuration</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label className="text-xs font-mono block mb-2" style={{ color: "var(--text-muted)" }}>Number of Processes</label>
          <input
            type="number"
            min="2"
            max="50"
            value={numProcesses}
            onChange={(e) => setNumProcesses(Math.min(50, Math.max(2, Number(e.target.value))))}
            className="input-field w-24"
            style={{ color: "#00d4ff" }}
          />
        </div>

        <RangeInput label="Arrival Time Range" range={arrivalRange} setRange={setArrivalRange} color="#a855f7" />
        <RangeInput label="Burst Time Range" range={burstRange} setRange={setBurstRange} color="#22d3a2" />
        <RangeInput label="Priority Range" range={priorityRange} setRange={setPriorityRange} color="#fbbf24" />

        <div>
          <label className="text-xs font-mono block mb-2" style={{ color: "var(--text-muted)" }}>Round Robin Quantum</label>
          <input
            type="number"
            min="1"
            value={quantum}
            onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
            className="input-field w-24"
            style={{ color: "#fb923c" }}
          />
        </div>
      </div>
    </div>
  );
}
