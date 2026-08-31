// ──────────────────────────────────────────────
// AttritionReport — attrition analysis page
// Route: /app/dashboard/reports/attrition
// ──────────────────────────────────────────────

import { TrendingUp, Users, UserMinus, CalendarDays, BarChart2, PieChartIcon } from 'lucide-react'
import { ViewHeader } from '../../../components/ui'
import { DynamicComponentRenderer } from '../../../components/charts'
import type { DynamicBlock, ChartDataPoint, ChartSeries, CategoryBarItem, DonutDataPoint, ComponentGroupProps } from '../../../components/charts'
import type { RecordColumn, RecordData } from '../../../records'
import { useAppTranslation } from '../../../i18n/useAppTranslation'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CHART_DATA: ChartDataPoint[] = MONTHS.map((month, i) => ({
  month,
  left1: Math.round(120 - i * 12 + Math.random() * 15),
  left2: Math.round(30 + i * 5 + Math.random() * 8),
  right: parseFloat(((5 - i * 0.3 + Math.random() * 1.5)).toFixed(2)),
}))

const CHART_SERIES: ChartSeries[] = [
  { name: 'Altas', key: 'left1', yAxis: 'left', strokeColor: '#3b82f6', dot: true },
  { name: 'Bajas', key: 'left2', yAxis: 'left', strokeColor: '#ef4444', dot: true },
  { name: 'Rotación%', key: 'right', yAxis: 'right', strokeColor: '#16a34d', dot: true, strokeDasharray: '4 4' },
]

const TABLE_DATA = [
  { month: 'Ene', left1: 120, left2: 28, hadecount: 115, right: 4.2 },
  { month: 'Feb', left1: 105, left2: 32, hadecount: 108, right: 3.8 },
  { month: 'Mar', left1: 98, left2: 35, hadecount: 100, right: 4.5 },
  { month: 'Abr', left1: 85, left2: 38, hadecount: 92, right: 5.1 },
  { month: 'May', left1: 72, left2: 42, hadecount: 80, right: 5.8 },
  { month: 'Jun', left1: 65, left2: 45, hadecount: 75, right: 6.2 },
] as unknown as RecordData[]

const TABLE_COLUMNS: RecordColumn[] = [
  { key: 'month', header: 'Mes', type: 'text' },
  { key: 'left1', header: 'Altas', type: 'number' },
  { key: 'left2', header: 'Bajas', type: 'number' },
  { key: 'hadecount', header: 'HadeCount Prom', type: 'number' },
  { key: 'right', header: 'Rotación %', type: 'number' },
]

const METRICS_DATA: CategoryBarItem[] = [
  { name: 'MINT UNIV. -SFM', count: 28.5, subtitle: '142 headcount | 65 bajas' },
  { name: 'ULTRA UNIVERSAL / RSR', count: 22.3, subtitle: '118 headcount | 48 bajas' },
  { name: 'ARISE', count: 18.7, subtitle: '95 headcount | 38 bajas' },
  { name: 'MINT SALES AND MINT 55', count: 14.2, subtitle: '87 headcount | 32 bajas' },
  { name: 'LIVE CHAT', count: 10.8, subtitle: '72 headcount | 24 bajas' },
  { name: 'ORB HEALTH STGO', count: 5.5, subtitle: '38 headcount | 12 bajas' },
]

const DEPT_TABLE_DATA = [
  { departamento: 'MINT UNIV. -SFM', hadecount: 142, bajas: 65, rotacion: 28.5 },
  { departamento: 'ULTRA UNIVERSAL / RSR', hadecount: 118, bajas: 48, rotacion: 22.3 },
  { departamento: 'ARISE', hadecount: 95, bajas: 38, rotacion: 18.7 },
  { departamento: 'MINT SALES AND MINT 55', hadecount: 87, bajas: 32, rotacion: 14.2 },
  { departamento: 'LIVE CHAT', hadecount: 72, bajas: 24, rotacion: 10.8 },
  { departamento: 'ORB HEALTH STGO', hadecount: 38, bajas: 12, rotacion: 5.5 },
] as unknown as RecordData[]

const DEPT_TABLE_COLUMNS: RecordColumn[] = [
  { key: 'departamento', header: 'Departamento', type: 'text' },
  { key: 'hadecount', header: 'Headcount Prom', type: 'number' },
  { key: 'bajas', header: 'Bajas', type: 'number' },
  { key: 'rotacion', header: 'Rotación %', type: 'number' },
]

const DONUT_DATA: DonutDataPoint[] = [
  { name: 'MINT UNIV. -SFM', value: 65, color: '#3b82f6' },
  { name: 'ULTRA UNIVERSAL / RSR', value: 48, color: '#8b5cf6' },
  { name: 'ARISE', value: 38, color: '#10b981' },
  { name: 'MINT SALES AND MINT 55', value: 32, color: '#f59e0b' },
  { name: 'LIVE CHAT', value: 24, color: '#ef4444' },
  { name: 'ORB HEALTH STGO', value: 12, color: '#06b6d4' },
]

const REPORT_ITEMS: DynamicBlock[] = [
  {
    type: 'KpiCard',
    props: { label: 'Total Employees', value: 1248, hint: 'as of current period', icon: <Users className="w-4 h-4" /> },
    layout: { row: true },
  },
  {
    type: 'KpiCard',
    props: { label: 'Employees Left', value: 87, hint: 'left this period', icon: <UserMinus className="w-4 h-4" /> },
    layout: { row: true },
  },
  {
    type: 'KpiCard',
    props: { label: 'Attrition Rate', value: 6.98, suffix: '%', hint: 'vs 5.2% last period', icon: <TrendingUp className="w-4 h-4" />, accentClass: 'text-red-400' },
    layout: { row: true },
  },
  {
    type: 'KpiCard',
    props: { label: 'Avg Tenure', value: 42, suffix: 'months', hint: 'avg months employed', icon: <CalendarDays className="w-4 h-4" />, accentClass: 'text-green-400' },
    layout: { row: true },
  },
  {
    type: 'DualAxisLineChart',
    props: { data: CHART_DATA, series: CHART_SERIES, title: 'Attrition Trends', height: 380 },
  },
  {
    type: 'RecordsTable',
    props: { data: TABLE_DATA, columns: TABLE_COLUMNS, hideFilter: true },
    before: 'Tabla del movimiento mensual (clic en una fila para ver el detalle).',
  },
  {
    type: 'CategoryBarList',
    props: {
      title: 'Rotación por Departamento',
      subtitle: '% de rotación por departamento, ordenado por bajas. Haz clic para ver los empleados.',
      items: METRICS_DATA,
      icon: <BarChart2 className="w-4 h-4 text-[var(--text-muted)]" />,
      barClass: 'bg-red-500',
    },
  },
  {
    type: 'ComponentGroup',
    props: {
      title: 'Distribución de Bajas por Departamento',
      icon: <PieChartIcon className="w-4 h-4 text-[var(--text-muted)]" />,
      children: [
        {
          type: 'DonutChart',
          props: {
            title: '',
            total: 87,
            items: DONUT_DATA,
          },
        },
        {
          type: 'RecordsTable',
          props: { data: DEPT_TABLE_DATA, columns: DEPT_TABLE_COLUMNS, hideFilter: true, defaultPageSize: 20 },
          before: 'Detalle por departamento',
        },
      ],
    },
  },
]

export default function AttritionReport() {
  const { t } = useAppTranslation()

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title={t('Attrition Report')} />
      <div className="flex-1 overflow-auto px-4 lg:px-6 pt-5 pb-10">
        <DynamicComponentRenderer items={REPORT_ITEMS} />
      </div>
    </div>
  )
}
