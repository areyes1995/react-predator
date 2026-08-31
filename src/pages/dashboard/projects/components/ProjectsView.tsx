import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Filter, ChevronDown, Plus, ArrowDown, ArrowUp, Star, FolderOpen } from 'lucide-react'
import type { ProjectRole, ProjectTab, ProjectSearchFilters, ProjectData } from '../types'
import { PROJECTS_DATA, PROJECT_CATEGORIES } from '../data'
import ProjectCard from './ProjectCard'
import EntityCardSkeleton from '../../../../components/ui/cards/EntityCardSkeleton'
import CardError from '../../../../components/ui/cards/CardError'
import CardEmpty from '../../../../components/ui/cards/CardEmpty'
import ProjectDetailModal from './ProjectDetailModal'
import { LayoutGrid, List } from 'lucide-react'

export default function ProjectsView({ role }: { role: ProjectRole }) {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [selectedTab, setSelectedTab] = useState<ProjectTab>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<ProjectSearchFilters>({
    search: '',
    category: 'Todas',
    status: 'all',
    sortBy: 'date'
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const filtered = PROJECTS_DATA.filter(p => {
          const matchSearch = !filters.search || p.title.toLowerCase().includes(filters.search.toLowerCase()) || p.description.toLowerCase().includes(filters.search.toLowerCase())
          const matchCategory = filters.category === 'Todas' || p.category === filters.category
          const matchStatus = filters.status === 'all' || p.status === filters.status
          return matchSearch && matchCategory && matchStatus
        })
        const sorted = [...filtered].sort((a, b) => {
          if (filters.sortBy === 'name') return a.title.localeCompare(b.title)
          if (filters.sortBy === 'views') return b.views - a.views
          return new Date(b.updatedAt.split('/').reverse().join('-')).getTime() - new Date(a.updatedAt.split('/').reverse().join('-')).getTime()
        })
        const tabFiltered = selectedTab === 'my' ? sorted.filter(p => p.author.includes('Sánchez') || p.author.includes('Martínez')) : selectedTab === 'pending' ? sorted.filter(p => p.status === 'pending') : sorted
        setProjects(tabFiltered)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [filters, selectedTab])

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    pending: projects.filter(p => p.status === 'pending').length,
    completed: projects.filter(p => p.status === 'completed').length,
    archived: projects.filter(p => p.status === 'archived').length,
    totalViews: projects.reduce((acc, p) => acc + p.views, 0),
    totalLikes: projects.reduce((acc, p) => acc + p.likes, 0)
  }), [projects])

  const handleCardClick = useCallback((project: ProjectData) => {
    setSelectedProject(project)
  }, [])

  const handleToggleFavorite = useCallback((id: string) => {
    setSelectedProject(prev => {
      if (prev && prev.id === id) {
        return { ...prev, isFavorite: !prev.isFavorite }
      }
      return prev
    })
  }, [])

  const handleRequestMeeting = useCallback(() => {
    console.log('Meeting request sent')
    setSelectedProject(null)
  }, [])

  const handleApprove = useCallback(() => {
    console.log('Project approved')
  }, [])

  const handleReject = useCallback(() => {
    console.log('Project rejected')
  }, [])

  const handleEdit = useCallback(() => {
    console.log('Edit project')
  }, [])

  const handleViewToggle = useCallback(() => {
    setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'))
  }, [])

  const statusLabels: Record<string, string> = {
    active: 'Activo',
    pending: 'Pendiente',
    completed: 'Completado',
    archived: 'Archivado'
  }

  const statusColors: Record<string, string> = {
    active: 'text-emerald-400',
    pending: 'text-amber-400',
    completed: 'text-blue-400',
    archived: 'text-gray-400'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 lg:px-6 py-4 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Proyectos</h1>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Explora, gestiona y colabora en los proyectos de la plataforma</p>
            </div>
            {role === 'expositor' && (
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors whitespace-nowrap">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            )}
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, descripción..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filters.category}
                onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none pr-8 cursor-pointer"
              >
                {PROJECT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                className="px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none pr-8 cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
              </select>
            </div>
            <div className="flex-shrink-0">
              <select
                value={filters.sortBy}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none pr-8 cursor-pointer"
              >
                <option value="date">Fecha</option>
                <option value="name">Nombre</option>
                <option value="views">Visitas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 px-4 lg:px-6 border-b border-[var(--border)]">
        {([
          { tab: 'all' as ProjectTab, label: 'All Projects', count: stats.total },
          { tab: 'my' as ProjectTab, label: 'My Projects', count: stats.total },
          { tab: 'pending' as ProjectTab, label: 'Pending Approval', count: stats.pending }
        ]).map(tab => (
          <button
            key={tab.tab}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              selectedTab === tab.tab
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            onClick={() => setSelectedTab(tab.tab)}
          >
            {tab.label}
            <span className="ml-2 text-[10px] opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-end px-4 lg:px-6 py-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 bg-[var(--bg-surface-soft)] rounded-lg p-1">
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
            onClick={handleViewToggle}
            aria-label="Vista cuadrícula"
            title="Vista cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Grid</span>
          </button>
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              viewMode === 'list'
                ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
            onClick={handleViewToggle}
            aria-label="Vista lista"
            title="Vista lista"
          >
            <List className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-4">
        {viewMode === 'grid' ? (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 lg:p-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <EntityCardSkeleton key={i} count={1} />
              ))}
            </div>
          ) : error ? (
            <div className="p-4 lg:p-6">
              <CardError />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-4 lg:p-6">
              <CardEmpty
                icon={FolderOpen}
                message={role === 'admin' ? 'No hay proyectos registrados. Haz clic en "+ New Project" para crear uno.' : role === 'expositor' ? 'A&#233;un no tienes proyectos. &#191;Comienza creando tu primer proyecto!' : 'No hay proyectos disponibles en este momento. Vuelve pronto.'}
                role={role}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 lg:p-6">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  role={role}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )
        ) : (
          loading ? (
            <div className="flex items-center justify-center py-12 text-[var(--text-muted)]">
              <EntityCardSkeleton count={1} />
            </div>
          ) : error ? (
            <div className="p-4 lg:p-6">
              <CardError />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-4 lg:p-6">
              <CardEmpty
                icon={FolderOpen}
                message={role === 'admin' ? 'No hay proyectos registrados. Haz clic en "+ New Project" para crear uno.' : role === 'expositor' ? 'A&#233;un no tienes proyectos. &#191;Comienza creando tu primer proyecto!' : 'No hay proyectos disponibles en este momento. Vuelve pronto.'}
                role={role}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left text-[var(--text-muted)] font-medium py-3 px-3 text-xs whitespace-nowrap">
                      Nombre
                    </th>
                    <th className="text-left text-[var(--text-muted)] font-medium py-3 px-3 text-xs whitespace-nowrap hidden sm:table-cell">
                      Estado
                    </th>
                    <th className="text-left text-[var(--text-muted)] font-medium py-3 px-3 text-xs whitespace-nowrap hidden md:table-cell">
                      Autor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr
                      key={project.id}
                      className="border-b border-[var(--border)] transition-colors hover:bg-[var(--bg-surface-soft)] cursor-pointer"
                      onClick={() => handleCardClick(project)}
                    >
                      <td className="py-3 px-3 text-[var(--text-secondary)]">
                        <span className="font-medium">{project.title}</span>
                      </td>
                      <td className="py-3 px-3 hidden sm:table-cell">
                        <span className={`text-xs ${statusColors[project.status]}`}>
                          {statusLabels[project.status]}
                        </span>
                      </td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        <span className="text-xs text-[var(--text-muted)]">{project.author}</span>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td className="text-center py-12 text-[var(--text-muted)]">No hay proyectos</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Modal */}
      <ProjectDetailModal
        project={selectedProject!}
        role={role}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onToggleFavorite={selectedProject ? () => handleToggleFavorite(selectedProject.id) : undefined}
        onRequestMeeting={handleRequestMeeting}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
      />
    </div>
  )
}
