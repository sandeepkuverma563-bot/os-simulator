import React from "react";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";

/**
 * Generic editable matrix grid. `matrix` is number[][].
 */
export default function MatrixEditor({ title, matrix, setMatrix, rowLabels, colLabels, color = "#00d4ff" }) {
  const updateCell = (i, j, value) => {
    const next = matrix.map((row) => [...row]);
    next[i][j] = Math.max(0, Number(value) || 0);
    setMatrix(next);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <div className="overflow-x-auto">
        <table className="text-sm border-separate" style={{ borderSpacing: "4px" }}>
          <thead>
            <tr>
              <th></th>
              {colLabels.map((c) => (
                <th key={c} className="text-xs font-mono pb-1" style={{ color: "var(--text-muted)" }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="text-xs font-mono pr-2 text-right" style={{ color: "var(--text-muted)" }}>{rowLabels[i]}</td>
                {row.map((val, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      min="0"
                      value={val}
                      onChange={(e) => updateCell(i, j, e.target.value)}
                      className="input-field w-14 text-center"
                      style={{ color }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function VectorEditor({ title, vector, setVector, colLabels, color = "#fbbf24" }) {
  const updateCell = (j, value) => {
    const next = [...vector];
    next[j] = Math.max(0, Number(value) || 0);
    setVector(next);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{title}</h3>
      <div className="flex gap-2">
        {vector.map((val, j) => (
          <div key={j} className="flex flex-col items-center gap-1">
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{colLabels[j]}</span>
            <input
              type="number"
              min="0"
              value={val}
              onChange={(e) => updateCell(j, e.target.value)}
              className="input-field w-14 text-center"
              style={{ color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MatrixDimensionControls({ numProcesses, setNumProcesses, numResources, setNumResources }) {
  const Btn = ({ onClick, children }) => (
    <button onClick={onClick} className="btn-ghost px-2 py-1">{children}</button>
  );

  return (
    <div className="flex flex-wrap gap-6">
      <div>
        <span className="text-xs font-mono block mb-2" style={{ color: "var(--text-muted)" }}>Processes</span>
        <div className="flex items-center gap-2">
          <Btn onClick={() => setNumProcesses((n) => Math.max(2, n - 1))}><HiOutlineMinus className="w-3.5 h-3.5" /></Btn>
          <span className="font-mono font-semibold w-6 text-center" style={{ color: "var(--text-primary)" }}>{numProcesses}</span>
          <Btn onClick={() => setNumProcesses((n) => Math.min(8, n + 1))}><HiOutlinePlus className="w-3.5 h-3.5" /></Btn>
        </div>
      </div>
      <div>
        <span className="text-xs font-mono block mb-2" style={{ color: "var(--text-muted)" }}>Resource Types</span>
        <div className="flex items-center gap-2">
          <Btn onClick={() => setNumResources((n) => Math.max(1, n - 1))}><HiOutlineMinus className="w-3.5 h-3.5" /></Btn>
          <span className="font-mono font-semibold w-6 text-center" style={{ color: "var(--text-primary)" }}>{numResources}</span>
          <Btn onClick={() => setNumResources((n) => Math.min(5, n + 1))}><HiOutlinePlus className="w-3.5 h-3.5" /></Btn>
        </div>
      </div>
    </div>
  );
}
