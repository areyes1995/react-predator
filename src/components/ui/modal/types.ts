import type { ReactNode } from 'react'

export interface FormFieldConfig {
  name: string
  label: string
  type: 'text' | 'number' | 'email' | 'textarea' | 'select'
  placeholder?: string
  initialValue?: string | number
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validate?: (value: string | number) => string | undefined
}

export interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, unknown>) => void
  title?: string
  fields?: FormFieldConfig[]
  children?: ReactNode
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidth?: string
  maxHeight?: string
  overlay?: boolean
}

export interface ModalHeaderProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  onBack?: () => void
  closeLabel?: string
}

export interface ModalBodyProps {
  children: ReactNode
}

export interface ModalFooterProps {
  left?: ReactNode
  right?: ReactNode
}
