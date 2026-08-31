// ──────────────────────────────────────────────
// FrequentQuestions — Tabla/lista de las preguntas
// más frecuentes al avatar IA
// ──────────────────────────────────────────────

import { useState } from 'react'
import { MessageSquare, Star } from 'lucide-react'
import { useAppTranslation } from '../../../i18n/useAppTranslation'

export interface FAQItem {
  question: string
  count: number
  satisfaction: number
}

export interface FrequentQuestionsProps {
  data: FAQItem[]
  title?: string
  maxItems?: number
}

export default function FrequentQuestions({ data, title, maxItems = 10 }: FrequentQuestionsProps) {
  const { t } = useAppTranslation()
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? data : data.slice(0, maxItems)

  const renderStars = (rating: number) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    const empty = 5 - full - (half ? 1 : 0)
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`full-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
        {half && (
          <span className="relative">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="absolute inset-0 overflow-hidden">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-3 h-3 text-[var(--border)]" />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] h-full">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-[var(--text-muted)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-2 px-1 text-xs font-medium text-[var(--text-muted)]">#</th>
              <th className="text-left py-2 px-1 text-xs font-medium text-[var(--text-muted)]">{t('metrics.questions')}</th>
              <th className="text-center py-2 px-1 text-xs font-medium text-[var(--text-muted)]">{t('metrics.appearances')}</th>
              <th className="text-center py-2 px-1 text-xs font-medium text-[var(--text-muted)]">{t('metrics.satisfaction')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item, i) => (
              <tr key={i} className="border-b border-[var(--border)] last:border-none hover:bg-[var(--bg-surface-hover)] transition-colors">
                <td className="py-2 px-1 text-[var(--text-muted)] font-mono text-xs">{i + 1}</td>
                <td className="py-2 px-1 text-[var(--text-primary)]">{item.question}</td>
                <td className="py-2 px-1 text-center text-[var(--text-primary)] font-medium">{item.count.toLocaleString()}</td>
                <td className="py-2 px-1 text-center">{renderStars(item.satisfaction)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > maxItems && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] py-2 transition-colors"
        >
          {expanded ? 'Ver menos' : `Ver todo (${data.length})`}
        </button>
      )}
    </div>
  )
}
