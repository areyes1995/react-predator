import type { ReactNode } from 'react'

export default function ModalFooter({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] flex-shrink-0 gap-3">
      {left}
      <div className="flex items-center gap-3 ml-auto">
        {right}
      </div>
    </div>
  )
}
