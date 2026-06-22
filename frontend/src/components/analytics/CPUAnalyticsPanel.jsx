import React, { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { HiOutlinePlay } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";
import { generatePerformanceTest } from "../../services/api";
import { StatBox } from "../common/Feedback";
import { LoadingSpinner } from "../common/Feedback";

export default function CPUAnalyticsPanel() {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textColor = theme === "dark" ? "#b4b4c6" : "#56566b";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const result = await generatePerformanceTest({
        numProcesses: 10,
        arrivalRange: [0, 12],
        burstRange: [1, 15],
        priorityRange: [1, 5],
        quantum: 2,
      });
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data?.leaderboard?.map((e) => ({
    algorithm: e.algorithm,
    "Avg WT": e.avgWT,
    "Avg TAT": e.avgTAT,
    "CPU Util %": e.cpuUtilization,
  })) || [];

  const best = data?.leaderboard?.[0];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label">CPU Analytics</p>
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Scheduling Performance</h2>
        </div>
        <button onClick={handleRun} disabled={loading} className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50">
          <HiOutlinePlay className="w-3.5 h-3.5" /> Run Sample
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Running 5 scheduling algorithms…" />
      ) : data ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <StatBox label="Best Algorithm" value={best?.algorithm || "—"} color="#fbbf24" />
            <StatBox label="Best Avg WT" value={best?.avgWT ?? "—"} color="#00d4ff" />
            <StatBox label="Best CPU Util" value={best?.cpuUtilization ?? "—"} color="#22d3a2" suffix="%" />
            <StatBox label="Sample Size" value={data.processes.length} color="#a855f7" />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="algorithm" tick={{ fill: textColor, fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <YAxis tick={{ fill: textColor, fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#1a1a28" : "#fff", border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Bar dataKey="Avg WT" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Avg TAT" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="CPU Util %" fill="#22d3a2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="text-sm font-mono text-center py-10" style={{ color: "var(--text-muted)" }}>
          Click "Run Sample" to generate CPU scheduling analytics
        </div>
      )}
    </div>
  );
}
