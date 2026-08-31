// ──────────────────────────────────────────────
// DropdownFilter — Generic dropdown filter
// ──────────────────────────────────────────────

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

export interface DropdownFilterItem {
  key: string
  label: string
}

export interface DropdownFilterProps {
  value: string
  items: DropdownFilterItem[]
  onChange: (key: string) => void
  buttonLabel?: string
  /** Icon shown before label — defaults to ChevronDown */
  icon?: ReactNode
}

export default function DropdownFilter({ value, items, onChange, buttonLabel, icon }: DropdownFilterProps) {
  const [open, setOpen] = useState(false)
  const selectedLabel = items.find(i => i.key === value)?.label ?? ''

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface-soft)] text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
      >
        {icon || <span className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-white">{buttonLabel}</span>}
        <span>{selectedLabel}</span>
        <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 min-w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onChange(item.key)
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === item.key
                    ? 'bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
