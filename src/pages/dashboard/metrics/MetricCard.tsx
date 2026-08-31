// ──────────────────────────────────────────────
// MetricCard — Tarjeta de métrica con tendencia
// (+/- %) e ícono representativo
// ──────────────────────────────────────────────

import type { ReactNode } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { useAppTranslation } from '../../../i18n/useAppTranslation'

export interface MetricCardProps {
  label: string
  value: string
  trend?: number
  trendLabel?: string
  icon: ReactNode
  accentClass?: string
}

export default function MetricCard({ label, value, trend, trendLabel, icon, accentClass = 'text-[var(--text-muted)]' }: MetricCardProps) {
  const { t } = useAppTranslation()
  const hasTrend = trend !== undefined && trend !== null

  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] h-full">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 ${accentClass}`}>
          {icon}
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">{value}</div>
      {hasTrend && (
        <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
          {trend > 0 ? <ArrowUp className="w-3 h-3" /> : trend < 0 ? <ArrowDown className="w-3 h-3" /> : null}
          <span>{Math.abs(trend)}% {trend !== 0 ? t('metrics.trend.up') : ''}</span>
        </div>
      )}
    </div>
  )
}
