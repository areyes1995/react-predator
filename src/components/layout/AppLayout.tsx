// ──────────────────────────────────────────────
// AppLayout — Protected shell under /app
// Renders the DashboardLayout (sidebar + menu
// panel) and the routed main content via <Outlet/>.
// Breadcrumbs are derived from the current URL.
// ──────────────────────────────────────────────

import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from './DashboardLayout'
import { Sidebar } from '../sidebar'
import SettingsView from '../settings/SettingsView'
import { Breadcrumbs, ViewTabs, type BreadcrumbItem } from '../ui'
import { useRecordsDashboard, RECORD_MODULES } from '../../records'
import { QUICK_LINKS, STATIC_SECTIONS } from '../../routes/menu.config'

export default function AppLayout() {
  const { user: authUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showSettings, setShowSettings] = useState(false)

  const {
    activeItemLabel,
    sidebarSections,
    viewOptions,
    activeView,
    handleSelectCard,
  } = useRecordsDashboard()

  useEffect(() => {
    setShowSettings(false)
  }, [activeItemLabel])

  const crumbs = useMemo<BreadcrumbItem[]>(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = [{ label: 'Home', to: '/app/home' }]
    if (showSettings) {
      items.push({ label: 'settings.title' })
    } else if (segments[1] === 'records') {
      const module = RECORD_MODULES.find(m => m.slug === segments[2])
      if (module) {
        items.push({ label: module.label, to: `/app/records/${module.slug}/summary` })
      } else {
        const securityItem = STATIC_SECTIONS.flatMap(s => s.items).find(i => i.slug === segments[2])
        if (securityItem) {
          items.push({ label: securityItem.label, to: securityItem.path })
        }
      }
    } else if (segments[1] && segments[1] !== 'home') {
      const page = QUICK_LINKS.find(q => q.slug === segments[1])
      items.push({ label: page?.label ?? segments[1] })
    }
    return items
  }, [location.pathname, showSettings])

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

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          sections={sidebarSections}
          user={displayUser}
          onLogout={handleLogout}
          onSettings={() => setShowSettings(true)}
        />
      }
      mainContent={
        <>
          <ViewTabs
            items={viewOptions}
            activeSlug={activeView?.slug || 'summary'}
            onSelect={handleSelectCard}
          />
          <Breadcrumbs items={crumbs} onNavigate={() => setShowSettings(false)} />
          {showSettings ? (
            <SettingsView />
          ) : (
            <Outlet />
          )}
        </>
      }
    />
  )
}