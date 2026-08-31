import type { ReactNode } from 'react'

export type StandStatus = 'published' | 'pending' | 'draft'

export type StandRole = 'admin' | 'presentador' | 'empresarial' | 'invitado'

export type StandSearchFilters = {
  search: string
  status: StandStatus | 'all'
  sala: string
  proyecto: string
}

export interface StandData {
  id: string
  title: string
  meta: string
  status: StandStatus
  proyecto: string
  sala: string
  createdAt: string
  updatedAt: string
  author: string
}

export interface StandStats {
  total: number
  published: number
  pending: number
  drafts: number
}

export interface StandDetailModalProps {
  stand: StandData
  role: StandRole
  isOpen: boolean
  onClose: () => void
}

export interface StandCardProps {
  stand: StandData
  role: StandRole
  onClick: (stand: StandData) => void
  onEdit?: (stand: StandData) => void
  onDelete?: (stand: StandData) => void
  onChangeStatus?: (stand: StandData, status: StandStatus) => void
}

export interface StandsViewProps {
  role: StandRole
  stands: StandData[]
  stats: StandStats
  filters: StandSearchFilters
  onFiltersChange: (filters: StandSearchFilters) => void
  onCreateStand?: () => void
  onEditStand?: (stand: StandData) => void
  onDeleteStand?: (stand: StandData) => void
  onChangeStatus?: (stand: StandData, status: StandStatus) => void
  selectedStand: StandData | null
  setSelectedStand: (stand: StandData | null) => void
  showFormModal: boolean
  setShowFormModal: (show: boolean) => void
  editingStand: StandData | null
  setEditingStand: (stand: StandData | null) => void
}

export interface StandFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<StandData, 'id' | 'createdAt' | 'updatedAt' | 'author'>) => void
  stand?: StandData | null
  role: StandRole
}

export interface StandDetailModalWithActionsProps extends StandDetailModalProps {
  onChangeStatus?: (stand: StandData, status: StandStatus) => void
  onEdit?: (stand: StandData) => void
  onDelete?: (stand: StandData) => void
  canEdit?: boolean
  canDelete?: boolean
}

export interface StandCardSkeletonProps {}

export interface StandCardEmptyProps {
  role: StandRole
  onCreateStand?: () => void
}

export interface StandCardErrorProps {
  message?: string
}
