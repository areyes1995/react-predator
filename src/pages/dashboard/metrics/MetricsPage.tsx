// ──────────────────────────────────────────────
// MetricsPage — Dashboard de Métricas y Analíticas
// de Rendimiento para UAPAverse
// ──────────────────────────────────────────────

import { useEffect, useState, useCallback } from 'react'
import { Users, Clock, MessageSquare, CheckCircle2, UserCheck, Activity, FileText, Table, FileSpreadsheet, TrendingUp } from 'lucide-react'
import { KpiCard, MetricGrid, ChartRow, DonutChart, ProgressCard, type KpiCardProps, type ProgressItem, AreaChartCard, type AreaDataPoint, BarChartCard, type BarDataPoint, type DonutDataPoint } from '../../../components/charts'
import { EmptyState, PageLayout, SkeletonGrid, SkeletonChartCard, ActivityFeed, DropdownFilter, DropdownAction, StarRating, ExpandableTable, type ActivityEntry } from '../../../components/ui'
import { useAppTranslation } from '../../../i18n/useAppTranslation'

export type TimeRange = 'today' | 'sevenDays' | 'thirtyDays' | 'event'

// ──────────────────────────────────────────────
// Mock data (TODO: Reemplazar con llamadas al
// endpoint backend /api/v1/analytics)
// ──────────────────────────────────────────────

const MOCK_TRAFFIC_DATA: AreaDataPoint[] = [
  { time: '08:00', unique: 12, total: 18 },
  { time: '09:00', unique: 45, total: 72 },
  { time: '10:00', unique: 120, total: 185 },
  { time: '11:00', unique: 230, total: 340 },
  { time: '12:00', unique: 310, total: 480 },
  { time: '13:00', unique: 385, total: 560 },
  { time: '14:00', unique: 420, total: 610 },
  { time: '15:00', unique: 395, total: 580 },
  { time: '16:00', unique: 350, total: 510 },
  { time: '17:00', unique: 280, total: 420 },
  { time: '18:00', unique: 190, total: 290 },
  { time: '19:00', unique: 110, total: 170 },
]

const MOCK_STANDS_DATA: BarDataPoint[] = [
  { name: 'Pab. A - Tech', visitors: 520, avgStay: 18 },
  { name: 'Pab. B - Design', visitors: 480, avgStay: 22 },
  { name: 'Pab. C - Media', visitors: 390, avgStay: 15 },
  { name: 'Pab. D - AI', visitors: 360, avgStay: 20 },
  { name: 'Pab. E - Startup', visitors: 280, avgStay: 12 },
  { name: 'Pab. F - Edu', visitors: 210, avgStay: 25 },
]

const MOCK_INTERACTION_DATA = [
  { name: 'Consultas Avatar', value: 3420, color: '#3b82f6' },
  { name: 'Fichas Técnicas', value: 1240, color: '#10b981' },
  { name: 'Formularios', value: 890, color: '#f59e0b' },
  { name: 'Descargas', value: 270, color: '#8b5cf6' },
]

const MOCK_FAQ_DATA = [
  { question: '¿Cuál es la duración del evento?', count: 342, satisfaction: 4.5 },
  { question: '¿Cómo accedo al avatar virtual del stand?', count: 287, satisfaction: 4.2 },
  { question: '¿Qué tipos de stands están disponibles?', count: 198, satisfaction: 3.8 },
  { question: '¿Puedo descargar las fichas técnicas?', count: 156, satisfaction: 4.7 },
  { question: '¿Hay límite de interacciones con el avatar?', count: 134, satisfaction: 4.0 },
  { question: '¿Cómo registro mi empresa en el evento?', count: 112, satisfaction: 3.5 },
  { question: '¿El avatar puede responder en inglés?', count: 89, satisfaction: 4.3 },
  { question: '¿Puedo personalizar mi avatar?', count: 76, satisfaction: 4.1 },
  { question: '¿Dónde encuentro el programa del evento?', count: 65, satisfaction: 4.6 },
  { question: '¿Hay costo para participar?', count: 52, satisfaction: 4.8 },
  { question: '¿Puedo conectar con otros visitantes?', count: 41, satisfaction: 3.9 },
  { question: '¿Cómo contacto al equipo del evento?', count: 28, satisfaction: 4.4 },
]

const MOCK_LATENCY_DATA = [
  { label: 'Parsing', value: 45, max: 200, status: 'good' },
  { label: 'Retrieval', value: 120, max: 500, status: 'good' },
  { label: 'Execution', value: 85, max: 300, status: 'good' },
  { label: 'Generation', value: 210, max: 500, status: 'warning' },
]

const MOCK_AUDIT_ENTRIES: ActivityEntry[] = [
  { timestamp: '2026-08-31 14:32:15', event: 'Export report', user: 'admin@uapaverse.com', status: 'success', detail: 'PDF export completed' },
  { timestamp: '2026-08-31 13:18:42', event: 'Knowledge document uploaded', user: 'editor@uapaverse.com', status: 'success', detail: 'Stand_A_TechSpec.pdf ingested' },
  { timestamp: '2026-08-31 12:05:33', event: 'Login', user: 'admin@uapaverse.com', status: 'success' },
  { timestamp: '2026-08-31 11:42:10', event: 'FAQ created', user: 'editor@uapaverse.com', status: 'success', detail: 'New FAQ added to Pab. A module' },
  { timestamp: '2026-08-31 10:55:21', event: 'Change settings', user: 'admin@uapaverse.com', status: 'info', detail: 'Theme changed to dark' },
  { timestamp: '2026-08-31 09:30:00', event: 'Document uploaded', user: 'editor@uapaverse.com', status: 'error', detail: 'File corrupted, processing failed' },
  { timestamp: '2026-08-30 18:45:12', event: 'Logout', user: 'admin@uapaverse.com', status: 'info' },
  { timestamp: '2026-08-30 17:20:35', event: 'Export report', user: 'admin@uapaverse.com', status: 'success', detail: 'CSV export completed' },
  { timestamp: '2026-08-30 14:10:45', event: 'Login', user: 'admin@uapaverse.com', status: 'success' },
  { timestamp: '2026-08-30 13:55:28', event: 'Knowledge document uploaded', user: 'moderator@uapaverse.com', status: 'success', detail: 'AI_Module_Docs.pdf ingested' },
  { timestamp: '2026-08-30 10:00:00', event: 'System backup', user: 'system', status: 'success', detail: 'Daily backup completed successfully' },
]

// ──────────────────────────────────────────────
// Empty state — use shared EmptyState component
// ──────────────────────────────────────────────

function MetricsEmpty({ onRefresh }: { onRefresh: () => void }) {
  const { t } = useAppTranslation()
  return (
    <EmptyState
      message={t('metrics.empty')}
      actionLabel={t('metrics.refresh')}
      onAction={onRefresh}
    />
  )
}

// ──────────────────────────────────────────────
// MetricsPage — Main dashboard component
// ──────────────────────────────────────────────

export default function MetricsPage() {
  const { t } = useAppTranslation()

  const [timeRange, setTimeRange] = useState<TimeRange>('today')
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

  const loadMetrics = useCallback(() => {
    setLoading(true)
    // TODO: Reemplazar con llamada al endpoint backend /api/v1/analytics?range={timeRange}
    setTimeout(() => {
      setDataLoaded(true)
      setLoading(false)
    }, 1200)
  }, [])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  const handleExport = (format: string) => {
    // TODO: Implementar exportación real
    console.log(`Exporting metrics as ${format}`)
  }

  // KPI data (mock)
  const kpiMetrics: KpiCardProps[] = [
    { label: 'metrics.uniqueVisitors', value: '2,450', trend: 12, icon: <Users className="w-5 h-5" />, accentClass: 'text-blue-400' },
    { label: 'metrics.avgStayTime', value: '14 min 30s', trend: 5, icon: <Clock className="w-5 h-5" />, accentClass: 'text-emerald-400' },
    { label: 'metrics.aiInteractions', value: '5,820', trend: 18, icon: <MessageSquare className="w-5 h-5" />, accentClass: 'text-purple-400' },
    { label: 'metrics.ragSuccessRate', value: '96.4%', trend: 2.1, icon: <CheckCircle2 className="w-5 h-5" />, accentClass: 'text-emerald-500' },
    { label: 'metrics.leadsCaptured', value: '340', trend: -3, icon: <UserCheck className="w-5 h-5" />, accentClass: 'text-amber-400' },
  ]

  const donutData: DonutDataPoint[] = MOCK_INTERACTION_DATA.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
  }))

  const progressData: ProgressItem[] = MOCK_LATENCY_DATA.map((item) => ({
    label: item.label,
    value: item.value,
    max: item.max,
    status: item.status,
  }))

  // Build FAQ rows with StarRating
  const faqRows = MOCK_FAQ_DATA.map((faq) => (
    <tr key={faq.question} className="border-b border-[var(--border)] last:border-none hover:bg-[var(--bg-surface-hover)] transition-colors">
      <td className="py-2 px-1 text-[var(--text-muted)] font-mono text-xs">#</td>
      <td className="py-2 px-1 text-[var(--text-primary)]">{faq.question}</td>
      <td className="py-2 px-1 text-center text-[var(--text-primary)] font-medium">{faq.count.toLocaleString()}</td>
      <td className="py-2 px-1 text-center">
        <StarRating value={faq.satisfaction} size={3} />
      </td>
    </tr>
  ))

  // Build audit rows
  const auditRows = MOCK_AUDIT_ENTRIES.map((entry) => (
    <tr key={entry.event} className="border-b border-[var(--border)] last:border-none hover:bg-[var(--bg-surface-hover)] transition-colors">
      <td className="py-2 px-1 text-[var(--text-primary)]">{entry.event}</td>
      <td className="py-2 px-1 text-[var(--text-secondary)]">{entry.user}</td>
      <td className="py-2 px-1 text-[var(--text-muted)]">{entry.timestamp}</td>
    </tr>
  ))

  return (
    <PageLayout
      title={t('metrics.title')}
      subtitle={t('metrics.subtitle')}
      controls={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <DropdownFilter
            value={timeRange}
            items={[
              { key: 'today', label: t('metrics.timeRange.today') },
              { key: 'sevenDays', label: t('metrics.timeRange.sevenDays') },
              { key: 'thirtyDays', label: t('metrics.timeRange.thirtyDays') },
              { key: 'event', label: t('metrics.timeRange.event') },
            ]}
            onChange={(val) => {
              setTimeRange(val as TimeRange)
              setLoading(true)
              setTimeout(() => {
                setDataLoaded(true)
                setLoading(false)
              }, 800)
            }}
          />
          <DropdownAction
            items={[
              { key: 'pdf', label: t('metrics.export.pdf'), icon: <FileText className="w-4 h-4" /> },
              { key: 'csv', label: t('metrics.export.csv'), icon: <Table className="w-4 h-4" /> },
              { key: 'excel', label: t('metrics.export.excel'), icon: <FileSpreadsheet className="w-4 h-4" /> },
            ]}
            onAction={handleExport}
            buttonLabel={t('metrics.exportReport')}
            buttonIcon={<TrendingUp className="w-4 h-4" />}
            buttonClass="bg-emerald-600 hover:bg-emerald-700 text-white"
          />
        </div>
      }
    >
      {loading ? (
        <>
          <SkeletonGrid count={5} cardHeight="h-32" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <SkeletonChartCard height={320} />
            <SkeletonChartCard height={320} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <SkeletonChartCard height={320} />
            <SkeletonChartCard height={320} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <SkeletonChartCard height={320} />
            <SkeletonChartCard height={320} />
          </div>
        </>
      ) : dataLoaded ? (
        <div className="space-y-6">
          <MetricGrid metrics={kpiMetrics} />

          <ChartRow
            left={<AreaChartCard data={MOCK_TRAFFIC_DATA} title={t('metrics.trafficFlow')} />}
            right={<BarChartCard data={MOCK_STANDS_DATA} title={t('metrics.popularStands')} />}
          />

          <ChartRow
            left={<DonutChart title={t('metrics.interactionTypes')} items={donutData} />}
            right={
              <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] h-full">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-[var(--text-muted)]" />
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{t('metrics.frequentQuestions')}</h3>
                </div>
                <ExpandableTable
                  items={faqRows}
                  total={MOCK_FAQ_DATA.length}
                  maxItems={8}
                />
              </div>
            }
          />

          <ProgressCard
            avgValue={460}
            avgSuffix="ms"
            items={progressData}
            title={t('metrics.ragLatency')}
          />

          <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] h-full">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{t('metrics.auditLog')}</h3>
            </div>
            <ExpandableTable
              items={auditRows}
              total={MOCK_AUDIT_ENTRIES.length}
              maxItems={10}
            />
          </div>
        </div>
      ) : (
        <MetricsEmpty onRefresh={loadMetrics} />
      )}
    </PageLayout>
  )
}
