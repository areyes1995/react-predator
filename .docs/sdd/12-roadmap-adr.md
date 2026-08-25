# Roadmap & ADR — Modu

> **Propósito**: Documentar las decisiones arquitectónicas (ADRs) formales y la hoja de ruta del proyecto.

---

## 1. Architecture Decision Records (ADRs)

Los ADRs son inmutables una vez aprobados. Si una decisión cambia, se crea un nuevo ADR que reemplaza al anterior.

### ADR-001: Monorepo con pnpm Workspaces

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ Aceptado |
| **Contexto** | El sistema tiene backend, frontend y paquetes compartidos. Necesitamos compartir tipos, DTOs y utilidades entre proyectos |
| **Decisión** | Usar pnpm workspaces con estructura monorepo |
| **Consecuencias** | + Tipos compartidos sin publicar paquetes. + Single version de dependencias. - Mayor complejidad de build |
| **Alternativas** | Multi-repo (descartado por inconsistencia de tipos), npm/yarn workspaces (descartado por performance de pnpm) |

### ADR-002: NestJS como Framework Backend

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ Aceptado |
| **Contexto** | Necesitamos un framework con modularidad, DI, guards y ecosistema maduro |
| **Decisión** | NestJS 11 con TypeScript |
| **Consecuencias** | + Arquitectura modular nativa. + Swagger automático. - Curva de aprendizaje para equipo no familiarizado |
| **Alternativas** | Express (sin estructura), Fastify (menos ecosistema Nest) |

### ADR-003: Patrón Hexagonal

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ Aceptado |
| **Contexto** | El negocio no debe depender de infraestructura (bases de datos, servicios cloud) |
| **Decisión** | Separar puertos (interfaces) de adaptadores (implementaciones). Services y Repositories tienen interfaces en `interfaces/` |
| **Consecuencias** | + Testable. + Intercambiable. + Separación de concerns. - Más archivos por módulo |
| **Alternativas** | MVC tradicional (acoplado), Clean Architecture (sobreingeniería para este alcance) |

### ADR-004: JWT + Cookies httpOnly

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ Aceptado |
| **Contexto** | Necesitamos autenticación stateless para SPA, segura contra XSS |
| **Decisión** | JWT en cookie httpOnly + refresh token. Token en header como fallback |
| **Consecuencias** | + Seguro contra XSS. + Stateless. - No podemos invalidar tokens individuales (esperar expiración) |
| **Nota** | ❌ **Problema detectado**: El frontend guarda el token en `localStorage` además de la cookie. Esto rompe la seguridad de httpOnly. Ver [Frontend Security](frontend/04-security.md) |

### ADR-005: MySQL 8 como Base de Datos

| Campo | Valor |
|-------|-------|
| **Estado** | 🔁 **Reemplazado** por ADR-011 |
| **Contexto** | Requisito del negocio: compatibilidad con sistemas legacy educativos basados en MySQL |
| **Decisión** | MySQL 8 con Prisma ORM |
| **Consecuencias** | + Compatibilidad. - Menos features que PostgreSQL (arrays, JSONB nativo) |
| **Alternativas** | PostgreSQL (más features, pero no compatible con el ecosistema legacy) |

### ADR-006: React + Vite (SPA)

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ Aceptado |
| **Contexto** | Necesitamos una interfaz moderna sin requerir SSR ni SEO |
| **Decisión** | React 19 + Vite 8, SPA con React Router v7 |
| **Consecuencias** | + Simplicidad de deploy. + Build rápido. - Sin SEO nativo |
| **Alternativas** | Next.js (sobreingeniería si no se necesita SSR), Remix (similar) |

### ADR-007: Azure como Proveedor Cloud

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ Aceptado |
| **Contexto** | Contrato del cliente/usuario final |
| **Decisión** | Azure Blob Storage, Azure Document Intelligence, OpenAI via Azure |
| **Consecuencias** | + Alineado con cliente. - Dependencia de Azure SDK |
| **Nota** | Storage está abstraído tras `FileStorageService` → intercambiable. Document y AiAnalysis también tienen interfaces |

### ADR-011: PostgreSQL 14 + pgvector como Base de Datos

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ Aceptado |
| **Contexto** | ADR-005 (MySQL 8) era un requisito de compatibilidad con sistemas legacy, pero limita features. La IA (embeddings) necesita búsqueda vectorial en la base de datos |
| **Decisión** | Migrar a **PostgreSQL 14 + extensión pgvector** con Prisma ORM |
| **Consecuencias** | + Búsqueda vectorial (pgvector) para embeddings de IA sin servicio externo. + JSONB, arrays, full-text search nativos. - Migración del schema Prisma (provider → postgresql) y de los seeders |
| **Alternativas** | MySQL 8 + servicio vectorial externo (más infraestructura), MongoDB (sin JOINs relacionales) |
| **Nota** | Reemplaza al ADR-005. Credenciales y connection string definidos en `.env` con prefijo `DATABASE_*` (genérico, no `MYSQL_*`) |

### ADR-012: Base Vectorial (RAG) sobre pgvector

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ Aceptado |
| **Contexto** | Se dispone de un corpus de documentos (`documents`, `document_chunks`) con embeddings de 1024 dimensiones generados con `nvidia/nv-embedqa-e5-v5` (NVIDIA NIM, `input_type=passage`). El sistema necesita búsqueda semántica sobre este corpus |
| **Decisión** | Almacenar los embeddings en PostgreSQL 14 con **pgvector** (extensión `vector`, 0.7.4), con índice **HNSW `vector_cosine_ops`** para búsqueda por similitud coseno. Las tablas se restauran desde un dump externo vía seeder (`prisma/seeders/vector.seeder.ts`) y se modelan en `schema.prisma` (`Document`, `DocumentChunk`, `EmbeddingModel`, `IngestionRun`), pero **sin migraciones Prisma** — las consultas se hacen con SQL crudo (`$queryRaw`). La búsqueda **NO depende de IA**: la semántica opera directo sobre el vector almacenado (`<=>`) y la de texto usa full-text (`search_vector`) + trigram (`pg_trgm`) |
| **Consecuencias** | + Búsqueda semántica en la propia BD (sin servicio vectorial externo). + Búsqueda full-text y trigram sin modelo de embedding. + Datos RAG disponibles sin migraciones Prisma. - La columna `embedding` (tipo `vector`) se modela como `Unsupported(...)` (no hay CRUD tipado de Prisma para ella); las consultas de similitud son SQL crudo. - Para que la semántica acepte texto libre hace falta vectorizar la query con el **mismo modelo** (`nv-embedqa-e5-v5`, `input_type=query`), paso opcional |
| **Alternativas** | Servicio vectorial externo (Pinecone, Weaviate) — descartado por infraestructura adicional; OpenSearch — descartado por sobreingeniería |
| **Nota** | El dump original era de PostgreSQL 17; se mantiene una copia sanitizada para PostgreSQL 14 en `prisma/dump/rai_vector_pg14.sql`. Extensiones requeridas: `vector`, `pg_trgm` |

### ADR-013: RBAC granular en base de datos

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ Aceptado |
| **Contexto** | Los roles eran un enum (`UserRole` = ADMIN/STAFF/STUDENT) en el schema, imposible de extender sin migraciones, y los guards validaban literales hardcodeados. El producto requiere permisos granulares por recurso/acción y roles configurables |
| **Decisión** | Modelar RBAC en la BD: `Role`, `Resource`, `Permission`, `RolePermission` (N:N) y `SystemUserRole` (N:N `SystemUser` ↔ `Role`). Los roles/permisos se siembran de forma idempotente desde constantes (`roles.seeder.ts`) y se validan en `RolesGuard` vía `PrismaService`. Decoradores `@Roles()` y `@Permissions()`; **`SUPERADMIN` hace bypass total**. `SystemUserDto` expone `roles: string[]` y `permissions: string[]` (permisos efectivos), el payload JWT pasa a `{ id, roles }` y el frontend usa los permisos para filtrar módulos/vistas/menú |
| **Consecuencias** | + Permisos granulares sin migrar por cada rol nuevo. + Roles configurables desde datos. + Coherente con menús dinámicos futuros. + El frontend oculta items por permiso (visibilidad de UI; la autorización real queda en el backend). - Los roles deben sembrarse (no existen si falta el seeder). - Cada request protegido hace consultas RBAC a BD (caché pendiente) |
| **Alternativas** | Roles enum + switch en guards (insostenible), ABAC sobre metadatos (sobreingeniería para el alcance) |
| **Nota** | Roles sembrados: `SUPERADMIN` (bypass), `ADMIN` (todos los permisos), `BASIC` (solo RAG de lectura: `module:records`, `rag:read`, `rag:search` — reemplaza `STAFF`/`ANALYST`; `STUDENT` eliminado). Permisos de visibilidad: recurso `module` (`module:records`, `module:coaching`, `module:vacations`, `module:sales`, `module:licenses`, `module:permissions`) y `rag:upload-view` / `rag:upload`. Migración `20260819144300_init` |

---

## 2. Hoja de Ruta

### Fase 1 — Base (Completado)
- [x] Estructura del monorepo
- [x] Autenticación JWT + guards
- [x] CRUD de usuarios
- [x] Logging de auditoría (AuthLog, SystemLog)
- [x] Módulo de almacenamiento Azure Blob
- [x] Módulo de OCR (Azure DI)
- [x] Módulo de análisis IA (OpenAI)
- [x] Notificaciones
- [x] CLI para crear admin
- [x] Docker multi-stage + CI/CD

### Fase 2 — Correcciones Críticas
- [ ] ⚠️ Resolver asimetría frontend-backend en ruta `/api/v1`
- [ ] ⚠️ Eliminar almacenamiento de token en `localStorage` del frontend
- [ ] ⚠️ Implementar endpoint LDAP real en backend o eliminar referencia del frontend
- [ ] Agregar controlador REST para Document (actualmente solo tiene service)
- [ ] Estandarizar paginación en NotificationController (usa query params manuales)

### Fase 2b — Base Vectorial (RAG)
- [x] Restaurar tablas vectoriales en `modu` (documents, document_chunks, embedding_models, ingestion_runs)
- [x] Seeder idempotente para el dump vectorial (`pnpm run db:seed:vector`)
- [x] Modelo Prisma de las tablas vectoriales (documents, document_chunks, embedding_models, ingestion_runs) — `vector`/`tsvector` como `Unsupported`
- [x] Búsqueda semántica directa por vector (`POST /rag/search`, `ORDER BY embedding <=> $1::vector`, JWT) — **sin IA**
- [x] Búsqueda full-text sin modelo de embedding (`GET /rag/text-search`, `websearch_to_tsquery` + trigram)
- [x] Listado de documentos del índice (`GET /rag/documents`, paginado, con `chunkCount`)
- [x] Servicio unificado `PostgresRagService` (`searchVector`, `searchText`, `listDocuments`)
- [x] **Frontend**: vista RAG en Records View — `RagSearchView` (Summary) y `UploadDocumentView` (`Subir documento`, solo UI)
- [ ] Búsqueda híbrida (vectorial + full-text `search_vector` + trigram)
- [ ] (Opcional) Vectorización de consultas con `nvidia/nv-embedqa-e5-v5` (`input_type=query`) para aceptar texto libre
- [ ] Endpoint de subida/ingesta de documentos (conectar `UploadDocumentView`)

### Fase 2c — RBAC granular (ADR-013)
- [x] Modelo Prisma RBAC: `Role`, `Resource`, `Permission`, `RolePermission`, `SystemUserRole` (N:N) — `SystemUser.role` (enum `UserRole`) eliminado
- [x] Seeder `roles.seeder.ts` (upserts idempotentes de recursos, permisos y roles desde constantes)
- [x] `RolesGuard` consulta roles/permisos en BD + **bypass `SUPERADMIN`**; decoradores `@Roles()` / `@Permissions()`
- [x] Payload JWT `{ id, roles }`; `SystemUserDto`/`AuthUserDto` con `roles: string[]`
- [x] Roles `SUPERADMIN`, `ADMIN`, `BASIC` (renombrado de `STAFF` → `ANALYST` → `BASIC`; `STUDENT` eliminado)
- [x] Permisos de visibilidad sembrados: recurso `module` (`module:*`) y `rag:upload-view`/`rag:upload`; BASIC solo RAG de lectura (`module:records`, `rag:read`, `rag:search`) — sin subida ni módulos demo
- [x] **Permisos expuestos al frontend** — `SystemUserDto.permissions`/`AuthUserDto.permissions` (efectivos, `SUPERADMIN` → todos) vía `/auth/login` y `/auth/me`
- [x] Frontend mapea `roles` (`role = roles[0]`), mocks a `BASIC` y **consume permisos** (`User.permissions`, `hasPermission`): filtra módulos (`module:<slug>`), vistas (`RecordViewOption.permission`, ej. `rag:upload-view`) y sidebar (`StaticSidebarItem.permission`) y valida la URL en `RecordsRoute`; config de menú en `routes/menu.config.tsx`
- [x] **Endpoints REST de consulta RBAC** — `GET /roles/all`, `GET /roles`, `GET /roles/:identifier`, `GET /permissions` (módulo `rbac`) *(2026-08-20)*
- [ ] Menús dinámicos por rol (`GET /menus/me`) y CRUD/UI de administración de permisos
- [ ] Cerrar agujeros: `GET /users` sin RolesGuard; `SystemLogsController` parcial; `AiAnalysisController` import sin uso; `RbacController` sin `@Roles` en `/roles`

### Fase 3 — Dashboard y UX
- [ ] Implementar Dashboard con contenido real
- [ ] Implementar vistas diferenciadas por rol
- [ ] Sistema de navegación (Sidebar/Navbar)
- [ ] Componentes de tabla, listas, filtros
- [ ] Manejo de estados de carga y error consistente

### Fase 4 — Features
- [ ] Caché con TTL para análisis IA repetitivos
- [ ] Exportación de reportes
- [ ] Gestión de sesiones activas
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Panel de administración de logs

### Fase 5 — Calidad
- [ ] Tests unitarios para frontend
- [ ] Tests E2E completos
- [ ] Documentación de usuario
- [ ] Auditoría de seguridad

---

## 3. Decisiones Pendientes

| # | Tema | Propuesta | Estado |
|---|------|-----------|--------|
| DP-1 | Estrategia de caché para AiAnalysis | TTL + invalidación por hash | Pendiente |
| DP-2 | Refresh token rotation | Endpoint `POST /auth/refresh` implementado; rotar/persistir el refresh token en cada uso | Parcial |
| DP-3 | Rate limiting | NestJS `@nestjs/throttler` | Pendiente |
| DP-4 | Menús dinámicos por rol | Endpoint `GET /menus/me` sobre `Role`/`Permission` RBAC | Pendiente |
| DP-5 | Caché de consultas RBAC en `RolesGuard` | Cachear roles/permisos por usuario (Redis) para no golpear BD en cada request | Pendiente |

> **Documentos relacionados**: [Engram](00-engram.md), [Architecture](02-architecture.md)