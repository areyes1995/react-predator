import type { ReactElement } from 'react'
import { Plus } from 'lucide-react'
import type { CardEmptyProps } from '../types'

export default function CardEmpty({ icon: Icon, message, role, rolesWithAction, actionLabel, onAction }: CardEmptyProps) {
  const hasAction = onAction && (role === undefined || rolesWithAction?.includes(role))

  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--bg-surface-hover)] flex items-center justify-center">
        {typeof Icon === 'function' ? <Icon className="w-8 h-8 text-[var(--text-muted)]" strokeWidth={1.5} /> : null}
      </div>
      <p className="text-sm text-[var(--text-muted)] max-w-sm">{message}</p>
      {hasAction && (
        <button
          onClick={onAction}
          className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
