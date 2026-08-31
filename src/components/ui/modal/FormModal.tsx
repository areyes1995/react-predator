import { Save } from 'lucide-react'
import { useState, forwardRef, type ReactNode } from 'react'
import Modal from './Modal'
import ModalHeader from './ModalHeader'
import ModalBody from './ModalBody'
import { FormButton } from '../form/FormButton'

export interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  title?: string
  children?: ReactNode
  submitText?: string
  cancelText?: string
}

const FormModal = forwardRef<HTMLElement, FormModalProps>(
  ({ isOpen, onClose, onSubmit, title, children, submitText, cancelText }, ref) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      await onSubmit(e)
      setIsSubmitting(false)
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
          </ModalBody>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)] flex-shrink-0">
            <button
              type="button"
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              onClick={onClose}
            >
              {cancelText || 'Cancelar'}
            </button>
            <FormButton
              type="submit"
              loading={isSubmitting}
              loadingText="Guardando..."
              icon={<Save className="w-3.5 h-3.5" />}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              {submitText || 'Guardar'}
            </FormButton>
          </div>
        </form>
      </Modal>
    )
  }
)

FormModal.displayName = 'FormModal'
export default FormModal
