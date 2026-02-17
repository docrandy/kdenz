/**
 * TabLayout - Layout wrapper for tabbed navigation pages
 * Renders AppHeader + page content (Outlet) + BottomTabBar
 * Used as a layout route in React Router v6
 */

import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { BottomTabBar } from "./BottomTabBar";

export function TabLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
