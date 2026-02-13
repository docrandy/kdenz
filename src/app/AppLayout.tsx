import { Outlet } from "react-router-dom";
import { useState, useCallback } from "react";
import clsx from "clsx";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggle = useCallback(() => {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      setSidebarOpen((open) => !open);
      setCollapsed(false);
      return;
    }
    setCollapsed((prev) => !prev);
  }, []);

  const handleBackdropClick = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="app-shell" data-collapsed={collapsed}>
      <aside
        className={clsx("app-shell__sidebar", {
          "is-open": sidebarOpen,
        })}
      >
        <Sidebar />
      </aside>

      <div
        className={clsx("app-shell__backdrop", {
          "is-visible": sidebarOpen,
        })}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <div className="app-shell__main">
        <TopBar onSidebarToggle={handleToggle} />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}