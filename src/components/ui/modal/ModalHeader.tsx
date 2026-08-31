import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalHeaderProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  onBack?: () => void
  onClose?: () => void
}

interface ModalFooterProps {
  left?: ReactNode
  right?: ReactNode
}

export default function ModalHeader({ title, subtitle, actions, onBack, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[var(--border)] flex-shrink-0">
      {(title || onBack) && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                onClick={onBack}
              >
                <X className="w-3.5 h-3.5 rotate-180" />
              </button>
            )}
            {onBack && <span className="w-px h-5 bg-[var(--bg-surface)]" />}
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] truncate">{title}</h2>
              {subtitle && <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 flex-shrink-0">
        {actions}
        {onClose && (
          <button
            className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  )
}
