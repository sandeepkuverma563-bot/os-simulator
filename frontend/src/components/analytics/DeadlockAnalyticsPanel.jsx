import React, { useState } from "react";
import { HiOutlinePlay } from "react-icons/hi";
import { runBankers } from "../../services/api";
import { StatBox, LoadingSpinner } from "../common/Feedback";

const DEFAULT_ALLOCATION = [
  [0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2],
];
const DEFAULT_MAX = [
  [7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3],
];
const DEFAULT_AVAILABLE = [3, 3, 2];

export default function DeadlockAnalyticsPanel() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const data = await runBankers(DEFAULT_ALLOCATION, DEFAULT_MAX, DEFAULT_AVAILABLE);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalAllocated = DEFAULT_ALLOCATION.reduce((sum, row) => sum + row.reduce((s, v) => s + v, 0), 0);
  const totalResources = DEFAULT_AVAILABLE.reduce((s, v) => s + v, 0) + totalAllocated;
  const resourceUtilization = totalResources > 0 ? +((totalAllocated / totalResources) * 100).toFixed(1) : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label">Deadlock Analytics</p>
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Banker's Algorithm Sample</h2>
        </div>
        <button onClick={handleRun} disabled={loading} className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50">
          <HiOutlinePlay className="w-3.5 h-3.5" /> Run Sample
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Checking system safety…" />
      ) : result ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            <StatBox label="System State" value={result.safe ? "SAFE" : "UNSAFE"} color={result.safe ? "#22d3a2" : "#f87171"} />
            <StatBox label="Safe Sequence Length" value={result.safeSequence.length} color="#00d4ff" />
            <StatBox label="Resource Utilization" value={resourceUtilization} color="#fbbf24" suffix="%" />
          </div>

          {result.safe && (
            <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
              <span style={{ color: "var(--text-muted)" }}>Sequence:</span>
              {result.safeSequence.map((p, i) => (
                <React.Fragment key={p}>
                  <span style={{ color: "#00d4ff" }}>{p}</span>
                  {i < result.safeSequence.length - 1 && <span style={{ color: "var(--text-muted)" }}>→</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-sm font-mono text-center py-10" style={{ color: "var(--text-muted)" }}>
          Click "Run Sample" to generate deadlock analytics
        </div>
      )}
    </div>
  );
}
