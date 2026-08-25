// ──────────────────────────────────────────────
// HomePage — main landing page. Route: /app/home
// ──────────────────────────────────────────────

import { HomeOverview } from '../../components/home'
import { ViewHeader } from '../../components/ui'
import { useAppTranslation } from '../../i18n/useAppTranslation'

export default function HomePage() {
  const { t } = useAppTranslation()
  return (
    <div className="flex flex-col h-full">
      <ViewHeader title={t('Home')} subtitle={t('Overview')} />
      <HomeOverview />
    </div>
  )
}