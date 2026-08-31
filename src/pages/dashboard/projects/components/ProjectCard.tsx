import { FolderOpen, Eye, Heart, MessageSquare, Calendar, Clock, ChevronRight, Star } from 'lucide-react'
import type { ProjectCardProps } from '../types'

export default function ProjectCard({ project, role, onClick }: ProjectCardProps) {
  const statusLabels: Record<string, string> = {
    active: 'Activo',
    pending: 'Pendiente',
    completed: 'Completado',
    archived: 'Archivado'
  }

  const statusColors: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-400',
    pending: 'text-amber-400 bg-amber-400',
    completed: 'text-blue-400 bg-blue-400',
    archived: 'text-gray-400 bg-gray-400'
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (role === 'visitor') {
      onClick(project)
    }
  }

  return (
    <div
      className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-active)] cursor-pointer h-full flex flex-col group"
      onClick={() => onClick(project)}
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-[var(--bg-surface-soft)] to-[var(--bg-surface)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-[var(--text-muted)]" strokeWidth={1.5} />
          </div>
        </div>
        {/* Status badge */}
        <div className={`absolute top-3 right-3 ${statusColors[project.status]} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg`}>
          {statusLabels[project.status]}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 min-h-0 gap-3">
        <div className="min-h-0 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight line-clamp-2 group-hover:text-[var(--text-primary)]/80 transition-colors">
                {project.title}
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {project.technologies.slice(0, 3).map(tech => (
            <span key={tech} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)]">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)]">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {project.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {project.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {project.comments}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {role === 'visitor' && (
              <button
                className="p-1 rounded-md transition-colors text-[var(--text-muted)] hover:text-amber-400 hover:bg-amber-400/10"
                onClick={handleFavorite}
              >
                {project.isFavorite ? <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <Star className="w-3.5 h-3.5" />}
              </button>
            )}
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {project.createdAt}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {project.updatedAt}
          </span>
        </div>
      </div>
    </div>
  )
}
