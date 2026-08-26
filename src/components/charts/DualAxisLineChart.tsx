// ──────────────────────────────────────────────
// DualAxisLineChart — reusable line chart with
// dual Y-axes (left: numeric, right: percentage)
// ──────────────────────────────────────────────

import { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export interface ChartDataPoint {
  month: string
  left1: number
  left2: number
  right?: number
}

export interface ChartSeries {
  name: string
  key: keyof ChartDataPoint
  yAxis?: 'left' | 'right'
  strokeColor?: string
  strokeWidth?: number
  strokeDasharray?: string
  dot?: boolean
}

export interface DualAxisLineChartProps {
  data: ChartDataPoint[]
  series: ChartSeries[]
  title?: string
  /** Aspect ratio — height relative to width, e.g. "600" */
  height?: number
  /** Tooltip formatter; overrides default numeric/% formatting */
  formatValue?: (key: string, value: number, payload?: Record<string, unknown>) => string
}

export default function DualAxisLineChart({
  data,
  series,
  title,
  height = 380,
  formatValue,
}: DualAxisLineChartProps) {
  const chartData = useMemo(() => {
    return data.map((row) => {
      const entry: Record<string, number | string> = { month: row.month }
      series.forEach((s) => {
        const val = row[s.key as keyof ChartDataPoint]
        if (val !== undefined) {
          entry[s.key] = val
        }
      })
      return entry
    })
  }, [data, series])

  const leftTicks = useMemo(() => {
    const values = series
      .filter((s) => s.yAxis === 'left')
      .flatMap((s) => data.map((d) => d[s.key] as number))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const step = range / 5
    return Array.from({ length: 6 }, (_, i) => Math.round(min + step * i))
  }, [data, series])

  const rightTicks = useMemo(() => {
    const values = series
      .filter((s) => s.yAxis === 'right')
      .flatMap((s) => data.map((d) => d[s.key] as number))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const step = range / 5
    return Array.from({ length: 6 }, (_, i) => Math.round(min + step * i))
  }, [data, series])

  const renderTooltip = (
    props: unknown,
    defaultColor: string,
  ) => {
    const typedProps = props as { payload?: unknown[]; label?: string }
    const payloadArr = (typedProps?.payload as unknown[]) || []
    const [firstPayload] = payloadArr
    if (!firstPayload || !typedProps?.label) return null

    const label = typedProps.label as string
    const row = (firstPayload as { data?: ChartDataPoint })?.data as ChartDataPoint | undefined
    if (!label || !row) return null

    const items = payloadArr.map((p) => {
      const typedP = p as { dataKey?: string; type?: string }
      const s = series.find((ser) => ser.key === typedP.dataKey)
      const val = (row as unknown as Record<string, unknown>)[typedP.dataKey as keyof ChartDataPoint] as number
      const formatted = formatValue
        ? formatValue(String(typedP.dataKey), val)
        : s?.yAxis === 'right'
          ? `${Math.round(val * 100)}%`
          : val.toLocaleString()
      return {
        type: typedP.type as string,
        dataKey: String(typedP.dataKey),
        color: s?.strokeColor || defaultColor,
        label: s?.name || String(typedP.dataKey),
        value: formatted,
        strokeWidth: s?.strokeWidth || 2,
        strokeDasharray: s?.strokeDasharray,
      }
    })

    return (
      <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-sm">
        <p className="text-xs font-medium text-[var(--text-primary)] mb-1">{String(label)}</p>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                backgroundColor: item.color,
                ...(item.strokeDasharray ? { backgroundImage: `repeating-linear-gradient(90deg, ${item.color} 0, ${item.color} 2px, transparent 2px, transparent 4px)` } : {}),
              }}
            />
            <span className="text-[var(--text-secondary)] w-28 truncate">{item.label}</span>
            <span className="text-[var(--text-primary)] font-medium ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)]">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 10, right: 60, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

          <XAxis
            dataKey="month"
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
          />

          <YAxis
            yAxisId="left"
            orientation="left"
            tickFormatter={(v: number) => v.toLocaleString()}
            ticks={leftTicks}
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            width={60}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v: number) => `${Math.round(v)}%`}
            ticks={rightTicks}
            stroke="var(--text-muted)"
            fontSize={12}
            tickLine={false}
            width={40}
          />

          <Tooltip
            content={({ payload, ...rest }: any) =>
              renderTooltip({ payload, label: rest?.label }, 'var(--text-muted)')
            }
            wrapperStyle={{ fontSize: '12px' }}
          />

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />

          {series.map((s) => (
            <Line
              key={s.key}
              yAxisId={s.yAxis || 'left'}
              type="monotone"
              dataKey={s.key}
              stroke={s.strokeColor || '#6b7280'}
              strokeWidth={s.strokeWidth || 2}
              strokeDasharray={s.strokeDasharray}
              dot={s.dot ?? true}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
