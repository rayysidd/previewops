/**
 * mockData.js
 * Initial seed data for deployments.
 * In production, replace this with a real API call (e.g. Jenkins + K8s API).
 */

/** @type {import('@/constants/statusConfig').Deployment[]} */
export const initialDeployments = [
  {
    prNumber: 42,
    author: "shiven-s",
    branch: "feat/payment-gateway",
    status: "Live",
    liveUrl: "https://pr-42.preview.yourdomain.com",
    uptime: "2h 15m",
    costEstimate: "$1.40",
  },
  {
    prNumber: 45,
    author: "dev_team_alpha",
    branch: "fix/auth-token",
    status: "Provisioning",
    liveUrl: null,
    uptime: "2m",
    costEstimate: "$0.05",
  },
  {
    prNumber: 39,
    author: "shiven-s",
    branch: "feat/user-profile",
    status: "Destroyed",
    liveUrl: null,
    uptime: "-",
    costEstimate: "$4.20 (Saved)",
  },
];
