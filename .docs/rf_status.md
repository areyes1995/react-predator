REQUERIMIENTOS FUNCIONALES — ESTADO ACTUAL
===========================================================

FECHA: 2026-01-26
ORIGEN: Mapeo entre los RF del documento dashboard_requerimientos_consolidados_uapaverse.txt y lo implementado en el frontend.

===========================================================
✅ COMPLETO
===========================================================

RF03 — Autenticación de usuarios (~90%)
  - Login DB y LDAP implementado
  - JWT token con AuthContext
  - Token auto-refresh on 401
  - Mock auth para desarrollo
  - ⚠️ Pendiente: ban/suspend (no hay endpoint backend)

===========================================================
⚠️ PARCIALMENTE IMPLEMENTADO
===========================================================

RF02 — Gestión de roles y permisos (~40%)
  - ✅ Servicio RBAC completo (hasPermission, getRoles, getPermissions)
  - ✅ RbacRolesView con API real — tabla de roles expandible
  - ✅ RbacPermissionsView con API real — tabla de permisos
  - ✅ Sidebar filtering por permission
  - ✅ module:<slug> convention en toda la app
  - ❌ NO hay CRUD de roles (crear, editar, eliminar)
  - ❌ NO hay UI para asignar permisos a roles
  - ❌ AdminPage está vacío ("Admin module coming soon")

RF09 — Filtrado de proyectos (~20%)
  - ✅ Filtros existen en UI (DropdownFilter, RecordsFilter)
  - ❌ Filtros conectados a mock data, no a API real
  - ❌ Sin backend endpoint de filtrado

RF14 — Dashboard (~50%)
  - ✅ Layout Dashboard completo (3 columnas)
  - ✅ Sidebar con RBAC filtering funcional
  - ✅ DynamicComponentRenderer para rendering declarativo
  - ✅ Navegación URL-driven con deep-linking
  - ❌ Dashboards separados por rol (admin/presenter/empresarial/invitado) NO existen
  - ❌ Role-based route guards NO existen (solo session guard)
  - ❌ Métricas con mock data en vez de API real
  - ❌ Guardas de página por rol (AdminRoute, PresenterRoute, etc.)

===========================================================
❌ PENDIENTE — MOCK DATA CONECTAR AL BACKEND
===========================================================

RF01 — Gestión de usuarios (~10%)
  - ✅ UsersPage existe con RecordsTable + filtros
  - ✅ UsersView creado con estructura de tabla
  - ❌ NO conectado a /api/uapaverse/user/list (usa mock data)
  - ❌ NO tiene user detail view (/api/uapaverse/user/{id})
  - ❌ NO tiene change role action (PUT /api/uapaverse/user/{id})
  - ❌ NO tiene delete user action
  - ❌ NO tiene edit user action
  - ❌ NO maneja "No disponible" para fechas inválidas
  - ❌ NO implementar ban/suspend (sin endpoint backend)
  - ❌ AdminPage placeholder — debe reemplazarse

RF04 — Gestión de proyectos institucionales (~5%)
  - ❌ PROJECTS_DATA es mock data (167 lines)
  - ❌ NO conectado a /api/uapaverse/project/list
  - ❌ NO tiene create project
  - ❌ NO tiene read project detail (/api/uapaverse/project/{id})
  - ❌ NO tiene update project
  - ❌ NO tiene delete project
  - ❌ NO tiene publish project
  - ❌ NO tiene campos: title, description, category, responsible, participants, technologies, status, multimedia, DEMO, knowledge base

RF10 — Gestión de stands virtuales (~5%)
  - ❌ Stands data es mock data
  - ❌ NO conectado a backend
  - ❌ NO tiene CRUD de stands
  - ❌ NO tiene approve stand (estado_proyecto = APROBADO)
  - ❌ NO tiene edit stand (name, nombre_grupo, id_categoria)
  - ❌ NO tiene normalize status states

RF06 — Gestión de información de proyectos (~5%)
  - ❌ Depende de RF04

RF09 — Filtrado de proyectos (~20%)
  - ❌ UI existe pero con mock data
  - ❌ NO filtrado real por backend

===========================================================
❌ NO IMPLEMENTADO
===========================================================

RF07 — Gestión de contenido multimedia
  - ❌ Sin componente
  - ❌ Sin API endpoint

RF08 — Acceso a demos
  - ❌ Sin implementación
  - ⚠️ public/demo-dashboard.html existe como HTML estático

RF11 — Gestión de avatar inteligente
  - ❌ Sin implementación
  - ❌ Sin API endpoint

RF12 — Gestión de datos de visitas e interacciones
  - ❌ MetricsPage usa mock data (MOCK_TRAFFIC_DATA, MOCK_STANDS_DATA, etc.)
  - ❌ NO conectado a /api/v1/analytics
  - ❌ NO tiene HU24 (visitas a ferias)
  - ❌ NO tiene HU25 (visitas a stands)
  - ❌ NO tiene HU26 (interacciones)
  - ❌ NO tiene HU34 (preguntas a avatares)
  - ❌ Sin filtros de: period, fair, room, stand, project, category
  - ❌ Sin métricas por rol (admin = global, presenter = own only)

RF13 — Gestión de intereses y solicitudes de contacto
  - ❌ Intereses: mock data en visitantes
  - ❌ NO tiene manifestar interés
  - ❌ NO tiene retirar interés
  - ❌ NO tiene solicitar contacto con usuarios
  - ❌ NO tiene solicitar contacto con expositores
  - ❌ NO tiene identificar proyecto asociado
  - ❌ NO tiene persistir datos al backend

RF15 — Generación de reportes
  - ❌ Sin selección de contenido
  - ❌ Sin filtros de reporte
  - ❌ Sin generación
  - ❌ Sin exportación (CSV, PDF)
  - ❌ MetricsPage.tsx:126 tiene placeholder `console.log("Exporting...")`

RF16 — Sistema de mensajería
  - ❌ Sin chat general de sala
  - ❌ Sin chat privado
  - ❌ Sin mensajes cronológicos
  - ❌ Sin notificaciones de nuevos mensajes
  - ❌ Sin componente de chat
  - ❌ Sin servicio de mensajería

RF18 — Gestión de notificaciones
  - ❌ Sin notificaciones para admin (cambios de proyectos, stands, actividades)
  - ❌ Sin notificaciones para expositor (proyecto incorporado, deshabilitado, actualizado, contacto)
  - ❌ Sin distinguir leídas/no leídas
  - ❌ Sin componente de notificaciones
  - ⚠️ Solo hay label "Notifications" en SettingsView

RF19 — Gestión de ferias y salas temáticas
  - ❌ Sin CRUD de ferias
  - ❌ Sin CRUD de salas temáticas
  - ❌ Sin asociar salas a ferias
  - ❌ Sin distribuir stands en salas
  - ❌ Sin seleccionar proyectos para ferias
  - ❌ Sin endpoints backend disponibles

===========================================================
RESUMEN POR PORCENTAJE
===========================================================

RF03 ✅ Autenticación:      ~90% — Casi completo (falta ban/suspend)
RF02 ⚠️ Roles y permisos:   ~40% — Core RBAC funciona, pero falta CRUD
RF09 ⚠️ Filtrado:           ~20% — UI existe pero con mock data
RF14 ⚠️ Dashboard:          ~50% — Layout funciona, falta separation by role
RF01 ❌ Gestión usuarios:   ~10% — UI existe pero con mock data, sin acciones
RF04 ❌ Gestión proyectos:  ~5%  — Mock data, sin CRUD
RF10 ❌ Gestión stands:     ~5%  — Mock data, sin CRUD
RF06 ❌ Info proyectos:     ~5%  — Depende de RF04

RF07 ❌ Contenido multimedia: 0%
RF08 ❌ Acceso a demos:      0%
RF11 ❌ Avatar inteligente:  0%
RF12 ❌ Visitas e interacciones: 0% — Mock data en MetricsPage
RF13 ❌ Intereses y contactos: 0%
RF15 ❌ Reportes:            0%
RF16 ❌ Mensajería:          0%
RF18 ❌ Notificaciones:      0%
RF19 ❌ Ferias y salas:      0%

===========================================================
RESUMEN FINAL
===========================================================

Total RF: 16
✅ Completos: 1 (RF03)
⚠️ Parciales: 4 (RF02, RF09, RF14)
❌ Pendientes: 11 (RF01, RF04, RF06, RF07, RF08, RF10, RF11, RF12, RF13, RF15, RF16, RF18, RF19)

Porcentaje general: ~18% implementado
===========================================================

NOTAS:
- Los items marcados con ❌ tienen mock data o no tienen implementación
- Varios RF dependen de endpoints de backend que no existen
- Los componentes UI reutilizables (charts, tables, modals, badges) son reutilizables
- El sistema de RBAC filtering en sidebar y routes funciona correctamente
- Las rutas dedicadas por rol (admin, presenter, empresarial, invitado) NO existen

===========================================================
