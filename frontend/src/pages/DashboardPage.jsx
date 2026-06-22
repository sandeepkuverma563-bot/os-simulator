import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineClock, HiOutlineDatabase, HiOutlineTemplate,
  HiOutlineLockClosed, HiOutlineBeaker, HiOutlineChartBar, HiOutlineArrowRight,
} from "react-icons/hi";

const MODULES = [
  {
    id: "scheduling",
    title: "CPU Scheduling Visualizer",
    desc: "Animate FCFS, SJF, SRTF, Priority, and Round Robin with step-by-step Gantt charts.",
    icon: HiOutlineClock,
    color: "#00d4ff",
  },
  {
    id: "memory",
    title: "Memory Management Visualizer",
    desc: "Watch FIFO, LRU, and Optimal page replacement evict and load pages frame by frame.",
    icon: HiOutlineDatabase,
    color: "#a855f7",
  },
  {
    id: "allocation",
    title: "Memory Allocation Visualizer",
    desc: "Compare First Fit, Best Fit, and Worst Fit across fragmentation and utilization.",
    icon: HiOutlineTemplate,
    color: "#22d3a2",
  },
  {
    id: "deadlock",
    title: "Deadlock Avoidance",
    desc: "Run the Banker's Algorithm and animate the safe execution sequence.",
    icon: HiOutlineLockClosed,
    color: "#fbbf24",
  },
  {
    id: "performance",
    title: "Performance Lab",
    desc: "Generate random workloads and auto-rank all 5 scheduling algorithms.",
    icon: HiOutlineBeaker,
    color: "#fb923c",
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    desc: "Cross-module charts: CPU utilization, page fault rates, and resource stats.",
    icon: HiOutlineChartBar,
    color: "#ec4899",
  },
];

export default function DashboardPage({ setActivePage }) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 sm:p-8">
        <p className="section-label">Welcome</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          OS Simulator Platform
        </h1>
        <p className="text-sm sm:text-base max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          An interactive Operating Systems laboratory covering CPU scheduling, memory management,
          deadlock avoidance, and performance analytics — built to demonstrate core OS theory visually.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.button
              key={m.id}
              onClick={() => setActivePage(m.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -2 }}
              className="glass-card p-5 text-left group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${m.color}1a`, border: `1px solid ${m.color}40` }}
              >
                <Icon className="w-5 h-5" style={{ color: m.color }} />
              </div>
              <h3 className="font-semibold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>{m.title}</h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>{m.desc}</p>
              <div className="flex items-center gap-1 text-xs font-mono" style={{ color: m.color }}>
                Open module <HiOutlineArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
