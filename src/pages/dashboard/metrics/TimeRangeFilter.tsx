// ──────────────────────────────────────────────
// TimeRangeFilter — Dropdown de rango temporal
// ──────────────────────────────────────────────

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAppTranslation } from '../../../i18n/useAppTranslation'

export type TimeRange = 'today' | 'sevenDays' | 'thirtyDays' | 'event'

export interface TimeRangeFilterProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
}

const ranges: { key: TimeRange; label: string }[] = [
  { key: 'today', label: 'metrics.timeRange.today' },
  { key: 'sevenDays', label: 'metrics.timeRange.sevenDays' },
  { key: 'thirtyDays', label: 'metrics.timeRange.thirtyDays' },
  { key: 'event', label: 'metrics.timeRange.event' },
]

export default function TimeRangeFilter({ value, onChange }: TimeRangeFilterProps) {
  const { t } = useAppTranslation()
  const [open, setOpen] = useState(false)

  const selectedLabel = ranges.find(r => r.key === value)?.label ?? ''

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface-soft)] text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
      >
        <span>{t(selectedLabel)}</span>
        <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 min-w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
            {ranges.map((range) => (
              <button
                key={range.key}
                onClick={() => {
                  onChange(range.key)
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === range.key
                    ? 'bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t(range.label)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
