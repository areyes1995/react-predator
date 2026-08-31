import { useState } from 'react'
import { X, ExternalLink, Calendar, Clock, Edit, Trash2 } from 'lucide-react'
import type { StandDetailModalWithActionsProps, StandStatus } from '../types'

export default function StandsDetailModal({
  stand,
  role,
  isOpen,
  onClose,
  onChangeStatus,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: StandDetailModalWithActionsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const statusLabels: Record<string, string> = {
    published: 'Publicado',
    pending: 'Pendiente',
    draft: 'Borrador',
  }

  if (!isOpen) return null

  const handleClose = () => {
    onClose()
    setConfirmDelete(false)
  }

  const handleStatusChange = (newStatus: StandStatus) => {
    if (stand && onChangeStatus) {
      onChangeStatus(stand, newStatus)
    }
    handleClose()
  }

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(stand)
      setConfirmDelete(false)
    }
  }

  const renderStatusActions = () => {
    if (role !== 'admin' && role !== 'presentador') return null

    if (stand?.status !== 'published') {
      return (
        <button
          className="px-3 py-1.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
          onClick={() => handleStatusChange('published')}
        >
          Publicar
        </button>
      )
    }
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[var(--text-primary)] truncate">{stand?.title}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">{stand?.proyecto}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {renderStatusActions()}
            {canEdit && (
              <button
                className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                onClick={() => { onEdit?.(stand); handleClose() }}
              >
                Editar
              </button>
            )}
            {canDelete && !confirmDelete && (
              <button
                className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                onClick={() => setConfirmDelete(true)}
              >
                Eliminar
              </button>
            )}
            {confirmDelete && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">¿Eliminar stand?</span>
                <button
                  className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  onClick={handleDeleteClick}
                >
                  Eliminar
                </button>
                <button
                  className="px-2 py-1 text-xs font-medium bg-[var(--bg-surface-soft)] text-[var(--text-muted)] rounded hover:bg-[var(--bg-surface-hover)] transition-colors"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancelar
                </button>
              </div>
            )}
            <button
              className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors"
              onClick={handleClose}
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-5">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Descripción</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{stand?.meta}</p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)]">Proyecto</p>
                <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{stand?.proyecto}</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)]">Sala</p>
                <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{stand?.sala}</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)]">Estado</p>
                <p className={`text-sm font-medium mt-1 ${stand?.status === 'published' ? 'text-emerald-400' : stand?.status === 'pending' ? 'text-amber-400' : 'text-gray-400'}`}>
                  {stand ? statusLabels[stand.status] : ''}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)]">Autor</p>
                <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{stand?.author}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Creado: {stand?.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Actualizado: {stand?.updatedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] flex-shrink-0 gap-3">
          <div className="flex items-center gap-2">
            {role === 'invitado' || role === 'empresarial' ? (
              <a
                href="#"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ver Stand
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
