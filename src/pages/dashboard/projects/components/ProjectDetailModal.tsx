import { useState } from 'react'
import { X, ExternalLink, Heart, Mail, Calendar, Clock, Star, Play, Image as ImageIcon, FileText, Users, Wrench, Clock as ClockIcon } from 'lucide-react'
import type { ProjectDetailModalProps } from '../types'

export default function ProjectDetailModal({
  project,
  role,
  isOpen,
  onClose,
  onToggleFavorite,
  onRequestMeeting,
  onApprove,
  onReject,
  onEdit
}: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'specs'>('overview')

  if (!isOpen) return null

  const handleClose = () => {
    onClose()
    setActiveTab('overview')
  }

  const statusLabels: Record<string, string> = {
    active: 'Activo',
    pending: 'Pendiente',
    completed: 'Completado',
    archived: 'Archivado'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[var(--text-primary)] truncate">{project.title}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">{project.category}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {(role === 'admin' && project.status === 'pending') && (
              <>
                <button
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                  onClick={() => { onApprove?.(); handleClose() }}
                >
                  Aprobar
                </button>
                <button
                  className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  onClick={() => { onReject?.(); handleClose() }}
                >
                  Rechazar
                </button>
              </>
            )}
            {role === 'expositor' && (
              <button
                className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                onClick={() => { onEdit?.(); handleClose() }}
              >
                Editar
              </button>
            )}
            <button
              className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors"
              onClick={handleClose}
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 border-b border-[var(--border)] flex-shrink-0">
          {(['overview', 'gallery', 'specs'] as const).map(tab => {
            const labels = { overview: 'General', gallery: 'Galería', specs: 'Ficha Técnica' }
            return (
              <button
                key={tab}
                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {labels[tab]}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-5">
              {/* Hero image area */}
              <div className="h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-3">
                    <Play className="w-10 h-10 text-white/60" strokeWidth={1.5} />
                  </div>
                  <p className="text-xs text-white/40">Video del proyecto</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Descripción</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{project.description}</p>
              </div>

              {/* Author & Contact */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
                  {project.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{project.author}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{project.category}</p>
                </div>
                {project.contactEmail && role === 'visitor' && (
                  <button
                    className="p-2 rounded-md text-[var(--text-muted)] hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                    title="Enviar solicitud de contacto"
                  >
                    <Mail className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-4">
                <div className="flex-1 text-center p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)]">
                  <div className="text-lg font-bold text-[var(--text-primary)]">{project.views.toLocaleString()}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Visitas</div>
                </div>
                <div className="flex-1 text-center p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)]">
                  <div className="text-lg font-bold text-[var(--text-primary)]">{project.likes}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Likes</div>
                </div>
                <div className="flex-1 text-center p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)]">
                  <div className="text-lg font-bold text-[var(--text-primary)]">{project.comments}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Comentarios</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="flex flex-col gap-4">
              {project.gallery && project.gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {project.gallery.map((item, i) => (
                    <div key={i} className="aspect-video bg-gradient-to-br from-[var(--bg-surface-soft)] to-[var(--bg-surface)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--border)] hover:border-[var(--border-active)] transition-colors group cursor-pointer">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-5 h-5 text-[var(--text-muted)]" strokeWidth={1.5} />
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)]">{item.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-[var(--text-muted)]">No hay imágenes en esta galería</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="flex flex-col gap-5">
              {project.technicalSpec && (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)]">
                    <Wrench className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Metodología</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{project.technicalSpec.methodology}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)] text-center">
                      <div className="text-lg font-bold text-[var(--text-primary)]">{project.technicalSpec.duration}</div>
                      <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Duración
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)] text-center">
                      <div className="text-lg font-bold text-[var(--text-primary)]">{project.technicalSpec.teamSize}</div>
                      <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1">
                        <Users className="w-3 h-3" />
                        Equipo
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--bg-surface-soft)] border border-[var(--border)] text-center">
                      <div className="text-lg font-bold text-[var(--text-primary)]">{project.technologies.length}</div>
                      <div className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1">
                        <Wrench className="w-3 h-3" />
                        Herramientas
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Tecnologías principales</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map(tech => (
                        <span key={tech} className="text-xs px-3 py-1 rounded-md bg-[var(--bg-surface-soft)] border border-[var(--border)] text-[var(--text-primary)]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Tools & Frameworks</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technicalSpec.tools.map(tool => (
                        <span key={tool} className="text-xs px-3 py-1 rounded-md bg-[var(--bg-surface-soft)] border border-[var(--border)] text-[var(--text-muted)]">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {project.createdAt}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {project.updatedAt}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {role === 'visitor' && project.status === 'active' && (
              <>
                <button
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
                  onClick={() => onToggleFavorite?.()}
                >
                  {project.isFavorite ? (
                    <><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Guardado</>
                  ) : (
                    <><Heart className="w-3.5 h-3.5" /> Guardar</>
                  )}
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                  onClick={() => onRequestMeeting?.()}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Solicitar Reunión
                </button>
              </>
            )}
            {role === 'visitor' && project.status !== 'active' && (
              <button
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
                onClick={() => onToggleFavorite?.()}
              >
                <Heart className="w-3.5 h-3.5" />
                Guardar
              </button>
            )}
            {role === 'admin' && (
              <a
                href="#"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ver Proyecto
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
