// ──────────────────────────────────────────────
// ProgressCard — Reusable card for progress bars
// with status indicators (e.g. latency, performance)
// ──────────────────────────────────────────────

import { useMemo } from 'react'
import { Zap } from 'lucide-react'
import { useAppTranslation } from '../../i18n/useAppTranslation'

export interface ProgressItem {
  label: string
  value: number
  max: number
  status: 'good' | 'warning' | 'critical'
}

export interface ProgressCardProps {
  avgValue?: number
  avgLabel?: string
  avgSuffix?: string
  items: ProgressItem[]
  title?: string
}

export default function ProgressCard({ avgValue, avgLabel, avgSuffix, items, title }: ProgressCardProps) {
  const { t } = useAppTranslation()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-emerald-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      default: return 'text-[var(--text-muted)]'
    }
  }

  const getBarColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-emerald-500'
      case 'warning': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-[var(--border)]'
    }
  }

  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] h-full">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[var(--text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
      )}

      {avgValue !== undefined && avgLabel && (
        <div className="mb-5">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-[var(--text-primary)]">{avgValue}</span>
            {avgSuffix && <span className="text-sm text-[var(--text-muted)]">{avgSuffix}</span>}
          </div>
          {avgLabel && <div className="text-xs text-[var(--text-muted)]">{avgLabel}</div>}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-secondary)]">{item.label}</span>
              <span className={`${getStatusColor(item.status)} font-medium`}>
                {item.value}{avgSuffix || ''}
              </span>
            </div>
            <div className="w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.status)}`}
                style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
