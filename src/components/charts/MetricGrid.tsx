// ──────────────────────────────────────────────
// MetricGrid — Reusable grid of KpiCard components
// ──────────────────────────────────────────────

import { KpiCard, type KpiCardProps } from '../charts'

export interface MetricGridProps {
  metrics: KpiCardProps[]
  /** Grid columns — defaults to 5 for 5 KPIs */
  cols?: number
}

export default function MetricGrid({ metrics, cols = 5 }: MetricGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-${cols} gap-4`}>
      {metrics.map((metric, i) => (
        <KpiCard key={i} {...metric} />
      ))}
    </div>
  )
}
