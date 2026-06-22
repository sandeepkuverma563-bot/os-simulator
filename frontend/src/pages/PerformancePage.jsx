import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBeaker, HiOutlinePlay } from "react-icons/hi";
import WorkloadGenerator from "../components/performance/WorkloadGenerator";
import Leaderboard from "../components/performance/Leaderboard";
import PerformanceChart from "../components/performance/PerformanceChart";
import { ErrorBanner, EmptyState, LoadingSpinner } from "../components/common/Feedback";
import { generatePerformanceTest } from "../services/api";

export default function PerformancePage() {
  const [numProcesses, setNumProcesses] = useState(8);
  const [arrivalRange, setArrivalRange] = useState([0, 10]);
  const [burstRange, setBurstRange] = useState([1, 12]);
  const [priorityRange, setPriorityRange] = useState([1, 5]);
  const [quantum, setQuantum] = useState(2);

  const [data, setData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setError(null);
    setIsRunning(true);
    setData(null);

    try {
      const result = await generatePerformanceTest({
        numProcesses,
        arrivalRange,
        burstRange,
        priorityRange,
        quantum,
      });
      setData(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unknown error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <ErrorBanner error={error} onClose={() => setError(null)} />

      <WorkloadGenerator
        numProcesses={numProcesses} setNumProcesses={setNumProcesses}
        arrivalRange={arrivalRange} setArrivalRange={setArrivalRange}
        burstRange={burstRange} setBurstRange={setBurstRange}
        priorityRange={priorityRange} setPriorityRange={setPriorityRange}
        quantum={quantum} setQuantum={setQuantum}
      />

      <div className="glass-card p-5">
        <p className="section-label">Controls</p>
        <button onClick={handleGenerate} disabled={isRunning} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <HiOutlinePlay className="w-4 h-4" /> Generate & Compare All Algorithms
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isRunning ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-card"><LoadingSpinner label="Generating random workload and running 5 algorithms…" /></div>
          </motion.div>
        ) : data ? (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="glass-card p-5">
              <p className="section-label">Generated Workload</p>
              <h2 className="font-semibold text-base mb-3" style={{ color: "var(--text-primary)" }}>{data.processes.length} Random Processes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                      {["PID", "Arrival", "Burst", "Priority"].map((h) => (
                        <th key={h} className="text-left font-mono text-xs pb-2 pr-4" style={{ color: "var(--text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.processes.map((p) => (
                      <tr key={p.pid} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td className="py-1.5 pr-4 font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{p.pid}</td>
                        <td className="py-1.5 pr-4 font-mono" style={{ color: "var(--text-secondary)" }}>{p.arrivalTime}</td>
                        <td className="py-1.5 pr-4 font-mono" style={{ color: "var(--text-secondary)" }}>{p.burstTime}</td>
                        <td className="py-1.5 pr-4 font-mono" style={{ color: "var(--text-secondary)" }}>{p.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Leaderboard leaderboard={data.leaderboard} />
            <PerformanceChart leaderboard={data.leaderboard} />
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState icon={HiOutlineBeaker} title="No test generated yet" subtitle="Configure the workload parameters and click Generate & Compare" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
