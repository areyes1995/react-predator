// ──────────────────────────────────────────────
// DataTable — Generic data table with header and rows
// ──────────────────────────────────────────────

import type { ReactNode } from 'react'

export interface Column {
  key: string
  header: string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps {
  columns: Column[]
  /** Row data — each element maps to a column */
  data: unknown[]
  /** Custom row renderer */
  renderRow?: (row: unknown, index: number) => ReactNode
  /** Override body with custom JSX */
  children?: ReactNode
}

export default function DataTable({
  columns,
  data,
  renderRow,
  children,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2 px-1 text-xs font-medium text-[var(--text-muted)] ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        {children ? (
          <tbody>{children}</tbody>
        ) : (
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-[var(--border)] last:border-none hover:bg-[var(--bg-surface-hover)] transition-colors">
                {renderRow
                  ? renderRow(row, i)
                  : columns.map((col) => (
                      <td
                        key={col.key}
                        className={`py-2 px-1 text-[var(--text-primary)] ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                      >
                        {String((row as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  )
}
