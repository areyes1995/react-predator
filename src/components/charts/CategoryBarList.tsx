// ──────────────────────────────────────────────
// CategoryBarList — horizontal bar list by category
// ──────────────────────────────────────────────

import type { ReactNode } from 'react'
import { useAppTranslation } from '../../i18n/useAppTranslation'

export interface CategoryBarItem {
  name: string
  count: number
}

export interface CategoryBarListProps {
  title: string
  items: CategoryBarItem[]
  icon?: ReactNode
  barClass?: string
}

export default function CategoryBarList({ title, items, icon, barClass = 'bg-blue-500' }: CategoryBarListProps) {
  const { t } = useAppTranslation()
  const max = Math.max(1, ...items.map(i => i.count))

  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)]">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[var(--text-secondary)]">{item.name}</span>
              <span className="text-[var(--text-muted)]">{item.count}</span>
            </div>
            <div className="h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-[var(--text-muted)] py-4 text-center">{t('No data available')}</p>
        )}
      </div>
    </div>
  )
}