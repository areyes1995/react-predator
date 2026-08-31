// ──────────────────────────────────────────────
// DashboardLayout — Protected layout for dashboard pages
// Wraps the sidebar + main content area for all pages
// under /app/dashboard/*
// ──────────────────────────────────────────────

import { Outlet } from 'react-router-dom'
import { ViewHeader } from '../../components/ui'
import { useAppTranslation } from '../../i18n/useAppTranslation'

export default function DashboardLayout() {
  const { t } = useAppTranslation()
  return (
    <div className="flex flex-col h-full">
      <ViewHeader title={t('Dashboard')} />
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  )
}
