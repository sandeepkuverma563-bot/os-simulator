import React from "react";

function ReadOnlyMatrix({ title, matrix, rowLabels, colLabels, color }) {
  return (
    <div>
      <h3 className="text-xs font-mono uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>{title}</h3>
      <table className="text-sm border-separate" style={{ borderSpacing: "3px" }}>
        <thead>
          <tr>
            <th></th>
            {colLabels.map((c) => (
              <th key={c} className="text-xs font-mono pb-1 px-1" style={{ color: "var(--text-muted)" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="text-xs font-mono pr-2 text-right" style={{ color: "var(--text-muted)" }}>{rowLabels[i]}</td>
              {row.map((val, j) => (
                <td key={j}>
                  <div
                    className="w-9 h-8 flex items-center justify-center rounded font-mono text-sm font-semibold"
                    style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border-color)", color }}
                  >
                    {val}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MatrixSummary({ allocation, max, need, available, processLabels, resourceLabels }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <ReadOnlyMatrix title="Allocation" matrix={allocation} rowLabels={processLabels} colLabels={resourceLabels} color="#00d4ff" />
      <ReadOnlyMatrix title="Maximum" matrix={max} rowLabels={processLabels} colLabels={resourceLabels} color="#a855f7" />
      <ReadOnlyMatrix title="Need (Max - Allocation)" matrix={need} rowLabels={processLabels} colLabels={resourceLabels} color="#fbbf24" />

      <div className="sm:col-span-3">
        <h3 className="text-xs font-mono uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>Available Resources</h3>
        <div className="flex gap-2">
          {available.map((v, j) => (
            <div key={j} className="flex flex-col items-center gap-1">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{resourceLabels[j]}</span>
              <div className="w-9 h-8 flex items-center justify-center rounded font-mono text-sm font-semibold" style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border-color)", color: "#22d3a2" }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
