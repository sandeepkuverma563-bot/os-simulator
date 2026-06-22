import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineTemplate, HiOutlinePlay } from "react-icons/hi";
import AllocationInput from "../components/allocation/AllocationInput";
import AllocationAlgorithmSelector from "../components/allocation/AllocationAlgorithmSelector";
import MemoryBlockVisualizer from "../components/allocation/MemoryBlockVisualizer";
import AllocationStats from "../components/allocation/AllocationStats";
import { ErrorBanner, EmptyState } from "../components/common/Feedback";
import { runAllocation } from "../services/api";

const DEFAULT_BLOCKS = [
  { id: "B1", size: 100, _key: 1 },
  { id: "B2", size: 500, _key: 2 },
  { id: "B3", size: 200, _key: 3 },
  { id: "B4", size: 300, _key: 4 },
  { id: "B5", size: 600, _key: 5 },
];

const DEFAULT_PROCESSES = [
  { id: "P1", size: 212, _key: 11 },
  { id: "P2", size: 417, _key: 12 },
  { id: "P3", size: 112, _key: 13 },
  { id: "P4", size: 426, _key: 14 },
];

export default function AllocationPage() {
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS);
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [algorithm, setAlgorithm] = useState("FIRST_FIT");

  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const handleRun = async () => {
    setError(null);
    setIsRunning(true);
    setResult(null);

    try {
      const cleanBlocks = blocks.map(({ id, size }) => ({ id, size }));
      const cleanProcesses = processes.map(({ id, size }) => ({ id, size }));
      const data = await runAllocation(algorithm, cleanBlocks, cleanProcesses);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unknown error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <ErrorBanner error={error} onClose={() => setError(null)} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <AllocationInput blocks={blocks} setBlocks={setBlocks} processes={processes} setProcesses={setProcesses} />
        </div>
        <div className="lg:col-span-2">
          <AllocationAlgorithmSelector algorithm={algorithm} setAlgorithm={setAlgorithm} />
        </div>
      </div>

      <div className="glass-card p-5">
        <p className="section-label">Controls</p>
        <div className="flex gap-2">
          <button onClick={handleRun} disabled={isRunning} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <HiOutlinePlay className="w-4 h-4" /> Run Allocation
          </button>
          <button onClick={handleReset} className="btn-danger ml-auto">Reset</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="glass-card p-5">
              <p className="section-label">Memory Layout</p>
              <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>
                Block Allocation
                <span className="ml-2 px-2 py-0.5 rounded font-mono text-xs" style={{ backgroundColor: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.25)" }}>
                  {result.algorithm.replace("_", " ")}
                </span>
              </h2>
              <MemoryBlockVisualizer blockStates={result.blockStates} allocations={result.allocations} />
            </div>

            <div className="glass-card p-5">
              <p className="section-label">Results</p>
              <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>Allocation Statistics</h2>
              <AllocationStats stats={result.stats} allocations={result.allocations} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState icon={HiOutlineTemplate} title="No allocation run yet" subtitle="Define blocks and processes, choose a strategy, and click Run Allocation" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
