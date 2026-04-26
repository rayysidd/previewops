/**
 * StatusBadge.jsx
 * Pill badge that renders a colored dot + label for any DeploymentStatus.
 * Driven entirely by STATUS_CONFIG — no per-status conditionals here.
 */

import { STATUS_CONFIG } from "@/constants/statusConfig";

/**
 * @param {{ status: import('@/constants/statusConfig').DeploymentStatus }} props
 */
export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["Destroyed"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
        text-[11px] font-medium tracking-wide ${cfg.badge}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}
          ${cfg.pulse ? "animate-pulse" : ""}`}
      />
      {status}
    </span>
  );
}
