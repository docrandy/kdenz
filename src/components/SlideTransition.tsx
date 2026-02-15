/**
 * SlideTransition - Animated slide transitions for route changes
 * Provides horizontal slide animations: forward = slide left, back = slide right
 *
 * Uses route depth heuristic to detect navigation direction:
 * / (dashboard) = depth 0
 * /practice/:mode/setup = depth 2 (forward from dashboard)
 * /practice/:mode = depth 2 (recording)
 * /practice/results = depth 2 (post-session)
 * back navigation = shallower depth
 */

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface SlideTransitionProps {
  children: React.ReactNode;
}

// Route depth map for direction detection
const ROUTE_DEPTHS: Record<string, number> = {
  "/": 0,
  "/library": 1,
  "/profile": 1,
  "/voice-profile": 1,
  "/breathing": 1,
  "/settings": 1,
  "/privacy": 1,
  "/baseline": 1,
  "/practice/baseline": 2,
  "/baseline/results": 2,
  "/practice/filler/setup": 2,
  "/practice/pace/setup": 2,
  "/practice/filler": 3,
  "/practice/pace": 3,
  "/practice/technique": 3,
  "/practice/analysis": 3,
  "/practice/results": 3,
  "/practice/bridge": 3,
  "/practice/technique-results": 3,
  "/practice/evaluation": 4,
};

function getRouteDepth(pathname: string): number {
  // Exact match first
  if (ROUTE_DEPTHS[pathname] !== undefined) {
    return ROUTE_DEPTHS[pathname];
  }

  // Pattern matching for dynamic routes
  if (pathname.startsWith("/technique/")) return 2;
  if (pathname.startsWith("/session/")) return 2;

  // Default: count slashes as depth estimate
  return pathname.split("/").filter((s) => s.length > 0).length;
}

export function SlideTransition({ children }: SlideTransitionProps) {
  const location = useLocation();
  const [direction, setDirection] = useState<"forward" | "back" | "none">(
    "none",
  );
  const [prevDepth, setPrevDepth] = useState<number>(0);

  useEffect(() => {
    const currentDepth = getRouteDepth(location.pathname);

    if (prevDepth === 0) {
      // First render - no animation
      setDirection("none");
    } else if (currentDepth > prevDepth) {
      // Going deeper - forward animation (slide left)
      setDirection("forward");
    } else if (currentDepth < prevDepth) {
      // Going shallower - back animation (slide right)
      setDirection("back");
    } else {
      // Same depth - no animation (lateral navigation)
      setDirection("none");
    }

    setPrevDepth(currentDepth);
  }, [location.pathname]);

  // Reset animation after it completes
  useEffect(() => {
    if (direction !== "none") {
      const timer = setTimeout(() => setDirection("none"), 300);
      return () => clearTimeout(timer);
    }
  }, [direction]);

  const animationClass =
    direction === "forward"
      ? "slide-enter-left"
      : direction === "back"
        ? "slide-enter-right"
        : "";

  return <div className={animationClass}>{children}</div>;
}
