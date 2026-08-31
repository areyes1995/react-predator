// ──────────────────────────────────────────────
// InteractionTypeChart — Gráfico donut mostrando
// la distribución de interacciones por tipo
// ──────────────────────────────────────────────

import { Circle } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export interface InteractionDataPoint {
  name: string
  value: number
  color: string
}

export interface InteractionTypeChartProps {
  data: InteractionDataPoint[]
  title?: string
  className?: string
}

export default function InteractionTypeChart({ data, title, className }: InteractionTypeChartProps) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  const renderTooltip = (props: { payload?: Array<{ name: string; value: number; percent?: number }>; label: string }) => {
    const { payload, label } = props
    if (!payload || !label) return null
    const item = data.find(i => i.name === label)
    if (!item) return null
    const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0'
    return (
      <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-sm">
        <p className="text-xs font-medium text-[var(--text-primary)] mb-1">{label}</p>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-[var(--text-secondary)]">{item.name}</span>
          <span className="text-[var(--text-primary)] font-medium ml-auto">{item.value} ({percentage}%)</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] ${className} h-full`}>
      <div className="flex items-center gap-2 mb-4">
        <Circle className="w-4 h-4 text-[var(--text-muted)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <ResponsiveContainer width={300} height={200}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={300}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip as any} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col justify-center gap-2 w-40">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[var(--text-secondary)]">{item.name}</span>
              <span className="text-[var(--text-primary)] font-medium ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
