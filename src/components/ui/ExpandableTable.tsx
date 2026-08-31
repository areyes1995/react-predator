// ──────────────────────────────────────────────
// ExpandableTable — Generic expandable table component
// Used by FrequentQuestions, AuditLog, etc.
// ──────────────────────────────────────────────

import { useState, Fragment } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ReactNode } from 'react'

export interface ExpandableTableProps {
  /** Table body rows — tr elements render directly inside tbody */
  items: ReactNode[]
  /** Total count (for showing "show all N" button) */
  total: number
  /** Initial visible count */
  maxItems?: number
  /** Expand/collapse button label override */
  expandLabel?: string
  collapseLabel?: string
  /** Table header row (th elements) */
  header?: ReactNode
  /** Render each data item as a row — provides index and data object */
  renderRow?: (index: number, data: unknown) => ReactNode
  /** Raw data array for renderRow mode */
  data?: unknown[]
}

export default function ExpandableTable({
  items: rawItems,
  total,
  maxItems = 10,
  expandLabel = 'Ver todo',
  collapseLabel = 'Ver menos',
  header,
  renderRow,
  data,
}: ExpandableTableProps) {
  const [expanded, setExpanded] = useState(false)

  const rows = renderRow && data
    ? data.map((item, i) => renderRow(i, item))
    : rawItems

  const visible = expanded ? rows : rows?.slice(0, maxItems)

  return (
    <div className="overflow-x-auto">
      {header && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {header}
            </tr>
          </thead>
        </table>
      )}

      <table className="w-full text-sm">
        <tbody>
          {visible?.map((row, i) => (
            <Fragment key={i}>{row}</Fragment>
          ))}
        </tbody>
      </table>

      {total > maxItems && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] py-2 transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              {collapseLabel} ({total})
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              {expandLabel} ({total})
            </>
          )}
        </button>
      )}
    </div>
  )
}
