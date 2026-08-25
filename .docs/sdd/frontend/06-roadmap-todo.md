# Roadmap & TODO — Frontend (Modu)

> **Propósito**: Plan de trabajo y lista de pendientes del frontend para el **manager de reportería multi-sistema**: conectar varios sistemas (APIs) en una interfaz única, con permisos/roles/menús dinámicos, reportes y administración.
>
> **Estado**: La UI base es sólida y reutilizable (tokens de tema, i18n, tabla, filtros, charts, layout). El **contenido es demo de una app de notas** y debe reemplazarse por el dominio real. **Excepciones**: el módulo **Records View** ya consume el backend real (búsqueda RAG full-text y listado de documentos vía `/rag/*`) y la **navegación/visibilidad del menú ya se controla por permisos RBAC** servidos por el backend (`/auth/me` → `permissions: string[]`).

---

## 1. Contexto y Diagnóstico

- El frontend heredó una "note-taking app" re-tematizada con **datos 100% mock** (`src/records/data.ts`).
- Solo consume del backend: **login/logout/me** + **RAG** (`GET /rag/text-search`, `GET /rag/documents` desde `RagSearchView`). El resto del dashboard es estático.
- **Sin rutas por URL** para el contenido: el menú es estado local (`useRecordsDashboard`) + `localStorage`.
- Lo aprovechable: `RecordsTable`, `RecordsFilter`, charts (`KpiCard`/`CategoryBarList`/`StatusOverview`), `DashboardLayout`, sidebar, tema e i18n.

**Prioridad**: P0 = limpieza/bloqueante; P1 = arquitectura de navegación; P2 = páginas del producto; P3 = UX/pulido.

---

## 2. Fase 0 — Limpieza de código muerto y demo (P0)

### 2.1 Código muerto (no se renderiza) — ELIMINAR
- [x] `src/components/context/NavigationContext.tsx` — contexto sin Provider ni consumidores.
- [x] `src/components/note-detail/NoteContent.tsx`, `FloatingToolbar.tsx`, `FloatingActionButton.tsx` — no se renderizan.
- [x] `src/components/ui/form/FormInput.tsx` — duplica a `form/index.tsx`.
- [ ] `public/demo-dashboard.html` — demo estático de la app de notas. **EXCEPCIÓN**: mantener (aún se usa/consulta). No eliminar.
- [x] `public/vector 2.png` — asset suelto; `public/favicon.svg` sin uso.

### 2.2 Demo visible en la UI — REEMPLAZAR/QUITAR
- [x] **Secciones "Folders/Tags/Trash"** del sidebar (`Management`, `Images`, `Science`, `Design`, `Screenshots`, `Silver`) → `src/records/records.config.tsx` (`STATIC_SECTIONS`). Restos de app de notas. Reemplazadas por secciones del producto: **Management** (Data Sources, Schedules, Users) y **Security** (Roles, Permissions, Audit Logs), navegables con `path` y estado activo.
- [x] **Quick links** `Highlights`, `Activity`, `Saved` → todos renderizan `HomeOverview` sin vista propia. Reemplazados por páginas reales: **Home Page**, **Records View**, **Reports** (`/app/reports`), **Connections** (`/app/connections`), **Administration** (`/app/admin`).
- [ ] **Módulos demo** (`Coaching Forms`, `Vacations`, `Sales`, `Licenses`, `Permissions`) con registros ficticios en `src/records/data.ts` ("HR Reports", "Q1 Pipeline Review", "Windows Enterprise", etc.). **MANTENER**: los módulos de records se conservan tal cual (tienen data). **EXCEPCIÓN**: `Records View` ya no es demo — renderiza la **búsqueda RAG real** (`RagSearchView`, Summary) y la vista de **subida de documento** (`UploadDocumentView`, solo UI).
- [x] **Visibilidad del menú controlada por permisos RBAC** — los módulos de records se filtran con `module:<slug>` (`getVisibleRecordModules`), las opciones de vista con `RecordViewOption.permission` (`rag:upload-view` oculta la subida a quien no la tenga) y los items del sidebar (quick links/secciones) con `StaticSidebarItem.permission` (`isMenuItemVisible`); un item **sin** `permission` siempre se muestra. `RecordsRoute` redirige si el módulo/vista de la URL no está autorizado.
- [ ] **UserProfile**: estado `online` hardcodeado e ícono switch sin función.
- [ ] **Fallback de usuario** `'Thomas Williams'` en `Dashboard.tsx`.
- [ ] **Panel central de notas**: lenguaje "All notes/Modules", `autoHideSeconds={3}`, `search={{}}` sin handlers.
- [x] **`NoteDetailHeader`** (`src/components/note-detail/`, breadcrumbs "My notes"/"Add tags", botones muertos Paperclip/Share2/Bell/More) — **eliminado** (no se renderizaba) junto con sus claves i18n huérfanas.
- [x] **Renombrado notas → menú** — `src/components/notes/` → `src/components/menu/` (`MenuPanel`, `MenuItem`, `MenuSearchBar`); el panel central pasa de "notas" a "menú de vistas" (`menuItems`, `menuTitle`, `menuCollapsed`; claves i18n `menu.*`; `localStorage` `modu_menu_collapsed` con migración de `modu_notes_collapsed`).
- [ ] **Login**: botones sociales (Google/Apple) comentados y carousel con ítems comentados de coaching/licencias/vacaciones → quitar o completar.
- [ ] **Settings**: opciones solo decorativas (densidad, perfil, notificaciones, privacidad, preferencias, colores) → implementar o retirar.

### 2.3 Configuración
- [x] **Corregir `tsconfig.app.json`**: `module: "esnext"` + `moduleResolution: "node16"` rompe `tsc` (TS5110). Alinear a `"moduleResolution": "bundler"` o `"module": "Node16"`.
- [x] **Añadir `tsc --noEmit` al build** (`"build": "tsc -b && vite build"`) para que los errores de tipos no pasen desapercibidos.
- [x] **Fix del flujo de login**: `AuthContext` separa `isSubmitting` (login en progreso) de `isLoading` (validación inicial de sesión). Antes, `login()` activaba `isLoading`, `GuestRoute` desmontaba el `<Login />` mostrando `LoadingScreen` y al fallar lo remontaba — se percibía como "refresh" y el error del backend no quedaba en el banner. Ahora el formulario permanece montado y `login-error` muestra el mensaje (ej: `System user with email admin@test.com not found`).
- [ ] **Evaluar ESLint/Prettier y tests (Vitest)** — hoy no hay ninguno en el frontend.

---

## 3. Fase 1 — Arquitectura de navegación por URL + menú dinámico (P1)

Base necesaria antes de las páginas del producto.

### 3.1 Routing real
- [x] Reestructurar `src/router.tsx` con **rutas hijas bajo `/app`** y layout protegido anidado:
  - `/app` → `DashboardLayout` (sidebar + main).
  - Rutas por módulo/menú: `/app/reports`, `/app/connections`, `/app/admin/*`, etc.
- [x] **Separación lógica/declarativa**: el router queda como una **tabla de rutas pura** en `src/routes/index.tsx`; la lógica de acceso vive en `src/routes/guards.tsx` (`LoadingScreen`, `ProtectedRoute`, `GuestRoute`, `IndexRedirect`) y `src/routes/records-route.tsx` (`RecordsRoute` — valida `module:<slug>` y el `permission` de la vista, redirige al primer módulo visible o a `/app/reports`). `src/router.tsx` eliminado.
- [x] **Deep-linking** (recargar en `/app/reports/12` conserva estado).
- [x] **Botón "atrás" y breadcrumbs coherentes con la URL** *(fix 2026-08-20: `Breadcrumbs` con `ChevronLeft`, "volver" navega al crumb previo, `onNavigate` cierra Settings; `AppLayout` deriva los crumbs de la URL — módulos con `/summary`, omite la primera vista, `settings.title` en Settings).*
- [x] `ProtectedRoute` que redirige a `/login` si no hay sesión; `index` redirige según autenticación.
- [x] **Página Home real** — `src/pages/home/HomePage.tsx` (`HomeOverview` + `ViewHeader`) en `/app/home`; el index de `/app` y `IndexRedirect` apuntan a `/app/home` *(2026-08-20)*.

### 3.2 Menú dinámico desde backend
- [x] **Permisos de menú servidos por el backend** (paso previo): `SystemUserDto`/`AuthUserDto` exponen `permissions: string[]` (permisos efectivos de los roles activos; `SUPERADMIN` → todos) vía `/auth/login` y `/auth/me`; el frontend los mapea en `User.permissions` y los usa con `hasPermission()`.
- [x] **Config general de menú movida a `src/routes/menu.config.tsx`** (`QUICK_LINKS`, `STATIC_SECTIONS` con `StaticSidebarItem.permission?`), fuera de `records/`. `useRecordsDashboard` filtra modules/views/items con permisos y persiste solo `modu_menu_collapsed`.
- [ ] Reemplazar `STATIC_SECTIONS`/`QUICK_LINKS`/`RECORD_MODULES` por **menús servidos por API** (`GET /menus/me`).
- [ ] `useRecordsDashboard` → hook de menús que consume la API, con persistencia de selección en la URL (no solo localStorage).
- [ ] Separar **config de UI (columnas/iconos)** de **datos**: el esquema de columnas (`RecordColumn[]`) es bueno y se conserva; los datasets mock se eliminan.

---

## 4. Fase 2 — Páginas del producto (P2)

### 4.0 Búsqueda RAG en Records View
- [x] **Vista de búsqueda RAG** — `src/components/records/RagSearchView.tsx` renderizada en `RecordsView` cuando el módulo es `records` con vista Summary (Records View del menú colapsable): reemplaza la tabla genérica.
- [x] **Cliente API** `src/services/rag.ts` — `ragTextSearch` (GET `/rag/text-search`), `ragListDocuments` (GET `/rag/documents`), `ragVectorSearch` (POST `/rag/search`). Usa `get`/`post` de `api.ts` (JWT automático).
- [x] Búsqueda full-text con filtro por departamento, ranking `ts_rank_cd` + trigram, y grilla de documentos del índice con `chunkCount`.
- [x] **Sin vistas genéricas de records** — el módulo `records` usa `RAG_VIEW_OPTIONS` con solo **Summary** (→ búsqueda RAG) y **Subir documento** (→ `UploadDocumentView`, `kind: 'upload'` nuevo en `RecordViewKind`). `useRecordsDashboard` genera un view de respaldo interno.
- [x] **Subir documento (UI)** — `src/components/records/UploadDocumentView.tsx`: selector/drag & drop + botón de subida. **Solo frontend**: el endpoint de ingesta aún no existe en el backend (no hay controller HTTP en `StorageModule`). La vista exige el permiso **`rag:upload-view`** (`RAG_VIEW_OPTIONS[].permission`) y el botón de enviar está oculto sin **`rag:upload`** (pendiente en backend/roadmap).
- [x] **Permisos RAG en frontend** — `rag:upload-view` (ver la opción de subida) y `rag:upload` (enviar) se consumen vía `hasPermission`/`RecordsRoute`. BASIC quedó **solo con RAG de lectura** (`module:records`, `rag:read`, `rag:search`): ni ve ni puede usar la subida.
- [x] **i18n en las vistas RAG** — `RagSearchView`, `UploadDocumentView`, `RecordsPage` y los labels/descripciones de `RAG_VIEW_OPTIONS` usan `useAppTranslation` con claves `rag.*` (default `en`, cambian con el selector de idioma). `useAppTranslation` ahora soporta interpolación (`{{ms}}`, `{{query}}`, `{{page}}`, `{{name}}`, `{{id}}`).
- [x] **Expand de resultados RAG** — cada `ResultCard` tiene **Expandir/Colapsar**: muestra el contenido completo del chunk (scroll) con los términos de la query **resaltados**, y **Leer todo el contexto** carga los chunks vecinos del mismo documento (`GET /rag/chunks/:id/context`) y los muestra como contenido anterior (`before`) y posterior (`after`) completos.
- [ ] **Búsqueda semántica** desde la UI (requiere vectorizar la consulta, opcional NVIDIA NIM) — `ragVectorSearch` ya está listo en el cliente pero no se expone.
- [ ] **Paginación y carga incremental** del listado de documentos.
- [ ] Vaciado/estados de error por endpoint individual (hoy hay estado global por pestaña).
- [ ] **Subir documento real** — crear endpoint backend de subida/ingesta y conectar `UploadDocumentView` (hoy simula el envío).

### 4.1 Reportes
- [ ] `src/pages/reports/ReportsPage.tsx` — lista de reportes (reusar `RecordsTable`).
- [ ] `ReportBuilder.tsx` — parámetros, fuentes, métricas, filtros (reusar `RecordsFilter`).
- [ ] `ReportViewer.tsx` — visualización con charts (`KpiCard`/`CategoryBarList`/`StatusOverview`).
- [ ] **Exportación** de resultados (CSV/Excel/PDF) desde el backend.
- [ ] Servicio `src/services/reports.ts`.

### 4.2 Conexiones a sistemas externos
- [ ] `src/pages/integrations/ConnectionsPage.tsx` — CRUD de fuentes, **test de conexión**, estado, credenciales (cifradas).
- [ ] `src/pages/integrations/DataSourcesPage.tsx` — mapeo de columnas, refresh, scheduling.
- [ ] Servicio `src/services/connections.ts`, `src/services/dataSources.ts`.

### 4.3 Administración (permisos, roles, menús, usuarios, logs)
- [ ] `src/pages/admin/RolesPage.tsx` — roles + asignación de permisos.
- [ ] `src/pages/admin/PermissionsPage.tsx` — permisos por recurso/acción.
- [ ] `src/pages/admin/MenusPage.tsx` — menús por rol (dinámicos).
- [ ] `src/pages/admin/UsersPage.tsx` — CRUD de usuarios (backend ya existe).
- [ ] `src/pages/admin/LogsPage.tsx` — `AuthLog`/`SystemLog` (backend ya existe).
- [ ] Servicio `src/services/admin.ts`.

---

## 5. Fase 3 — Conexión con el backend (P2/P3)

- [ ] **Cliente API para datos de negocio** (hoy solo `api.ts` + auth; los datos son mock).
- [ ] **Resolver asimetría de rutas**: `api.ts` usa `/api/v1` por defecto y el proxy de `vite.config.ts` (localhost:4000) no se usa → unificar con `VITE_API_URL`. *(El login ya funciona contra el backend real — `VITE_API_URL=http://localhost:3000`; pendiente el resto de datos.)*
- [x] **Manejo del error de login en el banner**: `api.ts` extrae `body.message` sobre `body.error`; `Login.tsx` renderiza `login-error` desde `useAuth().error` y `handleSubmit` lo limpia en cada cambio. *(Fix completo 2026-08-17.)*
- [ ] **Manejo de refresh token** — el backend ya expone `POST /auth/refresh`; falta el interceptor en el frontend que renueve la sesión sin re-login.
- [ ] **Token**: decidir entre cookie httpOnly y `localStorage` (hoy redundante; riesgo XSS, ver ADR-004). Si se usa cookie, el cliente deja de leer `auth_token`.
- [ ] **LDAP**: si el backend elimina `POST /auth/ldap/login`, quitar la referencia del frontend.
- [ ] **Limpiar secretos** del `.env`/`.env.example` del frontend (mock secret, LDAP bind password).

---

## 6. Fase 4 — UX, visual e i18n (P3)

### 6.1 Tema y consistencia visual
- [ ] **Unificar tema claro en Login, NotFound y `.app-loading`** (hoy usan hex inline y saltan de claro→oscuro al entrar al dashboard).
- [ ] **`theme-color` de `index.html`** (`#7c3aed` púrpura) → acento ámbar de la marca (`#f2a93b`).
- [ ] **Resolver doble fuente de formularios**: `<style>` inline gigante de `Login.tsx` vs `components/ui/form/*` (colisión de selectores globales).
- [ ] **Accesibilidad**: `index.css` usa `ring` (propiedad CSS inválida) → el foco no se ve; corregir con `box-shadow`/`outline`. `aria-label` en botones de icono.
- [ ] **Acento único**: azul (`bg-blue-500/20`) en paginación/filtros/badges vs ámbar de marca → definir un sistema único de acento.
- [ ] **Locale en números**: `RecordsTable` formatea con `toLocaleString('en-US')` → usar locale de la app.
- [ ] **Hover `scale-[1.001]`** en filas de tabla — gimmick; valorar quitarlo.

### 6.2 i18n
- [ ] **Completar `en.json`**: tiene ~78 claves frente a ~165 de `es.json`; muchas frases en inglés se ven "bien por accidente" (la clave cruda es la frase) pero no son traducciones reales. Balancear ambos diccionarios.
- [ ] **Traducir** Login, NotFound, `routes/guards.tsx` ("Loading session…"), `PanelHeader` ("Back").
- [ ] **`index.html` `lang="es"` fijo** → sincronizar con el idioma activo (default `en`).
- [ ] **Usar `useAppTranslation` + `noTranslate`** (hoy definidos pero sin uso) para datos vs textos.
- [ ] **Unificar idioma de mensajes de error** (`auth.ts` mezcla inglés y español).

---

## 7. Deuda técnica estructural del frontend (P3)

Mejoras de estructura/calidad detectadas en la revisión de la arquitectura (2026-08-19). No son features sino mantenibilidad.

- [ ] **Code-splitting** — el bundle de producción es un único archivo (~532 KB). Aplicar `React.lazy` + `Suspense` por página en `src/routes/index.tsx` (Login, ReportsPage, ConnectionsPage, AdminPage, RecordsPage) para reducir el payload inicial.
- [ ] **Barrel exports inconsistentes** — mezcla de imports directos (`../records/useRecordsDashboard`) y vía `index` (`../records`). Unificar criterio por carpeta.
- [ ] **Mocks entremezclados con servicios reales** — `mocks/auth.ts` convive con `services/auth.ts`; separar la capa mock (detrás de `VITE_MOCK_ENABLED`) del código real para no contaminar la lógica de negocio.
- [ ] **`records/` mezcla dominio real y demo** — el mismo directorio contiene `records.config.tsx` (producto real: RAG, permisos) y los datasets demo (`data.ts`) de los módulos ficticios. Separar cuando se eliminen los módulos demo (Fase 0).
- [ ] **`RecordData` tipado débil** — `Record<string, string | number>` con `id`/`status` requeridos; reemplazar por tipos por dominio (o schema Zod) cuando los módulos sean reales.
- [ ] **`STORAGE_KEYS.activeView`/`selectedCard` sin uso** — `useRecordsDashboard` solo persiste `modu_menu_collapsed`; limpiar las claves muertas de `STORAGE_KEYS`.
- [ ] **tsconfig raíz del repo roto + scripts `build` deshabilitados** (backend) — impide el typecheck oficial (`tsc -b`) y CI; ver `backend/07-roadmap-todo.md` §2.2. El frontend usa su propio `tsconfig.app.json` (ya funciona).

---

## 8. Orden de ejecución recomendado

1. **Fase 0** (limpieza) → quitar demo/código muerto y arreglar build de tipos.
2. **Fase 1** (routing + menú dinámico) → base de navegación real. *(Permisos de menú servidos por `/auth/me` + filtrado por `module:*`/`RecordViewOption.permission`/`StaticSidebarItem.permission` ya implementados 2026-08-19; pendiente `GET /menus/me`.)*
3. **Fase 2** (páginas: reportes, conexiones, admin) → el producto.
4. **Fase 3** (conexión backend) → datos reales en vez de mocks.
5. **Fase 4** (UX/i18n) → pulido continuo.
6. **Fase 5** (deuda técnica estructural §7) → mantenibilidad; código-splitting y barrels prioritarios.

> **Documentos relacionados**: [00-engram.md](../00-engram.md), [01-modules-pages.md](01-modules-pages.md), [02-ui-ux-design-system.md](02-ui-ux-design-system.md), [03-api-client.md](03-api-client.md), [04-security.md](04-security.md), [05-testing-strategy.md](05-testing-strategy.md).