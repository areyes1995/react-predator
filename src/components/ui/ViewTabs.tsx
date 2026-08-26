// ──────────────────────────────────────────────
// ViewTabs — Tab bar for module view options
// ──────────────────────────────────────────────

import type { RecordViewOption } from '../../records'
import { useAppTranslation } from '../../i18n/useAppTranslation'

export interface ViewTabsProps {
  items: RecordViewOption[]
  activeSlug: string
  onSelect: (slug: string) => void
}

export default function ViewTabs({ items, activeSlug, onSelect }: ViewTabsProps) {
  const { t } = useAppTranslation()
  if (items.length === 0) return null

  return (
    <div className="flex items-center gap-1 px-4 lg:px-6 py-3 border-b border-[var(--border)]">
      {items.map((item) => (
        <button
          key={item.slug}
          onClick={() => onSelect(item.slug)}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            item.slug === activeSlug
              ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          {t(item.label)}
        </button>
      ))}
    </div>
  )
}
