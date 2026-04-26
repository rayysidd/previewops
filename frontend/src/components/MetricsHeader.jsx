/**
 * MetricsHeader.jsx
 * Derives 4 aggregate KPIs from the deployments array and renders them
 * as a responsive metric card grid. No state — purely derived from props.
 */

import { Server, Activity, AlertTriangle, ShieldCheck } from "lucide-react";

/**
 * @param {{ deployments: import('@/constants/statusConfig').Deployment[] }} props
 */
export default function MetricsHeader({ deployments }) {
  const live        = deployments.filter((d) => d.status === "Live").length;
  const provisioning = deployments.filter((d) => d.status === "Provisioning").length;
  const tearingDown  = deployments.filter((d) => d.status === "Tearing Down...").length;
  const destroyed    = deployments.filter((d) => d.status === "Destroyed").length;
  const active       = live + provisioning + tearingDown;

  const cards = [
    {
      label:     "Active Envs",
      value:     active,
      icon:      Server,
      iconClass: "text-indigo-400",
      ringClass: "bg-indigo-500/10 border-indigo-500/20",
      valClass:  "text-indigo-300",
    },
    {
      label:     "Live & Serving",
      value:     live,
      icon:      Activity,
      iconClass: "text-emerald-400",
      ringClass: "bg-emerald-500/10 border-emerald-500/20",
      valClass:  "text-emerald-300",
    },
    {
      label:     "Tearing Down",
      value:     tearingDown,
      icon:      AlertTriangle,
      iconClass: "text-orange-400",
      ringClass: "bg-orange-500/10 border-orange-500/20",
      valClass:  "text-orange-300",
    },
    {
      label:     "Reclaimed",
      value:     destroyed,
      icon:      ShieldCheck,
      iconClass: "text-zinc-400",
      ringClass: "bg-zinc-700/30 border-zinc-700/40",
      valClass:  "text-zinc-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {cards.map((c) => (
        <MetricCard key={c.label} {...c} />
      ))}
    </div>
  );
}

/* ── Sub-component ─────────────────────────────────────────────────────────── */

function MetricCard({ label, value, icon: Icon, iconClass, ringClass, valClass }) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl
        bg-zinc-900/60 border ${ringClass}`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center
          flex-shrink-0 border ${ringClass}`}
      >
        <Icon size={17} className={iconClass} />
      </div>
      <div>
        <p className="data-label mb-1.5">{label}</p>
        <p className={`text-2xl font-bold font-mono leading-none ${valClass}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
