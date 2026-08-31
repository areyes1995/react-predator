import type { ReactNode } from 'react'

export type ProjectRole = 'admin' | 'expositor' | 'visitor'
export type ProjectStatus = 'active' | 'pending' | 'completed' | 'archived'
export type ProjectTab = 'all' | 'my' | 'pending'

export interface ProjectData {
  id: string
  title: string
  description: string
  author: string
  category: string
  technologies: string[]
  status: ProjectStatus
  imageUrl?: string
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  comments: number
  technicalSpec?: {
    methodology: string
    tools: string[]
    duration: string
    teamSize: number
  }
  gallery?: Array<{
    url: string
    caption: string
  }>
  isFavorite?: boolean
  contactEmail?: string
}

export interface ProjectStats {
  total: number
  active: number
  pending: number
  completed: number
  archived: number
  totalViews: number
  totalLikes: number
}

export interface ProjectSearchFilters {
  search: string
  category: string
  status: ProjectStatus | 'all'
  sortBy: 'date' | 'name' | 'views'
}

export interface ProjectDetailModalProps {
  project: ProjectData
  role: ProjectRole
  isOpen: boolean
  onClose: () => void
  onToggleFavorite?: () => void
  onRequestMeeting?: () => void
  onApprove?: () => void
  onReject?: () => void
  onEdit?: () => void
}

export interface ProjectCardProps {
  project: ProjectData
  role: ProjectRole
  onClick: (project: ProjectData) => void
}

export interface ProjectsViewProps {
  role: ProjectRole
  projects: ProjectData[]
  stats: ProjectStats
  searchFilters: ProjectSearchFilters
  onSearchChange: (search: string) => void
  onCategoryChange: (category: string) => void
  onStatusChange: (status: ProjectStatus | 'all') => void
  onSortChange: (sortBy: 'date' | 'name' | 'views') => void
  onTabChange: (tab: ProjectTab) => void
  selectedTab: ProjectTab
  onCardClick: (project: ProjectData) => void
  onToggleFavorite: (id: string) => void
  onRequestMeeting?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onEdit?: (id: string) => void
}
