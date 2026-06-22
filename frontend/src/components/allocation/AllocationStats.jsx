import React from "react";
import { StatBox } from "../common/Feedback";

export default function AllocationStats({ stats, allocations }) {
  if (!stats) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBox label="Memory Utilization" value={stats.memoryUtilization} color="#00d4ff" suffix="%" />
        <StatBox label="Internal Fragmentation" value={stats.internalFragmentation} color="#fbbf24" suffix="KB" />
        <StatBox label="External Fragmentation" value={stats.externalFragmentation} color="#f87171" suffix="KB" />
        <StatBox label="Free Memory" value={stats.freeMemory} color="#22d3a2" suffix="KB" />
        <StatBox label="Processes Allocated" value={stats.processesAllocated} color="#a855f7" />
        <StatBox label="Processes Unallocated" value={stats.processesUnallocated} color="#fb923c" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["Process", "Size", "Allocated Block", "Internal Frag."].map((h) => (
                <th key={h} className="text-left font-mono text-xs pb-2 pr-4" style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allocations.map((a) => (
              <tr key={a.processId} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td className="py-2 pr-4 font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{a.processId}</td>
                <td className="py-2 pr-4 font-mono" style={{ color: "var(--text-secondary)" }}>{a.processSize}KB</td>
                <td className="py-2 pr-4 font-mono">
                  {a.blockId ? (
                    <span style={{ color: "#22d3a2" }}>{a.blockId}</span>
                  ) : (
                    <span style={{ color: "#f87171" }}>Unallocated</span>
                  )}
                </td>
                <td className="py-2 pr-4 font-mono" style={{ color: "var(--text-secondary)" }}>{a.internalFragmentation}KB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
