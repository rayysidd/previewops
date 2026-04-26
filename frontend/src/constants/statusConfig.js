/**
 * statusConfig.js
 * Central source of truth for all deployment status variants.
 * Adding a new status = add one entry here. Nothing else needs to change.
 *
 * @typedef {'Live' | 'Provisioning' | 'Tearing Down...' | 'Destroyed'} DeploymentStatus
 *
 * @typedef {Object} Deployment
 * @property {number}            prNumber      - GitHub PR number
 * @property {string}            author        - GitHub username
 * @property {string}            branch        - Git branch name
 * @property {DeploymentStatus}  status        - Current environment status
 * @property {string | null}     liveUrl       - Preview URL (null if not yet available)
 * @property {string}            uptime        - Human-readable uptime string
 * @property {string}            costEstimate  - Formatted cost string
 *
 * @typedef {Object} StatusConfig
 * @property {string}  badge        - Tailwind classes for the badge pill
 * @property {string}  dot          - Tailwind class for the status indicator dot
 * @property {string}  leftBorder   - Hex color for the card's left accent border
 * @property {boolean} pulse        - Whether the status dot should animate
 */

/** @type {Record<DeploymentStatus, StatusConfig>} */
export const STATUS_CONFIG = {
  Live: {
    badge:       "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    dot:         "bg-emerald-400",
    leftBorder:  "#10b981",
    pulse:       false,
  },
  Provisioning: {
    badge:       "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    dot:         "bg-amber-400",
    leftBorder:  "#f59e0b",
    pulse:       true,
  },
  "Tearing Down...": {
    badge:       "bg-orange-500/15 text-orange-400 border border-orange-500/25",
    dot:         "bg-orange-400",
    leftBorder:  "#f97316",
    pulse:       true,
  },
  Destroyed: {
    badge:       "bg-zinc-800/60 text-zinc-500 border border-zinc-700/40",
    dot:         "bg-zinc-600",
    leftBorder:  "#3f3f46",
    pulse:       false,
  },
};

/** All valid statuses, in order of a typical lifecycle. */
export const DEPLOYMENT_STATUSES = [
  "Provisioning",
  "Live",
  "Tearing Down...",
  "Destroyed",
];

/** Statuses in which buttons should be disabled. */
export const DISABLED_STATUSES = new Set(["Destroyed", "Tearing Down..."]);
