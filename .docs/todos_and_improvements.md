TODO / IMPROVEMENTS — FRONTEND UAPAVERSE
===========================================================

FECHA: 2026-01-26
ORIGEN: Análisis comparativo entre dashboard_requerimientos_consolidados_uapaverse.txt y estado actual del proyecto.

===========================================================
PHASE 1: QUALITY BASE — CORREGIR ERROES ANTES DE AVANZAR
===========================================================

[CRITICAL] TypeScript Errors (12 errores en 6 archivos):
- [ ] Fix src/components/charts/BarChartCard.tsx:70,75 — TS7053: dynamic property access on BarDataPoint
- [ ] Fix src/components/ui/index.ts:17,45 — TS2300: duplicate export of StarRatingProps
- [ ] Fix src/pages/dashboard/metrics/MetricsPage.tsx:145 — TS2322: string not assignable to union type for ProgressItem.status
- [ ] Fix src/pages/dashboard/stands/components/StandsDetailModal.tsx:45,75 — TS2345: stand is StandData | null, needs null check
- [ ] Fix src/pages/dashboard/users/UsersPage.tsx:51,52,56 — TS2353: DynamicColumnOverride missing options property

[CRITICAL] Remove `any` types (4 occurrences):
- [ ] src/components/charts/DonutChart.tsx:65 — remove `as any` cast on Tooltip content
- [ ] src/components/records/RecordsTable.tsx:69 — replace `any` in filterFn parameters
- [ ] src/pages/dashboard/projects/components/ProjectsView.tsx:154 — replace `as any` on e.target.value
- [ ] src/pages/dashboard/projects/components/ProjectsView.tsx:166 — replace `as any` on e.target.value

[HIGH] Remove console.log statements (7 occurrences):
- [ ] src/services/auth.ts:139 — remove `console.log(res.data)`
- [ ] src/pages/dashboard/metrics/MetricsPage.tsx:127 — remove `console.log` for export format
- [ ] src/pages/dashboard/projects/components/ProjectsView.tsx:75,80,84,88 — remove all console.log (meeting request, approve, reject, edit)

[INFO] Add lint and test scripts to package.json:
- [ ] Add `"lint": "eslint . --ext .ts,.tsx"`
- [ ] Add `"lint:fix": "eslint . --ext .ts,.tsx --fix"`
- [ ] Add `"typecheck": "tsc --noEmit"`
- [ ] Add `"test"` or `"test:unit"` script

[INFO] ESLint configuration improvements:
- [ ] Enable `@typescript-eslint/no-explicit-any` (currently off)
- [ ] Address `no-floating-promises` warnings (currently warn)
- [ ] Address `no-unsafe-argument` warnings (currently warn)

===========================================================
PHASE 2: ROUTING & ROLE-BASED ACCESS
===========================================================

[CRITICAL] Separate dashboards by role:
- [ ] Create /app/dashboard-admin route (AdminPage exists but empty)
- [ ] Create /app/dashboard-presentador route (no dedicated route exists)
- [ ] Create /app/dashboard-empresarial route (no route exists, no functional path)
- [ ] Create /app/dashboard-invitado route (no route exists)
- [ ] Current /app/dashboard/projects should route based on user role

[CRITICAL] Implement centralized route guards:
- [ ] ProtectedRoute exists but needs role-based extensions
- [ ] Create AdminRoute guard (redirects non-admin users)
- [ ] Create PresenterRoute guard (redirects non-presenters)
- [ ] Create GuestRoute for visitor/invitado routes
- [ ] Implement role-based redirects after login (redirect admin -> admin dashboard, presenter -> presenter dashboard, etc.)

[MEDIUM] Fix current routing inconsistencies:
- [ ] /app/dashboard/projects hardcodes role='expositor' instead of deriving from user
- [ ] /app/dashboard/stands derives role but has no admin-only view
- [ ] /app/dashboard/knowledge-base has no role gating
- [ ] /app/dashboard/metrics has no role gating (expositor should only see own metrics)

[LOW] Sidebar navigation compliance:
- [ ] Ensure sidebar only triggers URL changes, never renders content directly
- [ ] All routes must work when accessed directly (refresh, bookmark)
- [ ] Active sidebar item must highlight based on pathname
- [ ] No duplicated layouts across routes

===========================================================
PHASE 3: MOCK DATA — REEMPLAZAR CON API REAL
===========================================================

[CRITICAL] Remove mock data from main processes (requirement #27):
- [ ] src/pages/dashboard/metrics/MetricsPage.tsx:19-84 — All MOCK_* data (traffic, stands, interactions, FAQ, latency, audit)
  - Replace loadMetrics() with real API call to /api/v1/analytics
  - Replace getMetricsByRange() with real API call with date range params
- [ ] src/pages/dashboard/projects/data.ts:167 lines — PROJECTS_DATA
  - Connect to /api/uapaverse/project/list endpoint
- [ ] src/components/records/RecordsView.tsx:364-365 — `generateMockData()` fallback
  - Remove fallback, show proper empty state instead

[HIGH] Mock authentication (only for dev, not main processes):
- [ ] Keep src/mocks/auth.ts but document it is dev-only
- [ ] Ensure VITE_MOCK_ENABLED=true only works in development
- [ ] Add environment check: only use mocks when !import.meta.env.PROD

[MEDIUM] Records mock data:
- [ ] src/records/data.ts — sampleData, coachingData, vacationsData, salesData
  - These are module configs, not dashboard data — clarify purpose

[INFO] Demo page:
- [ ] public/demo-dashboard.html — static HTML demo, consider removing or documenting as deprecated

===========================================================
PHASE 4: ADMIN DASHBOARD — GESTIÓN DE USUARIOS
===========================================================

[HIGH] Users management page (requirement #9, #10, #11):
- [ ] Build out AdminPage.tsx (currently just "TODO: Admin page")
- [ ] Integrate with /api/uapaverse/user/list endpoint
- [ ] Display: name, email, avatar/initials, role, status, last activity
- [ ] Handle invalid last activity dates with "No disponible"
- [ ] Use existing RecordTable component (requirement #11)
- [ ] Use existing Filters component (requirement #11)
- [ ] Add user detail view (/api/uapaverse/user/{id})

[HIGH] User actions:
- [ ] Change role via /api/uapaverse/user/{id} (name, email, role_id)
- [ ] Delete user
- [ ] View user detail
- [ ] DO NOT implement ban/suspend — no backend endpoint available (requirement #9)

[MEDIUM] RBAC integration:
- [ ] Integrate with existing RBAC service (src/services/rbac.ts)
- [ ] getRoles() — GET /roles/all
- [ ] getPermissions() — GET /permissions
- [ ] Display roles and permissions in admin UI

===========================================================
PHASE 5: ADMIN DASHBOARD — GESTIÓN DE PROJECTS/STANDS
===========================================================

[HIGH] Projects/Stands management (requirement #12, #13, #14, #15, #16):
- [ ] Connect projects list to /api/uapaverse/project/list
- [ ] Implement project detail view (/api/uapaverse/project/{id})
- [ ] Implement approve action (set estado_proyecto = APROBADO via /api/uapaverse/project/{id})
- [ ] Implement edit action (update name_proyecto, nombre_grupo, id_categoria)
- [ ] Implement delete action (/api/uapaverse/project/{id})
- [ ] Normalize status states: APROBADO -> "Activo", ACTIVO -> "Activo", PENDIENTE -> "Pendiente"

[HIGH] Project CRUD requirements (requirement #17):
- [ ] Create project: title, description, category, responsible, participants, technologies, status, multimedia resources, DEMO link, knowledge base
- [ ] Read project detail
- [ ] Update project info
- [ ] Delete project
- [ ] Publish project

[MEDIUM] Fair and room management (requirement #18, #45-#49):
- [ ] Create fair management: create, read, update, delete fairs
- [ ] Create room management: create, read, update, delete thematic rooms
- [ ] Associate rooms with fairs
- [ ] Distribute stands within rooms
- [ ] Select projects to participate in a fair
- [ ] Remove projects from fairs
- [ ] Note: No backend endpoints exist yet — mark as pending

===========================================================
PHASE 6: METRICS & ANALYTICS (REAL DATA)
===========================================================

[HIGH] Replace mock metrics with real data:
- [ ] Connect metrics to real backend endpoints (requirement #4, #5)
- [ ] Visitor metrics: count, by fair, by stand
- [ ] Consulted projects count
- [ ] Consulted stands count
- [ ] Manifested interests count
- [ ] Smart avatar interactions
- [ ] Questions to avatars
- [ ] Frequently asked questions
- [ ] Contact requests
- [ ] General activity log
- [ ] Fair participation stats
- [ ] Room participation stats
- [ ] Most interactive projects/stands

[HIGH] Role-based metric access (requirement #5, #19):
- [ ] Admin: view global platform metrics
- [ ] Presenter: view ONLY their own projects/stands metrics
- [ ] Implement permission check: prevent presenter from seeing other presenters' data

[MEDIUM] Metric filters (requirement #25):
- [ ] Period filter
- [ ] Fair filter
- [ ] Room filter
- [ ] Stand filter
- [ ] Project filter
- [ ] Category filter
- [ ] Interaction type filter
- [ ] Interest type filter

[MEDIUM] Visit tracking (requirement #6):
- [ ] HU24: Admin can consult fair visits (fair, date, time, count, most visited fairs)
- [ ] HU25: Admin/Presenter can consult stand visits (stand, user, date/time, traffic, stay time)
- [ ] Presenter can only see visits to their own stands

[MEDIUM] Interaction tracking (requirement #7):
- [ ] HU26: Admin can consult interactions by fair, room, stand, date, time
- [ ] Identify stands, fairs, rooms, projects with highest participation

[MEDIUM] AI Avatar questions (requirement #8):
- [ ] HU34: Avatar questions history (project, avatar, user, date, question)
- [ ] Filter questions
- [ ] Detect frequently asked questions
- [ ] Identify projects with most questions

===========================================================
PHASE 7: REPORTS (requirement #24)
===========================================================

[HIGH] Report generation (RF15, HU35):
- [ ] Select report content (visits, interests, interactions, queries, contacts, activity, project/stand stats)
- [ ] Apply filters to report data
- [ ] Generate updated reports
- [ ] Export reports (CSV, PDF, etc.)
- [ ] Admin: export platform-wide data
- [ ] Presenter: export only their own data
- [ ] Fix existing TODO: "Implementar exportación real" in MetricsPage.tsx:126

===========================================================
PHASE 8: PRESENTER DASHBOARD
===========================================================

[HIGH] Presenter-specific routes and views:
- [ ] Create dedicated presenter dashboard route
- [ ] My Stands: view and edit their stands/projects
- [ ] Create Stand: form to create/administer stand with project association
- [ ] Configure stand information and resources
- [ ] Contact requests: view received requests, identify user/project, manage
- [ ] Messaging: room chat and private chat (see Phase 10)
- [ ] Settings: profile and user settings

[MEDIUM] Presenter metrics (requirement #19):
- [ ] Stand visits (only their own)
- [ ] Project interactions (only their own)
- [ ] Avatar queries (only their own)
- [ ] Interests (only their own)
- [ ] Contact requests (only their own)

===========================================================
PHASE 9: VISITOR / GUEST DASHBOARD
===========================================================

[HIGH] Visitor dashboard (requirement #20):
- [ ] Create /app/dashboard-invitado route
- [ ] Home page
- [ ] My interests: view and manage interest in stands
- [ ] Settings
- [ ] Visited projects history (HU27: project, date, access again)
- [ ] Visited rooms history (HU28)
- [ ] Mark stands as interesting (HU29): mark, remove interest, prevent duplicates, persist user-stand relationship
- [ ] View interested stands history (HU30)

[HIGH] Interests and contact requests persistence (requirement #21):
- [ ] Manifest interest in stands
- [ ] Remove interest
- [ ] Request contact with other users
- [ ] Request direct contact with presenters
- [ ] Identify associated project
- [ ] Register request
- [ ] Generate initial message when applicable
- [ ] Notify presenter
- [ ] All actions must persist to backend

===========================================================
PHASE 10: MESSAGING & CHAT (requirement #22)
===========================================================

[HIGH] Chat system (RF16, HU36, HU37):
- [ ] General room chat: associated with room, send/receive messages, chronological order, room members only
- [ ] Private chat: only between users who established contact, sent/received messages, new message notifications, restricted access
- [ ] No chat components exist yet — need full implementation
- [ ] No messaging service exists — need API integration

[HIGH] Notifications (RF18, HU39-HU44):
- [ ] Admin notifications: project changes, stand changes, activities, disabled projects
- [ ] Presenter notifications: project incorporated to stand, project disabled, project info updated, contact request
- [ ] Distinguish: read/unread, related event
- [ ] No notification components exist yet

[MEDIUM] Contact requests:
- [ ] View contact requests in presenter dashboard
- [ ] Process/accept/reject contact requests
- [ ] Generate notifications on new requests

===========================================================
PHASE 11: KNOWLEDGE BASE & RAG
===========================================================

[MEDIUM] Knowledge base integration:
- [ ] Connect KnowledgeBaseView to real API endpoints (comments show planned: /api/knowledge-base/documents, /api/knowledge-base/faq)
- [ ] All handlers currently use setTimeout or local state
- [ ] Implement real document listing, FAQ management, search

[MEDIUM] RAG service:
- [ ] Services exist (src/services/rag.ts) but not fully integrated
- [ ] ragTextSearch, ragVectorSearch, ragListDocuments, ragChunkContext
- [ ] Connect to frontend components

===========================================================
PHASE 12: RESPONSIVE & ACCESSIBILITY
===========================================================

[MEDIUM] Responsive design verification:
- [ ] Test and verify desktop, tablet, and mobile layouts
- [ ] DashboardLayout side panels become drawers on mobile (exists, verify)
- [ ] Chart components responsive sizing
- [ ] Table components horizontal scroll on mobile

[MEDIUM] Visual consistency:
- [ ] Ensure consistency between sidebar, header, cards, tables, filters, modals, forms, loading states, empty states, error messages

===========================================================
PHASE 13: UI STATES (requirement #33)
===========================================================

[HIGH] Implement proper states for all backend-connected modules:
- [ ] Loading: show indicator while fetching data
- [ ] Success: display information
- [ ] Empty: show message when no records exist
- [ ] Error: show understandable message with retry option
- [ ] Mutation: show feedback during create, edit, delete, approve, change role, mark interest, request contact

===========================================================
PHASE 14: SECURITY & BEST PRACTICES
===========================================================

[HIGH] Remove hardcoded credentials:
- [ ] src/mocks/auth.ts — hardcoded passwords (admin123, docente123, director123, Admin123!, etc.)
- [ ] .env.example — sensitive LDAP credentials and secrets
- [ ] Move secrets to environment/secrets manager, not committed to repo

[MEDIUM] API client improvements:
- [ ] src/services/api.ts — add proper error handling for all endpoints
- [ ] Add retry logic for failed requests
- [ ] Add timeout configuration
- [ ] Document all expected API contracts

[MEDIUM] Type safety:
- [ ] Replace remaining `any` types with proper interfaces
- [ ] Add proper generics where applicable
- [ ] Ensure all API responses are typed

===========================================================
PHASE 15: DEPLOYMENT & DEVOPS
===========================================================

[INFO] Docker:
- [ ] Review Dockerfile for production readiness
- [ ] Add multi-stage build optimizations
- [ ] Add .env file to .dockerignore

[INFO] Environment configuration:
- [ ] Document required environment variables for staging/production
- [ ] Add validation for missing required variables at startup

===========================================================
SUMMARY BY PRIORITY
===========================================================

PRIORIDAD ALTA (Must implement before new features):
1. Fix all TypeScript errors (12 errors)
2. Remove all `any` types (4 occurrences)
3. Implement role-based routing and guards
4. Connect main dashboards to real API endpoints
5. Remove mock data from production code
6. Build Admin page with real user management
7. Implement presenter-specific dashboard routes
8. Implement visitor-specific dashboard routes

PRIORIDAD MEDIA (Implement after base is stable):
9. Real metrics and analytics
10. Report generation and export
11. Chat/messaging system
12. Notification system
13. Fair and room management (pending backend endpoints)
14. Knowledge base integration
15. Contact requests persistence

PRIORIDAD BAJA (Cleanup and polish):
16. Remove console.log statements
17. Add lint and test scripts
18. Responsive design verification
19. Visual consistency audit
20. Remove hardcoded credentials
21. Documentation and deployment config

===========================================================
BLOCKERS (Dependen del Backend)
===========================================================

Los siguientes items dependen de que el backend implemente los endpoints:
- Ban/suspend user (no endpoint disponible)
- Fair management endpoints
- Room management endpoints
- Metric endpoints (/api/v1/analytics no implementado)
- Visit tracking endpoints
- Interaction tracking endpoints
- Chat/messaging endpoints
- Notification endpoints
- Report generation endpoint
- Knowledge base endpoints

Estado actual del frontend: los servicios API existen pero las respuestas
pueden fallar si los endpoints del backend no existen. Todos los endpoints
pendientes deben marcarse como bloqueados hasta que el backend los proporcione.

===========================================================
END OF TODO LIST
===========================================================
