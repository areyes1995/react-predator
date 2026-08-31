import { Search } from 'lucide-react'
import type { SearchFilterProps } from '../types'

export default function SearchFilter({ searchValue, onSearchChange, searchPlaceholder, filters, ariaLabel }: SearchFilterProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
          <input
            type="text"
            placeholder={searchPlaceholder ?? 'Buscar...'}
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors"
            aria-label={ariaLabel}
          />
        </div>
      </div>
      {filters && filters.length > 0 && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {filters.map(f => (
            <select
              key={f.value}
              value={f.currentValue ?? f.options[0]}
              onChange={e => f.onChange(e.target.value)}
              className="px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none pr-8 cursor-pointer"
              aria-label={f.label}
            >
              {f.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  )
}
