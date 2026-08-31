// ──────────────────────────────────────────────
// PageLayout — Reusable page layout with
// header, controls bar, and content area
// ──────────────────────────────────────────────

import type { ReactNode } from 'react'

export interface PageLayoutProps {
  title: string
  subtitle?: string
  controls?: ReactNode
  children?: ReactNode
}

export default function PageLayout({ title, subtitle, controls, children }: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
        <div className="border-b border-[var(--border)]">
          <div className="px-4 lg:px-6 py-4">
            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h1>
              {subtitle && <p className="text-sm text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {controls && (
            <div className="px-4 lg:px-6 py-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {controls}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
