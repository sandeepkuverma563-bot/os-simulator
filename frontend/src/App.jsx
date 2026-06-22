import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import SchedulingPage from "./pages/SchedulingPage";
import MemoryPage from "./pages/MemoryPage";
import AllocationPage from "./pages/AllocationPage";
import DeadlockPage from "./pages/DeadlockPage";
import PerformancePage from "./pages/PerformancePage";
import AnalyticsPage from "./pages/AnalyticsPage";

const PAGES = {
  dashboard: DashboardPage,
  scheduling: SchedulingPage,
  memory: MemoryPage,
  allocation: AllocationPage,
  deadlock: DeadlockPage,
  performance: PerformancePage,
  analytics: AnalyticsPage,
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const ActiveComponent = PAGES[activePage] || DashboardPage;

  return (
    <ThemeProvider>
      <MainLayout activePage={activePage} setActivePage={setActivePage}>
        {activePage === "dashboard" ? (
          <DashboardPage setActivePage={setActivePage} />
        ) : (
          <ActiveComponent />
        )}
      </MainLayout>
    </ThemeProvider>
  );
}
