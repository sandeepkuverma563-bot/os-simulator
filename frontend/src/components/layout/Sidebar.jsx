import React from "react";
import {
  HiOutlineViewGrid,
  HiOutlineClock,
  HiOutlineDatabase,
  HiOutlineTemplate,
  HiOutlineLockClosed,
  HiOutlineBeaker,
  HiOutlineChartBar,
} from "react-icons/hi";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { id: "scheduling", label: "CPU Scheduling", icon: HiOutlineClock },
  { id: "memory", label: "Memory Management", icon: HiOutlineDatabase },
  { id: "allocation", label: "Memory Allocation", icon: HiOutlineTemplate },
  { id: "deadlock", label: "Deadlock Avoidance", icon: HiOutlineLockClosed },
  { id: "performance", label: "Performance Lab", icon: HiOutlineBeaker },
  { id: "analytics", label: "Analytics", icon: HiOutlineChartBar },
];

export default function Sidebar({ activePage, setActivePage, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-50 lg:z-0 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          backgroundColor: "var(--surface-1)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        <div className="h-14 flex items-center gap-2.5 px-5" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <svg className="w-6 h-6 text-accent-cyan flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="8" y="8" width="8" height="8" rx="1" />
            <path d="M9 2v2M12 2v2M15 2v2M9 20v2M12 20v2M15 20v2M2 9h2M2 12h2M2 15h2M20 9h2M20 12h2M20 15h2" />
          </svg>
          <div className="leading-tight">
            <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>OS Simulator</div>
            <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Platform</div>
          </div>
        </div>

        <nav className="py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: active ? "rgba(0, 212, 255, 0.1)" : "transparent",
                  color: active ? "#00d4ff" : "var(--text-secondary)",
                  border: active ? "1px solid rgba(0, 212, 255, 0.25)" : "1px solid transparent",
                }}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: "1px solid var(--border-color)" }}>
          <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
            v1.0.0 · OS Lab
          </div>
        </div>
      </aside>
    </>
  );
}

export { NAV_ITEMS };
