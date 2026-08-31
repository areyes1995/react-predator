// ──────────────────────────────────────────────
// StarRating — Star-based rating display
// ──────────────────────────────────────────────

import { Star } from 'lucide-react'

export interface StarRatingProps {
  /** Rating value (0-5) */
  value: number
  /** Max rating — defaults to 5 */
  max?: number
  /** Size — defaults to 3 */
  size?: number
  /** Full class — defaults to yellow-400 */
  fullClass?: string
  /** Empty class — defaults to border color */
  emptyClass?: string
  /** Show half stars */
  allowHalf?: boolean
}

export default function StarRating({ value, max = 5, size = 3, fullClass = 'fill-yellow-400 text-yellow-400', emptyClass = 'text-[var(--border)]', allowHalf = true }: StarRatingProps) {
  const full = Math.floor(value)
  const half = allowHalf && (value % 1) >= 0.5
  const empty = max - full - (half ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`full-${i}`} className={`w-${size} h-${size} ${fullClass}`} />
      ))}
      {half && (
        <span className="relative">
          <Star className={`w-${size} h-${size} ${fullClass}`} />
          <span className="absolute inset-0 overflow-hidden">
            <Star className={`w-${size} h-${size} ${fullClass}`} />
          </span>
        </span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`empty-${i}`} className={`w-${size} h-${size} ${emptyClass}`} />
      ))}
    </div>
  )
}
