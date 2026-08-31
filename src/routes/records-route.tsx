// ──────────────────────────────────────────────
// RecordsRoute — logic for the records area under
// `/app/dashboard/records/:base?/:view?`
// ──────────────────────────────────────────────

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { RECORD_MODULES, getVisibleRecordModules } from '../records'
import { hasPermission } from '../services/auth'
import { ROLES_VIEW_OPTIONS, PERMISSIONS_VIEW_OPTIONS } from '../records/records.config'
import RecordsPage from '../pages/dashboard/records/RecordsPage'
import RbacRolesView from '../components/records/RbacRolesView'
import RbacPermissionsView from '../components/records/RbacPermissionsView'
import { LoadingScreen } from './guards'

export function RecordsRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen />
  }

  const segments = location.pathname.split('/').filter(Boolean)
  const baseSlug = segments[2] ?? 'records'
  const viewSlug = segments[3] ?? 'summary'

  const rbacBases: Record<string, { slug: string; options: { slug: string }[] }> = {
    roles: { slug: 'roles', options: ROLES_VIEW_OPTIONS },
    permissions: { slug: 'permissions', options: PERMISSIONS_VIEW_OPTIONS },
  }

  const rbac = rbacBases[baseSlug]
  if (rbac) {
    const validView = rbac.options.find(o => o.slug === viewSlug)
    if (!validView) {
      return <Navigate to={`/app/dashboard/records/${rbac.slug}/summary`} replace />
    }
    if (!segments[3]) {
      return <Navigate to={`/app/dashboard/records/${rbac.slug}/summary`} replace />
    }
    if (user && !hasPermission(user, 'module:permissions')) {
      return <Navigate to='/app/dashboard/records' replace />
    }
    if (baseSlug === 'roles') {
      return <RbacRolesView view={viewSlug} />
    }
    if (baseSlug === 'permissions') {
      return <RbacPermissionsView view={viewSlug} />
    }
  }

  const targetModule = RECORD_MODULES.find(m => m.slug === baseSlug)

  if (targetModule && !hasPermission(user, `module:${targetModule.slug}`)) {
    const visibleModules = getVisibleRecordModules(user?.permissions)
    if (visibleModules.length === 0) {
      return <Navigate to="/app/dashboard/reports" replace />
    }
    return <Navigate to={`/app/dashboard/records/${visibleModules[0].slug}/summary`} replace />
  }

  if (targetModule && !segments[3]) {
    return <Navigate to={`/app/dashboard/records/${targetModule.slug}/summary`} replace />
  }

  if (targetModule && targetModule.viewOptions?.find(v => v.slug === viewSlug)?.permission && !hasPermission(user, targetModule.viewOptions.find(v => v.slug === viewSlug)?.permission as string)) {
    return <Navigate to={`/app/dashboard/records/${targetModule.slug}/summary`} replace />
  }

  return <RecordsPage />
}
