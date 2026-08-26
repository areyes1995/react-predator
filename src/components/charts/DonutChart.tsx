// ──────────────────────────────────────────────
// DonutChart — gender distribution donut chart
// ──────────────────────────────────────────────

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface DonutDataPoint {
  name: string
  value: number
  color: string
}

export interface DonutChartProps {
  title: string
  total: number
  items: DonutDataPoint[]
  icon?: React.ReactNode
}

export default function DonutChart({ title, total, items, icon, className }: { title: string; total: number; items: DonutDataPoint[]; icon?: React.ReactNode; className?: string }) {
  const totalValue = items.reduce((sum, item) => sum + item.value, 0)

  const renderTooltip = (props: unknown) => {
    const p = (props as any)?.payload as Array<{ name: string; value: number; percent?: number }> | undefined
    const l = (props as any)?.label as string
    if (!p || !l) return null
    const data = items.find(i => i.name === l)
    if (!data) return null
    const percentage = totalValue > 0 ? ((data.value / totalValue) * 100).toFixed(1) : '0'
    return (
      <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-sm">
        <p className="text-xs font-medium text-[var(--text-primary)] mb-1">{l}</p>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="text-[var(--text-secondary)]">{data.name}</span>
          <span className="text-[var(--text-primary)] font-medium ml-auto">{data.value} ({percentage}%)</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      </div>

      <div className="flex justify-between gap-4 text-left">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={items}
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={300}
              >
                {items.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend
                iconType="circle"
                iconSize={8}
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col items-center justify-center min-w-[100px]">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{total}</div>
          <div className="text-xs text-[var(--text-muted)]">bajas</div>
        </div>
      </div>
    </div>
  )
}
