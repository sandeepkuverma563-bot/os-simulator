import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ---- Scheduling ----
export async function runScheduling(algorithm, processes, quantum) {
  const payload = { algorithm, processes };
  if (algorithm === "RR") payload.quantum = quantum;
  const { data } = await api.post("/scheduling/run", payload);
  return data;
}

export async function compareScheduling(algorithms, processes, quantum) {
  const { data } = await api.post("/scheduling/compare", { algorithms, processes, quantum });
  return data;
}

// ---- Memory: Page Replacement ----
export async function runPageReplacement(algorithm, referenceString, frames) {
  const { data } = await api.post("/memory/page-replacement", { algorithm, referenceString, frames });
  return data;
}

// ---- Memory: Allocation ----
export async function runAllocation(algorithm, blocks, processes) {
  const { data } = await api.post("/memory/allocation", { algorithm, blocks, processes });
  return data;
}

// ---- Deadlock: Banker's Algorithm ----
export async function runBankers(allocation, max, available) {
  const { data } = await api.post("/deadlock/bankers", { allocation, max, available });
  return data;
}

// ---- Performance Lab ----
export async function generatePerformanceTest(params) {
  const { data } = await api.post("/performance/generate", params);
  return data;
}

export default api;
