import React from "react";
import { HiOutlinePlay, HiOutlinePause, HiOutlineRewind, HiOutlineFastForward, HiOutlineSwitchHorizontal } from "react-icons/hi";

const SPEEDS = [0.5, 1, 1.5, 2, 3];

export default function ControlPanel({
  onRun, onReset, onPlayPause, onStepForward, onStepBackward,
  isPlaying, isRunning, hasResult, currentStep, totalSteps,
  speed, setSpeed, compareMode, setCompareMode,
}) {
  return (
    <div className="glass-card p-5">
      <p className="section-label">Controls</p>
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={onRun} disabled={isRunning} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <HiOutlinePlay className="w-4 h-4" /> Run Simulation
        </button>

        <button
          onClick={() => setCompareMode((v) => !v)}
          className="btn-ghost flex items-center gap-2"
          style={compareMode ? { borderColor: "rgba(168,85,247,0.5)", color: "#a855f7" } : {}}
        >
          <HiOutlineSwitchHorizontal className="w-4 h-4" />
          {compareMode ? "Compare ON" : "Compare"}
        </button>

        <div className="h-6 w-px" style={{ backgroundColor: "var(--border-color)" }} />

        {hasResult && (
          <>
            <button onClick={onStepBackward} disabled={currentStep <= 0} className="btn-ghost px-3 disabled:opacity-30" title="Step Back">
              <HiOutlineRewind className="w-4 h-4" />
            </button>
            <button onClick={onPlayPause} className="btn-ghost px-3" title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <HiOutlinePause className="w-4 h-4" /> : <HiOutlinePlay className="w-4 h-4" />}
            </button>
            <button onClick={onStepForward} disabled={currentStep >= totalSteps} className="btn-ghost px-3 disabled:opacity-30" title="Step Forward">
              <HiOutlineFastForward className="w-4 h-4" />
            </button>

            <div className="h-6 w-px" style={{ backgroundColor: "var(--border-color)" }} />

            <div className="flex items-center gap-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="px-2 py-1 rounded text-xs font-mono transition-all"
                  style={
                    speed === s
                      ? { backgroundColor: "rgba(0,212,255,0.15)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.4)" }
                      : { color: "var(--text-muted)" }
                  }
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="h-6 w-px" style={{ backgroundColor: "var(--border-color)" }} />

            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              Step <span style={{ color: "#00d4ff" }}>{Math.min(currentStep + 1, totalSteps)}</span> / {totalSteps}
            </span>
          </>
        )}

        <div className="ml-auto">
          <button onClick={onReset} className="btn-danger">Reset</button>
        </div>
      </div>
    </div>
  );
}
