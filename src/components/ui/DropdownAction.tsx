// ──────────────────────────────────────────────
// DropdownAction — Dropdown action button
// ──────────────────────────────────────────────

import { useState } from 'react'
import type { ReactNode } from 'react'

export interface DropdownActionItem {
  key: string
  label: string
  icon?: ReactNode
}

export interface DropdownActionProps {
  items: DropdownActionItem[]
  onAction?: (key: string) => void
  buttonLabel?: string
  buttonIcon?: ReactNode
  buttonClass?: string
}

export default function DropdownAction({ items, onAction, buttonLabel = 'Action', buttonIcon, buttonClass = 'bg-emerald-600 hover:bg-emerald-700 text-white' }: DropdownActionProps) {
  const [open, setOpen] = useState(false)

  const handleClick = (key: string) => {
    onAction?.(key)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${buttonClass}`}
      >
        {buttonIcon}
        <span>{buttonLabel}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 z-20 min-w-[200px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() => handleClick(item.key)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
