// ──────────────────────────────────────────────
// UsersView — Table grid de Users (Management).
// Renderiza los registros de usuarios con
// RecordsTable + filtro existente.
// ──────────────────────────────────────────────

import { useEffect, useMemo, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import ViewHeader from '../ui/layout/ViewHeader'
import { buildDynamicTable } from '../../records/dynamicColumns'
import { DynamicComponentRenderer } from '../charts'
import { sampleUsersData } from '../../records/data'
import { useAppTranslation } from '../../i18n/useAppTranslation'

export default function UsersView({ view }: { view?: string }) {
  const { t } = useAppTranslation()
  const [users, setUsers] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setTimeout(() => {
      if (!mounted) return
      setUsers(sampleUsersData)
      setError(null)
      setLoading(false)
    }, 300)
    return () => {
      mounted = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    if (view === 'archived') return users.filter(u => {
      const role = String(u['role'] ?? '').toLowerCase()
      return role === 'inactive' || role === 'suspended'
    })
    return users
  }, [users, view])

  const { columns, data } = useMemo(
    () =>
      buildDynamicTable<Record<string, unknown>>(filteredUsers, {
            columns: {
              id: { header: 'User ID' },
              name: { header: 'Name' },
              email: { header: 'Email', type: 'text' },
              role: { header: 'Role', type: 'select', options: ['admin', 'editor', 'viewer', 'inactive', 'suspended'] },
              department: { header: 'Department', type: 'select', options: ['Engineering', 'Design', 'Marketing', 'HR', 'Finance'] },
              status: {
                header: 'Status',
                type: 'select',
                options: ['Active', 'Pending', 'Archived'],
                render: info => {
                  const status = String(info.getValue())
                  const colors: Record<string, string> = {
                    Active: 'text-green-400 bg-green-400/10',
                    Pending: 'text-amber-400 bg-amber-400/10',
                    Archived: 'text-[var(--text-secondary)] bg-gray-400/10',
                  }
                  return (
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[status] ?? ''}`}>
                      {status}
                    </span>
                  )
                },
              },
              lastLogin: { header: 'Last Login', type: 'date' },
            },
            statusOf: row => {
              const role = String(row['role'] ?? '').toLowerCase()
              if (role === 'inactive' || role === 'suspended') return 'Archived'
              return 'Active'
            },
          }),
    [users, view],
  )

  return (
    <div className="flex h-full flex-col">
      <ViewHeader title="Users" subtitle={t('rbac.management')} />
      <div className="flex-1 min-h-0 flex flex-col">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" />
          </div>
        ) : error ? (
          <div className="m-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        ) : (
          <DynamicComponentRenderer
            items={[
              {
                type: 'RecordsTable',
                props: { data, columns },
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}
