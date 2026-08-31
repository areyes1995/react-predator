// ──────────────────────────────────────────────
// EmptyState — Reusable empty state with
// refresh / action button
// ──────────────────────────────────────────────

import { RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  message?: string
  description?: string
  icon?: ReactNode
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ message, description, icon, actionLabel, onAction }: EmptyStateProps) {
  const defaultIcon = <RefreshCw className="w-8 h-8 text-[var(--text-muted)]" />
  const defaultMessage = 'No data available'

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--bg-surface-hover)] flex items-center justify-center mb-4">
        {icon || defaultIcon}
      </div>
      <p className="text-[var(--text-muted)] mb-4 text-sm">{message || defaultMessage}</p>
      {description && <p className="text-[var(--text-muted)] text-xs mb-4">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-[var(--bg-surface-hover)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--border-active)] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
