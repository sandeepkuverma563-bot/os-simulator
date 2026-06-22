import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePlus, HiOutlineX } from "react-icons/hi";
import { colorFor } from "../../utils/colors";

const defaultProcess = (n) => ({
  id: Date.now() + Math.random(),
  pid: `P${n}`,
  arrivalTime: 0,
  burstTime: 4,
  priority: 1,
});

export default function ProcessTable({ processes, setProcesses, showPriority }) {
  const addProcess = () => {
    setProcesses((prev) => [...prev, defaultProcess(prev.length + 1)]);
  };

  const removeProcess = (id) => {
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProcess = (id, field, value) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: field === "pid" ? value : Math.max(0, Number(value)) } : p
      )
    );
  };

  const loadExample = () => {
    setProcesses([
      { id: 1, pid: "P1", arrivalTime: 0, burstTime: 8, priority: 3 },
      { id: 2, pid: "P2", arrivalTime: 1, burstTime: 4, priority: 1 },
      { id: 3, pid: "P3", arrivalTime: 2, burstTime: 9, priority: 4 },
      { id: 4, pid: "P4", arrivalTime: 3, burstTime: 5, priority: 2 },
      { id: 5, pid: "P5", arrivalTime: 4, burstTime: 2, priority: 5 },
    ]);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label">Process Input</p>
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Process Queue</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={loadExample} className="btn-ghost text-xs">Load Example</button>
          <button onClick={addProcess} className="btn-primary text-xs flex items-center gap-1">
            <HiOutlinePlus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              <th className="text-left font-mono text-xs pb-2 w-6" style={{ color: "var(--text-muted)" }}>#</th>
              <th className="text-left font-mono text-xs pb-2 pr-3" style={{ color: "var(--text-muted)" }}>PID</th>
              <th className="text-left font-mono text-xs pb-2 pr-3" style={{ color: "var(--text-muted)" }}>Arrival</th>
              <th className="text-left font-mono text-xs pb-2 pr-3" style={{ color: "var(--text-muted)" }}>Burst</th>
              {showPriority && (
                <th className="text-left font-mono text-xs pb-2 pr-3" style={{ color: "var(--text-muted)" }}>Priority</th>
              )}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {processes.map((p, idx) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ borderBottom: "1px solid var(--border-color)" }}
                >
                  <td className="py-2 pr-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colorFor(idx) }} />
                  </td>
                  <td className="py-2 pr-3">
                    <input className="input-field w-16" value={p.pid} onChange={(e) => updateProcess(p.id, "pid", e.target.value)} />
                  </td>
                  <td className="py-2 pr-3">
                    <input type="number" min="0" className="input-field w-20" value={p.arrivalTime} onChange={(e) => updateProcess(p.id, "arrivalTime", e.target.value)} />
                  </td>
                  <td className="py-2 pr-3">
                    <input type="number" min="1" className="input-field w-20" value={p.burstTime} onChange={(e) => updateProcess(p.id, "burstTime", e.target.value)} />
                  </td>
                  {showPriority && (
                    <td className="py-2 pr-3">
                      <input type="number" min="1" className="input-field w-20" value={p.priority} onChange={(e) => updateProcess(p.id, "priority", e.target.value)} />
                    </td>
                  )}
                  <td className="py-2">
                    <button
                      onClick={() => removeProcess(p.id)}
                      disabled={processes.length <= 1}
                      className="transition-colors disabled:opacity-20"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <HiOutlineX className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {processes.length === 0 && (
        <div className="text-center py-8 text-sm font-mono" style={{ color: "var(--text-muted)" }}>
          No processes. Click "Add" to begin.
        </div>
      )}
    </div>
  );
}
