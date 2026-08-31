import { useState, useEffect, useCallback, useMemo } from 'react'
import { Tent, Plus, Eye, Edit, Trash2, Search } from 'lucide-react'
import type { StandRole, StandSearchFilters, StandData, StandStatus } from '../types'
import { STANDS_DATA, STAND_SALAS, STAND_PROYECTOS } from '../data'
import StandsCard from './StandsCard'
import EntityCardSkeleton from '../../../../components/ui/cards/EntityCardSkeleton'
import CardError from '../../../../components/ui/cards/CardError'
import CardEmpty from '../../../../components/ui/cards/CardEmpty'
import StandsDetailModal from './StandsDetailModal'
import StandsFormModal from './StandsFormModal'

export default function StandsView({ role }: { role: StandRole }) {
  const [stands, setStands] = useState<StandData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedStand, setSelectedStand] = useState<StandData | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingStand, setEditingStand] = useState<StandData | null>(null)
  const [filters, setFilters] = useState<StandSearchFilters>({
    search: '',
    status: 'all',
    sala: 'Todas',
    proyecto: 'Todos',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const filtered = STANDS_DATA.filter(s => {
          const matchSearch = !filters.search || s.title.toLowerCase().includes(filters.search.toLowerCase()) || s.meta.toLowerCase().includes(filters.search.toLowerCase()) || s.proyecto.toLowerCase().includes(filters.search.toLowerCase())
          const matchStatus = filters.status === 'all' || s.status === filters.status
          const matchSala = filters.sala === 'Todas' || s.sala === filters.sala
          const matchProyecto = filters.proyecto === 'Todos' || s.proyecto === filters.proyecto
          return matchSearch && matchStatus && matchSala && matchProyecto
        })
        setStands(filtered)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [filters])

  const stats = useMemo(() => ({
    total: stands.length,
    published: stands.filter(s => s.status === 'published').length,
    pending: stands.filter(s => s.status === 'pending').length,
    drafts: stands.filter(s => s.status === 'draft').length,
  }), [stands])

  const handleCardClick = useCallback((stand: StandData) => {
    setSelectedStand(stand)
  }, [])

  const handleEdit = useCallback((stand: StandData) => {
    setEditingStand(stand)
    setShowFormModal(true)
  }, [])

  const handleDelete = useCallback((stand: StandData) => {
    setStands(prev => prev.filter(s => s.id !== stand.id))
    setSelectedStand(null)
    setShowFormModal(false)
  }, [])

  const handleCreate = useCallback(() => {
    setEditingStand(null)
    setShowFormModal(true)
  }, [])

  const handleFormSubmit = useCallback((data: Omit<StandData, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('es-DO')

    if (editingStand) {
      setStands(prev => prev.map(s =>
        s.id === editingStand.id ? { ...s, ...data, updatedAt: dateStr } : s
      ))
    } else {
      const newStand: StandData = {
        ...data,
        id: `STD-${String(stands.length + 1).padStart(3, '0')}`,
        createdAt: dateStr,
        updatedAt: dateStr,
        author: 'Usuario actual',
      }
      setStands(prev => [...prev, newStand])
    }
    setShowFormModal(false)
    setEditingStand(null)
  }, [editingStand, stands.length])

  const handleStatusChange = useCallback((_stand: StandData, _status: StandStatus) => {
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 lg:px-6 py-4 border-b border-[var(--border)]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Gestión de Stands</h1>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Administra los stands que forman parte de la experiencia virtual.</p>
            </div>
            {role === 'admin' || role === 'presentador' ? (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors whitespace-nowrap"
                aria-label="Crear nuevo stand"
              >
                <Plus className="w-4 h-4" />
                Crear stand
              </button>
            ) : null}
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Buscar stands..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-active)] transition-colors"
                  aria-label="Buscar stands"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={filters.status}
                onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as StandStatus | 'all' }))}
                className="px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none pr-8 cursor-pointer"
                aria-label="Filtrar por estado"
              >
                <option value="all">Estado</option>
                <option value="published">Publicado</option>
                <option value="pending">Pendiente</option>
                <option value="draft">Borrador</option>
              </select>
              <select
                value={filters.sala}
                onChange={e => setFilters(prev => ({ ...prev, sala: e.target.value }))}
                className="px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none pr-8 cursor-pointer"
                aria-label="Filtrar por sala"
              >
                {STAND_SALAS.map(sala => (
                  <option key={sala} value={sala}>{sala}</option>
                ))}
              </select>
              <select
                value={filters.proyecto}
                onChange={e => setFilters(prev => ({ ...prev, proyecto: e.target.value }))}
                className="px-3 py-2 text-xs bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-active)] transition-colors appearance-none pr-8 cursor-pointer"
                aria-label="Filtrar por proyecto"
              >
                {STAND_PROYECTOS.map(proyecto => (
                  <option key={proyecto} value={proyecto}>{proyecto}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 lg:px-6 py-3 border-b border-[var(--border)]">
        <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-3">
          <div className="text-xs text-[var(--text-muted)] mb-1">Total</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</div>
        </div>
        <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-3">
          <div className="text-xs text-[var(--text-muted)] mb-1">Publicados</div>
          <div className="text-2xl font-bold text-emerald-400">{stats.published}</div>
        </div>
        <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-3">
          <div className="text-xs text-[var(--text-muted)] mb-1">Pendientes</div>
          <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
        </div>
        <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-3">
          <div className="text-xs text-[var(--text-muted)] mb-1">Borradores</div>
          <div className="text-2xl font-bold text-gray-400">{stats.drafts}</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 lg:p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EntityCardSkeleton key={i} count={1} />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 lg:p-6">
            <CardError />
          </div>
        ) : stands.length === 0 && filters.search ? (
          <div className="p-4 lg:p-6">
            <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center">
              <Search className="w-8 h-8 text-[var(--text-muted)]" strokeWidth={1.5} />
              <p className="text-sm text-[var(--text-muted)] max-w-sm">
                No encontramos stands. Prueba con otro término o modifica los filtros.
              </p>
            </div>
          </div>
        ) : stands.length === 0 ? (
          <div className="p-4 lg:p-6">
            <CardEmpty
              icon={Tent}
              message="No hay stands todavía. Crea el primer stand para comenzar a configurar la feria."
              role={role}
              rolesWithAction={['admin', 'presentador']}
              actionLabel="Crear stand"
              onAction={handleCreate}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 lg:p-6">
            {stands.map(stand => (
              <StandsCard
                key={stand.id}
                stand={stand}
                role={role}
                onClick={handleCardClick}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <StandsDetailModal
        stand={selectedStand!}
        role={role}
        isOpen={!!selectedStand}
        onClose={() => setSelectedStand(null)}
        onChangeStatus={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={role === 'admin' || role === 'presentador'}
        canDelete={role === 'admin'}
      />

      {/* Form Modal */}
      <StandsFormModal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); setEditingStand(null) }}
        onSubmit={handleFormSubmit}
        stand={editingStand}
        role={role}
      />
    </div>
  )
}
