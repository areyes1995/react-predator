TODO / IMPROVEMENTS — FRONTEND UAPAVERSE
===========================================================

FECHA: 2026-01-26
ORIGEN: Análisis comparativo entre dashboard_requerimientos_consolidados_uapaverse.txt y estado actual del proyecto.

===========================================================
✅ YA IMPLEMENTADO — RBAC & SEGURIDAD
===========================================================

[COMPLETADO] Servicio RBAC completo (src/services/rbac.ts):
- ✅ hasPermission(user, permission) — src/services/auth.ts:73-79
- ✅ getRoles() — GET /roles/all con permisos anidados
- ✅ getRolesSummary() — GET /roles/all sin permisos anidados
- ✅ getRolePermissions(identifier) — GET /roles/:identifier
- ✅ getPermissions() — GET /permissions

[COMPLETADO] Modelo de usuario con RBAC:
- ✅ User interface tiene `permissions?: string[]` — src/services/auth.ts:17
- ✅ User interface tiene `role: string`, `roles?: string[]` — src/services/auth.ts:16-17
- ✅ Mock role-permission mapping (ADMIN, BASIC) — src/mocks/auth.ts:20-23

[COMPLETADO] Sidebar filtering con RBAC (useRecordsDashboard.tsx):
- ✅ isMenuItemVisible(item, permissions) — filtra items por permission — line 40-45
- ✅ getVisibleRecordModules(permissions) — filtra módulos por `module:<slug>` — line 31-37
- ✅ sidebarSections filtra STATIC_SECTIONS con isMenuItemVisible — line 224-236
- ✅ Secciones vacías se eliminan automáticamente — line 236
- ✅ QUICK_LINKS también se filtran — line 208-215

[COMPLETADO] View options con permission gate (useRecordsDashboard.tsx):
- ✅ View options de módulos se filtran por permission — line 139-145
- ✅ View options de RBAC bases se filtran — line 140-141
- ✅ Upload view requiere `rag:upload-view` — records.config.tsx:40

[COMPLETADO] Route-level permission checks (records-route.tsx):
- ✅ Bloquea /records/roles y /records/permissions sin `module:permissions` — line 55-57
- ✅ Bloquea módulos sin `module:<slug>` permission — line 71-77
- ✅ Bloquea view options con permission requerido — line 83-85
- ✅ Redirige a primer módulo visible si no tiene acceso — line 73-76

[COMPLETADO] Menu config con permission field (menu.config.tsx):
- ✅ Roles item tiene `permission: 'module:permissions'` — line 46
- ✅ Permissions item tiene `permission: 'module:permissions'` — line 47

[COMPLETADO] Componentes RBAC fully working:
- ✅ RbacRolesView — tabla de roles con API real, expandable permissions — 154 lines
- ✅ RbacPermissionsView — tabla de permisos con API real — 88 lines
- ✅ RolePermissionsCell — badge expandable con count + lista — RbacRolesView.tsx:20-50

[COMPLETADO] Convention establecida:
- ✅ `module:<slug>` permission convention usado en todo el sistema
- ✅ `rag:<action>` permission convention usado para RAG (upload, upload-view, read, search)

===========================================================
✅ YA IMPLEMENTADO — NAVEGACIÓN & LAYOUT
===========================================================

[COMPLETADO] Layout del Dashboard:
- ✅ DashboardLayout — 3 columnas (sidebar + menu panel + main)
- ✅ AppLayout — shell con breadcrumbs, settings override
- ✅ Sidebar con MetaverseButton, section groups, UserProfile footer
- ✅ Sidebar dropdown collapse para Records modules
- ✅ Responsive: side panels become drawers on mobile
- ✅ Menu panel con view options, collapsible, auto-hide, search
- ✅ DynamicComponentRenderer — rendering engine type-driven

[COMPLETADO] Routing base:
- ✅ React Router v7 con ProtectedRoute, GuestRoute
- ✅ RecordsRoute con path dinámico /dashboard/records/:base?/:view?
- ✅ Deep-linking: URL determina el contenido, no el sidebar
- ✅ handleSidebarClick navega por URL (no renderiza directamente)

[COMPLETADO] Records Domain Architecture:
- ✅ RECORD_MODULES config con 10 módulos (records, coaching, vacations, sales, licenses, permissions, projects, stands, knowledge-base, metrics)
- ✅ Module viewOptions con summary/table/archived/faq/upload
- ✅ Dynamic column definitions per module
- ✅ useRecordsDashboard hook — URL-driven state

===========================================================
✅ YA IMPLEMENTADO — COMPONENTES REUTILIZABLES
===========================================================

[COMPLETADO] Chart Components:
- ✅ AreaChartCard — area chart component
- ✅ BarChartCard — bar chart component
- ✅ DonutChart — donut chart component
- ✅ DualAxisLineChart — dual axis line chart
- ✅ KpiCard — KPI card display
- ✅ MetricGrid — grid of metrics
- ✅ ProgressCard — progress bar card
- ✅ CategoryBarList — horizontal bar list
- ✅ DynamicComponentRenderer — type-driven rendering engine
- ✅ ChartRow — 2-column responsive grid

[COMPLETADO] UI Components:
- ✅ DataTable — generic table with column definitions
- ✅ Modal — modal dialog system
- ✅ FormModal — form-based modal
- ✅ Skeleton variants (Table, Card, Chart, Text, Avatar, Button)
- ✅ EmptyState — empty state display
- ✅ Tooltip — tooltip component
- ✅ Toggle — toggle switch
- ✅ Expandable — expandable content
- ✅ ShowMore — show more items
- ✅ SectionTitle — section title
- ✅ DropdownFilter — filter dropdown
- ✅ DropdownAction — action dropdown
- ✅ StatusIndicator — status badge
- ✅ StatusBadge — status badge
- ✅ StarRating — star rating
- ✅ ViewHeader — view header with title/subtitle
- ✅ TextCarousel — text carousel
- ✅ MetaRow — meta row display
- ✅ ActivityFeed — activity feed display

[COMPLETADO] Layout & Structure Components:
- ✅ SidebarSection — sidebar section with title + items
- ✅ SidebarLinkItem — sidebar link item with active state
- ✅ SidebarDropdown — collapsible dropdown section
- ✅ UserProfile — user profile footer component
- ✅ MetaverseButton — metaverse entry button
- ✅ MenuPanel — notes panel with view options
- ✅ MenuItem — menu item with badge

===========================================================
✅ YA IMPLEMENTADO — SERVICIOS
===========================================================

[COMPLETADO] API Client (src/services/api.ts):
- ✅ HTTP client con fetch() + JWT Bearer token
- ✅ Built-in 401 handling con auto-refresh (2 retry attempts)
- ✅ GET, POST, PUT, PATCH, DELETE
- ✅ ApiResponse<T> wrapper {ok, status, data, error}
- ✅ Base URL from VITE_API_URL

[COMPLETado] Auth Service (src/services/auth.ts):
- ✅ login() — DB auth endpoint
- ✅ validateToken() — JWT validation
- ✅ logout() — API logout
- ✅ preValidateCredentials() — client-side validation

[COMPLETado] RAG Service (src/services/rag.ts):
- ✅ ragTextSearch(q, filters) — GET /rag/text-search
- ✅ ragVectorSearch(embedding, filters) — POST /rag/search
- ✅ ragListDocuments(limit, offset) — GET /rag/documents
- ✅ ragIndexStatus() — GET /rag/documents/status
- ✅ ragChunkContext(chunkId, filters) — GET /rag/chunks/:id/context
- ✅ ragListDocumentsCached() — cached document list

[COMPLETado] Theme Context:
- ✅ light | dark | system modes
- ✅ localStorage persistence (modu_theme)
- ✅ prefers-color-scheme media query watch
- ✅ data-theme attribute on <html>

[COMPLETado] ReloadNotificationContext:
- ✅ Simple visible/dismiss pattern for reload banner

[COMPLETado] i18n:
- ✅ i18next + react-i18next + i18next-browser-languagedetector
- ✅ en.json and es.json locale files
- ✅ useAppTranslation hook with noTranslate option

===========================================================
❌ PENDIENTE — ROUTING & ROLE-BASED ACCESS
===========================================================

[CRITICAL] Role-based route guards (NO implementado):
- ❌ ProtectedRoute SOLO verifica isAuthenticated, NO roles/permisos — guards.tsx:20-32
- ❌ No existe AdminRoute guard
- ❌ No existe PresenterRoute guard
- ❌ No existe GuestRoute/VisitorRoute guard
- ❌ No hay role-based redirect after login
- ❌ Cualquier usuario autenticado puede acceder a cualquier ruta

[CRITICAL] Dashboards separados por rol (NO implementado):
- ❌ /app/dashboard-admin — AdminPage existe pero es placeholder: "Admin module coming soon" — AdminPage.tsx:19
- ❌ /app/dashboard-presentador — no existe ruta dedicada
- ❌ /app/dashboard-empresarial — no existe ruta, no hay path funcional
- ❌ /app/dashboard-invitado — no existe ruta
- ❌ Las rutas actuales (/app/dashboard/projects, /app/dashboard/metrics) tienen no role gating

[MEDIUM] Fix current routing inconsistencies:
- ❌ /app/dashboard/projects hardcodes role='expositor' instead of deriving from user — routes/index.tsx:48
- ❌ /app/dashboard/knowledge-base has no role gating
- ❌ /app/dashboard/metrics has no role gating (should restrict expositor to own metrics)

[INFO] Sidebar navigation — parcialmente OK:
- ✅ Sidebar solo navega por URL (no renderiza contenido)
- ✅ Active sidebar item highlights based on pathname
- ⚠️ Users page va a /app/dashboard/records/users, NO a /app/dashboard-admin/users
- ⚠️ No hay ruta dedicada para admin-only views

===========================================================
❌ PENDIENTE — MOCK DATA → API REAL
===========================================================

[CRITICAL] Mock data en procesos principales:
- ❌ MetricsPage.tsx:19-84 — TODOS los MOCK_* data (traffic, stands, interactions, FAQ, latency, audit)
  - loadMetrics() usa setTimeout — debe conectar /api/v1/analytics
  - getMetricsByRange() usa datos locales — debe conectar API con date range
- ❌ src/pages/dashboard/projects/data.ts — PROJECTS_DATA (167 lines) — debe conectar /api/uapaverse/project/list
- ❌ src/components/records/RecordsView.tsx:364-365 — generateMockData() fallback — debe remover
- ❌ src/pages/dashboard/projects/components/ProjectsView.tsx — handlers con console.log sin API calls

[HIGH] UsersPage con mock data:
- ❌ UsersPage.tsx usa sampleUsersData (mock) — debe conectar /api/uapaverse/user/list
- ❌ sampleUsersData en src/pages/dashboard/users/data.ts

[MEDIUM] Mock auth (solo dev):
- ⚠️ src/mocks/auth.ts debe quedar pero documentar como dev-only
- ⚠️ VITE_MOCK_ENABLED=true debe ser dev-only check

===========================================================
❌ PENDIENTE — ADMIN DASHBOARD (Users Management)
===========================================================

[HIGH] Users management — USERS PAGE YA EXISTE pero con mock data:
- ⚠️ UsersPage.tsx existe con RecordsTable + filtros — cumple requirement #11 (reutilizar componentes)
- ❌ NO conectado a /api/uapaverse/user/list — usa mock data
- ⚠️ Muestra: name, email, role, department, status, lastLogin — cumple requirement #9 parcialmente
- ❌ NO tiene user detail view (/api/uapaverse/user/{id})
- ❌ NO tiene change role action (PUT /api/uapaverse/user/{id})
- ❌ NO tiene delete user action
- ❌ NO tiene edit user action
- ✅ Ya tiene sub-filtros agregados
- ✅ Ya tiene UsersView.tsx creado

[HIGH] AdminPage — PLACEHOLDER:
- ❌ AdminPage.tsx muestra "Admin module coming soon" — debe ser reemplazado
- ❌ Audit Logs menu item (menu.config.tsx:48) redirige a AdminPage vacío

[MEDIUM] RBAC integration — PARCIALMENTE hecho:
- ✅ RbacRolesView y RbacPermissionsView ya existen Y funcionan con API real
- ✅ GET /roles/all y GET /permissions ya se consumen
- ❌ AdminPage no integra estos componentes
- ❌ No hay UI para CRUD de roles (create, update, delete roles)
- ❌ No hay UI para asignar permisos a roles

===========================================================
❌ PENDIENTE — PROJECTS/STANDS CRUD (Backend dependent)
===========================================================

[HIGH] Projects/Stands management:
- ❌ projects/data.ts usa mock PROJECTS_DATA — debe conectar /api/uapaverse/project/list
- ❌ NO implementado: connect to /api/uapaverse/project/list
- ❌ NO implementado: project detail view (/api/uapaverse/project/{id})
- ❌ NO implementado: approve action (estado_proyecto = APROBADO)
- ❌ NO implementado: edit action (name, nombre_grupo, id_categoria)
- ❌ NO implementado: delete action (/api/uapaverse/project/{id})
- ⚠️ Status normalization: APROBADO/ACTIVO/PENDIENTE → Activo/Pendiente NO implementado

[HIGH] Project CRUD:
- ❌ Create project (title, description, category, responsible, participants, etc.)
- ❌ Read project detail
- ❌ Update project
- ❌ Delete project
- ❌ Publish project

[MEDIUM] Fair and room management — PENDIENTE DE BACKEND:
- ❌ Fair CRUD (create, read, update, delete)
- ❌ Room CRUD (create, read, update, delete)
- ❌ Associate rooms with fairs
- ❌ Distribute stands within rooms
- ❌ Select projects for fair participation
- ❌ No backend endpoints disponibles

===========================================================
❌ PENDIENTE — METRICS & ANALYTICS (Real Data)
===========================================================

[HIGH] Metrics reales:
- ❌ MetricsPage.tsx usa mock data — NO conectado a API
- ❌ Visits, projects consulted, stands consulted, interests, avatar interactions
- ❌ Questions to avatars, FAQ, contact requests, activity log
- ❌ Fair/room participation stats, most interactive projects
- ⚠️ Componentes de gráficos YA existen (AreaChartCard, BarChartCard, KpiCard, etc.)

[HIGH] Role-based metrics:
- ❌ Admin: view global metrics — NO hay gate
- ❌ Presenter: view ONLY own metrics — NO hay gate
- ❌ Implement permission check for metrics access

[MEDIUM] Metric filters:
- ⚠️ TimeRangeFilter component existe en MetricsPage.tsx
- ❌ Period filter conectado a API
- ❌ Fair, room, stand, project, category filters

[MEDIUM] Visit tracking:
- ❌ HU24: Fair visits (fair, date, time, count, most visited)
- ❌ HU25: Stand visits (stand, user, date/time, traffic, stay time)
- ❌ Presenter restricted to own stands only

[MEDIUM] Interaction tracking:
- ❌ HU26: Interactions by fair, room, stand, date, time
- ❌ Highest participation identification

[MEDIUM] AI Avatar questions:
- ❌ HU34: Avatar questions history
- ❌ Filter questions, detect FAQ, identify top projects
- ⚠️ Mock FAQ data existe en MetricsPage.tsx:50-63

===========================================================
❌ PENDIENTE — REPORTES (RF15, HU35)
===========================================================

[HIGH] Report generation:
- ❌ Select report content (visits, interests, interactions, queries, contacts)
- ❌ Apply filters
- ❌ Generate reports
- ❌ Export (CSV, PDF) — MetricsPage.tsx:126 tiene `console.log` placeholder
- ❌ Admin: platform-wide export
- ❌ Presenter: own data export only

===========================================================
❌ PENDIENTE — PRESENTER DASHBOARD
===========================================================

[HIGH] Presenter routes y vistas:
- ❌ Ruta dedicada /app/dashboard-presenter
- ❌ Mis Stands: view and edit
- ❌ Create Stand: form with project association
- ❌ Configure stand info and resources
- ❌ Contact requests: view and manage
- ❌ Messaging (room chat + private chat)
- ❌ Settings: profile and user settings

[MEDIUM] Presenter metrics:
- ❌ Stand visits (own only)
- ❌ Project interactions (own only)
- ❌ Avatar queries (own only)
- ❌ Interests (own only)
- ❌ Contact requests (own only)

===========================================================
❌ PENDIENTE — VISITOR / GUEST DASHBOARD
===========================================================

[HIGH] Visitor dashboard:
- ❌ Ruta /app/dashboard-invitado
- ❌ Home page
- ❌ My interests: view and manage
- ❌ Settings
- ❌ Visited projects history (HU27: project, date, access again)
- ❌ Visited rooms history (HU28)
- ❌ Mark stands as interesting (HU29)
- ❌ Interested stands history (HU30)

[HIGH] Interests and contact persistence:
- ❌ Manifest/remove interest
- ❌ Request contact with users/presenters
- ❌ Identify associated project
- ❌ Persist all actions to backend

===========================================================
❌ PENDIENTE — MENSAJERÍA & NOTIFICACIONES
===========================================================

[HIGH] Chat system (RF16, HU36, HU37):
- ❌ General room chat (send/receive, chronological, room members only)
- ❌ Private chat (contact-established only, notifications)
- ❌ NO hay chat components
- ❌ NO hay messaging service

[HIGH] Notifications (RF18, HU39-HU44):
- ❌ Admin notifications (project changes, stand changes, activities, disabled projects)
- ❌ Presenter notifications (project incorporated, disabled, updated, contact request)
- ❌ Distinguish read/unread, related event
- ❌ NO hay notification components

[MEDIUM] Contact requests:
- ❌ View in presenter dashboard
- ❌ Process/accept/reject
- ❌ Generate notifications

===========================================================
❌ PENDIENTE — KNOWLEDGE BASE INTEGRATION
===========================================================

[MEDIUM] Knowledge Base:
- ❌ KnowledgeBaseView handlers usan setTimeout/local state — NO API
- ❌ Connect to /api/knowledge-base/documents
- ❌ Connect to /api/knowledge-base/faq
- ❌ Real document listing, FAQ management, search

[MEDIUM] RAG Integration:
- ⚠️ Services existen (ragTextSearch, ragVectorSearch, etc.) — src/services/rag.ts
- ❌ KnowledgeBaseView NO usa estos servicios
- ❌ Servicios RAG no están conectados a componentes frontend

===========================================================
❌ PENDIENTE — QUALITY BASE
===========================================================

[CRITICAL] TypeScript Errors (12 errores en 6 archivos):
- ❌ src/components/charts/BarChartCard.tsx:70,75 — TS7053: dynamic property access
- ❌ src/components/ui/index.ts:17,45 — TS2300: duplicate StarRatingProps export
- ❌ src/pages/dashboard/metrics/MetricsPage.tsx:145 — TS2322: string vs union type
- ❌ src/pages/dashboard/stands/components/StandsDetailModal.tsx:45,75 — TS2345: null check
- ❌ src/pages/dashboard/users/UsersPage.tsx:51,52,56 — TS2353: missing options property

[CRITICAL] Remove `any` types (4 occurrences):
- ❌ src/components/charts/DonutChart.tsx:65 — `as any` cast
- ❌ src/components/records/RecordsTable.tsx:69 — `any` in filterFn
- ❌ src/pages/dashboard/projects/components/ProjectsView.tsx:154,166 — `as any`

[HIGH] Remove console.log (7 occurrences):
- ❌ src/services/auth.ts:139
- ❌ src/pages/dashboard/metrics/MetricsPage.tsx:127
- ❌ src/pages/dashboard/projects/components/ProjectsView.tsx:75,80,84,88

[INFO] Build scripts:
- ❌ No lint script in package.json
- ❌ No typecheck script
- ❌ No test script
- ✅ Build tiene `tsc -b` integrado

[INFO] ESLint:
- ❌ `@typescript-eslint/no-explicit-any` disabled
- ⚠️ `no-floating-promises` at warning level
- ⚠️ `no-unsafe-argument` at warning level

===========================================================
✅ YA IMPLEMENTADO — UI STATES
===========================================================

[COMPLETADO] Loading states:
- ✅ LoadingScreen component con spinner — guards.tsx:10-17
- ✅ RbacRolesView tiene loading state — line 132-135
- ✅ RbacPermissionsView tiene loading state — line 66-69
- ✅ Skeleton variants (Table, Card, Chart, Text, Avatar, Button)

[COMPLETADO] Error states:
- ✅ RbacRolesView error display — line 136-140
- ✅ RbacPermissionsView error display — line 67-74
- ✅ AlertCircle icon + border error messages

[COMPLETADO] Empty states:
- ✅ EmptyState component — reusable
- ⚠️ Algunos módulos NO muestran empty state cuando deberían

[⚠️ Parcial] Mutation states:
- ❌ Loading/success/error feedback durante create, edit, delete
- ❌ Optimistic updates no implementados
- ❌ No hay React Query / SWR / RTK Query

===========================================================
❌ PENDIENTE — RESPONSIVE & ACCESSIBILITY
===========================================================

[MEDIUM] Responsive:
- ⚠️ DashboardLayout side panels become drawers on mobile (existe)
- ❌ Verificar todos los componentes responsive
- ❌ Chart components responsive sizing
- ❌ Table components horizontal scroll on mobile

[MEDIUM] Visual consistency:
- ❌ Consistencia entre sidebar, header, cards, tables, filters, modals
- ❌ Loading/empty/error states consistentos

===========================================================
❌ PENDIENTE — SECURITY & BEST PRACTICES
===========================================================

[HIGH] Hardcoded credentials:
- ❌ src/mocks/auth.ts: hardcoded passwords (admin123, docente123, etc.)
- ❌ .env.example: sensitive LDAP credentials
- ⚠️ No deben estar en repo si son sensibles

[MEDIUM] API improvements:
- ❌ Error handling para todos los endpoints
- ❌ Retry logic
- ❌ Timeout configuration
- ❌ API contracts documented

[MEDIUM] Type safety:
- ❌ Replace `any` types with proper interfaces
- ❌ Add generics where applicable

===========================================================
✅ YA IMPLEMENTADO — i18n & LOCALIZATION
===========================================================

[COMPLETADO] Internacionalización:
- ✅ Spanish and English locale files (es.json, en.json)
- ✅ Browser language detection
- ✅ localStorage persistence
- ✅ i18n keys for RBAC (rbac.security, rbac.roles.error.load, etc.)
- ✅ useAppTranslation hook with noTranslate option

===========================================================
✅ YA IMPLEMENTADO — DEVELOPER MODE
===========================================================

[COMPLETADO] Developer settings:
- ✅ Dev mode toggle en SettingsView
- ✅ localStorage persistence (modu_dev_mode)
- ✅ getDevMode()/setDevMode() helpers

===========================================================
SUMMARY BY PRIORITY
===========================================================

PRIORIDAD ALTA (Antes de nuevas features):
1. ✅ RBAC service Y filtering funciona (sidebar, modules, views, routes)
2. ✅ RbacRolesView Y RbacPermissionsView funcionan con API real
3. ❌ Implementar role-based route guards (AdminRoute, PresenterRoute, etc.)
4. ❌ Separar dashboards por rol (admin, presenter, empresarial, invitado)
5. ❌ Conectar UsersPage a /api/uapaverse/user/list
6. ❌ Conectar Projects/Stands a /api/uapaverse/project/list
7. ❌ Remover mock data de procesos principales
8. ❌ Conectar MetricsPage a /api/v1/analytics
9. ❌ Fix 12 TypeScript errors
10. ❌ Eliminar `any` types

PRIORIDAD MEDIA (Después que base esté estable):
11. ❌ Report generation and export
12. ❌ Presenter dashboard dedicado
13. ❌ Visitor dashboard dedicado
14. ❌ Knowledge base API integration
15. ❌ Chat/messaging system (from scratch)
16. ❌ Notification system (from scratch)
17. ❌ Fair and room management (pending backend)
18. ❌ Visit tracking (pending backend)
19. ❌ Interaction tracking (pending backend)
20. ❌ AI Avatar questions (pending backend)

PRIORIDAD BAJA (Cleanup y polish):
21. ❌ Remove console.log statements
22. ❌ Add lint, typecheck, test scripts
23. ❌ Remove hardcoded credentials
24. ❌ Responsive verification
25. ❌ Visual consistency audit

===========================================================
BLOCKERS (Dependen del Backend)
===========================================================

Los siguientes items dependen de que el backend implemente los endpoints:

- ❌ Ban/suspend user — NO endpoint disponible
- ❌ Fair management — NO endpoint disponible
- ❌ Room management — NO endpoint disponible
- ❌ Metric endpoints (/api/v1/analytics no implementado)
- ❌ Visit tracking endpoints — NO endpoint disponible
- ❌ Interaction tracking endpoints — NO endpoint disponible
- ❌ Chat/messaging endpoints — NO endpoint disponible
- ❌ Notification endpoints — NO endpoint disponible
- ❌ Report generation endpoint — NO endpoint disponible
- ❌ Knowledge base endpoints — NO endpoint disponible
- ❌ Avatar questions endpoints — NO endpoint disponible

Los servicios API existen en el frontend pero fallan si los endpoints del backend
no existen. Todos los endpoints pendientes deben marcarse como bloqueados.

===========================================================
NOTAS CLAVE — QUÉ YA FUNCIONA
===========================================================

1. ✅ El sidebar filtra items por `permission` — funciona correctamente
2. ✅ Los módulos de records se filtran por `module:<slug>` permission
3. ✅ Las view options se filtran por permission individual
4. ✅ Las secciones vacías se eliminan automáticamente
5. ✅ Los guards de records-route bloquean acceso sin permisos
6. ✅ RbacRolesView y RbacPermissionsView consumen API real
7. ✅ Los componentes de gráficos son reutilizables y fully functional
8. ✅ El DynamicComponentRenderer permite rendering declarativo
9. ✅ La navegación es URL-driven (deep-linking funciona)
10. ✅ i18n completo en español e inglés
11. ✅ Theme switching con light/dark/system

===========================================================
END OF TODO LIST
===========================================================
