// ──────────────────────────────────────────────
// HomeOverview — Global summary of all record modules
// ──────────────────────────────────────────────

import { useAppTranslation } from '../../i18n/useAppTranslation'

export default function HomeOverview() {
  const { t } = useAppTranslation()
  return (
    <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)]">
      {t('Dashboard coming soon')}
    </div>
  )
}