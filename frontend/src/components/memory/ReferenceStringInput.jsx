import React, { useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";

const EXAMPLE_REFS = [
  { label: "Classic Belady", value: "7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1" },
  { label: "Belady's Anomaly", value: "1,2,3,4,1,2,5,1,2,3,4,5" },
  { label: "Short Demo", value: "1,2,3,4,1,2,5" },
];

export default function ReferenceStringInput({ referenceString, setReferenceString, frames, setFrames }) {
  const [rawInput, setRawInput] = useState(referenceString.join(", "));

  const applyInput = (text) => {
    setRawInput(text);
    const parsed = text
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "")
      .map((v) => Number(v))
      .filter((v) => Number.isInteger(v) && v >= 0);
    setReferenceString(parsed);
  };

  const loadExample = (value) => {
    applyInput(value);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label">Input</p>
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Page Reference String</h2>
        </div>
        <button onClick={() => loadExample(EXAMPLE_REFS[0].value)} className="btn-ghost text-xs flex items-center gap-1">
          <HiOutlineRefresh className="w-3.5 h-3.5" /> Load Example
        </button>
      </div>

      <label className="text-xs font-mono block mb-2" style={{ color: "var(--text-muted)" }}>
        Comma-separated page numbers
      </label>
      <textarea
        value={rawInput}
        onChange={(e) => applyInput(e.target.value)}
        rows={2}
        className="input-field w-full resize-none"
        placeholder="e.g. 7, 0, 1, 2, 0, 3, 0, 4"
      />

      <div className="flex items-center gap-3 mt-4">
        <label className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>Number of Frames:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={frames}
          onChange={(e) => setFrames(Math.max(1, Number(e.target.value)))}
          className="input-field w-20"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {EXAMPLE_REFS.map((ex) => (
          <button key={ex.label} onClick={() => loadExample(ex.value)} className="btn-ghost text-xs">
            {ex.label}
          </button>
        ))}
      </div>

      {referenceString.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {referenceString.map((p, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded text-xs font-mono"
              style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
