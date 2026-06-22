import React from "react";
import { StatBox } from "../common/Feedback";

export default function PageStats({ result }) {
  if (!result) return null;
  const { hits, faults, hitRatio, faultRatio } = result;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatBox label="Page Hits" value={hits} color="#22d3a2" />
      <StatBox label="Page Faults" value={faults} color="#f87171" />
      <StatBox label="Hit Ratio" value={(hitRatio * 100).toFixed(1)} color="#00d4ff" suffix="%" />
      <StatBox label="Fault Ratio" value={(faultRatio * 100).toFixed(1)} color="#fbbf24" suffix="%" />
    </div>
  );
}
