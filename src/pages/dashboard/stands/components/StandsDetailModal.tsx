import { useState } from 'react'
import { X, ExternalLink, Calendar, Clock, Edit, Trash2 } from 'lucide-react'
import type { StandDetailModalWithActionsProps, StandStatus } from '../types'
import Modal from '../../../../components/ui/modal/Modal'
import ModalHeader from '../../../../components/ui/modal/ModalHeader'
import ModalBody from '../../../../components/ui/modal/ModalBody'
import ModalFooter from '../../../../components/ui/modal/ModalFooter'
import type { ReactNode } from 'react'

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

  const renderHeaderActions = () => {
    const actions = [] as React.ReactNode[]
    renderStatusActions()
    actions.push(renderStatusActions())
    if (canEdit) {
      actions.push(
        <button
          key="edit"
          className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          onClick={() => { onEdit?.(stand); handleClose() }}
        >
          Editar
        </button>
      )
    }
    if (canDelete && !confirmDelete) {
      actions.push(
        <button
          key="delete"
          className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          onClick={() => setConfirmDelete(true)}
        >
          Eliminar
        </button>
      )
    }
    if (confirmDelete) {
      actions.push(
        <div key="confirm" className="flex items-center gap-2">
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
      )
    }
    return actions
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" maxHeight="max-h-[90vh]">
      <ModalHeader
        title={stand?.title}
        subtitle={stand?.proyecto}
        actions={renderHeaderActions()}
        onClose={onClose}
      />
      <ModalBody>
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Descripción</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{stand?.meta}</p>
          </div>
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
      </ModalBody>
      <ModalFooter
        right={
          role === 'invitado' || role === 'empresarial' ? (
            <a
              href="#"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Stand
            </a>
          ) : null
        }
      />
    </Modal>
  )
}
