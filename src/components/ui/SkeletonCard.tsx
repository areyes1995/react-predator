// ──────────────────────────────────────────────
// SkeletonCard — Reusable skeleton card placeholder
// ──────────────────────────────────────────────

export interface SkeletonCardProps {
  height?: string
  /** Content height — defaults to 32 (h-32) */
  contentHeight?: string
}

export default function SkeletonCard({ height = 'h-32', contentHeight = 'h-6' }: SkeletonCardProps) {
  return (
    <div className={`bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 ${height}`}>
      <div className="h-3 bg-[var(--bg-surface-hover)] rounded w-2/3 mb-3" />
      <div className={`bg-[var(--bg-surface-hover)] rounded ${contentHeight}`} />
    </div>
  )
}
