// ──────────────────────────────────────────────
// AppLayout — Protected shell under /app
// Renders the DashboardLayout (sidebar + menu
// panel) and the routed main content via <Outlet/>.
// Breadcrumbs are derived from the current URL.
// ──────────────────────────────────────────────

import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ReloadNotificationProvider } from '../../context/ReloadNotificationContext'
import DashboardLayout from './DashboardLayout'
import { Sidebar } from '../sidebar'
import { MenuPanel } from '../menu'
import SettingsView from '../settings/SettingsView'
import { Breadcrumbs, type BreadcrumbItem } from '../ui'
import ReloadNotificationBanner from '../ui/ReloadNotificationBanner'
import { useRecordsDashboard } from '../../records'
import { QUICK_LINKS, STATIC_SECTIONS } from '../../routes/menu.config'

export default function AppLayout() {
  const { user: authUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const isSettingsRoute = location.pathname.startsWith('/app/settings')
  const isProjectsRoute = segments[1] === 'dashboard' && (segments[2] === 'projects' || segments[2] === 'stands')
  const isKnowledgeBaseRoute = segments[1] === 'dashboard' && segments[2] === 'knowledge-base'

  const {
    menuCollapsed,
    setMenuCollapsed,
    sidebarSections,
    menuTitle,
    menuItems,
    activeModule,
    isRecordsRoute,
  } = useRecordsDashboard()

  const crumbs = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [{ label: 'Home', to: '/app/home' }]
    if (isSettingsRoute) {
      items.push({ label: 'settings.title', to: '/app/settings' })
    } else if (isProjectsRoute) {
      items.push({ label: segments[2] === 'stands' ? 'Stands' : 'Projects' })
    } else if (segments[1] === 'dashboard' && segments[2] === 'records') {
      const module = activeModule
      if (module) {
        items.push({ label: module.label, to: `/app/dashboard/records/${module.slug}/summary` })
        const view = module.viewOptions.find(v => v.slug === segments[4])
        if (view && view.slug !== module.viewOptions[0]?.slug) {
          items.push({ label: view.label })
        }
      } else {
        const securityItem = STATIC_SECTIONS.flatMap(s => s.items).find(i => i.slug === segments[3])
        if (securityItem) {
          items.push({ label: securityItem.label, to: securityItem.path })
        }
      }
    } else if (segments[1] === 'dashboard') {
      const pageLabel = segments[2] || 'Dashboard'
      items.push({ label: pageLabel.charAt(0).toUpperCase() + pageLabel.slice(1).replace('-', ' ') })
    } else if (segments[1] && segments[1] !== 'home') {
      const page = QUICK_LINKS.find(q => q.slug === segments[1])
      items.push({ label: page?.label ?? segments[1] })
    }
    return items
  }, [location.pathname, activeModule, isSettingsRoute, isProjectsRoute])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const displayUser = {
    name: authUser?.name ?? 'Thomas Williams',
    subtitle: authUser?.email,
    avatarUrl: authUser?.avatarUrl,
    status: 'online' as const,
  }

  const sidebar = isSettingsRoute ? null : (
    <Sidebar
      sections={sidebarSections}
      user={displayUser}
      onLogout={handleLogout}
      onSettings={() => { setMenuCollapsed(true); navigate('/app/settings') }}
    />
  )

  const menuPanel = isSettingsRoute || isProjectsRoute || isKnowledgeBaseRoute ? null : (
    <MenuPanel
      title={menuTitle ?? 'Orchestrator'}
      items={menuItems ?? []}
      search={{}}
      autoHideSeconds={3}
      collapsed={menuCollapsed}
      onCollapsedChange={setMenuCollapsed}
    />
  )

  return (
    <ReloadNotificationProvider>
      <DashboardLayout
        sidebar={sidebar}
        menuPanel={menuPanel}
        mainContent={
          <>
            <ReloadNotificationBanner />
            <Breadcrumbs items={crumbs} />
            {isSettingsRoute ? (
              <SettingsView />
            ) : (
              <Outlet />
            )}
          </>
        }
      />
    </ReloadNotificationProvider>
  )
}
