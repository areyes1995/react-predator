import type { StandFormModalProps, StandStatus } from '../types'
import { STAND_SALAS, STAND_PROYECTOS } from '../data'
import FormModal from '../../../../components/ui/modal/FormModal'
import type { FormFieldConfig } from '../../../../components/ui/modal/types'

export default function StandsFormModal({
  isOpen,
  onClose,
  onSubmit,
  stand,
  role,
}: StandFormModalProps) {
  const isEditing = !!stand

  const fields: FormFieldConfig[] = [
    {
      name: 'title',
      label: 'Nombre del stand',
      type: 'text',
      placeholder: 'Ej: Stand Innovación Educativa',
      initialValue: stand?.title ?? '',
      validate: (v: string | number) => {
        const val = String(v).trim()
        return !val ? 'El nombre del stand es obligatorio' : undefined
      },
    },
    {
      name: 'meta',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Describe el contenido y propósito del stand...',
      initialValue: stand?.meta ?? '',
      validate: (v: string | number) => {
        const val = String(v).trim()
        return !val ? 'La descripción es obligatoria' : undefined
      },
    },
  ]

  if (role === 'admin' || role === 'presentador') {
    fields.push({
      name: 'proyecto',
      label: 'Proyecto',
      type: 'select',
      initialValue: stand?.proyecto ?? '',
      options: STAND_PROYECTOS.filter(p => p !== 'Todos').map(p => ({ value: p, label: p })),
      validate: (v: string | number) => {
        return !String(v) ? 'El proyecto es obligatorio' : undefined
      },
    })
    fields.push({
      name: 'sala',
      label: 'Sala',
      type: 'select',
      initialValue: stand?.sala ?? '',
      options: STAND_SALAS.filter(s => s !== 'Todas').map(s => ({ value: s, label: s })),
      validate: (v: string | number) => {
        return !String(v) ? 'La sala es obligatorio' : undefined
      },
    })
  }

  if (role === 'admin') {
    fields.push({
      name: 'status',
      label: 'Estado',
      type: 'select',
      initialValue: stand?.status ?? 'draft',
      options: [
        { value: 'draft', label: 'Borrador' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'published', label: 'Publicado' },
      ],
    })
  }

  const handleSubmit = (data: Record<string, unknown>) => {
    onSubmit({
      title: String(data.title ?? '').trim(),
      meta: String(data.meta ?? '').trim(),
      status: data.status as StandStatus,
      proyecto: String(data.proyecto ?? ''),
      sala: String(data.sala ?? ''),
    })
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditing ? 'Editar stand' : 'Crear stand'}
      fields={fields}
    />
  )
}
