import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react'
import type { MetaRowProps } from '../types'

export default function MetaRow({ createdAt, updatedAt, views, extra }: MetaRowProps) {
  return (
    <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] pt-1">
      <span className="flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {createdAt}
      </span>
      {updatedAt && (
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {updatedAt}
        </span>
      )}
      {views !== undefined && (
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {views}
        </span>
      )}
      {extra}
    </div>
  )
}
