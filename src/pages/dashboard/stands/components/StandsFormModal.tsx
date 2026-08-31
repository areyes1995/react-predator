import { useState, useCallback } from 'react'
import { X, Save } from 'lucide-react'
import type { StandFormModalProps, StandStatus } from '../types'
import { STAND_SALAS, STAND_PROYECTOS } from '../data'

export default function StandsFormModal({
  isOpen,
  onClose,
  onSubmit,
  stand,
  role,
}: StandFormModalProps) {
  const isEditing = !!stand

  const [formData, setFormData] = useState({
    title: stand?.title ?? '',
    meta: stand?.meta ?? '',
    status: stand?.status ?? ('draft' as StandStatus),
    proyecto: stand?.proyecto ?? '',
    sala: stand?.sala ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El nombre del stand es obligatorio'
    }
    if (!formData.meta.trim()) {
      newErrors.meta = 'La descripción es obligatoria'
    }

    if (role === 'admin' || role === 'presentador') {
      if (!formData.proyecto) {
        newErrors.proyecto = 'El proyecto es obligatorio'
      }
      if (!formData.sala) {
        newErrors.sala = 'La sala es obligatoria'
      }
    }

    return newErrors
  }, [formData, role])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        title: formData.title.trim(),
        meta: formData.meta.trim(),
        status: formData.status,
        proyecto: formData.proyecto,
        sala: formData.sala,
      })
    }
  }

  const handleClose = () => {
    onClose()
    setErrors({})
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[var(--border)] flex-shrink-0">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {isEditing ? 'Editar stand' : 'Crear stand'}
          </h2>
          <button
            className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors"
            onClick={handleClose}
            aria-label="Cerrar formulario"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label htmlFor="stand-title" className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                Nombre del stand
              </label>
              <input
                id="stand-title"
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors ${errors.title ? 'border-red-500/50' : 'border-[var(--border)]'}`}
                placeholder="Ej: Stand Innovación Educativa"
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-400" role="alert">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="stand-meta" className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                Descripción
              </label>
              <textarea
                id="stand-meta"
                value={formData.meta}
                onChange={e => setFormData(prev => ({ ...prev, meta: e.target.value }))}
                className={`w-full px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors resize-none h-24 ${errors.meta ? 'border-red-500/50' : 'border-[var(--border)]'}`}
                placeholder="Describe el contenido y propósito del stand..."
                aria-invalid={!!errors.meta}
              />
              {errors.meta && (
                <p className="mt-1 text-xs text-red-400" role="alert">{errors.meta}</p>
              )}
            </div>

            {/* Proyecto */}
            {role === 'admin' || role === 'presentador' ? (
              <div>
                <label htmlFor="stand-proyecto" className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                  Proyecto
                </label>
                <select
                  id="stand-proyecto"
                  value={formData.proyecto}
                  onChange={e => setFormData(prev => ({ ...prev, proyecto: e.target.value }))}
                  className={`w-full px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none cursor-pointer ${errors.proyecto ? 'border-red-500/50' : 'border-[var(--border)]'}`}
                  aria-invalid={!!errors.proyecto}
                >
                  <option value="">Seleccionar proyecto</option>
                  {STAND_PROYECTOS.filter(p => p !== 'Todos').map(proyecto => (
                    <option key={proyecto} value={proyecto}>{proyecto}</option>
                  ))}
                </select>
                {errors.proyecto && (
                  <p className="mt-1 text-xs text-red-400" role="alert">{errors.proyecto}</p>
                )}
              </div>
            ) : null}

            {/* Sala */}
            {role === 'admin' || role === 'presentador' ? (
              <div>
                <label htmlFor="stand-sala" className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                  Sala
                </label>
                <select
                  id="stand-sala"
                  value={formData.sala}
                  onChange={e => setFormData(prev => ({ ...prev, sala: e.target.value }))}
                  className={`w-full px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none cursor-pointer ${errors.sala ? 'border-red-500/50' : 'border-[var(--border)]'}`}
                  aria-invalid={!!errors.sala}
                >
                  <option value="">Seleccionar sala</option>
                  {STAND_SALAS.filter(s => s !== 'Todas').map(sala => (
                    <option key={sala} value={sala}>{sala}</option>
                  ))}
                </select>
                {errors.sala && (
                  <p className="mt-1 text-xs text-red-400" role="alert">{errors.sala}</p>
                )}
              </div>
            ) : null}

            {/* Status */}
            {role === 'admin' ? (
              <div>
                <label htmlFor="stand-status" className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                  Estado
                </label>
                <select
                  id="stand-status"
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as StandStatus }))}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none cursor-pointer"
                >
                  <option value="draft">Borrador</option>
                  <option value="pending">Pendiente</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
            ) : null}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)] flex-shrink-0">
          <button
            type="button"
            className="px-4 py-2 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            onClick={handleSubmit}
          >
            <Save className="w-3.5 h-3.5" />
            {isEditing ? 'Guardar cambios' : 'Crear stand'}
          </button>
        </div>
      </div>
    </div>
  )
}
