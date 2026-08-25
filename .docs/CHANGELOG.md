# Changelog

Todas las modificaciones notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.4] - 2026-08-21

### Added
- **Frontend**: **grids de Seguridad con datos reales del backend RBAC** — `RbacRolesView` (`GET /roles/all`, permisos anidados expandibles por recurso + pill Active/Inactive) y `RbacPermissionsView` (`GET /permissions`), en `/app/records/roles` y `/app/records/permissions`; `records-route.tsx` intercepta ambos slugs antes del lookup de `RECORD_MODULES` y `AppLayout` resuelve sus breadcrumbs vía `STATIC_SECTIONS`. Claves i18n `rbac.*`.
- **Frontend**: **servicio RBAC** — `services/rbac.ts` (`getRoles`, `getRolesSummary`, `getRolePermissions`, `getPermissions`; tipos `RoleDto`/`RoleSummaryDto`/`PermissionDto`).
- **Frontend**: **columnas dinámicas genéricas** — `records/dynamicColumns.ts`: `buildDynamicTable<T>(rows, config)` deriva columnas desde las claves de los datos (estáticos o de endpoint) con headers auto-pretificados (`humanizeKey`: camelCase/guiones → Title Case) y control por columna vía overrides: `header` (renombrar), `hidden` (ocultar), `type` (forzar), `transform` (ej. array→count), `itemsOf` (label de cada item de un grupo), `render` (celda custom); además `statusOf`/`idOf`.
- **Frontend**: **tipo de columna `list`** para grupos de items — `RecordColumn.type` acepta `'list'` y `RecordData` valores `string[]` (labels normalizados). Filtro (`RecordsFilter`) con operadores `Has` / `Doesn't have` y select de items únicos derivados de todas las filas; celdas por defecto en `RecordsTable` como badges (hasta 3 + "+n").

### Changed
- **Frontend**: `RecordsTable` respeta `col.render` (celda custom por columna, definido en `RecordColumn.render`) antes del render por tipo.
- **Frontend**: la columna Permissions del grid de Roles es `list` (`itemsOf: p => p.name`): el filtro muestra los permisos únicos (23 en los datos actuales) y filtra correctamente roles que los tienen o no.

### Fixed
- **Frontend**: bug "Permissions en 0" en el grid de Roles — `buildDynamicTable` sobrescribía `record.id` con el valor numérico crudo del DTO, rompiendo el lookup `roleById.get(row.original.id)` del render de permisos; ahora el loop salta las claves estructurales `id`/`status` y el id conserva el string derivado.

### Documentation
- **SDD**: actualizados `frontend/01-modules-pages.md` (vistas Security, §4.6.1 columnas dinámicas, §4.6.2 tipo `list`, estructura de archivos), `frontend/03-api-client.md` (§5 Servicio RBAC), `frontend/04-security.md` (§3.2 excepción roles/permissions).

---

## [0.4.3] - 2026-08-20

### Added
- **Backend**: **módulo RBAC con endpoints REST de lectura** — `modules/rbac/` (`RbacModule`, `RbacController`, `DefaultRbacService`, `PrismaRbacRepository`):
  - `GET /roles/all` — roles con sus permisos (solo `RolesGuard`).
  - `GET /roles` — resumen de roles con `permissionCount` (solo `RolesGuard`).
  - `GET /roles/:identifier` — rol por id o nombre con permisos (`@Roles(ADMIN)`).
  - `GET /permissions` — permisos agrupados por recurso (`@Roles(ADMIN)`).
  - DTOs `RoleDto`, `RoleSummaryDto`, `PermissionDto` con factories `fromEntity`.
- **Backend**: **helper genérico de paginación/filtros Prisma** — `src/shared/helpers/prisma-pagination.helper.ts` (`paginatePrisma`, `buildWhereFromFilters`, `resolvePagination`). Refactorizados `PrismaAiAnalysisRepository` y `PrismaSystemUserRepository` para usarlo (elimina la lógica duplicada de `skip`/`take`/`count`/`filter`). Soporta specs `string | number | boolean | enum` y **transformers** (función) — el filtro `role` de usuarios usa un transformer para mapear a `roles.some.role.name`.
- **Frontend**: **página Home real** — `src/pages/home/HomePage.tsx` (`HomeOverview` + `ViewHeader`) en la ruta `/app/home`; `IndexRedirect` y el index de `/app` ahora apuntan a `/app/home` (antes `/app/records`).

### Changed
- **Backend**: `SystemUserController` y `RbacController` **sin `@UseGuards(JwtGuard)` a nivel de controlador** — la protección queda por ruta con `@UseGuards(RolesGuard)` + `@Roles()`; `GET /users` y `GET /roles*`/`GET /permissions` (sin `@Roles`) dependen de `RolesGuard`. *(Nota: al quedar comentado `JwtGuard`, endpoints sin `@Roles()` quedan expuestos — ver agujeros en `backend/07-roadmap-todo.md` §3.2.)*
- **Backend CLI**: `user:create-admin` acepta **`--role <ADMIN|BASIC>`** (default `BASIC`, mayúsculas vía `CreateAdminCliDto.role`); descripciones y mensajes cambian de "administrator/admin" a "user".
- **Frontend**: **breadcrumbs corregidos** — `AppLayout` deriva los crumbs de la URL real (`Home` → `/app/home`; módulos con `/summary`; omite la primera vista por ser la default; `settings.title` cuando está en Settings); `Breadcrumbs` usa `ChevronLeft` (sin texto "Back"), `onNavigate` para salir de Settings, y "volver" navega al crumb previo. `SettingsView` pierde el `onBack` (breadcrumbs gestionan el retorno).

### Documentation
- **SDD**: actualizados `backend/01-modules.md` (módulo RBAC, CLI `--role`, helper de paginación), `backend/03-business-logic.md`, `backend/04-api-integrations.md` (endpoints RBAC + ANALYST→BASIC), `backend/05-security.md`, `backend/02-data-model.md`, `backend/07-roadmap-todo.md`, `frontend/01-modules-pages.md` (Home `/app/home` + breadcrumbs), `frontend/04-security.md`, `frontend/06-roadmap-todo.md`, `00-engram.md`, `01-project-overview.md`, `02-architecture.md`, `12-roadmap-adr.md`; **nuevo** `backend/08-pagination-filtering.md` — guía de uso del helper `paginatePrisma` (tipos de filtro, transformers, paginación, ejemplos).

---

## [0.4.2] - 2026-08-19

### Changed
- **Backend**: rol **ANALYST renombrado a BASIC** (`roles.constants.ts`): mismo set de permisos (RAG de lectura: `module:records`, `rag:read`, `rag:search`); descripción actualizada.
- **Backend**: usuarios nuevos entran con **rol BASIC por defecto** — `CreateSystemUserDto.role` y `RegisterAuthDto.role` opcionales; `DefaultSystemUserService.create()` usa `ROLES.BASIC` si no se provee.
- **Frontend**: mocks alineados (`ROLE_PERMISSIONS.BASIC`, usuarios DB `role: 'BASIC'`).
- **DB**: fila `Role` renombrada `ANALYST` → `BASIC` (preservando `roleId` y `SystemUserRole` existentes); seed re-ejecutado sincroniza permisos.

### Documentation
- **SDD**: actualizados `backend/07-roadmap-todo.md`, `frontend/03-api-client.md`, `frontend/06-roadmap-todo.md`, `12-roadmap-adr.md`.

---

## [0.4.1] - 2026-08-19

### Changed
- **Backend**: rol **ANALYST reducido a solo RAG de lectura** — `roles.constants.ts` pasa de 11 a 3 permisos: `rag:read` (listar documentos, GET), `rag:search` (buscar en el índice) y `module:records` (visibilidad del módulo Records View donde vive la búsqueda RAG). Se eliminan `system-user:read`, `ai-analysis:*`, `notification:*`, `connection:read`, `rag:upload-view` y `module:coaching`; descripción actualizada a "solo lectura".
- **Backend**: `roles.seeder.ts` ahora **sincroniza asignaciones**: tras el upsert elimina los `RolePermission` del rol que ya no están en la definición (antes solo hacía upsert y dejaba asignaciones obsoletas). Re-ejecutado: ANALYST quedó con 3 permisos.
- **Frontend**: mock `ROLE_PERMISSIONS.ANALYST` en `mocks/auth.ts` alineado al nuevo set (`module:records`, `rag:read`, `rag:search`).

### Documentation
- **SDD**: actualizados `backend/07-roadmap-todo.md`, `frontend/03-api-client.md`, `frontend/06-roadmap-todo.md`, `12-roadmap-adr.md`.

---

## [0.4.0] - 2026-08-19

### Added
- **Backend**: permisos de **visibilidad de módulos y RAG** en `permissions.constants.ts` / `roles.constants.ts` (seeder re-ejecutado):
  - Recurso `module` con `module:records`, `module:coaching`, `module:vacations`, `module:sales`, `module:licenses`, `module:permissions` → controlan qué módulos ve cada rol.
  - `rag:upload-view` (ver la sección de subida) y `rag:upload` (enviar documento).
  - ADMIN recibe todos; ANALYST solo `module:records`, `module:coaching` y `rag:upload-view` (ve la subida pero no puede subir).
- **Backend**: **permisos efectivos expuestos al frontend**:
  - `SystemUserDto.permissions: string[]` con `resolveEffectivePermissions()` (unión de permisos de los roles activos; `SUPERADMIN` → todos los permisos).
  - `AuthUserDto.permissions: string[]`; `GET /auth/me` y `POST /auth/login` devuelven los permisos del usuario.
  - Repository `SystemUser` incluye los permisos de sus roles (`role.permissions`) y `getAuthUserByEmail` los resuelve.
- **Frontend**: **RBAC aplicado a la navegación/menú**:
  - `RawUser.permissions`/`User.permissions` en `services/auth.ts` + helper `hasPermission(user, perm)`.
  - `useRecordsDashboard`: `getVisibleRecordModules()` filtra módulos por `module:<slug>`; `isMenuItemVisible()` filtra quick links/secciones por `StaticSidebarItem.permission` (sin `permission` → siempre visible); `viewOptions` filtran por `RecordViewOption.permission`.
  - `RecordsRoute` (guarda de ruta): valida `module:<slug>` y el `permission` extra de la vista (`rag:upload-view`); redirige al primer módulo visible o a `/app/reports`.
  - Config general del menú movida a `src/routes/menu.config.tsx` (`QUICK_LINKS`, `STATIC_SECTIONS` con `permission?`), fuera de `records/`.
  - Mocks: `ROLE_PERMISSIONS` por rol (ADMIN incluye `rag:upload`, ANALYST incluye `rag:upload-view`); `mockValidateToken` deriva permisos por rol.

### Changed
- **Frontend**: renombrado **notas → menú**:
  - `src/components/notes/` → `src/components/menu/` (`MenuPanel`, `MenuItem`, `MenuSearchBar`; tipos `MenuItemProps`, `MenuBadge`).
  - API del hook: `panelNotes`→`menuItems`, `panelTitle`→`menuTitle`, `notesCollapsed`→`menuCollapsed`; prop `menuPanel`; claves i18n `menu.*`.
  - `localStorage`: `modu_menu_collapsed` (con migración de `modu_notes_collapsed`).
- **Frontend**: router refactorizado — `src/router.tsx` eliminado; ahora `src/routes/`:
  - `index.tsx` — tabla de rutas declarativa.
  - `guards.tsx` — `LoadingScreen`, `ProtectedRoute`, `GuestRoute`, `IndexRedirect`.
  - `records-route.tsx` — `RecordsRoute` (lógica de permisos por módulo/vista).
  - `menu.config.tsx` — configuración del menú lateral.
- **Frontend**: `useRecordsDashboard` persiste solo `modu_menu_collapsed` (las claves `modu_active_view`/`modu_selected_card` quedan sin uso).

### Removed
- **Frontend**: `src/components/note-detail/` (`NoteDetailHeader` y dependencias) — componente no renderizado; claves i18n huérfanas eliminadas.

### Documentation
- **SDD**: actualizados `00-engram.md` (ADR-013), `backend/07-roadmap-todo.md`, `frontend/01-modules-pages.md`, `frontend/02-ui-ux-design-system.md`, `frontend/03-api-client.md`, `frontend/04-security.md`, `frontend/06-roadmap-todo.md`, `09-development-conventions.md`, `12-roadmap-adr.md`; nueva sección de deuda técnica estructural en el roadmap del frontend y entrada `CHANGELOG` 0.4.0.

---

## [0.3.0] - 2026-08-19

### Added
- **Backend**: **RBAC granular en base de datos** — nuevo modelo de permisos (ADR-013):
  - Modelos Prisma en `prisma/models/platform/rbac.prisma`: `Role`, `Resource`, `Permission`, `RolePermission` (N:N) y `SystemUserRole` (N:N `SystemUser` ↔ `Role`). `SystemUser.role` (enum `UserRole`) eliminado.
  - Migración `20260819144300_init` (única migración actual) — crea las tablas RBAC.
  - Roles sembrados con `prisma/seeders/roles.seeder.ts` (idempotente, upserts) desde `apps/api/src/modules/auth/constants/roles.constants.ts` (`ROLE_DEFINITIONS`) y `permissions.constants.ts` (`RESOURCES`, `PERMISSIONS`). Roles: `SUPERADMIN` (bypass total), `ADMIN` (todos los permisos), `ANALYST` (operativo, reemplaza `STAFF`).
  - Decoradores `@Roles(...)` y `@Permissions(...)` con constantes tipadas (`ROLES`, `PERMISSIONS`, `ResourceName`, `PermissionName`).
  - `RolesGuard` reescrito: consulta roles y permisos del usuario en BD (`PrismaService`), **bypass para `SUPERADMIN`**, valida roles **o** permisos (todos requeridos); 403 con mensajes descriptivos.
  - `JwtStrategy.validate()` y payload JWT ahora usan `roles: string[]` (`{ id, roles }`).
  - `SystemUserDto` → `roles: string[]` (antes `role`); `AuthUserDto.roles: string[]`; `getAuthUserByEmail` devuelve nombres de rol.
  - `SystemUserService.create`/`createAdmin`/`update` resuelven el rol por nombre (`Role.name`) desde BD; filtro `role` del listado mapea a `roles: { some: { role: { name } } }`.
  - `NotificationService.notifyByRoles` ahora filtra por nombres de rol RBAC (`roles.some.role.name.in`).
- **Backend**: endpoint `POST /auth/refresh` (body `{ refreshToken }`) — emite nuevos access (`1h`) + refresh (`2d`) tokens; 401 si el refresh es inválido/expirado o el usuario no existe/inactivo.
- **Frontend**: `RawUser.roles: string[]` y `User.roles?: string[]` en `services/auth.ts` — `role` se deriva de `roles[0]` (`mapRawUser`); mocks actualizados a rol `ANALYST` (reemplaza `STAFF`).

### Changed
- **Backend**: `RegisterAuthDto.role` es el **nombre del rol RBAC** existente en la tabla `Role`; controladores usan constantes `ROLES.ADMIN`/`ROLES.ANALYST` en vez de literales `'ADMIN'`/`'STAFF'` (`system-logs`, `auth-log`, `ai-analysis`).
- **Backend**: `SystemLogsService.findAll` selecciona `roles` (N:N) en lugar de `role`.
- **Backend**: CLI `user:create-admin` — `employeeId` ahora **opcional** (`@IsOptional()` en `CreateAdminCliDto`); `DefaultSystemUserService.createAdmin` conecta el empleado solo si `employeeId` está presente (coherente con `CreateSystemUserDto`).

### Documentation
- **SDD**: actualizados `00-engram.md` (ADR-013), `01-project-overview.md`, `02-architecture.md`, `backend/01-modules.md`, `backend/02-data-model.md`, `backend/03-business-logic.md`, `backend/04-api-integrations.md`, `backend/05-security.md`, `backend/07-roadmap-todo.md`, `frontend/01-modules-pages.md`, `frontend/03-api-client.md`, `frontend/06-roadmap-todo.md`, `10-deployment-infrastructure.md`, `12-roadmap-adr.md`.

---

## [0.2.12] - 2026-08-18

### Changed
- **Backend**: `prisma/schema.prisma` → **schema compuesto multi-file** en `prisma/models/` (Prisma folder schema, GA). El schema queda organizado por dominio:
  - `_base.prisma` — `generator`, `datasource` y convenciones.
  - `enums.prisma` — todos los enums agrupados por dominio (Acceso/IA, Catálogos HR, Turnover, Conexiones, Sync).
  - `platform/` — `SystemUser`, `AuthLog`, `SystemLog`, `AiAnalysis`, `Notification`.
  - `connections/` — `Connection`.
  - `hr/` — `catalogs.prisma` (Organization, Department, Job, Lob, Modality, WorkLocation, Platform), `employee.prisma` (Employee), `employee-detail.prisma` (EmployeeDetail, Assignment), `employment-history.prisma` (EmploymentHistory, IdentityChangeLog), `exits.prisma` (ExitReason, EmployeeExit, ExitInterview, ExitActionItem, DataQualityCheck).
  - `sync/` — `sync-jobs.prisma` (SyncJob, PlatformSyncLog), `staging.prisma` (StagingEmployee, StagingExit, StagingGenesysUser).
  - `rag/` — `rag.prisma` (Document, DocumentChunk, EmbeddingModel, IngestionRun).
  - `prisma.config.ts` apunta a `schema: 'prisma/models'`. El modelo de datos es **idéntico** (sin cambios de tablas/columnas): `prisma validate`, `prisma generate` OK y `prisma migrate status` sigue "Database schema is up to date!".

### Documentation
- **SDD**: actualizado `backend/02-data-model.md` (sección 4 — convenciones del schema multi-file).

---

## [0.2.11] - 2026-08-18

### Added
- **Backend**: nuevo modelo `Connection` en `prisma/schema.prisma` — conexiones a **APIs externas** (Odoo, Genesys, Kimai…) o **bases de datos externas**. Campos específicos por tipo (`apiBaseUrl`/`apiAuthType` para API; `databaseType`/`host`/`port`/`databaseName`/`username` para DATABASE), secretos **cifrados en capa de aplicación** (`credentialsEncrypted` Text, AES-256-GCM app-layer, con `encryptionKeyVersion` para rotación), `extraConfig` Json, `lastTestedAt`/`lastConnectedAt`, relación opcional a `SystemUser.createdById`, soft-delete y timestamps.
- **Backend**: migración `20260818141955_add_connections_and_external_sync` — crea `Connection`, el resto de tablas del dominio HR/sync (`Platform`, `EmployeeDetail`, `Assignment`, `EmploymentHistory`, `IdentityChangeLog`, `ExitReason`, `EmployeeExit`, `ExitInterview`, `ExitActionItem`, `DataQualityCheck`, `SyncJob`, `PlatformSyncLog`, `StagingEmployee`, `StagingExit`, `StagingGenesysUser`) y los enums asociados (`ReconciliationStatus`, `AssignmentType`, `ExitReasonCategory`, `ExitType`, `SeparationOwnership`, `InterviewStatus`, `ActionItemStatus`, `QualityCheckStatus`, `ConnectionType`, `ConnectionStatus`, `ApiAuthType`, `DatabaseType`, `SyncSource`, `SyncType`, `SyncTrigger`, `SyncStatus`, `StagingEmployeeStatus`, `StagingExitStatus`, `StagingGenesysStatus`). Elimina las tablas huérfanas `Lesson`/`LessonContent` (vacías, heredadas de una rama previa del merge). Excluye las alteraciones de las tablas vectoriales RAG (convención: no gestionadas por migraciones).

### Changed
- **Backend**: `prisma/schema.prisma` **reorganizado** en 7 secciones (1 PLATAFORMA, 2 CONEXIONES, 3 CATÁLOGOS HR, 4 EMPLEADOS E IDENTIDAD, 5 TURNOVER, 6 INGESTION/STAGING, 7 RAG) con enums agrupados por dominio al inicio.
- **Backend**: optimización de tablas — `source` pasa a enum `SyncSource` en `EmployeeDetail`, `IdentityChangeLog`, `StagingEmployee` y `StagingExit`; eliminados índices redundantes `SystemUser.email_idx` y `SystemUser.employeeId_idx` (ya cubiertos por UNIQUE); `SystemLog` unifica `entityName_idx`+`entityId_idx` en un único índice compuesto `entityName_entityId_idx`.

### Documentation
- **SDD**: actualizado `backend/02-data-model.md` — nueva entidad 2.8 `Connection` (con nota sobre cifrado app-layer), enums nuevos en la sección 3, y actualizada la nota de migración de la entidad 2.7.

---

## [0.2.10] - 2026-08-18

### Added
- **Backend**: migración `20260818140949_link_system_user_to_employee` — crea las tablas catálogo del dominio HR (`Organization`, `Department`, `Job`, `Lob`, `Modality`, `WorkLocation`) y la tabla `Employee` (con `employeeId` único como ID legado/externo, enums `RecordStatus` y `EmployeeStatus`).

### Changed
- **Backend**: `SystemUser.personalId` → `SystemUser.employeeId` en `prisma/schema.prisma` — ahora es `String? @unique @db.VarChar(50)` y se relaciona con `Employee.employeeId` (relación opcional, `ON DELETE SET NULL`). Se añadió la relación inversa `Employee.systemUsers`. El campo pasa a nullable: los usuarios existentes quedan sin `employeeId` (no referencian ningún empleado).
- **Backend**: API y CLI renombrados de `personalId` a `employeeId` — `CreateSystemUserDto`, `RegisterAuthDto`, `SystemUserDto`, `CreateAdminCliDto`, `DefaultSystemUserService` (`normalizePersonalId` → `normalizeEmployeeId`), `DefaultAuthService.register`, filtro de `PrismaSystemUserRepository` y flag CLI `--personal-id` → `--employee-id`.
- **Frontend**: `RawUser` en `services/auth.ts` — `personalId` → `employeeId`.
- **Frontend**: `RagSearchView` — el contenedor de la búsqueda RAG pasa de `max-w-5xl` (1024px) a `max-w-7xl` (1280px) para aprovechar mejor el ancho del área principal y reducir los espacios vacíos a los lados. *(2026-08-18: `apps/frontend/src/components/records/RagSearchView.tsx`.)*

### Documentation
- **SDD**: actualizados `00-engram.md` (R5), `backend/02-data-model.md` (SystemUser con `employeeId`, nueva entidad 2.7 Employee, enums `RecordStatus`/`EmployeeStatus`), `backend/03-business-logic.md`, `backend/04-api-integrations.md`, `backend/01-modules.md`, `10-deployment-infrastructure.md`, `frontend/03-api-client.md`.

---

## [0.2.9] - 2026-08-17

### Added
- **Backend**: **tablas vectoriales (RAG)** restauradas en la base `modu` desde un `pg_dump` externo (generado con PostgreSQL 17) y adaptado a **PostgreSQL 14**: `documents` (191), `document_chunks` (6,543 chunks con embeddings `vector(1024)`), `embedding_models`, `ingestion_runs`. Extensiones `vector` (pgvector 0.7.4) y `pg_trgm` activadas. Índices restaurados: HNSW `vector_cosine_ops` sobre `embedding`, `gin` sobre `metadata`, `gin` sobre `search_vector`, trigram sobre `title`/`original_filename`.
- **Backend**: **seeder vectorial** `prisma/seeders/vector.seeder.ts` — restaura el dump de forma **idempotente** (omite si `document_chunks` ya tiene datos), con verificación de tablas vía `to_regclass` y extensiones autocreadas. Comandos: `pnpm run db:seed:vector` o integrado en `pnpm run db:seed`.
- **Backend**: `prisma/dump/rai_vector_pg14.sql` — versión sanitizada del dump original (`rai_vector_20260814.sql`), eliminando `SET transaction_timeout` (PG17-only), meta-comandos `\restrict`/`\unrestrict` y `OWNER TO sophie`.
- **Backend**: **modelos Prisma de las tablas vectoriales** en `prisma/schema.prisma` — `Document`, `DocumentChunk`, `EmbeddingModel`, `IngestionRun` con `@map` a `snake_case`; columnas `embedding` (`vector`) y `search_vector` (`tsvector`) como `Unsupported(...)` (similitud vía `$queryRaw`). `prisma validate` + `prisma generate` OK; verificado contra `modu` (191 docs, 6,543 chunks, 1 modelo, 191 runs).
- **Backend**: **módulo `rag`** — `apps/api/src/modules/rag/`: `RagModule`, `RagController` y búsqueda **sin IA**:
  - `POST /rag/search` (JWT) — búsqueda semántica **directa por vector**: recibe el `embedding` ya calculado y ejecuta `ORDER BY embedding <=> $vector::vector LIMIT N` vía `$queryRaw`, con filtros opcionales (`department`, `project`, `sensitivity`) y umbral `minScore`.
  - `GET /rag/text-search?q=...` (JWT) — búsqueda full-text **sin modelo de embedding**: `websearch_to_tsquery` sobre `search_vector` con ranking `ts_rank_cd` + trigram `similarity()`.
  - `GET /rag/documents` (JWT) — listado paginado de documentos con `chunkCount` (JOIN agregado sobre `document_chunks`).
  - `GET /rag/chunks/:id/context?before&after` (JWT) — contexto de un chunk: devuelve el chunk objetivo con los vecinos del mismo documento (contenido completo previo/posterior por `chunk_index`), para lectura de contexto alrededor de un resultado. 404 si no existe.
  - Servicio único `PostgresRagService` (token `RagService`, interfaz `RagService`) con `searchVector()`, `searchText()`, `listDocuments()` y `getChunkContext()`; DTOs de query/resultado.
  - Registrado en `AppModule`.
- **Frontend**: estado `isSubmitting` separado de `isLoading` en `AuthContext` — el login en progreso ya no desmonta la página (el `GuestRoute` mostraba un `LoadingScreen` y remontaba el formulario, lo que se percibía como "refresh" de página).
- **Frontend**: **vista RAG en Records View** — `src/components/records/RagSearchView.tsx` integrada en `RecordsView` (módulo `records` del menú colapsable): buscador de texto full-text (con filtro por departamento), resultados con ranking + similitud trigram, y grilla de documentos del índice con contadores de chunks. Cliente API `src/services/rag.ts` (`ragTextSearch`, `ragListDocuments`).
- **Frontend**: **expand de resultados RAG** en `RagSearchView` — cada resultado tiene Expandir/Colapsar (contenido completo del chunk en scroll con términos de la query resaltados) y "Leer todo el contexto" (carga `GET /rag/chunks/:id/context` y muestra el contenido previo/posterior del mismo documento). Cliente `ragChunkContext` en `services/rag.ts`.
- **Frontend**: el módulo `records` ya no muestra las vistas genéricas Summary/Table/Archived; usa `RAG_VIEW_OPTIONS` con solo **Summary** (→ búsqueda RAG) y **Subir documento** (→ `UploadDocumentView`, `kind: 'upload'` añadido a `RecordViewKind`). `UploadDocumentView` es solo UI (drag & drop + botón); el endpoint de ingesta aún no existe en el backend.

### Changed
- **Frontend**: las vistas RAG (`RagSearchView`, `UploadDocumentView`) y los labels/descripciones de `RAG_VIEW_OPTIONS` ahora usan **i18n** (`useAppTranslation` con claves `rag.*`; default `en`, cambian con el selector de idioma en Settings). `useAppTranslation` ahora pasa variables de interpolación (`{{ms}}`, `{{query}}`, `{{page}}`, `{{name}}`, `{{id}}`) a `i18next`. `UploadDocumentView` y la vista Summary quedan en **inglés por defecto**.
- **Backend**: `prisma/prisma.service.ts` y `prisma/seeders/main.seeder.ts` usan `@prisma/adapter-pg` (`PrismaPg`) en lugar de `@prisma/adapter-mariadb` (`PrismaMariaDb`) — ver [CHANGELOG 0.2.8](#028---2026-08-14). Dependencias: eliminadas `@prisma/adapter-mariadb` y `mariadb`; añadidas `@prisma/adapter-pg`, `pg`, `@types/pg`.
- **Backend**: `prisma/schema.prisma` — añadido bloque `generator client { provider = "prisma-client-js" }` (antes el cliente se generaba con `activeProvider = "mysql"`, incompatible con el datasource `postgresql`).

### Fixed
- **Frontend**: login con email inexistente — el error del backend (`System user with email admin@test.com not found`) ahora se muestra en el banner de login (`role="alert"`) y la página deja de "refrescarse" (causado por `GuestRoute` montando `LoadingScreen` durante el submit, ver `apps/frontend/src/router.tsx`).

### Documentation
- **SDD**: actualizados `sdd/12-roadmap-adr.md`, `sdd/00-engram.md`, `sdd/backend/07-roadmap-todo.md`, `sdd/backend/02-data-model.md`, `sdd/backend/01-modules.md`, `sdd/backend/04-api-integrations.md`, `sdd/frontend/06-roadmap-todo.md`, `sdd/frontend/01-modules-pages.md`, `sdd/frontend/03-api-client.md` — cimentación Prisma marcada completada, dominio RAG/vectorial documentado (endpoints `POST /rag/search`, `GET /rag/text-search`, `GET /rag/documents`, servicio único `PostgresRagService`) y frontend (vista RAG en Records View: `RagSearchView`/`UploadDocumentView`, cliente `rag.ts`).

---

## [0.2.8] - 2026-08-14

### Added
- **Backend**: **PostgreSQL 14 + pgvector** como base de datos (reemplaza MySQL 8). Extensión `vector` instalada (compilada desde fuente, 0.7.4) para búsqueda de embeddings de IA.
- **Backend**: migración Prisma a Postgres — `prisma/schema.prisma` con `provider = "postgresql"` y migración inicial `20260814141939_init` aplicada a la base `modu`.

### Changed
- **Backend**: variables de entorno renombradas a un prefijo genérico `DATABASE_*` (`DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `DATABASE_HOST`, `DATABASE_PORT`) en `.env` y `.env.example` — ya no se usa `MYSQL_*`. `DATABASE_URL` apunta a `postgresql://areyes:root@localhost:5432/modu`.
- **Documentación SDD**: ADR-005 (MySQL) marcado como reemplazado por el nuevo **ADR-011 (PostgreSQL 14 + pgvector)** en `sdd/12-roadmap-adr.md`; Engram actualizado (ADR-003, ADR-008, S1, flujo de datos), `01-project-overview.md`, `02-architecture.md`, `10-deployment-infrastructure.md` y `backend/06-testing-strategy.md`.

### Removed
- **Documentación**: eliminados `.docs/01-architecture.md` → `09-appendices.md` (duplicados y desactualizados — describían MySQL 8 — frente a `.docs/sdd/`) y `.docs/lessons.md` (catálogo de Poker Academy). `.docs/README.md` reescrito como índice de la documentación SDD vigente.
- **Backend**: contenido de datos (catálogo de 80 lecciones) de `prisma/seeders/lessons.seeder.ts` — se conserva la **lógica de seed** (`seedLessons`) para reutilizarla en el futuro cuando exista un dataset. La llamada en `main.seeder.ts` sigue comentada.

### Documentation
- **SDD**: análisis senior completo del proyecto (backend + frontend) frente al objetivo de "manager de reportería multi-sistema". Nuevos documentos de plan:
  - `sdd/backend/07-roadmap-todo.md` — fases P0-P3: cimentación (adaptador Postgres, generator Prisma, build, Docker), seguridad/RBAC (permisos granulares, refresh token, LDAP), dominio de conexiones externas, sync/colas/caché, reportes y calidad.
  - `sdd/frontend/06-roadmap-todo.md` — fases P0-P3: limpieza de código demo/muerto, routing por URL, menú dinámico desde backend, páginas de reportes/conexiones/admin, integración real con el backend y UX/i18n.
  - Enlazados en `00-engram.md` y en el índice de `.docs/README.md`.

---

## [0.2.7] - 2026-08-13

### Added
- **Frontend**: sistema de **tema claro/oscuro** real. `ThemeContext` (`src/context/ThemeContext.tsx`) con temas `light | dark | system`, persistencia en `localStorage` (`modu_theme`) y detección de `prefers-color-scheme` para `system`. Se aplica `data-theme` en `<html>`.
- **Frontend**: **design tokens por tema** en `index.css` (`--bg-app`, `--bg-main`, `--bg-surface`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border`, `--border-active`, overlays de hover/active, scrollbar, `color-scheme`). Todos los componentes del dashboard migrados de hex hardcodeado a variables CSS.
- **Frontend**: sistema de **idiomas (i18n)** con `i18next` + `react-i18next` + `i18next-browser-languagedetector` (`src/i18n/`). Idiomas iniciales: **English (base)** y **Español**, persistencia en `localStorage` (`modu_language`). Helper `useAppTranslation` con opción `noTranslate` para excluir textos específicos de la traducción.
- **Frontend**: opciones de **Theme** (Light/Dark/System) y **Language** (English/Español) funcionales en `SettingsView`, con check de acento `#f2a93b` sobre la opción activa.

### Changed
- **Frontend**: labels, placeholders, títulos de sección y textos estáticos de sidebar, records, home y settings traducidos con `t()`. Los **datos** (títulos de registros, valores de columnas, nombres de módulos) no se traducen.
- **Frontend**: `SettingsView` ahora deriva secciones/opciones/sub-opciones de claves de traducción (`settings.*`) en lugar de texto hardcodeado.
- **Frontend**: `RecordsFilter` — constantes `darkInput`/`darkLabel` renombradas a `fieldInput`/`fieldLabel` y eliminado `[color-scheme:dark]` forzado (ahora lo define el tema).

---

## [0.2.6] - 2026-08-13

### Added
- **Frontend**: responsive en todo el dashboard. `DashboardLayout` ahora usa **drawers off-canvas** en móvil: top bar con botones "Menú" y "Notas" (`lg:hidden`), sidebar y notes panel deslizantes con backdrop, y layout de 3 columnas estático en `lg+`.
- **Frontend**: clase utilitaria `.scrollbar-none` en `index.css` para ocultar scrollbars en filas con overflow.

### Changed
- **Frontend**: `RecordsTable` — header de búsqueda `flex-col md:flex-row`, paginación `flex-col lg:flex-row` con `flex-wrap`, paddings `px-4 lg:px-6`.
- **Frontend**: `RecordsFilter` — dropdown `w-80` → `w-[80vw] max-w-80` (no se sale del viewport móvil).
- **Frontend**: `NoteDetailHeader` — `px-4 lg:px-8`, fila de breadcrumbs con `overflow-x-auto` y `scrollbar-none`.
- **Frontend**: grids de KPI en `RecordsSummary` y `HomeOverview` → `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` (1 col en móvil), paddings `px-4 lg:px-6`.
- **Frontend**: `SidebarLinkItem` y `UserProfile` — textos con `truncate` + `min-w-0`.

---

## [0.2.5] - 2026-08-13

### Added
- **Frontend**: hover animado con **scale-up** en las cards de gráficos (`KpiCard`, `CategoryBarList`, `StatusOverview`) y en las cards por módulo de `HomeOverview` (`transition-all duration-300 hover:scale-[1.02]` + fondo/borde más claros).
- **Frontend**: scrollbar personalizado en `index.css` (thumb con gradiente, borde flotante, track `#16171B`, active/drag en color acento `#f2a93b`; soporte Firefox `scrollbar-width: thin` + `scrollbar-color`).
- **Frontend**: smooth scroll en contenedores `overflow-auto/y/x` (`scroll-behavior: smooth` + `overscroll-behavior: contain`).

### Changed
- **Frontend**: padding inferior de `HomeOverview` y `RecordsSummary` aumentado a `pb-24` para que las cards finales no queden pegadas al borde y permitan mejor scroll.
- **Frontend**: `UserProfile` muestra un **icono genérico `UserRound`** cuando no hay `avatarUrl` (en lugar de la foto de Unsplash); el subtexto muestra `firstName · email` del payload.
- **Frontend**: prop `email` → `subtitle` en `UserProfileProps`/`Sidebar`/`Dashboard`.
- **Frontend**: `vite.config.ts` corregido (`ports: [5173]` → `port: 5173` + `strictPort`, `host: true`, `hmr.overlay`, `watch.usePolling`) para HMR en tiempo real.

---

## [0.2.4] - 2026-08-13

### Added
- **Frontend**: vista `HomeOverview` para el **Home Page** (Quick link, sin módulo activo): KPIs globales (Total/Active/Pending/Archived sumando todos los módulos), gráfico "Records by module", distribución de estados con actividad reciente, y tarjetas informativas por módulo (totales + barra + último registro).
- **Frontend**: `ALL_MODULE_DATA` y `getAllModuleRecords()` en `records/data.ts` para consolidar los datos de todos los módulos en el resumen global.

### Changed
- **Frontend**: al seleccionar una vista general (Home Page) `Dashboard` renderiza `HomeOverview` con header del panel en lugar del contenedor vacío; se quitaron los imports sin uso de `FloatingToolbar`/`FloatingActionButton`.

---

## [0.2.3] - 2026-08-13

### Added
- **Frontend**: columnas configurables por módulo (`RecordColumn[]`) en `records/records.config.tsx` — cada módulo define sus propias columnas (Records View: category/owner; Coaching Forms: coach/sessions; Vacations: leaveType/days; Sales: stage/amount; Licenses: vendor/seats; Permissions: scope/role).
- **Frontend**: dataset propio por módulo (`RECORDS_BY_MODULE` / `getRecordsForModule`) en `records/data.ts`.
- **Frontend**: `RecordsTable` construye sus columnas y filtros dinámicamente a partir de `RecordColumn[]` (tipos text/number/date/select, badge de status, números formateados).
- **Frontend**: `RecordsSummary` agrupa el gráfico de barras por la columna marcada `chartGroup` del módulo (con fallback a la primera columna text/select), adaptándose a cada dataset.

### Changed
- **Frontend**: `RecordData` ahora es un tipo flexible (`Record<string, string | number>` con `id` y `status` requeridos) en lugar de un shape fijo.
- **Frontend**: `RecordsView` pasa `data` + `columns` del módulo a `RecordsSummary` y `RecordsTable`.

---

## [0.2.2] - 2026-08-13

### Added
- **Frontend**: dominio `records/` con configuración de módulos y menús (`records.config.tsx`), datos mock y metadata de estados (`data.ts`), y tipos compartidos (`types.ts`).
- **Frontend**: hook `useRecordsDashboard` que encapsula todo el estado del dashboard (módulo activo, vista seleccionada, colapso del panel, persistencia en `localStorage`, derivación de secciones del sidebar y notas del panel).
- **Frontend**: primitivas de gráficos reutilizables en `components/charts/` (`KpiCard`, `CategoryBarList`, `StatusOverview`).
- **Frontend**: componente `RecordsView` que enruta la vista principal según `view.kind` (summary / table / archived).

### Changed
- **Frontend**: `Dashboard.tsx` ahora es una composición fina que consume el hook `useRecordsDashboard`; toda la lógica de menús y gráficos se movió a `records/` y `components/charts/`.
- **Frontend**: `RecordsSummary` compone las primitivas de `components/charts/` en lugar de implementar los gráficos inline.
- **Frontend**: `RecordData` y `sampleData` se movieron de `RecordsTable` al dominio `records/` (re-exportados desde `RecordsTable` para compatibilidad).

### Documentation
- **SDD**: actualizado `frontend/01-modules-pages.md` con el dominio `records/`, las primitivas de charts y el rol de `RecordsView`.

---

## [0.2.1] - 2026-08-13

### Added
- **Frontend**: nueva vista `RecordsSummary` con gráficos y KPIs (total, estado, categorías, actividad reciente) usando barras CSS nativas (sin dependencias nuevas).

### Changed
- **Frontend**: el panel de notas de cada módulo ahora muestra **opciones de vista** genéricas — **Summary** (gráficos), **Table Grid** (tabla paginada) y **Archived** (tabla filtrada a `status = Archived`) — en lugar del menú relacionado por módulo (All Records, Drafts, Requests, etc.). `RecordsTable` acepta props `data` y `statusFilter`; `sampleData` es exportado para reutilizarlo en resúmenes.
- **Documentación SDD**: actualizado `frontend/01-modules-pages.md`.

### Removed
- **Frontend**: menús relacionados específicos por módulo (HR Reports, Payroll, Drafts, Pending Review, Balances, Pipeline, etc.) del panel de notas.

---

## [0.2.0] - 2026-08-13

### Added
- **Frontend**: fix de login contra el backend real (DB). Mapeo del payload `{ token, refreshToken, Expiration, User }` a `AuthResponse` normalizado con `mapRawUser()`.
- **Frontend**: extracción de mensajes de error HTTP priorizando `body.message` sobre `body.error` (banner de login muestra "Email or password is incorrect").
- **Frontend**: menú desplegable de módulos en el sidebar (`SidebarDropdown`): Coaching Forms, Vacations, Sales, Licenses, Permissions. "Records View" como quick link.
- **Frontend**: menús relacionados por módulo en el panel de notas (All Records, HR Reports…; Roles, Users, Groups…), sustituyendo las notas demo.
- **Frontend**: panel de notas colapsable (w-80 ↔ rail w-12) con animación, auto-ocultado por prop (`autoHideSeconds`, mín. 3s, solo primera vez), estado controlado y apertura automática al seleccionar módulo.
- **Frontend**: iconos de módulos minimalistas planos monocromáticos.
- **Frontend**: persistencia en `localStorage` de vista activa, opción seleccionada y estado del panel (`modu_active_view`, `modu_selected_card`, `modu_notes_collapsed`).

### Changed
- **Frontend**: `User` normalizado (`name`, `firstName`, `lastName`, `role`, `isActive`, `avatarUrl`) reemplazando `nombre`/`rol`/`escuela`. Alineados mocks y `Dashboard2`.
- **Frontend**: `Dashboard` orientado a módulos y table grids (vista Records por defecto) en lugar de note-taking demo; eliminada la nota "Fusion energy".
- **Frontend**: `public/dashboard.html` renombrado a `public/demo-dashboard.html` (evita que `/dashboard` sirva el archivo estático al refrescar).
- **Documentación SDD**: actualizados `frontend/01-modules-pages.md`, `frontend/02-ui-ux-design-system.md`, `frontend/03-api-client.md`, `frontend/05-testing-strategy.md`.

### Removed
- **Frontend**: notas demo del dashboard y dependencia de `public/dashboard.html` para el enrutado.

---

## [0.1.0] - 2025-01-01

### Added
- Proyecto inicial NestJS Backend Starter
- Autenticación JWT con Passport (access + refresh tokens)
- Gestión de usuarios del sistema (CRUD + roles)
- Registro de eventos de autenticación (AuthLog)
- Auditoría de cambios en entidades (SystemLog)
- Almacenamiento de archivos en Azure Blob Storage
- Extracción de texto de documentos con Azure Document Intelligence
- Análisis con IA (OpenAI) con trazabilidad completa
- Sistema de notificaciones internas
- CLI para tareas administrativas (`user:create-admin`)
- Docker Compose para entornos dev y prod
- Dockerfile multi-stage optimizado
- CI/CD con GitHub Actions (build multi-arch)
- Swagger/OpenAPI para documentación de API
- Tests unitarios y E2E con Jest
- Documentación SDD completa en `/.docs/`

### Changed
- Proyecto original limpiado: eliminados todos los módulos de dominio universitario
- Simplificado módulo SystemUser (sin perfiles ni universidad)
- Schema Prisma reducido a 6 modelos genéricos

### Removed
- 16 módulos de dominio específico
- 14 migraciones antiguas de Prisma
- 8 dependencias no utilizadas
- Vistas Handlebars y plantillas PDF
- Documentación del proyecto original