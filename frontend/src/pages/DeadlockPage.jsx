import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineLockClosed, HiOutlinePlay, HiOutlinePause, HiOutlineRewind, HiOutlineFastForward } from "react-icons/hi";
import MatrixEditor, { VectorEditor, MatrixDimensionControls } from "../components/deadlock/MatrixEditor";
import MatrixSummary from "../components/deadlock/MatrixSummary";
import SafeSequenceView from "../components/deadlock/SafeSequenceView";
import { ErrorBanner, EmptyState } from "../components/common/Feedback";
import { runBankers } from "../services/api";

const DEFAULT_ALLOCATION = [
  [0, 1, 0],
  [2, 0, 0],
  [3, 0, 2],
  [2, 1, 1],
  [0, 0, 2],
];
const DEFAULT_MAX = [
  [7, 5, 3],
  [3, 2, 2],
  [9, 0, 2],
  [2, 2, 2],
  [4, 3, 3],
];
const DEFAULT_AVAILABLE = [3, 3, 2];

function makeMatrix(rows, cols, fill = 0) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

function resizeMatrix(matrix, rows, cols) {
  const next = makeMatrix(rows, cols, 0);
  for (let i = 0; i < Math.min(rows, matrix.length); i++) {
    for (let j = 0; j < Math.min(cols, matrix[i].length); j++) {
      next[i][j] = matrix[i][j];
    }
  }
  return next;
}

function resizeVector(vec, len) {
  return Array.from({ length: len }, (_, i) => vec[i] ?? 0);
}

export default function DeadlockPage() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [numResources, setNumResources] = useState(3);

  const [allocation, setAllocation] = useState(DEFAULT_ALLOCATION);
  const [max, setMax] = useState(DEFAULT_MAX);
  const [available, setAvailable] = useState(DEFAULT_AVAILABLE);

  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    setAllocation((m) => resizeMatrix(m, numProcesses, numResources));
    setMax((m) => resizeMatrix(m, numProcesses, numResources));
    setAvailable((v) => resizeVector(v, numResources));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numProcesses, numResources]);

  const totalSteps = result?.steps?.length ?? 0;

  useEffect(() => {
    if (!isPlaying || !result) return;
    intervalRef.current = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= totalSteps - 1) {
          setIsPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 900);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, result, totalSteps]);

  const processLabels = Array.from({ length: numProcesses }, (_, i) => `P${i}`);
  const resourceLabels = Array.from({ length: numResources }, (_, i) => `R${i}`);

  const loadExample = () => {
    setNumProcesses(5);
    setNumResources(3);
    setAllocation(DEFAULT_ALLOCATION);
    setMax(DEFAULT_MAX);
    setAvailable(DEFAULT_AVAILABLE);
  };

  const handleRun = async () => {
    setError(null);
    setIsRunning(true);
    setIsPlaying(false);
    setCurrentStep(0);
    setResult(null);

    try {
      const data = await runBankers(allocation, max, available);
      setResult(data);
      if (data.safe) setTimeout(() => setIsPlaying(true), 200);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unknown error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setError(null);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="space-y-4">
      <ErrorBanner error={error} onClose={() => setError(null)} />

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label">Configuration</p>
            <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Banker's Algorithm Input</h2>
          </div>
          <button onClick={loadExample} className="btn-ghost text-xs">Load Example</button>
        </div>

        <MatrixDimensionControls
          numProcesses={numProcesses}
          setNumProcesses={setNumProcesses}
          numResources={numResources}
          setNumResources={setNumResources}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <MatrixEditor title="Allocation Matrix" matrix={allocation} setMatrix={setAllocation} rowLabels={processLabels} colLabels={resourceLabels} color="#00d4ff" />
          <MatrixEditor title="Maximum Matrix" matrix={max} setMatrix={setMax} rowLabels={processLabels} colLabels={resourceLabels} color="#a855f7" />
        </div>

        <div className="mt-6">
          <VectorEditor title="Available Resources" vector={available} setVector={setAvailable} colLabels={resourceLabels} color="#22d3a2" />
        </div>
      </div>

      <div className="glass-card p-5">
        <p className="section-label">Controls</p>
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={handleRun} disabled={isRunning} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <HiOutlinePlay className="w-4 h-4" /> Run Banker's Algorithm
          </button>

          {result && result.safe && (
            <>
              <div className="h-6 w-px" style={{ backgroundColor: "var(--border-color)" }} />
              <button onClick={() => { setIsPlaying(false); setCurrentStep((s) => Math.max(s - 1, 0)); }} disabled={currentStep <= 0} className="btn-ghost px-3 disabled:opacity-30">
                <HiOutlineRewind className="w-4 h-4" />
              </button>
              <button onClick={() => setIsPlaying((v) => !v)} className="btn-ghost px-3">
                {isPlaying ? <HiOutlinePause className="w-4 h-4" /> : <HiOutlinePlay className="w-4 h-4" />}
              </button>
              <button onClick={() => { setIsPlaying(false); setCurrentStep((s) => Math.min(s + 1, totalSteps - 1)); }} disabled={currentStep >= totalSteps - 1} className="btn-ghost px-3 disabled:opacity-30">
                <HiOutlineFastForward className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono ml-2" style={{ color: "var(--text-muted)" }}>
                Step <span style={{ color: "#00d4ff" }}>{Math.min(currentStep + 1, totalSteps)}</span> / {totalSteps}
              </span>
            </>
          )}

          <div className="ml-auto">
            <button onClick={handleReset} className="btn-danger">Reset</button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="glass-card p-5">
              <p className="section-label">State Matrices</p>
              <MatrixSummary allocation={allocation} max={max} need={result.need} available={available} processLabels={processLabels} resourceLabels={resourceLabels} />
            </div>

            <div className="glass-card p-5">
              <p className="section-label">Safety Analysis</p>
              <SafeSequenceView result={result} currentStep={currentStep} resourceLabels={resourceLabels} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState icon={HiOutlineLockClosed} title="No safety check run yet" subtitle="Configure the Allocation, Maximum, and Available matrices, then run the algorithm" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
