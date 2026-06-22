import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineCog } from "react-icons/hi";
import ProcessTable from "../components/scheduling/ProcessTable";
import AlgorithmSelector from "../components/scheduling/AlgorithmSelector";
import ControlPanel from "../components/scheduling/ControlPanel";
import GanttChart from "../components/scheduling/GanttChart";
import MetricsTable from "../components/scheduling/MetricsTable";
import ComparisonView from "../components/scheduling/ComparisonView";
import { ErrorBanner, EmptyState } from "../components/common/Feedback";
import { runScheduling, compareScheduling } from "../services/api";

const DEFAULT_PROCESSES = [
  { id: 1, pid: "P1", arrivalTime: 0, burstTime: 8, priority: 3 },
  { id: 2, pid: "P2", arrivalTime: 1, burstTime: 4, priority: 1 },
  { id: 3, pid: "P3", arrivalTime: 2, burstTime: 9, priority: 4 },
  { id: 4, pid: "P4", arrivalTime: 3, burstTime: 5, priority: 2 },
];

export default function SchedulingPage() {
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [quantum, setQuantum] = useState(2);
  const [compareMode, setCompareMode] = useState(false);
  const [compareAlgo1, setCompareAlgo1] = useState("SJF");
  const [compareAlgo2, setCompareAlgo2] = useState("RR");

  const [result, setResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);
  const totalSteps = result?.timeline?.length ?? 0;

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
    }, 800 / speed);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, result, totalSteps]);

  const handleRun = async () => {
    setError(null);
    setIsRunning(true);
    setIsPlaying(false);
    setCurrentStep(0);
    setResult(null);
    setCompareResult(null);

    try {
      if (compareMode) {
        const data = await compareScheduling([compareAlgo1, compareAlgo2], processes, quantum);
        setCompareResult(data.results);
      } else {
        const data = await runScheduling(algorithm, processes, quantum);
        setResult(data);
        setTimeout(() => setIsPlaying(true), 200);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unknown error");
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCompareResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setError(null);
    clearInterval(intervalRef.current);
  };

  const handlePlayPause = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((v) => !v);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const showPriority = algorithm === "PRIORITY" || compareAlgo1 === "PRIORITY" || compareAlgo2 === "PRIORITY";

  return (
    <div className="space-y-4">
      <ErrorBanner error={error} onClose={() => setError(null)} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <ProcessTable processes={processes} setProcesses={setProcesses} showPriority={showPriority} />
        </div>
        <div className="lg:col-span-3">
          <AlgorithmSelector
            algorithm={compareMode ? compareAlgo1 : algorithm}
            setAlgorithm={compareMode ? setCompareAlgo1 : setAlgorithm}
            quantum={quantum}
            setQuantum={setQuantum}
          />
        </div>
      </div>

      <ControlPanel
        onRun={handleRun}
        onReset={handleReset}
        onPlayPause={handlePlayPause}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        isPlaying={isPlaying}
        isRunning={isRunning}
        hasResult={!!result}
        currentStep={currentStep}
        totalSteps={totalSteps}
        speed={speed}
        setSpeed={setSpeed}
        compareMode={compareMode}
        setCompareMode={setCompareMode}
      />

      {compareMode ? (
        <ComparisonView
          compareAlgo1={compareAlgo1}
          setCompareAlgo1={setCompareAlgo1}
          compareAlgo2={compareAlgo2}
          setCompareAlgo2={setCompareAlgo2}
          compareResult={compareResult}
          processes={processes}
          currentStep={compareResult ? Math.max(...compareResult.map((r) => r.timeline.length - 1)) : 0}
        />
      ) : (
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="section-label">Gantt Chart</p>
                    <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                      Execution Timeline
                      <span className="ml-2 px-2 py-0.5 rounded font-mono text-xs" style={{ backgroundColor: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.25)" }}>
                        {result.algorithm}
                      </span>
                    </h2>
                  </div>
                  {result.timeline[currentStep] && (
                    <div className="text-right">
                      <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Executing</div>
                      <div className="font-mono font-bold" style={{ color: "#00d4ff" }}>{result.timeline[currentStep].pid}</div>
                      <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        t={result.timeline[currentStep].start}→{result.timeline[currentStep].end}
                      </div>
                    </div>
                  )}
                </div>
                <GanttChart timeline={result.timeline} currentStep={currentStep} processes={processes} />
              </div>

              <MetricsTable metrics={result.metrics} summary={result.summary} processes={processes} />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState icon={HiOutlineCog} title="No simulation running" subtitle="Add processes, select an algorithm, and click Run Simulation" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
