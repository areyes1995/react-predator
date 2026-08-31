// ──────────────────────────────────────────────
// AuditLog — Registro de actividad reciente para
// auditoría de administradores
// ──────────────────────────────────────────────

import { useState } from 'react'
import { Activity, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { useAppTranslation } from '../../../i18n/useAppTranslation'

export interface AuditEntry {
  timestamp: string
  event: string
  user: string
  status: 'success' | 'error' | 'info'
  detail?: string
}

export interface AuditLogProps {
  entries: AuditEntry[]
  title?: string
  maxEntries?: number
}

export default function AuditLog({ entries, title, maxEntries = 15 }: AuditLogProps) {
  const { t } = useAppTranslation()
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? entries : entries.slice(0, maxEntries)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Info className="w-4 h-4 text-[var(--text-muted)]" />
    }
  }

  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] h-full">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[var(--text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
      )}
      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
        {visible.map((entry, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 py-2 px-2 rounded-lg transition-colors ${
              i % 2 === 0 ? 'bg-[var(--bg-surface)]' : ''
            } hover:bg-[var(--bg-surface-hover)]`}
          >
            <span className="mt-0.5 shrink-0">{getStatusIcon(entry.status)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">{entry.event}</span>
                <span className="text-xs text-[var(--text-muted)] ml-auto">{entry.timestamp}</span>
              </div>
              {entry.detail && (
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{entry.detail}</div>
              )}
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{entry.user}</div>
            </div>
          </div>
        ))}
      </div>
      {entries.length > maxEntries && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] py-2 transition-colors mt-2"
        >
          {expanded ? `Ver menos (${entries.length})` : `Ver todo (${entries.length})`}
        </button>
      )}
    </div>
  )
}
