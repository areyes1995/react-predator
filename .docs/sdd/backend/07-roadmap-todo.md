# Roadmap & TODO — Backend (Modu)

> **Propósito**: Plan de trabajo y lista de pendientes para convertir el backend en el núcleo de un **manager de reportería multi-sistema**: consolida varias APIs externas en una, con base de datos propia, permisos/roles/menús y reportes.
>
> **Estado**: Cimentación rota + dominio de reportería ausente (ver [02-architecture.md](02-architecture.md), [00-engram.md](../00-engram.md)).

---

## 1. Contexto y Diagnóstico

El backend es un starter hexagonal limpio (interfaces + adaptadores, repositorios Prisma, Unit of Work, Swagger) pero:

- **No arranca contra Postgres**: `prisma/prisma.service.ts` usa `@prisma/adapter-mariadb` mientras el schema declara `provider = "postgresql"`.
- **Build/CI rotos**: scripts `build` deshabilitados, `tsconfig.json` raíz con `include/exclude` mal anidados.
- **Dominio del producto ausente**: no hay módulos de fuentes externas, sincronización, reportes, export, permisos granulares ni menús dinámicos.
- **Deuda de seguridad**: roles incompletos, auditoría mutable, refresh token sin endpoint, LDAP fantasma.

**Prioridad**: P0 = bloquea todo; P1 = seguridad; P2 = dominio de producto; P3 = calidad.

---

## 2. Fase 0 — Cimentación (P0, bloquea todo lo demás)

### 2.1 Base de datos y Prisma
- [x] **Reemplazar adaptador**: `@prisma/adapter-mariadb` → `@prisma/adapter-pg` en `prisma/prisma.service.ts`, `prisma/seeders/main.seeder.ts` y `package.json`.
- [x] **Añadir bloque `generator`** a `prisma/schema.prisma` (`provider = "prisma-client-js"`) para que `prisma generate` produzca el cliente con `activeProvider = "postgresql"` (antes quedaba `"mysql"` por falta de generator y rompía el runtime).
- [ ] **Recrear `prisma/migrations/`**: generar migración base desde el schema actual y verificar `prisma migrate dev` contra `modu` (Postgres).
- [ ] **Actualizar `prisma-exception.filter.ts`**: dejar de depender del `constraint.index` específico de MariaDB; mapear códigos de error de Postgres (P2002, P2025, etc.).
- [ ] **Limpiar modelos residuo**: decidir y eliminar `Lesson`, `LessonContent`, enum `AiRecommendation` (residuos de Poker Academy) o convertirlos en el dominio educativo real.

### 2.2 Build y tooling
- [ ] **Corregir `tsconfig.json` raíz**: mover `include`/`exclude` al nivel raíz, ajustar `rootDir`/`outDir` a la estructura real (`apps/api/src`).
- [ ] **Reactivar scripts de build**: `"build"`, `"build:api"` (hoy `# disabled`).
- [ ] **Revisar `Dockerfile` + `docker-compose.dev.yml`/`.prod.yml`**: reemplazar `mysql:8.0` por `postgres:14` + pgvector, corregir healthcheck contra un endpoint `/health` real, y que el runner copie `dist` real.

### 2.3 Endpoints base
- [ ] **Endpoint `/health`** (el Dockerfile/compose ya lo referencian) + integración con `@nestjs/terminus`.
- [ ] **Prefijo `/api/v1`** global en `main.ts` o alinear el frontend (hoy asimétrico).

---

## 2bis. Fase 0b — Base Vectorial (RAG) (P0/P2)

Infraestructura de búsqueda ya restaurada sobre PostgreSQL 14 + pgvector (ADR-011). La búsqueda **NO requiere IA**: la semántica opera **directo sobre el vector** ya almacenado (`<=>`, sin modelo de embedding para la consulta) y la de texto usa full-text (`search_vector`) + trigram (`pg_trgm`), ambas con SQL crudo vía `$queryRaw`.

### 2bis.1 Hecho (base de datos)
- [x] Extensiones `vector` (pgvector 0.7.4) y `pg_trgm` activadas en `modu`.
- [x] Tablas restauradas desde dump (`documents`, `document_chunks`, `embedding_models`, `ingestion_runs`) — 191 docs, 6,543 chunks con `embedding vector(1024)`.
- [x] Índices HNSW (`vector_cosine_ops`), GIN (`metadata`, `search_vector`) y trigram (`title`, `original_filename`).
- [x] Seeder idempotente `prisma/seeders/vector.seeder.ts` + dump sanitizado `prisma/dump/rai_vector_pg14.sql` (PG17 → PG14).

### 2bis.2 API y servicio (sin IA)
- [x] **Modelo Prisma** de las tablas vectoriales (`documents`, `document_chunks`, `embedding_models`, `ingestion_runs`) — columnas `vector`/`tsvector` como `Unsupported(...)`. *(2026-08-17: modelos en `prisma/schema.prisma` con `@map` snake_case y `Unsupported("vector")`/`Unsupported("tsvector")`; `prisma validate` + `prisma generate` OK; verificado contra `modu`: 191 docs, 6,543 chunks, 1 modelo, 191 runs.)*
- [x] **Módulo `rag`**: búsqueda semántica **directa por vector** — `POST /rag/search` recibe el `embedding` (vector ya calculado) y ejecuta `ORDER BY embedding <=> $1::vector LIMIT N` con `$queryRaw`. *(2026-08-17: `apps/api/src/modules/rag/` — `RagModule`, `RagController`, `PostgresRagService` (`searchVector`) con filtros opcionales por `department`/`project`/`sensitivity` y `minScore`; verificado contra `modu`: distance 0.0000 para el chunk exacto.)*
- [x] **Búsqueda full-text sin modelo de embedding** — `GET /rag/text-search?q=...` con `websearch_to_tsquery` sobre `search_vector`, ranking `ts_rank_cd` + `similarity()` trigram, mismos filtros opcionales. *(2026-08-17: `PostgresRagService` (`searchText`); verificado contra `modu`: "compras" → Politica/Procedimiento de Compras; "colores pantalla" → 0 hits, mostrando la diferencia con la semántica.)*
- [x] **Listado de documentos** — `GET /rag/documents?limit&offset` (JWT): documentos del índice con `chunkCount` (JOIN agregado sobre `document_chunks`), ordenados por `created_at DESC`. *(2026-08-17: `PostgresRagService` (`listDocuments`); verificado contra `modu`: 5 docs con chunkCount.)*
- [x] **Servicio unificado** — los métodos `searchVector`, `searchText` y `listDocuments` viven en un único `PostgresRagService` (token `RagService`) con `buildFilters()` compartido; la interfaz `RagService` los tipa. *(2026-08-17: eliminados los dos servicios e interfaces previos.)*
- [ ] **Búsqueda híbrida**: combinar el resultado vectorial con el full-text (`search_vector`) y trigram (`similarity`).
- [ ] **(Opcional)** Vectorización de consultas con `nvidia/nv-embedqa-e5-v5` (`input_type=query`) para que `POST /rag/search` acepte texto libre — hoy el cliente debe pasar el vector ya calculado.
- [ ] **(Opcional)** LLM generativo para respuestas redactadas (RAG completo) con trazabilidad en `AiAnalysis`.
- [ ] **Endpoint de subida/ingesta de documentos** (hoy `StorageModule` solo expone servicios internos, sin controller HTTP) — pendiente para conectar `UploadDocumentView` del frontend. **Los permisos `rag:upload-view`/`rag:upload` ya existen** en BD y el frontend los valida; el endpoint nuevo se protegerá con `@Permissions('rag:upload')`.

---

## 3. Fase 1 — Seguridad y RBAC (P1)

### 3.1 Autenticación
- [ ] **`JwtStrategy.validate()`**: consultar la BD, rechazar `isActive = false` y `deletedAt != null` (regla R4 del Engram).
- [x] **Endpoint `POST /auth/refresh`** implementado — emite nuevos access (`1h`) + refresh (`2d`) tokens (sin rotación/persistencia aún; hoy es stateless y no revocable).
- [ ] **Eliminar `LocalGuard`** muerto (no existe estrategia `local`) o implementarlo.
- [ ] **`POST /auth/ldap/login`**: implementar endpoint real o eliminar la referencia del frontend (roadmap Fase 2 pendiente).
- [ ] **Rate limiting** (`@nestjs/throttler`) en `/auth/*` (DP-3).
- [ ] **CSRF** para las cookies httpOnly o reevaluar el transporte del token.

### 3.2 Autorización granular (RBAC) — implementado parcialmente (ADR-013)
- [x] **Modelo Prisma**: `Role`, `Permission`, `Resource`, `RolePermission`, `SystemUserRole` (N:N). *(2026-08-19: `prisma/models/platform/rbac.prisma`; migración `20260819144300_init`; seeder `roles.seeder.ts` idempotente.)*
- [x] **Guard de permisos** por recurso+acción — `@Permissions('reports:read')` + `@Roles()` en `RolesGuard`, con **bypass de `SUPERADMIN`**. *(2026-08-19: `modules/auth/guards/roles.guard.ts` + decoradores `roles.decorator.ts`/`permissions.decorator.ts` + constantes `roles.constants.ts`/`permissions.constants.ts`.)*
- [x] **Permisos de visibilidad de módulos y RAG** — constantes con recurso `module` (`module:records`, `module:coaching`, `module:vacations`, `module:sales`, `module:licenses`, `module:permissions`) y `rag:upload-view` / `rag:upload`. ADMIN recibe todos; BASIC solo RAG de lectura: `module:records`, `rag:read` y `rag:search`. *(2026-08-19: `permissions.constants.ts`/`roles.constants.ts`; seeder re-ejecutado — ahora sincroniza y elimina asignaciones obsoletas.)*
- [x] **Usuarios nuevos entran con rol BASIC por defecto** — `CreateSystemUserDto.role` y `RegisterAuthDto.role` son opcionales; `DefaultSystemUserService.create()` usa `BASIC` si no se provee.
- [x] **Permisos expuestos al frontend** — `SystemUserDto.permissions: string[]` con `resolveEffectivePermissions()` (unión de los roles activos; `SUPERADMIN` → todos los permisos), `AuthUserDto.permissions` y repository con include de `role.permissions`. Disponibles en `/auth/login` y `/auth/me`. *(2026-08-19; el frontend ya los consume para filtrar módulos, vistas y sidebar — ver `frontend/06-roadmap-todo.md` §3.2.)*
- [x] **Endpoints REST de consulta RBAC** — módulo `rbac` con `GET /roles/all`, `GET /roles`, `GET /roles/:identifier` y `GET /permissions` (DTOs `RoleDto`/`RoleSummaryDto`/`PermissionDto`). *(2026-08-20: `modules/rbac/` — `RbacController`, `DefaultRbacService`, `PrismaRbacRepository`; registro en `app.module.ts`.)*
- [ ] **Menús dinámicos por rol**: modelo `Menu`/`RoleMenu` + endpoint `GET /menus/me`. *(El frontend ya valida con permisos efectivos vía `/auth/me`; `GET /menus/me` reemplazará la config estática.)*
- [ ] **Cerrar agujeros existentes**:
  - `GET /users` (listado) sin `RolesGuard` — restringir por rol. *(2026-08-20: el `@UseGuards(JwtGuard)` del controlador quedó comentado; `GET /users` solo depende de `RolesGuard` sin `@Roles`.)*
  - `SystemLogsController` — proteger `GET :id`, `POST`, `PATCH`, `DELETE` (hoy solo `GET /` tiene `@Roles(ROLES.ADMIN)`).
  - `AiAnalysisController` — import `PrismaService` sin uso; quitar.
  - `RbacController` — decidir si `GET /roles/all` y `GET /roles` requieren `@Roles(ADMIN)` (hoy solo `RolesGuard`).

### 3.3 Otros
- [ ] **`gen_hashes.js`** (credenciales en texto plano) — mover a seed seguro o eliminar.
- [ ] **Notificaciones**: corregir `CreateNotificationData.validationRequestId` (no existe en el modelo) y estandarizar paginación con `PaginationQueryDto`.
- [ ] **Timeout/retry** en llamadas externas (OpenAI, Azure) — restricción T8 del Engram.
- [ ] **Endpoint REST de storage y document** (hoy solo servicios, sin controller).

---

## 4. Fase 2 — Dominio "Conexiones a Sistemas Externos" (P2)

### 4.1 Modelo de datos
- [ ] Modelo `ExternalSource` (nombre, tipo de conexión, base URL, credenciales cifradas, headers, estado, última sync).
- [ ] Modelo `SourceCredential` (API key / basic auth / bearer / oauth2, cifrado en reposo).
- [ ] CRUD completo + **test de conexión** (probe al health/endpoint de la fuente).
- [ ] **Cifrado de credenciales** (capa de `SecretsManager`/`CryptoService` sobre `encrypt`/`decrypt`).

### 4.2 Cliente HTTP genérico
- [ ] Servicio `HttpSourceClient` configurable (auth header, timeout, retry con backoff, mapeo de errores).
- [ ] Soporte inicial de tipos: REST/JSON, luego paginación de cursors/offset.

### 4.3 Webhooks de entrada
- [ ] Endpoints de ingesta protegidos por API key por fuente (`POST /ingest/:sourceKey`).
- [ ] Validación de firma/secret según el sistema externo.

---

## 5. Fase 3 — Sincronización y Colas (P2)

### 5.1 Jobs programados (`@nestjs/schedule` — ya instalado)
- [ ] `@Cron` de sincronización periódica por fuente (intervalo configurable por `ExternalSource`).
- [ ] Registro de estado de sync por fuente (`lastSyncAt`, `status`, `error`).
- [ ] Ingesta incremental (solo delta desde `lastSyncAt`) y full-reload bajo demanda.

### 5.2 Colas BullMQ (ya instalado, sin uso)
- [ ] Cola `sync-source`: enqueue de syncs largos, workers con progreso y reintentos.
- [ ] Cola `import`: procesamiento masivo (CSV/Excel) — el DTO `ImportExcelResult` existe como esqueleto.
- [ ] Cola `notification`: envíos masivos.

### 5.3 Caché
- [ ] Capa de caché Redis con TTL e invalidación para respuestas externas repetitivas (DP-1).
- [ ] Cache de reportes agregados.

---

## 6. Fase 4 — Dominio "Reportes" (P2)

### 6.1 Modelo
- [ ] `Report` (definición: título, fuente/s, métricas, dimensiones, filtros, período, export config).
- [ ] `ReportExecution` (ejecución: estado, resultado, cache, duración, usuario).
- [ ] `ReportSchedule` (programación de reportes).

### 6.2 Motor de agregación
- [ ] Servicio de agregación sobre datos consolidados (sum/avg/count/group by/período).
- [ ] Query builder genérico sobre las fuentes normalizadas.

### 6.3 Endpoints
- [ ] `GET /reports`, `POST /reports`, `GET /reports/:id/execute`, `GET /reports/:id/results`.
- [ ] **Export**: CSV / Excel / PDF de resultados.

---

## 7. Fase 5 — Calidad y Observabilidad (P3)

### 7.1 Tests
- [ ] **Arreglar Jest** (`jest.config.ts` no matchea specs; solo existe `app.controller.spec.ts`).
- [ ] Tests unitarios de auth, system-user, ai-analysis, notification, permisos.
- [ ] Tests e2e (`supertest`) de los flujos críticos: login, roles, permisos, reportes, sync.
- [ ] Meta de cobertura ≥ 80% en módulos nuevos (checklist del Engram).

### 7.2 Observabilidad
- [ ] **Activar `LoggerService`** (winston está registrado pero nunca inyectado).
- [ ] Logs estructurados con request-id; correlación con `SystemLog`/`AuthLog`.
- [ ] Métricas (Prometheus) y healthchecks profundos (BD, Redis, fuentes externas).

### 7.3 Limpieza
- [ ] Quitar código huérfano (`utils/default.utils.ts` sin uso, imports muertos).
- [ ] Unificar convención kebab-case (`SystemLog` → `system-log`).
- [ ] Mover secretos de desarrollo fuera del repo.

---

## 9. Orden de ejecución recomendado

1. **Fase 0** (cimentación) → desbloquea build + BD + deploy. *(Adaptador pg y generator ya completados 2026-08-17.)*
2. **Fase 0b** (base vectorial RAG) → datos restaurados, modelos Prisma y API de búsqueda **sin IA** (semántica directa por vector `<=>` + full-text `search_vector`/trigram) completados 2026-08-17; la vectorización de consultas (NVIDIA NIM) es opcional.
3. **Fase 1** (seguridad/RBAC) → base sobre la que construir todo lo demás. *(RBAC en BD — modelos `Role`/`Permission`/`Resource`, seeder `roles.seeder.ts`, `RolesGuard` con `@Roles()`/`@Permissions()` y bypass `SUPERADMIN`, endpoint `POST /auth/refresh`, permisos de módulos/RAG sembrados y expuestos al frontend (`/auth/me`), endpoints REST de consulta RBAC (`/roles*`, `/permissions`) y helper genérico de paginación/filtros — completado 2026-08-20; faltan menús dinámicos (`GET /menus/me`), UI de administración y cerrar agujeros de controladores.)*
4. **Fase 2** (conexiones externas) → el "conectar varios sistemas en 1".
5. **Fase 3** (sync/colas/caché) → datos vivos consolidados.
6. **Fase 4** (reportes) → el valor de negocio visible.
7. **Fase 5** (calidad) → endurecer de forma continua.

> **Relación con ADRs**: las decisiones nuevas (Postgres/pgvector = ADR-011, RAG = ADR-012, permisos granulares, motor de reportes) deben registrarse en `../12-roadmap-adr.md` antes de implementarse (metodología SDD).

> **Documentos relacionados**: [00-engram.md](../00-engram.md), [01-modules.md](01-modules.md), [02-data-model.md](02-data-model.md), [03-business-logic.md](03-business-logic.md), [04-api-integrations.md](04-api-integrations.md), [05-security.md](05-security.md), [06-testing-strategy.md](06-testing-strategy.md), [08-pagination-filtering.md](08-pagination-filtering.md).