import type { StatusBadgeProps } from '../types'

const statusColors: Record<string, string> = {
  published: 'text-emerald-400 bg-emerald-400',
  pending: 'text-amber-400 bg-amber-400',
  draft: 'text-gray-400 bg-gray-400',
  active: 'text-emerald-400 bg-emerald-400',
  completed: 'text-blue-400 bg-blue-400',
  archived: 'text-gray-400 bg-gray-400',
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const colorClass = statusColors[status] || 'text-gray-400 bg-gray-400'

  return (
    <div className={`absolute top-3 right-3 ${colorClass} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg`}>
      {label ?? status}
    </div>
  )
}
