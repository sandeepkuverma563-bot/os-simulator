import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineExclamation } from "react-icons/hi";

export function StatBox({ label, value, color = "#00d4ff", suffix = "" }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border-color)" }}
    >
      <div className="text-xs font-mono mb-1" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="text-2xl font-mono font-semibold" style={{ color }}>
        {value}
        {suffix && <span className="text-sm ml-0.5 opacity-70">{suffix}</span>}
      </div>
    </div>
  );
}

export function ErrorBanner({ error, onClose }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-start justify-between gap-3 rounded-lg p-4 text-sm font-mono"
          style={{
            backgroundColor: "rgba(248, 113, 113, 0.1)",
            border: "1px solid rgba(248, 113, 113, 0.3)",
            color: "#f87171",
          }}
        >
          <div className="flex items-start gap-2">
            <HiOutlineExclamation className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="opacity-60 hover:opacity-100 flex-shrink-0">
              ×
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="glass-card p-12 text-center">
      {Icon && <Icon className="w-10 h-10 mx-auto mb-4 opacity-20" style={{ color: "var(--text-muted)" }} />}
      <div className="text-sm font-mono mb-1" style={{ color: "var(--text-muted)" }}>{title}</div>
      {subtitle && (
        <div className="text-xs font-mono opacity-60" style={{ color: "var(--text-muted)" }}>{subtitle}</div>
      )}
    </div>
  );
}

export function LoadingSpinner({ label = "Running simulation…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan"
      />
      <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{label}</div>
    </div>
  );
}
