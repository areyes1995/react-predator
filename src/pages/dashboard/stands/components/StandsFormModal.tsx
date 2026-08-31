import type { StandFormModalProps, StandStatus } from '../types'
import { STAND_SALAS, STAND_PROYECTOS } from '../data'
import { useState } from 'react'
import Modal from '../../../../components/ui/modal/Modal'
import ModalHeader from '../../../../components/ui/modal/ModalHeader'
import ModalBody from '../../../../components/ui/modal/ModalBody'
import { FormField, FormInput, FormLabel, FormSelect, FormButton } from '../../../../components/ui/form'
import { Save } from 'lucide-react'

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
    proyecto: stand?.proyecto ?? '',
    sala: stand?.sala ?? '',
    status: (stand?.status ?? 'draft') as StandStatus,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'El nombre del stand es obligatorio'
    if (!formData.meta.trim()) newErrors.meta = 'La descripción es obligatoria'
    if ((role === 'admin' || role === 'presentador') && !formData.proyecto) newErrors.proyecto = 'El proyecto es obligatorio'
    if ((role === 'admin' || role === 'presentador') && !formData.sala) newErrors.sala = 'La sala es obligatoria'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    onSubmit({
      title: formData.title.trim(),
      meta: formData.meta.trim(),
      status: formData.status,
      proyecto: formData.proyecto,
      sala: formData.sala,
    })
    setIsSubmitting(false)
  }

  const selectFields = role === 'admin' || role === 'presentador'

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        title={isEditing ? 'Editar stand' : 'Crear stand'}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <FormField label="Nombre del stand" htmlFor="title" error={errors.title}>
            <FormInput
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Stand Innovación Educativa"
            />
          </FormField>

          <FormField label="Descripción" htmlFor="meta" error={errors.meta}>
            <textarea
              name="meta"
              id="meta"
              value={formData.meta}
              onChange={handleChange}
              placeholder="Describe el contenido y propósito del stand..."
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors resize-none h-24"
            />
          </FormField>

          {selectFields && (
            <>
              <FormField label="Proyecto" htmlFor="proyecto" error={errors.proyecto}>
                <FormSelect
                  name="proyecto"
                  id="proyecto"
                  value={formData.proyecto}
                  onChange={handleChange}
                  options={STAND_PROYECTOS.filter(p => p !== 'Todos').map(p => ({ value: p, label: p }))}
                />
              </FormField>

              <FormField label="Sala" htmlFor="sala" error={errors.sala}>
                <FormSelect
                  name="sala"
                  id="sala"
                  value={formData.sala}
                  onChange={handleChange}
                  options={STAND_SALAS.filter(s => s !== 'Todas').map(s => ({ value: s, label: s }))}
                />
              </FormField>
            </>
          )}

          {role === 'admin' && (
            <FormField label="Estado" htmlFor="status">
              <FormSelect
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'draft', label: 'Borrador' },
                  { value: 'pending', label: 'Pendiente' },
                  { value: 'published', label: 'Publicado' },
                ]}
              />
            </FormField>
          )}
        </ModalBody>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)] flex-shrink-0">
          <button
            type="button"
            className="px-4 py-2 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
          <FormButton
            type="submit"
            loading={isSubmitting}
            loadingText="Guardando..."
            icon={<Save className="w-3.5 h-3.5" />}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Guardar
          </FormButton>
        </div>
      </form>
    </Modal>
  )
}
