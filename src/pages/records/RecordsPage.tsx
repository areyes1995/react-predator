// ──────────────────────────────────────────────
// RecordsPage — routed view of the records area.
// Module + view come from the URL
// (`/app/records/:base?/:view?`), deep-linkable.
// ──────────────────────────────────────────────

import { useRecordsDashboard } from '../../records'
import { RecordsView } from '../../components/records'
import { HomeOverview } from '../../components/home'

export default function RecordsPage() {
  const { activeModule, activeView } = useRecordsDashboard()

  if (activeModule && activeView) {
    return (
      <div className="flex-1 min-h-0 flex flex-col">
        <RecordsView module={activeModule} view={activeView} />
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <HomeOverview />
    </div>
  )
}