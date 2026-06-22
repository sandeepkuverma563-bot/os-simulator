import React from "react";
import { HiOutlineMenu, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";
import { NAV_ITEMS } from "./Sidebar";

export default function Topbar({ activePage, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const current = NAV_ITEMS.find((n) => n.id === activePage);

  return (
    <header
      className="h-14 sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6"
      style={{
        backgroundColor: "var(--surface-1)",
        borderBottom: "1px solid var(--border-color)",
        backdropFilter: "blur(10px)",
      }}
    >
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg"
        style={{ color: "var(--text-secondary)" }}
      >
        <HiOutlineMenu className="w-5 h-5" />
      </button>

      <div>
        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {current?.label || "Dashboard"}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow" />
          API Connected
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: "var(--surface-3)", color: "var(--text-secondary)" }}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <HiOutlineSun className="w-4 h-4" /> : <HiOutlineMoon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
