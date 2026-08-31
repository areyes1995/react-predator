// ──────────────────────────────────────────────
// AreaChartCard — Reusable area chart card
// ──────────────────────────────────────────────

import { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface AreaDataPoint {
  time: string
  unique: number
  total: number
}

export interface AreaChartCardProps {
  data: AreaDataPoint[]
  title?: string
  height?: number
  uniqueKey?: string
  totalKey?: string
}

export default function AreaChartCard({ data, title, height = 350, uniqueKey = 'unique', totalKey = 'total' }: AreaChartCardProps) {
  const chartData = useMemo(() => data, [data])

  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] flex flex-col" style={{ height: `${height}px` }}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
      )}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="time"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              width={50}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const p = payload[0]
                const d = chartData.find(row => row.time === p?.payload?.time)
                return (
                  <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-sm">
                    <p className="text-xs font-medium text-[var(--text-primary)] mb-1">{p?.payload?.time}</p>
                    {payload.map((entry, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                        <span className="text-[var(--text-secondary)]">{String(entry?.name || entry?.dataKey)}</span>
                        <span className="text-[var(--text-primary)] font-medium ml-auto">{entry?.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey={uniqueKey}
              stroke="var(--text-muted)"
              strokeWidth={2}
              fill="var(--text-muted)"
              fillOpacity={0.1}
              name="Unique"
            />
            <Area
              type="monotone"
              dataKey={totalKey}
              stroke="#10b981"
              strokeWidth={2}
              fill="#10b981"
              fillOpacity={0.1}
              name="Total"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
