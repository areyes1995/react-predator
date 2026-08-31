import type { ReactNode } from 'react'

// ──────────────────────────────────────────────
// EntityCardSkeleton
// ──────────────────────────────────────────────

export interface CardGridStates {
  count?: number
}

// ──────────────────────────────────────────────
// CardError
// ──────────────────────────────────────────────

export interface CardErrorProps {
  message?: string
}

// ──────────────────────────────────────────────
// CardEmpty
// ──────────────────────────────────────────────

export interface CardEmptyProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  message: string
  role?: string
  rolesWithAction?: string[]
  actionLabel?: string
  onAction?: () => void
}

// ──────────────────────────────────────────────
// StatusBadge
// ──────────────────────────────────────────────

export interface StatusBadgeProps {
  status: string
  label?: string
}

// ──────────────────────────────────────────────
// MetaRow
// ──────────────────────────────────────────────

export interface MetaRowProps {
  createdAt: string
  updatedAt?: string
  views?: number
  extra?: ReactNode
}

// ──────────────────────────────────────────────
// CardGrid
// ──────────────────────────────────────────────

export type CardGridState = 'loading' | 'error' | 'empty' | 'emptySearch' | 'loaded'

export interface CardGridProps {
  loading?: boolean
  error?: boolean
  empty?: boolean
  emptySearch?: boolean
  emptyMessage: string
  emptySearchMessage?: string
  emptyIcon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  emptyActionLabel?: string
  onEmptyAction?: () => void
  emptyRoles?: string[]
  role?: string
  skeletonCount?: number
  children?: ReactNode
  className?: string
}

// ──────────────────────────────────────────────
// SearchFilter
// ──────────────────────────────────────────────

export interface SearchFilterProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: Array<{
    value: string
    label: string
    options: string[]
    initialValue?: string
    currentValue?: string
    onChange: (value: string) => void
  }>
  ariaLabel?: string
}
