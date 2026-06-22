import { useState, useCallback } from "react";

/**
 * Tracks the most recent result from each module so the Analytics
 * dashboard can visualize cross-module stats without re-running everything.
 * Lives at the App level and is passed down via context-free props,
 * since the dataset is small and shared by only a few pages.
 */
export function useAnalyticsStore() {
  const [schedulingHistory, setSchedulingHistory] = useState([]);
  const [memoryHistory, setMemoryHistory] = useState([]);
  const [deadlockHistory, setDeadlockHistory] = useState([]);

  const recordScheduling = useCallback((result) => {
    setSchedulingHistory((prev) => [...prev.slice(-9), result]);
  }, []);

  const recordMemory = useCallback((result) => {
    setMemoryHistory((prev) => [...prev.slice(-9), result]);
  }, []);

  const recordDeadlock = useCallback((result) => {
    setDeadlockHistory((prev) => [...prev.slice(-9), result]);
  }, []);

  return {
    schedulingHistory,
    memoryHistory,
    deadlockHistory,
    recordScheduling,
    recordMemory,
    recordDeadlock,
  };
}
