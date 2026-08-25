// ──────────────────────────────────────────────
// Menu config — navegación general de la app.
// Define los items del menú lateral (quick links y
// secciones estáticas). Cada item puede exigir un
// permiso RBAC vía el campo `permission`:
//
//   - `permission` definido → el item solo se ve si
//     el usuario posee ese permiso.
//   - `permission` ausente → se omite la validación
//     y el item siempre se muestra.
//
// Sigue el mismo patrón que `RecordViewOption.permission`
// de records.config (ej. `rag:upload-view`).
// ──────────────────────────────────────────────

import {
  Home,
  Cable,
  Settings,
  CalendarClock,
  Users,
  KeyRound,
  ShieldCheck,
  ScrollText,
} from 'lucide-react'
import type { StaticSidebarItem, StaticSidebarSection } from '../records/types'

/** Quick links at the top of the sidebar — top-level product pages. */
export const QUICK_LINKS: StaticSidebarItem[] = [
  { icon: <Home className="w-4 h-4 text-blue-400" strokeWidth={1.5} />, label: 'Home Page', slug: 'home', path: '/app/home' },
  { icon: <Cable className="w-4 h-4" strokeWidth={1.5} />, label: 'Connections', slug: 'connections', path: '/app/connections' },
  { icon: <Settings className="w-4 h-4" strokeWidth={1.5} />, label: 'Administration', slug: 'admin', path: '/app/admin' },
]

/** Static sidebar sections — product areas grouping navigable links. */
export const STATIC_SECTIONS: StaticSidebarSection[] = [
  {
    title: 'Management',
    items: [
      { icon: <CalendarClock className="w-4 h-4 text-blue-400" strokeWidth={1.5} />, label: 'Schedules', slug: 'schedules', path: '/app/records/schedules' },
      { icon: <Users className="w-4 h-4" strokeWidth={1.5} />, label: 'Users', slug: 'users', path: '/app/records/users' },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: <KeyRound className="w-4 h-4" strokeWidth={1.5} />, label: 'Roles', slug: 'roles', path: '/app/records/roles', permission: 'module:permissions' },
      { icon: <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />, label: 'Permissions', slug: 'permissions', path: '/app/records/permissions', permission: 'module:permissions' },
      { icon: <ScrollText className="w-4 h-4" strokeWidth={1.5} />, label: 'Audit Logs', slug: 'logs', path: '/app/admin' },
    ],
  },
]
