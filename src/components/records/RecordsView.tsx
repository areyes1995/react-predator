// ──────────────────────────────────────────────
// RecordsView — renders the main content for a module + view option
// ──────────────────────────────────────────────

import { getRecordsForModule } from '../../records'
import type { RecordModule, RecordViewOption } from '../../records'
import RecordsSummary from './RecordsSummary'
import RecordsTable from './RecordsTable'

export interface RecordsViewProps {
  module: RecordModule
  view: RecordViewOption
}

export default function RecordsView({ module, view }: RecordsViewProps) {
  const data = getRecordsForModule(module.label)

  switch (view.kind) {
    case 'summary':
      return <RecordsSummary data={data} columns={module.columns} moduleColor={module.color} />
    case 'archived':
      return <RecordsTable data={data} columns={module.columns} statusFilter="Archived" />
    case 'table':
    default:
      return <RecordsTable data={data} columns={module.columns} />
  }
}