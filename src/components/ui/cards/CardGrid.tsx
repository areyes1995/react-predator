import { Search } from 'lucide-react'
import EntityCardSkeleton from './EntityCardSkeleton'
import CardError from './CardError'
import CardEmpty from './CardEmpty'
import type { CardGridProps, CardGridState } from '../types'

export default function CardGrid({
  loading,
  error,
  empty,
  emptySearch,
  emptyMessage,
  emptySearchMessage,
  emptyIcon: EmptyIcon,
  emptyActionLabel,
  onEmptyAction,
  emptyRoles,
  role,
  skeletonCount = 6,
  children,
  className,
}: CardGridProps) {
  const state: CardGridState = loading ? 'loading' : error ? 'error' : emptySearch ? 'emptySearch' : empty ? 'empty' : 'loaded'

  const contentClasses = className ?? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 lg:p-6'

  if (state === 'loading') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className={contentClasses}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <EntityCardSkeleton key={i} count={1} />
          ))}
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6">
          <CardError />
        </div>
      </div>
    )
  }

  if (state === 'emptySearch') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6">
          <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center">
            <Search className="w-8 h-8 text-[var(--text-muted)]" strokeWidth={1.5} />
            <p className="text-sm text-[var(--text-muted)] max-w-sm">{emptySearchMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'empty') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6">
          <CardEmpty
            icon={EmptyIcon}
            message={emptyMessage}
            role={role}
            rolesWithAction={emptyRoles}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  )
}
