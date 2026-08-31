// ──────────────────────────────────────────────
// StandsVisitChart — Gráfico de barras comparativo
// de tráfico entre stands/pabellones
// ──────────────────────────────────────────────

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export interface StandDataPoint {
  name: string
  visitors: number
  avgStay: number
}

export interface StandsVisitChartProps {
  data: StandDataPoint[]
  title?: string
  height?: number
}

export default function StandsVisitChart({ data, title, height = 350 }: StandsVisitChartProps) {
  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] flex flex-col" style={{ height: `${height}px` }}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <span className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">S</span>
          </span>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
      )}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              angle={-20}
              tickMargin={10}
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
                const d = payload[0]?.payload as StandDataPoint
                return (
                  <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-sm">
                    <p className="text-xs font-medium text-[var(--text-primary)] mb-1">{d.name}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-[var(--text-secondary)]">Visitantes</span>
                      <span className="text-[var(--text-primary)] font-medium ml-auto">{d.visitors}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[var(--text-secondary)]">Tiempo prom.</span>
                      <span className="text-[var(--text-primary)] font-medium ml-auto">{d.avgStay} min</span>
                    </div>
                  </div>
                )
              }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            <Bar dataKey="visitors" fill="#3b82f6" name="Visitantes" radius={[4, 4, 0, 0]} />
            <Bar dataKey="avgStay" fill="#10b981" name="Tiempo (min)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
