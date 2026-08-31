import type { ReactNode } from 'react'

export default function ModalBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      {children}
    </div>
  )
}
