export default function ProjectCardSkeleton() {
  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl overflow-hidden h-full flex flex-col animate-pulse">
      <div className="relative h-40 bg-[var(--bg-surface)] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-surface-hover)]" />
      </div>
      <div className="p-5 flex flex-col flex-1 min-h-0 gap-3">
        <div className="min-h-0 flex-1">
          <div className="h-4 bg-[var(--bg-surface-hover)] rounded mb-2 w-3/4" />
          <div className="h-3 bg-[var(--bg-surface-hover)] rounded mb-1 w-full" />
          <div className="h-3 bg-[var(--bg-surface-hover)] rounded w-2/3" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 bg-[var(--bg-surface-hover)] rounded w-16" />
          <div className="h-5 bg-[var(--bg-surface-hover)] rounded w-20" />
          <div className="h-5 bg-[var(--bg-surface-hover)] rounded w-14" />
        </div>
        <div className="flex justify-between pt-2 border-t border-[var(--border)]">
          <div className="flex gap-4">
            <div className="h-3 bg-[var(--bg-surface-hover)] rounded w-12" />
            <div className="h-3 bg-[var(--bg-surface-hover)] rounded w-12" />
            <div className="h-3 bg-[var(--bg-surface-hover)] rounded w-12" />
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <div className="h-3 bg-[var(--bg-surface-hover)] rounded w-24" />
          <div className="h-3 bg-[var(--bg-surface-hover)] rounded w-20" />
        </div>
      </div>
    </div>
  )
}
