import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidth?: string
  maxHeight?: string
  overlay?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
  maxHeight = 'max-h-[90vh]',
  overlay = true,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {overlay && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />}
      <div className={`relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-full ${maxWidth} ${maxHeight} overflow-hidden shadow-2xl flex flex-col`}>
        {children}
      </div>
    </div>
  )
}
