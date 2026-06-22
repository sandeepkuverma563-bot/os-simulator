import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "../../context/ThemeContext";

export default function PerformanceChart({ leaderboard }) {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textColor = theme === "dark" ? "#b4b4c6" : "#56566b";

  if (!leaderboard || leaderboard.length === 0) return null;

  const data = leaderboard.map((e) => ({
    algorithm: e.algorithm,
    "Avg WT": e.avgWT,
    "Avg TAT": e.avgTAT,
  }));

  return (
    <div className="glass-card p-5">
      <p className="section-label">Visual Comparison</p>
      <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>Avg Waiting & Turnaround Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="algorithm" tick={{ fill: textColor, fontSize: 12, fontFamily: "JetBrains Mono" }} />
          <YAxis tick={{ fill: textColor, fontSize: 12, fontFamily: "JetBrains Mono" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1a1a28" : "#ffffff",
              border: `1px solid ${gridColor}`,
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "JetBrains Mono",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: "JetBrains Mono" }} />
          <Bar dataKey="Avg WT" fill="#00d4ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Avg TAT" fill="#a855f7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
