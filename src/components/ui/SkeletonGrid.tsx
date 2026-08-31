// ──────────────────────────────────────────────
// SkeletonGrid — Reusable grid of skeleton cards
// ──────────────────────────────────────────────

import { useMemo } from 'react'
import SkeletonCard from './SkeletonCard'

export interface SkeletonGridProps {
  /** Number of skeleton cards to render */
  count: number
  /** Grid cols — e.g. "xl:grid-cols-5" */
  gridCols?: string
  /** Height of each card — e.g. "h-32" */
  cardHeight?: string
}

const defaultGridCols = 'xl:grid-cols-5'

export default function SkeletonGrid({ count, gridCols, cardHeight }: SkeletonGridProps) {
  const columns = gridCols || defaultGridCols

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns} gap-4 animate-pulse`}>
      {useMemo(() => Array.from({ length: count }), [count]).map((_, i) => (
        <SkeletonCard key={i} height={cardHeight || 'h-32'} contentHeight="h-6" />
      ))}
    </div>
  )
}
