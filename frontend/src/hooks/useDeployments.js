/**
 * useDeployments.js
 * Custom hook that owns all deployments state and business logic.
 * Keeps DashboardView as a pure layout/presentation component.
 *
 * Swap the `initialDeployments` seed and `_simulateTeardown` with real API
 * calls (fetch / axios / react-query) without touching any UI component.
 */

import { useState, useCallback, useEffect } from "react";
import { initialDeployments } from "@/data/mockData";

const TEARDOWN_DELAY_MS = 2000;

/**
 * @returns {{
 *   deployments: import('@/constants/statusConfig').Deployment[],
 *   handleTeardown: (prNumber: number) => void,
 *   handleRefresh: () => void,
 *   lastSync: string,
 * }}
 */
export function useDeployments() {
  const [deployments, setDeployments] = useState(initialDeployments);
  const [lastSync, setLastSync]       = useState("just now");

  // ── Simulate "last synced N minutes ago" ticker ──────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync((prev) => {
        if (prev === "just now") return "1m ago";
        const n = parseInt(prev, 10);
        return isNaN(n) ? "1m ago" : `${n + 1}m ago`;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // ── Teardown handler ─────────────────────────────────────────────────────
  /**
   * Triggers a two-phase status update:
   *   1. Immediately → "Tearing Down..." (loading UI)
   *   2. After TEARDOWN_DELAY_MS → "Destroyed" (terminal state)
   *
   * Replace the setTimeout body with a real API call:
   *   await fetch(`/api/environments/${prNumber}/teardown`, { method: 'DELETE' })
   *
   * @param {number} prNumber
   */
  const handleTeardown = useCallback((prNumber) => {
    setDeployments((prev) =>
      prev.map((d) =>
        d.prNumber === prNumber ? { ...d, status: "Tearing Down..." } : d
      )
    );

    // TODO: replace with real API call
    const timer = setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) =>
          d.prNumber === prNumber
            ? { ...d, status: "Destroyed", liveUrl: null }
            : d
        )
      );
    }, TEARDOWN_DELAY_MS);

    // In a real scenario you'd cancel the timer on component unmount.
    // Since this runs in a hook, the cleanup is trivial.
    return () => clearTimeout(timer);
  }, []);

  // ── Refresh handler ──────────────────────────────────────────────────────
  /**
   * Resets the "last synced" timer and re-fetches data.
   * In production, replace setDeployments with your data-fetching logic.
   */
  const handleRefresh = useCallback(() => {
    setLastSync("just now");
    // TODO: await refetch() from react-query or similar
  }, []);

  return { deployments, handleTeardown, handleRefresh, lastSync };
}
