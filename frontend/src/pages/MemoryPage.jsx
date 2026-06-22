import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineDatabase, HiOutlinePlay, HiOutlinePause, HiOutlineRewind, HiOutlineFastForward } from "react-icons/hi";
import ReferenceStringInput from "../components/memory/ReferenceStringInput";
import PageAlgorithmSelector from "../components/memory/PageAlgorithmSelector";
import FrameVisualizer from "../components/memory/FrameVisualizer";
import PageStats from "../components/memory/PageStats";
import { ErrorBanner, EmptyState } from "../components/common/Feedback";
import { runPageReplacement } from "../services/api";

const DEFAULT_REF = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];

export default function MemoryPage() {
  const [referenceString, setReferenceString] = useState(DEFAULT_REF);
  const [frames, setFrames] = useState(3);
  const [algorithm, setAlgorithm] = useState("FIFO");

  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);
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
    }, 700);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, result, totalSteps]);

  const handleRun = async () => {
    setError(null);
    if (referenceString.length === 0) {
      setError("Please enter a reference string before running the simulation.");
      return;
    }
    setIsRunning(true);
    setIsPlaying(false);
    setCurrentStep(0);
    setResult(null);

    try {
      const data = await runPageReplacement(algorithm, referenceString, frames);
      setResult(data);
      setTimeout(() => setIsPlaying(true), 200);
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

  const handlePlayPause = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((v) => !v);
    }
  };

  return (
    <div className="space-y-4">
      <ErrorBanner error={error} onClose={() => setError(null)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReferenceStringInput referenceString={referenceString} setReferenceString={setReferenceString} frames={frames} setFrames={setFrames} />
        <PageAlgorithmSelector algorithm={algorithm} setAlgorithm={setAlgorithm} />
      </div>

      <div className="glass-card p-5">
        <p className="section-label">Controls</p>
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={handleRun} disabled={isRunning} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <HiOutlinePlay className="w-4 h-4" /> Run Simulation
          </button>

          <div className="h-6 w-px" style={{ backgroundColor: "var(--border-color)" }} />

          {result && (
            <>
              <button onClick={() => { setIsPlaying(false); setCurrentStep((s) => Math.max(s - 1, 0)); }} disabled={currentStep <= 0} className="btn-ghost px-3 disabled:opacity-30">
                <HiOutlineRewind className="w-4 h-4" />
              </button>
              <button onClick={handlePlayPause} className="btn-ghost px-3">
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="section-label">Frame Visualization</p>
                  <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                    Page Replacement
                    <span className="ml-2 px-2 py-0.5 rounded font-mono text-xs" style={{ backgroundColor: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.25)" }}>
                      {result.algorithm}
                    </span>
                  </h2>
                </div>
              </div>
              <FrameVisualizer steps={result.steps} currentStep={currentStep} frameCount={result.frameCount} />
            </div>

            <PageStats result={result} />
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState icon={HiOutlineDatabase} title="No simulation running" subtitle="Enter a reference string, choose an algorithm, and click Run Simulation" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
