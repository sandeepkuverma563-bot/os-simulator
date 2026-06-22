import React from "react";

export default function Card({ children, className = "", padding = "p-5" }) {
  return <div className={`glass-card ${padding} ${className}`}>{children}</div>;
}

export function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        {eyebrow && <p className="section-label">{eyebrow}</p>}
        {title && (
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
            {title}
          </h2>
        )}
      </div>
      {action}
    </div>
  );
}
