// ──────────────────────────────────────────────
// ExportDropdown — Botón con menú desplegable
// para exportar reportes (PDF, CSV, Excel)
// ──────────────────────────────────────────────

import { useState } from 'react'
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react'
import { useAppTranslation } from '../../../i18n/useAppTranslation'

export interface ExportDropdownProps {
  onExport?: (format: 'pdf' | 'csv' | 'excel') => void
}

export default function ExportDropdown({ onExport }: ExportDropdownProps) {
  const { t } = useAppTranslation()
  const [open, setOpen] = useState(false)

  const formats = [
    { key: 'pdf' as const, label: 'metrics.export.pdf', icon: <FileText className="w-4 h-4" /> },
    { key: 'csv' as const, label: 'metrics.export.csv', icon: <Table className="w-4 h-4" /> },
    { key: 'excel' as const, label: 'metrics.export.excel', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ]

  const handleClick = (format: 'pdf' | 'csv' | 'excel') => {
    onExport?.(format)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm"
      >
        <Download className="w-4 h-4" />
        <span>{t('metrics.exportReport')}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 z-20 min-w-[200px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
            {formats.map((fmt) => (
              <button
                key={fmt.key}
                onClick={() => handleClick(fmt.key)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors"
              >
                {fmt.icon}
                {t(fmt.label)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
