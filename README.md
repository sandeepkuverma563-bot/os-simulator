# OS Simulator Platform 🖥️

> Interactive Operating System Learning Platform — CPU Scheduling, Memory Management, Deadlock Avoidance, and Performance Analytics.

A mini Operating Systems laboratory built to be portfolio-ready and interview-discussable across full-stack development and OS theory.

---

## ⚡ Quick Start

```bash
# From the root os-simulator/ folder:
npm install           # installs concurrently (root dev tooling)
npm run install:all   # installs backend + frontend dependencies
npm run dev           # starts both servers together
```

- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:3000

The Vite dev server proxies all `/api/*` requests to the backend automatically — no manual CORS config needed in the browser.

---

## 📦 Modules

| # | Module | What it does |
|---|--------|---------------|
| 1 | **CPU Scheduling Visualizer** | FCFS, SJF, SRTF, Priority, Round Robin — animated Gantt charts, step playback, comparison mode |
| 2 | **Memory Management Visualizer** | FIFO, LRU, Optimal page replacement — animated frame-by-frame hit/fault simulation |
| 3 | **Memory Allocation Visualizer** | First Fit, Best Fit, Worst Fit — graphical block allocation with fragmentation stats |
| 4 | **Deadlock Avoidance** | Banker's Algorithm — Need matrix, safe sequence detection, animated execution trace |
| 5 | **Performance Lab** | Random workload generator, auto-compares all 5 scheduling algorithms, ranked leaderboard |
| 6 | **Analytics Dashboard** | Cross-module Recharts visualizations (bar, pie) for CPU, memory, and deadlock stats |

---

## 📁 Project Structure

```
os-simulator/
├── backend/
│   ├── algorithms/
│   │   ├── scheduling/   fcfs.js, sjf.js, srtf.js, priority.js, rr.js
│   │   ├── memory/       fifo.js, lru.js, optimal.js
│   │   ├── allocation/   firstFit.js, bestFit.js, worstFit.js, allocationUtils.js
│   │   └── deadlock/     bankers.js
│   ├── controllers/      schedulingController.js, memoryController.js,
│   │                     allocationController.js, deadlockController.js,
│   │                     performanceController.js
│   ├── routes/           schedulingRoutes.js, memoryRoutes.js,
│   │                     deadlockRoutes.js, performanceRoutes.js
│   ├── utils/            calculateSchedulingMetrics.js
│   └── server.js
│
└── frontend/src/
    ├── components/
    │   ├── scheduling/   ProcessTable, AlgorithmSelector, ControlPanel,
    │   │                 GanttChart, MetricsTable, ComparisonView
    │   ├── memory/       ReferenceStringInput, PageAlgorithmSelector,
    │   │                 FrameVisualizer, PageStats
    │   ├── allocation/   AllocationInput, AllocationAlgorithmSelector,
    │   │                 MemoryBlockVisualizer, AllocationStats
    │   ├── deadlock/     MatrixEditor, MatrixSummary, SafeSequenceView
    │   ├── performance/  WorkloadGenerator, Leaderboard, PerformanceChart
    │   ├── analytics/    CPUAnalyticsPanel, MemoryAnalyticsPanel, DeadlockAnalyticsPanel
    │   ├── layout/       Sidebar, Topbar
    │   └── common/       Card, Feedback (StatBox, ErrorBanner, EmptyState, LoadingSpinner)
    ├── pages/             DashboardPage, SchedulingPage, MemoryPage, AllocationPage,
    │                      DeadlockPage, PerformancePage, AnalyticsPage
    ├── layouts/           MainLayout.jsx
    ├── context/           ThemeContext.jsx (light/dark, persisted to localStorage)
    ├── services/          api.js (Axios client, all 6 endpoints)
    ├── hooks/             useAnalyticsStore.js
    └── utils/             colors.js
```

---

## 🔌 API Reference

### POST `/api/scheduling/run`
```json
{ "algorithm": "RR", "quantum": 2, "processes": [
  { "pid": "P1", "arrivalTime": 0, "burstTime": 5, "priority": 2 }
]}
```
Returns `{ algorithm, timeline, metrics, summary }` where `summary` includes `avgWT`, `avgTAT`, `avgRT`, `cpuUtilization`, `throughput`.

### POST `/api/scheduling/compare`
```json
{ "algorithms": ["SJF", "RR"], "quantum": 2, "processes": [ ... ] }
```
Returns `{ results: [ {...}, {...} ] }`.

### POST `/api/memory/page-replacement`
```json
{ "algorithm": "LRU", "referenceString": [7,0,1,2,0,3,0,4], "frames": 3 }
```
Returns `{ algorithm, frameCount, steps, hits, faults, hitRatio, faultRatio }`.

### POST `/api/memory/allocation`
```json
{ "algorithm": "BEST_FIT",
  "blocks": [{ "id": "B1", "size": 100 }],
  "processes": [{ "id": "P1", "size": 50 }] }
```
Returns `{ algorithm, allocations, blockStates, stats }`.

### POST `/api/deadlock/bankers`
```json
{ "allocation": [[0,1,0],[2,0,0]],
  "max": [[7,5,3],[3,2,2]],
  "available": [3,3,2] }
```
Returns `{ need, safe, safeSequence, steps, unsafeReason }`.

### POST `/api/performance/generate`
```json
{ "numProcesses": 8, "arrivalRange": [0,10], "burstRange": [1,12],
  "priorityRange": [1,5], "quantum": 2 }
```
Returns `{ processes, results, leaderboard }` — leaderboard ranked by lowest average waiting time.

---

## 🧪 Example Test Data

**Scheduling** (classic 4-process set):
```json
[
  { "pid": "P1", "arrivalTime": 0, "burstTime": 8, "priority": 3 },
  { "pid": "P2", "arrivalTime": 1, "burstTime": 4, "priority": 1 },
  { "pid": "P3", "arrivalTime": 2, "burstTime": 9, "priority": 4 },
  { "pid": "P4", "arrivalTime": 3, "burstTime": 5, "priority": 2 }
]
```

**Page Replacement** (classic Bélády reference string):
```
7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1
```

**Memory Allocation** (textbook fragmentation example):
```
Blocks:    B1=100, B2=500, B3=200, B4=300, B5=600
Processes: P1=212, P2=417, P3=112, P4=426
```

**Banker's Algorithm** (Silberschatz textbook example — known safe sequence `P1→P3→P4→P0→P2`):
```
Allocation: [[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]]
Max:        [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]]
Available:  [3,3,2]
```

---

## 🎯 Feature Checklist

- [x] FCFS / SJF / SRTF / Priority / Round Robin scheduling
- [x] CT, TAT, WT, RT, Avg WT/TAT/RT, CPU Utilization, Throughput
- [x] Animated Gantt chart with Play/Pause/Step Forward/Step Backward/Reset
- [x] Speed control (0.5x–3x)
- [x] Active process highlighting + color coding
- [x] Side-by-side algorithm comparison mode
- [x] FIFO / LRU / Optimal page replacement with animated frames
- [x] Page hits, faults, hit/fault ratio
- [x] First Fit / Best Fit / Worst Fit memory allocation
- [x] Internal/external fragmentation, memory utilization
- [x] Banker's Algorithm — Need matrix, safe sequence, safe/unsafe state
- [x] Animated execution trace with process highlighting
- [x] Random workload generator (configurable ranges)
- [x] Auto-comparison + ranked leaderboard across all 5 algorithms
- [x] Analytics dashboard with Recharts bar/pie charts
- [x] Dark theme + Light theme with toggle, persisted via localStorage
- [x] Responsive sidebar navigation (mobile + desktop)
- [x] Glassmorphism UI, smooth Framer Motion animations
- [x] Loading states, error states, empty states throughout

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Axios, Recharts, React Icons |
| Backend | Node.js, Express.js |
| Architecture | Clean separation: algorithms / controllers / routes (backend), components / pages / context / services (frontend) |

---

## 📚 OS Concepts Implemented

- **FCFS**: Non-preemptive, simple arrival-order queue.
- **SJF**: Non-preemptive, shortest burst among arrived processes wins each decision point.
- **SRTF**: Preemptive SJF, recalculated every time unit; reproduces Bélády's anomaly when tested with FIFO paging.
- **Priority**: Non-preemptive, lower number = higher priority.
- **Round Robin**: Preemptive, fixed quantum, cyclic ready queue.
- **FIFO / LRU / Optimal paging**: Classic page replacement; Optimal is the theoretical lower bound on faults (Bélády's algorithm).
- **First/Best/Worst Fit**: Classic block allocation strategies; the example dataset reproduces the textbook result where Best Fit allocates all processes while First Fit and Worst Fit leave one unallocated.
- **Banker's Algorithm**: Need = Max − Allocation; safety algorithm finds a process ordering where each can finish with currently available + released resources.

---

## ⚠️ Notes on Local Setup

This project was generated in a sandboxed environment without npm registry access, so dependencies could not be live-installed or test-run end-to-end with a real browser. All algorithm logic was independently verified via direct Node.js execution (bypassing the HTTP layer) against known textbook examples, and all imports/exports were cross-checked programmatically. After `npm run install:all`, the app should run as described above — if you hit any issue, check the browser console and terminal output first, as missing dependencies are the most common cause.
