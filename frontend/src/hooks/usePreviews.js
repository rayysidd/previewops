/**
 * usePreviews.js
 * Fetches live GitHub PR + Kubernetes namespace data from the Bridge API.
 *
 * Responsibilities:
 *  - Initial fetch on mount
 *  - Auto-poll every POLL_INTERVAL_MS (30s by default)
 *  - Expose manual refresh, loading, and error states
 *  - Build the dynamic preview URL from the PR number
 *
 * To swap the API base URL per environment, set:
 *   VITE_BRIDGE_API_URL=http://bridge-api.preview.svc.cluster.local:4000
 * in your .env.local file.
 */

import { useState, useEffect, useCallback, useRef } from "react";

const BRIDGE_API_BASE =
  import.meta.env.VITE_BRIDGE_API_URL ?? "http://localhost:4000";

const POLL_INTERVAL_MS = 30_000;

/**
 * Constructs the dynamic preview URL for a given PR number.
 * Matches your NGINX Ingress rule: http://pr-{ID}.previewops.local
 *
 * @param {number} prNumber
 * @returns {string}
 */
export function buildPreviewUrl(prNumber) {
  const base =
    import.meta.env.VITE_PREVIEW_BASE_URL ?? "http://pr-{id}.previewops.local";
  return base.replace("{id}", prNumber);
}

/**
 * @typedef {Object} PreviewEntry
 * @property {number}   prNumber   - GitHub PR number
 * @property {string}   title      - PR title
 * @property {string}   author     - GitHub username
 * @property {string}   branch     - Head branch name
 * @property {string}   status     - "Live" | "Building" | "Pending"
 * @property {string}   previewUrl - Constructed preview URL
 * @property {string}   namespace  - Kubernetes namespace (e.g. preview-pr-42)
 * @property {boolean}  hasK8s     - Whether namespace was found in the cluster
 * @property {string}   updatedAt  - ISO timestamp of last PR activity
 * @property {string}   prUrl      - Link to the PR on GitHub
 */

/**
 * @returns {{
 *   previews:      PreviewEntry[],
 *   loading:       boolean,
 *   error:         string | null,
 *   lastFetched:   Date | null,
 *   refresh:       () => void,
 * }}
 */
export function usePreviews() {
  const [previews, setPreviews]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Stable ref so the interval callback always sees the latest fetch fn
  const fetchRef = useRef(null);

  const fetchPreviews = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${BRIDGE_API_BASE}/api/previews`);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }

      /** @type {PreviewEntry[]} */
      const data = await res.json();

      // Attach the dynamically constructed preview URL client-side
      // (Bridge API also returns it, but this gives the frontend control)
      const enriched = data.map((p) => ({
        ...p,
        previewUrl: buildPreviewUrl(p.prNumber),
      }));

      setPreviews(enriched);
      setLastFetched(new Date());
    } catch (err) {
      setError(err.message ?? "Failed to fetch previews");
    } finally {
      setLoading(false);
    }
  }, []);

  // Keep ref in sync
  fetchRef.current = fetchPreviews;

  // Mount fetch + polling interval
  useEffect(() => {
    fetchRef.current();

    const interval = setInterval(() => {
      fetchRef.current();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []); // empty deps — intentional; polling is self-managed via ref

  return {
    previews,
    loading,
    error,
    lastFetched,
    refresh: fetchPreviews,
  };
}
