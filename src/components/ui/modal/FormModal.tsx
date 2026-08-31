import { X, Save } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import Modal from './Modal'
import ModalHeader from './ModalHeader'
import ModalBody from './ModalBody'
import type { FormFieldConfig } from './types'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, unknown>) => void
  title?: string
  fields?: FormFieldConfig[]
  children?: ReactNode
}

interface FormFieldState {
  value: string | number
}

export default function FormModal({ isOpen, onClose, onSubmit, title, fields, children }: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, FormFieldState>>(() => {
    const initial: Record<string, FormFieldState> = {}
    if (fields) {
      fields.forEach(f => {
        initial[f.name] = { value: f.initialValue ?? '' }
      })
    }
    return initial
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const flat: Record<string, unknown> = {}
    Object.keys(formData).forEach(key => {
      flat[key] = formData[key].value
    })
    if (fields?.length) {
      const validationErrors: Record<string, string> = {}
      fields.forEach(f => {
        if (f.validate) {
          const err = f.validate(formData[f.name]?.value ?? '')
          if (err) validationErrors[f.name] = err
        }
      })
      setErrors(validationErrors)
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(flat)
      }
    } else {
      onSubmit(flat)
    }
  }

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: { value } }))
  }

  const renderField = (field: FormFieldConfig) => {
    const state = formData[field.name] ?? { value: field.initialValue ?? '' }
    const error = errors[field.name]
    const inputClasses = `w-full px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors ${error ? 'border-red-500/50' : 'border-[var(--border)]'}`

    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <div>
            <label htmlFor={field.name} className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              value={state.value}
              onChange={e => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              className={inputClasses}
              placeholder={field.placeholder}
              aria-invalid={!!error}
            />
            {error && <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>}
          </div>
        )

      case 'textarea':
        return (
          <div>
            <label htmlFor={field.name} className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              {field.label}
            </label>
            <textarea
              id={field.name}
              value={state.value}
              onChange={e => handleChange(field.name, e.target.value)}
              className={`${inputClasses} resize-none h-24`}
              placeholder={field.placeholder}
              aria-invalid={!!error}
            />
            {error && <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>}
          </div>
        )

      case 'select':
        return (
          <div>
            <label htmlFor={field.name} className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              {field.label}
            </label>
            <select
              id={field.name}
              value={state.value}
              onChange={e => handleChange(field.name, e.target.value)}
              className={`${inputClasses} appearance-none cursor-pointer`}
              aria-invalid={!!error}
            >
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader
        title={title}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {children}
          {fields?.map(f => renderField(f))}
        </ModalBody>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)] flex-shrink-0">
          <button
            type="button"
            className="px-4 py-2 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  )
}
