// ──────────────────────────────────────────────
// ReportsPage — placeholder for the reports module
// (built out in Fase 2). Route: /app/reports
// ──────────────────────────────────────────────

import { ViewHeader } from '../../components/ui'
import { useAppTranslation } from '../../i18n/useAppTranslation'

export default function ReportsPage() {
  const { t } = useAppTranslation()
  return (
    <div className="flex flex-col h-full">
      <ViewHeader title={t('Reports')} />
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)]">
        {t('Reports module coming soon')}
      </div>
    </div>
  )
}