# Frontend Modules & Pages — Modu

> **Propósito**: Describir las páginas, componentes, enrutamiento y estructura del frontend React.

---

## 1. Estructura de Archivos

```
apps/frontend/src/
├── components/
│   ├── ui/                        ← Componentes atómicos reutilizables
│   │   ├── carousel/
│   │   │   ├── TextCarousel.tsx
│   │   │   └── index.ts
│   │   └── form/
│   │       ├── FormButton.tsx
│   │       ├── FormField.tsx
│   │       ├── FormInput.tsx
│   │       └── index.ts
│   │
│   ├── layout/                    ← Layouts de página
│   │   ├── DashboardLayout.tsx    ← Layout de 3 columnas
│   │   └── index.ts
│   │
│   ├── sidebar/                   ← Panel de navegación lateral
│   │   ├── Sidebar.tsx
│   │   ├── SidebarSection.tsx
│   │   ├── SidebarLinkItem.tsx
│   │   ├── SidebarDropdown.tsx    ← Grupo colapsable de módulos
│   │   ├── UserProfile.tsx
│   │   └── index.ts
│   │
│   ├── menu/                       ← Panel central de menú de vistas (antes notes/)
│   │   ├── MenuPanel.tsx
│   │   ├── MenuItem.tsx
│   │   ├── MenuSearchBar.tsx
│   │   └── index.ts
│   │
│   ├── charts/                    ← Primitivas de gráficos reutilizables
│   │   ├── KpiCard.tsx            ← Tarjeta de KPI (label, valor, hint, icono)
│   │   ├── CategoryBarList.tsx    ← Barras horizontales por categoría
│   │   ├── StatusOverview.tsx     ← Distribución segmentada + actividad reciente
│   │   └── index.ts
│   │
│   ├── records/                   ← Componentes de registros
│   │   ├── RecordsTable.tsx       ← Tabla con filtros y paginación (columnas dinámicas)
│   │   ├── RecordsSummary.tsx     ← KPIs y gráficos por módulo
│   │   ├── RecordsView.tsx        ← Enruta la vista según view.kind (módulo `records` → RAG)
│   │   ├── RagSearchView.tsx      ← Búsqueda RAG full-text + documentos indexados (Summary)
│   │   ├── UploadDocumentView.tsx ← Subir documento al índice (UI, endpoint pendiente)
│   │   ├── RbacRolesView.tsx      ← Grid de Roles desde `GET /roles/all` (permisos anidados)
│   │   ├── RbacPermissionsView.tsx← Grid de Permisos desde `GET /permissions`
│   │   ├── RecordsFilter.tsx      ← Filtros por columna
│   │   └── index.ts
│   │
│   └── home/
│       ├── HomeOverview.tsx       ← Resumen global (Home Page): KPIs + charts + cards
│       └── index.ts
├── records/                       ← Dominio de módulos de registros
│   ├── types.ts                   ← Tipos compartidos (RecordData, RecordColumn, RecordModule…)
│   ├── dynamicColumns.ts          ← buildDynamicTable: columnas dinámicas desde datos crudos (estáticos o endpoint)
│   ├── records.config.tsx         ← Config de módulos, columnas, vistas, quick links y secciones
│   ├── data.ts                    ← Datos mock por módulo + metadata de estados
│   ├── useRecordsDashboard.tsx    ← Hook de estado del dashboard (menú + persistencia)
│   └── index.ts                   ← Barrel exports del dominio
├── pages/
│   ├── Login.tsx         ← Página de inicio de sesión
│   ├── Dashboard.tsx     ← Página principal (autenticada) — Note-taking app
│   ├── home/
│   │   └── HomePage.tsx  ← Home real (HomeOverview + ViewHeader), ruta `/app/home`
│   └── NotFound.tsx      ← 404
├── context/
│   └── AuthContext.tsx   ← Estado global de autenticación
├── services/
│   ├── api.ts            ← Cliente HTTP base
│   ├── auth.ts           ← Servicio de autenticación
│   ├── rag.ts            ← Cliente RAG (text-search, documents, vector search)
│   └── rbac.ts           ← Cliente RBAC (roles, permissions)
├── mocks/
│   └── auth.ts           ← Datos mock para desarrollo
├── App.tsx               ← Raíz de la aplicación (importa el router de ./routes)
├── routes/               ← Router separado: tabla de rutas + lógica de acceso
│   ├── index.tsx         ← Tabla de rutas declarativa (createBrowserRouter)
│   ├── guards.tsx        ← LoadingScreen, ProtectedRoute, GuestRoute, IndexRedirect
│   ├── records-route.tsx ← RecordsRoute (valida módulo/vista por permisos RBAC)
│   └── menu.config.tsx   ← QUICK_LINKS + STATIC_SECTIONS del sidebar
├── main.tsx              ← Entry point
└── index.css             ← Estilos globales (reset, loading spinner)
```

---

## 2. Enrutamiento

### 2.1 Configuración (React Router v7)

El router es una **tabla de rutas declarativa** en `src/routes/index.tsx`; la lógica de acceso vive separada en `guards.tsx` y `records-route.tsx`.

```typescript
createBrowserRouter([
  {
    path: '/login',                         // /login — solo invitados
    element: <GuestRoute><Login /></GuestRoute>
  },
  {
    index: true,                            // Ruta raíz: redirige según autenticación
    element: <IndexRedirect />
  },
  {
    path: '/app',                           // /app — layout protegido (sidebar + main)
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/app/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'records/:base?/:view?', element: <RecordsRoute /> },  // valida permisos
      { path: 'reports', element: <ReportsPage /> },
      { path: 'connections', element: <ConnectionsPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: '*', element: <NotFound /> }
    ]
  },
  { path: '*', element: <NotFound /> }
])
```

> **2026-08-20** (`801a143`): la ruta **index** de `/app` y `IndexRedirect` ahora apuntan a **`/app/home`** (nueva página `HomePage` real con `HomeOverview` + `ViewHeader`) en lugar de `/app/records`.

### 2.2 Guards de Navegación

| Guard | Función | Comportamiento |
|-------|---------|----------------|
| `ProtectedRoute` | Proteger rutas que requieren autenticación | Si `!isAuthenticated && !isLoading` → redirige a `/login` |
| `GuestRoute` | Proteger rutas de invitados (login) | Si `isAuthenticated && !isLoading` → redirige a `/app/home` |
| `IndexRedirect` | Redirigir la raíz según autenticación | Autenticado → `/app/home`; invitado → `/login` |
| `RecordsRoute` | Autorizar el área de registros por URL | Valida `module:<slug>` y `RecordViewOption.permission` (ej. `rag:upload-view`); sin módulos visibles → `/app/reports` |

### 2.3 Estados de Carga

Ambos guards muestran un spinner mientras `isLoading === true`:

```html
<div class="app-loading">
  <div class="spinner-lg" />
  <p>Loading session…</p>
</div>
```

---

## 3. Páginas

### 3.1 Login (`/`)

| Propiedad | Valor |
|-----------|-------|
| **Layout** | Split: izquierda (branding) + derecha (formulario) |
| **Acceso** | Público (solo invitados) |

**Secciones**:
- **Lado izquierdo**: Logo, título con acento, TextCarousel animado, dots indicadores
- **Lado derecho**: Logo pequeño, título "Welcome to Modu", error alert, formulario (email + password), botón submit, forgot password link, footer

**Comportamiento**:
1. Al montar, si ya autenticado → redirige a `/app/home`
2. Submit del formulario → `AuthContext.login(credentials)`
3. Error → muestra `login-error` con botón de cerrar
4. Loading → botón deshabilitado con spinner

**Estado actual**: ✅ Completada

### 3.2 Dashboard (`/app`) — Table grids + módulos

| Propiedad | Valor |
|-----------|-------|
| **Layout** | 3 columnas (Sidebar │ MenuPanel │ Main) |
| **Acceso** | Autenticado (+ permisos RBAC por módulo/vista) |

#### Layout General

```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Sidebar  │  │ MenuPanel    │  │ Main                  │ │
│  │          │  │ (w-80↔w-12)  │  │                       │ │
│  │ Quick    │  │ [SearchBar]  │  │  [ViewOption]         │ │
│  │ links    │  │              │  │  — {Módulo}           │ │
│  │ Records  │  │ {Vista/módulo│  │  ┌──────────────────┐ │ │
│  │  ▾ drop  │  │  activo}     │  │  │   RagSearchView  │ │ │
│  │  6 mods  │  │ ┌──────────┐ │  │  └──────────────────┘ │ │
│  │  (Records│  │ │ Summary  │ │  │                       │ │
│  │   View …)│  │ ├──────────┤ │  │                       │ │
│  │ Mgmt/Sec │  │ │ Subir    │ │  │  ┌──────────────────┐ │ │
│  │          │  │ │ doc.     │ │  │  │ UploadDocumentVw │ │ │
│  │          │  │ ├──────────┤ │  │  └──────────────────┘ │ │
│  ├──────────┤  │ │ Summary* │ │  │  * otros módulos:     │ │
│  │ Profile  │  │ │TableGrid │ │  │  RecordsSummary/Table │ │
│  └──────────┘  │ │ Archived │ │  │                       │ │
│                │ └──────────┘ │  │                       │ │
└─────────────────────────────────────────────────────────────────────┘
       w-60          w-80 / w-12                  flex-1
```

#### Árbol de Componentes

```
<DashboardLayout>                    ← 3-column layout shell
  ├── <Sidebar sections user>        ← Left panel (w-60)
  │   ├── <SidebarSection title="Quick links">
  │   │   └── <SidebarLinkItem icon active>   ← Home Page, Connections, Administration
  │   ├── <SidebarSection title="Records">
  │   │   └── <SidebarDropdown icon label items>  ← Records View, Coaching Forms, Vacations, Sales, Licenses, Permissions
  │   ├── <SidebarSection title="Management/Security">
  │   └── <UserProfile name subtitle avatarUrl>   ← icono genérico si no hay avatar
  │
  ├── <MenuPanel items title collapsible>  ← Center (w-80 ↔ w-12 rail)
  │   ├── <MenuSearchBar>
  │   └── <MenuItem variant>[...]    ← opciones de vista (Records View: Summary / Subir documento)
  │
  └── <main>                        ← Right panel (flex-1, scroll interno)
      ├── Header: {vista seleccionada} — {módulo}
      ├── Sin módulo activo (Home Page) → <HomeOverview>
      │   ├── <KpiCard>[...]             ← Total / Active / Pending / Archived (global)
      │   ├── <CategoryBarList>          ← Records by module
      │   ├── <StatusOverview>           ← Status global + latest activity
      │   └── Cards informativas por módulo (color, total, barra, último registro)
      └── Con módulo activo → <RecordsView module view>  ← resuelve según view.kind
          ├── Módulo `records` (RAG) →
          │   ├── view.kind = upload → <UploadDocumentView>  ← Subir documento (UI)
          │   └── resto (summary) → <RagSearchView>          ← búsqueda full-text + docs indexados
          ├── <RecordsSummary data columns moduleColor>  ← vista Summary (gráficos adaptativos)
          │   ├── <KpiCard>[...]         ← Total / Active / Pending / Archived
          │   ├── <CategoryBarList>      ← Records by {chartGroup} (columna del módulo)
          │   └── <StatusOverview>       ← Status distribution + latest activity
          └── <RecordsTable data columns statusFilter?>  ← Table Grid / Archived
```

#### Módulos de Table Grids (`records/records.config.tsx`)

| Módulo | Color dot | Opciones de vista | Columnas |
|--------|-----------|-------------------|----------|
| Records View | red | **Summary** (→ búsqueda RAG), **Subir documento** (UI) | — (sin tabla genérica) |
| Coaching Forms | purple | Summary, Table Grid, Archived | id, title, category, status, coach, sessions (number) |
| Vacations | green | Summary, Table Grid, Archived | id, title, leaveType (select), status, days (number), employee |
| Sales | amber | Summary, Table Grid, Archived | id, title, stage (select), status, amount (number), owner |
| Licenses | blue | Summary, Table Grid, Archived | id, title, vendor (select), status, seats (number), owner |
| Permissions | pink | Summary, Table Grid, Archived | id, title, scope (select), status, role, owner |

- La configuración de módulos, **columnas** y vistas vive en `records/records.config.tsx` (`RECORD_MODULES`, `MODULE_VIEW_OPTIONS`, `GENERAL_MENU`, `STORAGE_KEYS`); la **navegación general** (quick links y secciones estáticas) vive en `routes/menu.config.tsx` (`QUICK_LINKS`, `STATIC_SECTIONS`).
- Cada módulo tiene su **propio dataset** (`sampleData`, `coachingData`, `vacationsData`, `salesData`, `licensesData`, `permissionsData`) en `records/data.ts`, resuelto con `getRecordsForModule(label)`; `ALL_MODULE_DATA`/`getAllModuleRecords()` consolidan todo para el resumen global.
- `RecordData` es un tipo flexible (`Record<string, string|number|string[]>` con `id` y `status` requeridos; los `string[]` son labels de columnas tipo `list`); las columnas se definen con `RecordColumn[]` (key, header, type: text/number/date/select/**list**, options?, chartGroup?, render?).
- Toda la lógica de estado/menú está encapsulada en el hook `records/useRecordsDashboard` (`activeItemLabel`, `selectedCard`, `menuCollapsed`, persistencia, `sidebarSections`, `menuItems`, auto-selección del primer card). El panel central ya no es de "notas": es un **menú de vistas** (`components/menu/` → `MenuPanel`, `MenuItem`, `MenuSearchBar`; claves i18n `menu.*`).
- **Visibilidad por permisos RBAC** — el sidebar y el panel de menú se filtran con los permisos del usuario (`User.permissions` de `/auth/me`):
  - Módulos de records: `module:<slug>` vía `getVisibleRecordModules()`.
  - Opciones de vista: `RecordViewOption.permission` (ej. `rag:upload-view` en `RAG_VIEW_OPTIONS`).
  - Quick links / secciones estáticas: `StaticSidebarItem.permission` vía `isMenuItemVisible()` (sin `permission` → siempre visible).
  - `RecordsRoute` (`routes/records-route.tsx`) valida ambos niveles sobre la URL y redirige al primer módulo visible o a `/app/reports`.
- El render del área principal lo resuelve `RecordsView` según `view.kind`: para el módulo `records` → `upload` = `UploadDocumentView`, resto = `RagSearchView`; para los demás `summary` → `RecordsSummary`, `archived` → `RecordsTable statusFilter="Archived"`, `table` → `RecordsTable`. `RecordsTable` construye sus columnas y filtros dinámicamente desde `RecordColumn[]`.
- `RecordsSummary` agrupa el gráfico por la columna marcada `chartGroup` (fallback a la primera text/select), por lo que los gráficos **se adaptan a cada módulo**.
- `Dashboard.tsx` es una composición fina: consume el hook y arma el layout con `Sidebar` + `MenuPanel` + `RecordsView`/`HomeOverview`.
- **Records View** vive en el dropdown de **Records** (primer módulo). Su panel de menú muestra solo **Summary** (→ búsqueda RAG) y **Subir documento** (→ UI de subida, requiere `rag:upload-view`); ya no tiene Summary/Table/Archived genéricos ni tabla mock. Los otros 5 módulos con iconos minimalistas planos.
- **i18n de las vistas RAG**: los labels de `RAG_VIEW_OPTIONS` (`Summary`, `Upload Document`) y las descripciones (`RAG search over the vector store`, `Add a document to the index`) se guardan en inglés (default) y se traducen con `useAppTranslation` (`t(opt.label)` / `t(opt.description)` en `menuItems`). `RagSearchView`, `UploadDocumentView` y `RecordsPage` usan claves `rag.*` (p. ej. `rag.search.title` = "RAG Search" / "Búsqueda RAG", `rag.upload.title` = "Upload Document" / "Subir documento"). El idioma default es `en` y cambia con el selector de idioma de Settings.
- Al hacer clic en un módulo: el panel de menú se **abre automáticamente** y muestra sus **opciones de vista**: **Summary** (gráficos y KPIs), **Table Grid** (tabla paginada) y **Archived** (tabla filtrada a `status = Archived`). Al seleccionar una opción, el área principal muestra la vista correspondiente.
- Vistas generales (Home, Highlights…) usan un menú genérico (Overview, Recent Activity, Saved Items, Highlights). **Home Page** renderiza `HomeOverview` con el resumen global de todos los módulos.

#### Vistas de Seguridad — Roles y Permissions (endpoint RBAC)

Los items **Roles** y **Permissions** de la sección Management/Security del sidebar renderizan grids con datos reales del backend (mismo `RecordsTable` que los coaching forms), vía columnas dinámicas:

| Vista | Ruta | Fuente | Columnas |
|-------|------|--------|----------|
| `RbacRolesView` | `/app/records/roles` | `getRoles()` → `GET /roles/all` | ID, Name, Description, Status (pill Active/Inactive), Permissions (`list`, badges anidados expandibles + count), Created At, Updated At |
| `RbacPermissionsView` | `/app/records/permissions` | `getPermissions()` → `GET /permissions` (requiere ADMIN) | ID, Name, Description, Resource, Resource ID |

- `records-route.tsx` **intercepta** `baseSlug === 'roles' | 'permissions'` antes del lookup de `RECORD_MODULES` y renderiza la vista RBAC correspondiente.
- El filtrado por permisos anidados usa el tipo `list`: el filtro muestra el select de permisos únicos (derivados de todas las filas) con operadores Has/Doesn't have.
- Los headers se auto-generan desde las claves del DTO (`humanizeKey`); las columnas se ajustan/renombran/ocultan por override en `config.columns` sin tocar el pipeline.
- Breadcrumbs: `AppLayout` resuelve roles/permissions como fallback a `STATIC_SECTIONS`.
- i18n: claves `rbac.*` (active/inactive, títulos, errores de carga) en `en.json`/`es.json`.

#### Persistencia de Estado

| Clave `localStorage` | Valor |
|----------------------|-------|
| `modu_active_view` | Vista/módulo activo del dashboard *(sin uso — quedó de la migración)* |
| `modu_selected_card` | Vista seleccionada (Summary / Table Grid / Archived) *(sin uso — quedó de la migración)* |
| `modu_menu_collapsed` | Estado colapsado del panel de menú (antes `modu_notes_collapsed`; `useRecordsDashboard` migra la clave legacy) |

**Estado actual**: ✅ Completada. Dashboard orientado a módulos y table grids.

#### Variantes de MenuItem

| Variante | Clase CSS | Uso |
|----------|-----------|-----|
| `default` | `bg-[var(--bg-surface-soft)] hover:bg-[var(--bg-surface)]` | Vistas inactivas |
| `active` | `bg-[var(--bg-surface)] border-[var(--border-active)]` | Vista seleccionada |
| `subtle` | `sin bg, hover:bg-[var(--bg-surface-hover)]` | Vistas históricas sin énfasis |

**Estado actual**: ✅ Completada. Panel de menú (`components/menu/`) con items por vista (`MenuItemProps`) y filtro (`MenuSearchBar`).

### 3.3 NotFound (`/*`)

| Propiedad | Valor |
|-----------|-------|
| **Layout** | Simple |
| **Acceso** | Público |

**⚠️ Estado**: No implementado (archivo existe pero sin contenido definido en el análisis).

---

## 4. Componentes UI

### 4.1 Atómicos (`components/ui/`)

| Componente | Props | Propósito |
|-----------|-------|-----------|
| `FormField` | `label, htmlFor, error?, children` | Wrapper label + input + error |
| `FormInput` | `InputHTMLAttributes + { icon?: ReactNode }` | Input con icono (forwardRef) |
| `FormButton` | `ButtonHTMLAttributes + { loading?, loadingText?, icon? }` | Botón submit con estados |
| `TextCarousel` | `items: string[], currentIndex: number` | Texto rotativo animado |
| `Breadcrumbs` | `items: BreadcrumbItem[], onNavigate?` | Migas de pan derivadas de la URL; `onNavigate` cierra Settings. **2026-08-20**: icono `ChevronLeft` (sin texto "Back"), "volver" navega al crumb previo, Home → `/app/home` |

### 4.2 Layout (`components/layout/`)

| Componente | Props | Propósito |
|-----------|-------|-----------|
| `DashboardLayout` | `sidebar: ReactNode, notesPanel: ReactNode, mainContent: ReactNode` | Layout de 3 columnas; en móvil usa drawers off-canvas con top bar (Menú/Notas) |

### 4.3 Sidebar (`components/sidebar/`)

| Componente | Props principales | Propósito |
|-----------|------------------|-----------|
| `Sidebar` | `sections: SidebarSectionProps[], user: UserProfileProps` | Panel lateral completo |
| `SidebarSection` | `title: string, items?: SidebarLinkItemProps[], dropdown?: SidebarDropdownProps` | Sección con título; links o dropdown |
| `SidebarLinkItem` | `icon: ReactNode, label: string, href?, active?, onClick?` | Link de navegación |
| `SidebarDropdown` | `icon: ReactNode, label: string, items: SidebarLinkItemProps[]` | Grupo colapsable (chevron animado + grid expandible) |
| `UserProfile` | `name, subtitle?, avatarUrl?, status` | Tarjeta de perfil inferior (icono `UserRound` si no hay avatar) |

### 4.4 Menu (`components/menu/`) — panel central (antes `notes/`)

| Componente | Props principales | Propósito |
|-----------|------------------|-----------|
| `MenuPanel` | `items: MenuItemProps[], title?, search?, collapsible?` | Panel central colapsable (w-80 ↔ rail w-12) con opciones de vista por módulo |
| `MenuItem` | `title, variant, color?, pinned?, tags?, badge?, onClick?, onDelete?` | Item de vista/menú (3 variantes) |
| `MenuSearchBar` | `placeholder?, onSearch?, onFilter?, onAdd?` | Buscador con filtro y botón + |

*(El antiguo `components/note-detail/` — `NoteDetailHeader`, `NoteContent`, `FloatingToolbar`, `FloatingActionButton` — fue **eliminado** por no renderizarse.)*

### 4.5 Charts (`components/charts/`)

Primitivas de gráficos en **CSS/Tailwind puro** (sin librerías externas). Todas con hover scale-up.

| Componente | Props principales | Propósito |
|-----------|------------------|-----------|
| `KpiCard` | `label, value, hint?, suffix?, icon?, accentClass?` | Tarjeta de estadística (valor + label) |
| `CategoryBarList` | `title, items: {name, count}[], icon?, barClass?` | Barras horizontales por categoría |
| `StatusOverview` | `title, segments: {label, count, color, bar}[], total, recent?, icon?` | Barra segmentada + leyenda + actividad reciente |

### 4.6 Records (`components/records/`)

| Componente | Props principales | Propósito |
|-----------|------------------|-----------|
| `RecordsTable` | `data?, columns?: RecordColumn[], statusFilter?` | Tabla con columnas dinámicas (filtros + paginación); respeta `col.render` (celda custom) y renderiza tipo `list` como badges (+n) |
| `RecordsSummary` | `data?, columns?: RecordColumn[], moduleColor?` | KPIs y gráficos adaptativos por módulo |
| `RecordsView` | `module: RecordModule, view: RecordViewOption` | Enruta la vista según `view.kind` |
| `RecordsFilter` | `table, columns: FilterColumn[]` | Filtros por columna con operadores; tipos `text/number/date/select/list` |
| `RbacRolesView` | — | Grid de Roles desde `GET /roles/all`: columnas derivadas, pill Active/Inactive y permisos anidados expandibles (`RolePermissionsCell`) |
| `RbacPermissionsView` | — | Grid de Permisos desde `GET /permissions`: columnas derivadas |

#### 4.6.1 Columnas dinámicas (`records/dynamicColumns.ts`)

**`buildDynamicTable<T>(rows, config)`** deriva `RecordColumn[]` + `RecordData[]` a partir de un array de objetos crudos (**datos estáticos o de endpoint**, mismo pipeline que los coaching forms). Las columnas se auto-generan desde las claves de los datos — no hay que declararlas.

- **Headers auto-pretificados**: `humanizeKey()` divide camelCase, guiones bajos y medios → Title Case con espacios (`createdAt` → "Created At", `permission_count` → "Permission Count").
- **Tipo inferido** del primer valor no nulo (`number` → number, `boolean` → select, resto text); forzable por columna.
- **Control por columna** vía `config.columns` (mapa clave → override):

| Override | Propósito |
|----------|-----------|
| `header` | Renombrar el header |
| `hidden` | Ocultar la columna del grid (el valor queda en la fila) |
| `type` | Forzar el tipo (`text/number/date/select/list`) |
| `transform` | Transformar el valor crudo a `string \| number` (ej. array → count) |
| `itemsOf` | Solo `type: 'list'`: extrae el label de cada item del grupo (ej. `p.name`) |
| `render` | Celda custom (ej. permisos anidados, pills de estado) |

- También acepta `statusOf(row)` y `idOf(row, index)` para derivar status e id.
- Para `type: 'select'` deriva `options` de los valores únicos; para `'list'` deriva `options` de la **unión de labels** de todas las filas.
- ⚠️ El loop de valores salta las claves estructurales `id`/`status` para que `record.id` conserve el string derivado (bug corregido: el lookup de renders por `row.original.id` fallaba si el id numérico crudo sobrescribía el string).

#### 4.6.2 Tipo de columna `list` (grupos de items)

Para columnas cuyo valor es un **grupo de items** (ej. `permissions: PermissionDto[]` en Roles):

- `RecordData` acepta `string[]`; la fila guarda los **labels normalizados** (vía `itemsOf`) para filtrar sin depender del objeto crudo.
- **Filtro** (`RecordsFilter`): operadores `Has` / `Doesn't have`; el input es un select con los items disponibles (`col.options`). `matchFilterItem` compara case-insensitive contra los labels del array (`has` / `lacks`).
- **Celdas**: si no hay `render` custom, `RecordsTable` muestra badges de hasta 3 items + `+n` (o `—` si está vacío).
- En `RbacRolesView`, Permissions usa `itemsOf: p => p.name` y un `render` propio (`RolePermissionsCell`): badges anidados expandibles por recurso con count.

### 4.7 Home (`components/home/`)

| Componente | Props | Propósito |
|-----------|-------|-----------|
| `HomeOverview` | — | Resumen global del Home Page: KPIs, "Records by module", status y cards por módulo |

### 4.8 Convenciones de Componentes

- Todos los componentes usan **Tailwind CSS** para estilos
- Todos los iconos usan **lucide-react** (no `<i data-lucide>`)
- Los componentes aceptan `ReactNode` para iconos → composición flexible
- Interfaces exportadas con sufijo `Props` (ej. `MenuItemProps`)
- `index.ts` con barrel exports en cada carpeta de componentes

---

## 5. Contextos

### 5.1 AuthContext

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `user` | `User \| null` | Usuario autenticado |
| `token` | `string \| null` | JWT almacenado |
| `isAuthenticated` | `boolean` | `!!user && !!token` |
| `isLoading` | `boolean` | Cargando estado inicial |
| `error` | `string \| null` | Error de autenticación |
| `login(credentials)` | `function` | Login + almacenar token |
| `logout()` | `function` | Logout + limpiar estado |
| `clearError()` | `function` | Limpiar error |

**Flujo al montar**:
1. Leer `auth_token` de `localStorage`
2. Si existe → `validateToken(savedToken)` → setear user
3. Si falla → limpiar `localStorage` y estado
4. `isLoading = false`

### 5.2 NavigationContext

**⚠️ No implementado**. El archivo `context/NavigationContext.tsx` está referenciado en la estructura de archivos pero no existe en el código.

---

## 6. Dependencias del Frontend

```json
{
  "react": "^19.2.7",
  "react-dom": "^19.2.7",
  "react-router-dom": "7.18.2",
  "lucide-react": "^1.28.0",     ← Iconos SVG component-based
  "tailwindcss": "^3.4.19",       ← Utility-first CSS
  "@vitejs/plugin-react": "^6.0.3",
  "vite": "^8.1.1",
  "typescript": "~6.0.2"
}
```

> **Nota**: Los componentes UI son custom con **Tailwind CSS** + **lucide-react** para iconos. No se usan librerías de UI como shadcn, Material UI o Ant Design.

> **Documentos relacionados**: [UI/UX Design System](02-ui-ux-design-system.md), [API Client](03-api-client.md), [Frontend Security](04-security.md)