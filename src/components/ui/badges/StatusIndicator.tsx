// ──────────────────────────────────────────────
// StatusIndicator — Reusable status badge with
// icon, label, and optional color variants
// ──────────────────────────────────────────────

import { CheckCircle, AlertTriangle, Info } from 'lucide-react'
import type { ReactNode } from 'react'

export type StatusType = 'success' | 'error' | 'info' | 'warning'

export interface StatusIndicatorProps {
  status: StatusType
  label?: string
  icon?: ReactNode
}

export default function StatusIndicator({ status, label, icon }: StatusIndicatorProps) {
  const defaultIcon = () => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info': return <Info className="w-4 h-4 text-[var(--text-muted)]" />
    }
  }

  const iconToRender = icon || defaultIcon()

  return (
    <span className="inline-flex items-center gap-1.5">
      {iconToRender}
      {label && <span className="text-sm">{label}</span>}
    </span>
  )
}
