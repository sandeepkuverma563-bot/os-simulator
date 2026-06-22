import React from "react";
import CPUAnalyticsPanel from "../components/analytics/CPUAnalyticsPanel";
import MemoryAnalyticsPanel from "../components/analytics/MemoryAnalyticsPanel";
import DeadlockAnalyticsPanel from "../components/analytics/DeadlockAnalyticsPanel";

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <p className="section-label">Overview</p>
        <h2 className="font-semibold text-base mb-1" style={{ color: "var(--text-primary)" }}>OS Performance Analytics</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Run sample analyses across each module to visualize performance characteristics with charts. Each panel runs independently against the backend API.
        </p>
      </div>

      <CPUAnalyticsPanel />
      <MemoryAnalyticsPanel />
      <DeadlockAnalyticsPanel />
    </div>
  );
}
