import { Tent, ChevronRight, Calendar, Clock, Eye, Edit } from 'lucide-react'
import type { StandCardProps } from '../types'

export default function StandsCard({ stand, role, onClick, onEdit }: StandCardProps) {
  const statusLabels: Record<string, string> = {
    published: 'Publicado',
    pending: 'Pendiente',
    draft: 'Borrador',
  }

  const statusColors: Record<string, string> = {
    published: 'text-emerald-400 bg-emerald-400',
    pending: 'text-amber-400 bg-amber-400',
    draft: 'text-gray-400 bg-gray-400',
  }

  return (
    <div
      className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] cursor-pointer h-full flex flex-col group"
      onClick={() => onClick(stand)}
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-[var(--bg-surface-soft)] to-[var(--bg-surface)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <Tent className="w-8 h-8 text-[var(--text-muted)]" strokeWidth={1.5} />
          </div>
        </div>
        {/* Status badge */}
        <div className={`absolute top-3 right-3 ${statusColors[stand.status]} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg`}>
          {statusLabels[stand.status]}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 min-h-0 gap-3">
        <div className="min-h-0 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight line-clamp-2 group-hover:text-[var(--text-primary)]/80 transition-colors">
                {stand.title}
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] line-clamp-2">
              {stand.meta}
            </p>
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)]">
            {stand.proyecto}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)]">
            {stand.sala}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {stand.createdAt}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {role === 'admin' || role === 'presentador' ? (
              <button
                className="p-1 rounded-md transition-colors text-[var(--text-muted)] hover:text-blue-400 hover:bg-blue-400/10"
                onClick={e => {
                  e.stopPropagation()
                  onEdit?.(stand)
                }}
                aria-label={`Editar ${stand.title}`}
                tabIndex={-1}
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {stand.updatedAt}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {stand.sala}
          </span>
        </div>
      </div>
    </div>
  )
}
