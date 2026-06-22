import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { HiOutlinePlay } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";
import { runPageReplacement } from "../../services/api";
import { StatBox, LoadingSpinner } from "../common/Feedback";

const DEFAULT_REF = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];

export default function MemoryAnalyticsPanel() {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textColor = theme === "dark" ? "#b4b4c6" : "#56566b";

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const [fifo, lru, optimal] = await Promise.all([
        runPageReplacement("FIFO", DEFAULT_REF, 3),
        runPageReplacement("LRU", DEFAULT_REF, 3),
        runPageReplacement("OPTIMAL", DEFAULT_REF, 3),
      ]);
      setResults({ fifo, lru, optimal });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = results
    ? [
        { name: "Hits", value: results.lru.hits },
        { name: "Faults", value: results.lru.faults },
      ]
    : [];

  const barData = results
    ? [
        { algorithm: "FIFO", "Hit Ratio %": +(results.fifo.hitRatio * 100).toFixed(1), "Fault Ratio %": +(results.fifo.faultRatio * 100).toFixed(1) },
        { algorithm: "LRU", "Hit Ratio %": +(results.lru.hitRatio * 100).toFixed(1), "Fault Ratio %": +(results.lru.faultRatio * 100).toFixed(1) },
        { algorithm: "OPTIMAL", "Hit Ratio %": +(results.optimal.hitRatio * 100).toFixed(1), "Fault Ratio %": +(results.optimal.faultRatio * 100).toFixed(1) },
      ]
    : [];

  const PIE_COLORS = ["#22d3a2", "#f87171"];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label">Memory Analytics</p>
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Page Replacement Performance</h2>
        </div>
        <button onClick={handleRun} disabled={loading} className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50">
          <HiOutlinePlay className="w-3.5 h-3.5" /> Run Sample
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Running FIFO, LRU, and Optimal…" />
      ) : results ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <StatBox label="FIFO Faults" value={results.fifo.faults} color="#f87171" />
            <StatBox label="LRU Faults" value={results.lru.faults} color="#fbbf24" />
            <StatBox label="Optimal Faults" value={results.optimal.faults} color="#22d3a2" />
            <StatBox label="LRU Hit Rate" value={(results.lru.hitRatio * 100).toFixed(1)} color="#00d4ff" suffix="%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-mono mb-2" style={{ color: "var(--text-muted)" }}>LRU Hit vs Fault</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#1a1a28" : "#fff", border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-xs font-mono mb-2" style={{ color: "var(--text-muted)" }}>Hit/Fault Ratio by Algorithm</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="algorithm" tick={{ fill: textColor, fontSize: 11, fontFamily: "JetBrains Mono" }} />
                  <YAxis tick={{ fill: textColor, fontSize: 11, fontFamily: "JetBrains Mono" }} />
                  <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#1a1a28" : "#fff", border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="Hit Ratio %" fill="#22d3a2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Fault Ratio %" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className="text-sm font-mono text-center py-10" style={{ color: "var(--text-muted)" }}>
          Click "Run Sample" to generate memory analytics
        </div>
      )}
    </div>
  );
}
