// ──────────────────────────────────────────────
// AdminPage — placeholder for the administration
// module (built out in Fase 2). Route: /app/dashboard/admin
// ──────────────────────────────────────────────

import { ViewHeader } from '../../components/ui'
import { useAppTranslation } from '../../i18n/useAppTranslation'

export default function AdminPage() {
  const { t } = useAppTranslation()
  return (
    <div className="flex flex-col h-full">
      <ViewHeader title={t('Administration')} />
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)]">
        {t('Admin module coming soon')}
      </div>
    </div>
  )
}
