// ──────────────────────────────────────────────
// HomeOverview — Global summary of all record modules
// ──────────────────────────────────────────────

import { useMemo } from 'react'
import { LayoutGrid, CheckCircle2, Clock, Archive, TrendingUp, Boxes } from 'lucide-react'
import { ALL_MODULE_DATA, getAllModuleRecords, RECORD_STATUSES, STATUS_META } from '../../records'

const moduleBarColors: Record<string, string> = {
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  pink: 'bg-pink-500',
}
import type { RecordData } from '../../records'
import { KpiCard, CategoryBarList, StatusOverview } from '../charts'
import { useAppTranslation } from '../../i18n/useAppTranslation'

const statusIcons = {
  Active: <CheckCircle2 className="w-4 h-4" />,
  Pending: <Clock className="w-4 h-4" />,
  Archived: <Archive className="w-4 h-4" />,
}

export default function HomeOverview() {
  const { t } = useAppTranslation()
  const stats = useMemo(() => {
    const all = getAllModuleRecords()
    const byStatus: Record<RecordData['status'], number> = { Active: 0, Pending: 0, Archived: 0 }

    for (const row of all) byStatus[row.status]++

    const byModule = ALL_MODULE_DATA.map(entry => ({
      name: entry.label,
      count: entry.data.length,
    }))

    return { all, total: all.length, byStatus, byModule }
  }, [])

  const segments = RECORD_STATUSES.map(status => ({
    label: STATUS_META[status].label,
    count: stats.byStatus[status],
    color: STATUS_META[status].color,
    bar: STATUS_META[status].bar,
  }))

  const recent = stats.all.slice(0, 5).map(row => ({
    id: row.id,
    title: String(row.title),
    date: String(row.lastUpdated),
    dotClass: STATUS_META[row.status].bar,
  }))

  return (
    <div className="flex-1 overflow-auto px-4 lg:px-6 pt-5 pb-24">
      {/* KPIs globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label={t('Total Records')}
          value={stats.total}
          hint={t('across all modules')}
          icon={<LayoutGrid className="w-4 h-4" />}
        />
        {RECORD_STATUSES.map(status => (
          <KpiCard
            key={status}
            label={STATUS_META[status].label}
            value={stats.byStatus[status]}
            hint={`${stats.total ? Math.round((stats.byStatus[status] / stats.total) * 100) : 0}% ${t('of records')}`}
            icon={statusIcons[status]}
            accentClass={STATUS_META[status].color}
          />
        ))}
      </div>

      {/* Charts: by module + status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <CategoryBarList
          title={t('Records by module')}
          items={stats.byModule}
          icon={<Boxes className="w-4 h-4 text-[var(--text-muted)]" />}
          barClass="bg-blue-500"
        />
        <StatusOverview
          title={t('Status overview')}
          segments={segments}
          total={stats.total}
          recent={recent}
          icon={<TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />}
        />
      </div>

      {/* Cards informativas por módulo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {ALL_MODULE_DATA.map(entry => {
          const active = entry.data.filter(r => r.status === 'Active').length
          const pending = entry.data.filter(r => r.status === 'Pending').length
          const archived = entry.data.filter(r => r.status === 'Archived').length
          const isHex = typeof entry.color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(entry.color)
          const barClass = isHex ? '' : (moduleBarColors[entry.color] ?? 'bg-blue-500')
          const barStyle = isHex ? { backgroundColor: entry.color } : undefined
          const { title: sampleTitle, category: sampleCategory, owner: sampleOwner } = entry.data[0] ?? {}

          return (
            <div key={entry.label} className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${barClass}`} style={barStyle} />
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{entry.label}</h3>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{entry.data.length} {t('records')}</span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] space-y-1 mb-3">
                <p>{t('Active')}: <span className="text-green-400">{active}</span> · {t('Pending')}: <span className="text-amber-400">{pending}</span> · {t('Archived')}: <span className="text-[var(--text-secondary)]">{archived}</span></p>
              </div>
              <div className="h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barClass}`} style={{ ...barStyle, width: `${entry.data.length / stats.total * 100}%` }} />
              </div>
              {sampleTitle && (
                <p className="text-xs text-[var(--text-muted)] mt-3">
                  {t('Latest')}: <span className="text-[var(--text-secondary)]">{sampleTitle}</span>
                  {sampleCategory && <> · {sampleCategory}</>}
                  {sampleOwner && <> — {sampleOwner}</>}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}