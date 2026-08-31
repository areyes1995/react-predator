// ──────────────────────────────────────────────
// SkeletonChartCard — Reusable skeleton for chart cards
// ──────────────────────────────────────────────

export interface SkeletonChartCardProps {
  /** Height — defaults to 320px */
  height?: number
}

export default function SkeletonChartCard({ height = 320 }: SkeletonChartCardProps) {
  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 flex flex-col">
      <div className="h-4 bg-[var(--bg-surface-hover)] rounded w-1/2 mb-4" />
      <div className="flex-1 bg-[var(--bg-surface-hover)] rounded opacity-50 min-h-[200px]" />
    </div>
  )
}
