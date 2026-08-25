# API Client — Modu (Frontend)

> **Propósito**: Documentar la capa de comunicación HTTP entre el frontend y el backend, incluyendo mocks, manejo de errores y estados.

---

## 1. Cliente HTTP Base

**Archivo**: `services/api.ts`

### 1.1 Configuración

```typescript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
const MOCK_ENABLED = import.meta.env.VITE_MOCK_ENABLED === 'true'
```

### 1.2 Funciones Exportadas

| Función | Método HTTP | Descripción |
|---------|-------------|-------------|
| `get<T>(path, params?)` | GET | Obtener recursos con query params opcionales |
| `post<T>(path, body?)` | POST | Crear recursos |
| `put<T>(path, body?)` | PUT | Actualizar recursos |
| `patch<T>(path, body?)` | PATCH | Actualización parcial |
| `del<T>(path)` | DELETE | Eliminar recursos |

### 1.3 Construcción de URL

```typescript
`${BASE_URL}${path}` + `?key=value` (si hay params)
```

**⚠️ Problema detectado**: `BASE_URL` incluye `/api/v1` pero el backend NestJS no tiene un global prefix configurado. Las rutas reales son `/auth/login`, no `/api/v1/auth/login`.

### 1.4 Headers por Defecto

```typescript
{
  'Content-Type': 'application/json',
  ... (headers adicionales),
  ... (Authorization: `Bearer ${token}` si existe en localStorage)
}
```

### 1.5 Formato de Respuesta

```typescript
interface ApiResponse<T = unknown> {
  ok: boolean        // true si status 2xx
  status: number      // HTTP status code
  data: T             // Body parseado
  error?: string      // Mensaje de error (solo si !ok)
}
```

### 1.6 Manejo de Errores

```
- Error de red (fetch lanza excepción) → { ok: false, status: 0, error: "Network error" }
- Error HTTP (response.ok === false) → { ok: false, status, data, error }
- Éxito → { ok: true, status, data }
```

**Extracción del mensaje de error (HTTP)**: se prioriza en este orden:
1. `body.message` — ej. `"Email or password is incorrect"`
2. `body.error` — ej. `"Not Found"`
3. `response.statusText`

Esto garantiza que el banner de error del login muestre el mensaje del backend (`message`) y no el genérico `"Not Found"`.

---

## 2. Servicio de Autenticación

**Archivo**: `services/auth.ts`

### 2.1 Tipos

```typescript
interface User {
  id: string
  email: string
  name: string            // display name: [firstName lastName] o email
  firstName?: string
  lastName?: string
  role: string            // primer rol: roles[0] (RBAC)
  roles?: string[]        // nombres de rol RBAC completos
  permissions?: string[]  // permisos efectivos del usuario (RBAC — ADR-013)
  isActive?: boolean
  avatarUrl?: string
}

interface AuthResponse {
  user: User
  token: string
  expiresAt: string
}

interface LoginCredentials {
  email: string
  password: string
}

type AuthMethod = 'db' | 'ldap'

// ─── Payload real del backend ───
interface RawUser {                      // = SystemUserDto
  id: number
  firstName: string
  lastName: string
  employeeId?: string
  email: string
  phoneNumber?: string
  roles: string[]                        // Nombres de rol RBAC (antes role: string)
  permissions: string[]                  // Permisos efectivos (ADR-013); SUPERADMIN → todos
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface RawAuthResponse {              // POST /auth/login
  token: string
  refreshToken: string
  Expiration: string
  User: RawUser
}
```

> **Nota**: El backend responde `{ token, refreshToken, Expiration, User }` (nombres en PascalCase) y `/auth/me` devuelve un `SystemUserDto` directo. `RawUser` expone `roles: string[]` (RBAC — ADR-013) y `permissions: string[]` (permisos efectivos del usuario, unión de los roles activos); `mapRawUser()` deriva `role` de `roles[0]` y copia `permissions`. Ambos se mapean al tipo `User` normalizado del frontend. Esto fue el bug por el cual el login no redirigía al dashboard: `authResponse.user` era `undefined` porque el frontend esperaba `user` (minúscula).

**Uso de permisos en UI**: `hasPermission(user, 'module:records')` (helper en `services/auth.ts`) alimenta el filtrado de módulos/vistas/sidebar y el guard `RecordsRoute` (ver [Frontend Security](04-security.md) §3).

### 2.2 Funciones

| Función | Propósito | Mock |
|---------|-----------|------|
| `login(credentials)` | Autenticar usuario + mapear payload real | ✅ Soporta mock DB y LDAP |
| `validateToken(token)` | Validar JWT (`/auth/me` → `User`) | ✅ Soporta mock |
| `logout()` | Cerrar sesión | ✅ No-op en mock |
| `preValidateCredentials(credentials)` | Validación frontend | Siempre |

### 2.3 Flujo de Login

```
1. preValidateCredentials(credentials)
   ├── Email vacío → error
   ├── Email sin @ → error
   ├── Password < 4 caracteres → error
   └── Válido → continuar

2. Si MOCK_ENABLED:
   ├── AUTH_METHOD === 'ldap' → mockLdapLogin()
   └── AUTH_METHOD === 'db' → mockLogin()

3. Si NO mock:
   ├── AUTH_METHOD === 'ldap' → POST /auth/ldap/login (⚠️ endpoint no existe en backend)
   └── AUTH_METHOD === 'db' → POST /auth/login
       └── Respuesta real: { token, refreshToken, Expiration, User }
           └── mapRawUser(User) → { id, email, name, firstName, lastName, role, isActive }

4. Guardar token en localStorage
5. Retornar AuthResponse { token, user, expiresAt }
```

**`validateToken`** llama a `GET /auth/me` (requiere `Authorization: Bearer`), que devuelve un `SystemUserDto` directo; también se normaliza con `mapRawUser()`.

### 2.4 Pre-validación del Lado del Cliente

```typescript
function preValidateCredentials(credentials): ValidationResult {
  // 1. Email requerido
  // 2. Password requerido
  // 3. Formato de email (regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  // 4. Si LDAP: dominio debe coincidir con VITE_LDAP_DOMAIN
  // 5. Password >= 4 caracteres
}
```

---

## 3. Mocks

**Archivo**: `mocks/auth.ts`

### 3.1 Usuarios Mock (DB)

| Email | Password | Rol | Permisos |
|-------|----------|-----|----------|
| `admin@modu.com` | `admin123` | ADMIN | Todos (incl. `rag:upload`, `module:*`) |
| `docente@modu.com` | `docente123` | BASIC | Solo RAG de lectura: `module:records`, `rag:read`, `rag:search` (sin `rag:upload-view` ni `rag:upload`) |
| `director@modu.com` | `director123` | ADMIN | Todos (incl. `rag:upload`, `module:*`) |

Los permisos se derivan por rol vía `ROLE_PERMISSIONS` en `mocks/auth.ts` (`mockValidateToken`/`mockLogin`), replicando la asignación real del seeder del backend.

### 3.2 Usuarios Mock (LDAP)

| Email | Password | Rol |
|-------|----------|-----|
| `admin@modu.edu` | `Admin123!` | ADMIN |
| `maria.garcia@modu.edu` | `Maria2025!` | BASIC |
| `carlos.lopez@modu.edu` | `Carlos2025!` | ADMIN |

### 3.3 Formato de Token Mock

```
mock.{base64(payload)}.{base64(secret)}

Payload:
{
  sub: string,        // ID del usuario
  email: string,
  name: string,
  role: string,
  source: "db" | "ldap",
  iat: timestamp,
  exp: timestamp      // VITE_TOKEN_EXPIRY_MINUTES desde now
}
```

### 3.4 Latencia Simulada

| Servicio | Delay |
|----------|-------|
| Login DB | 600ms |
| Login LDAP | 800ms |
| Validate Token | 300ms |

---

## 4. Servicio RAG

**Archivo**: `services/rag.ts`

Cliente de la base vectorial (módulo backend `rag`, ver [Backend Modules](../backend/01-modules.md#113-módulo-rag--búsqueda-sin-ia)). Usa `get`/`post` de `api.ts` (JWT automático vía `auth_token`).

### 4.1 Funciones

| Función | Método y ruta | Params | Devuelve |
|---------|---------------|--------|----------|
| `ragTextSearch(q, filters?)` | `GET /rag/text-search` | `q`, `department?`, `project?`, `sensitivity?`, `limit` (default 8) | `RagTextSearchResult` |
| `ragVectorSearch(embedding, filters?)` | `POST /rag/search` | `embedding: number[]`, filtros, `limit` | `RagVectorSearchResult` |
| `ragListDocuments(limit?, offset?)` | `GET /rag/documents` | `limit` (default 100), `offset` (default 0) | `RagDocument[]` |
| `ragChunkContext(chunkId, filters?)` | `GET /rag/chunks/:id/context` | `before?` (default 3), `after?` (default 3) | `RagChunkContext` |

### 4.2 Tipos principales

```typescript
interface RagDocument {
  id: number; title: string | null; originalFilename: string
  sourcePath: string; department: string | null; project: string | null
  sensitivity: string | null; status: string; chunkCount: number; createdAt: string
}

interface RagTextChunk {
  id: number; chunkIndex: number; content: string
  sectionTitle: string | null; pageStart: number | null; pageEnd: number | null
  rank: number; trigramSimilarity: number | null
  documentId: number; documentTitle: string | null
  department: string | null; project: string | null; sensitivity: string | null
}

interface RagTextSearchResult { chunks: RagTextChunk[]; totalMatches: number; executionTimeMs: number }

interface RagContextChunk {
  id: number; chunkIndex: number; content: string
  sectionTitle: string | null; pageStart: number | null; pageEnd: number | null
}

interface RagChunkContext { chunk: RagTextChunk; context: RagContextChunk[] }
```

> `ragVectorSearch` se usa cuando el cliente ya dispone del embedding (vectorización de consultas, opcional); la búsqueda actual de la UI es **full-text** (`ragTextSearch`). `ragChunkContext` alimenta el **expand de resultados** en `RagSearchView` (leer el chunk completo y el contenido previo/posterior del mismo documento).

---

## 5. Servicio RBAC

**Archivo**: `services/rbac.ts`

Cliente del módulo backend `rbac` (ver [Backend Modules](../backend/01-modules.md)). Usa `get` de `api.ts` (JWT automático vía `auth_token`). Alimenta las vistas `RbacRolesView` y `RbacPermissionsView`.

### 5.1 Funciones

| Función | Método y ruta | Guard | Devuelve |
|---------|---------------|-------|----------|
| `getRoles()` | `GET /roles/all` | RolesGuard (sin auth estricta*) | `RoleDto[]` (roles con permisos anidados) |
| `getRolesSummary()` | `GET /roles` | RolesGuard | `RoleSummaryDto[]` (roles + permissionCount) |
| `getRolePermissions(identifier)` | `GET /roles/:identifier` | ADMIN | `RoleDto` |
| `getPermissions()` | `GET /permissions` | ADMIN | `PermissionDto[]` |

\* Ver agujero de seguridad en `backend/07-roadmap-todo.md` §3.2 (`JwtGuard` comentado).

### 5.2 Tipos

```typescript
interface PermissionDto {
  id: number
  name: string          // ej. "system-user:read"
  description: string | null
  resource: string      // ej. "system-user"
  resourceId: number
}

interface RoleDto {
  id: number
  name: string          // SUPERADMIN | ADMIN | BASIC
  description: string | null
  isActive: boolean
  permissions: PermissionDto[]
  createdAt: string
  updatedAt: string
}

interface RoleSummaryDto { id: number; name: string; description: string | null; isActive: boolean; permissionCount: number }
```

> **Consumo**: `RbacRolesView` usa `getRoles()` con columnas dinámicas (`buildDynamicTable`) — Permissions es columna `list` (`itemsOf: p => p.name`, badges anidados con count). `RbacPermissionsView` usa `getPermissions()`.

---

## 6. Variables de Entorno del Frontend

| Variable | Default | Propósito |
|----------|---------|-----------|
| `VITE_API_URL` | `http://localhost:3000/api/v1` | ⚠️ No coincide con backend |
| `VITE_APP_NAME` | `Modu` | Nombre de la app |
| `VITE_MOCK_ENABLED` | `true` | Usar mocks |
| `VITE_MOCK_SECRET` | `modu-dev-secret-2025` | Secreto para mock tokens |
| `VITE_TOKEN_EXPIRY_MINUTES` | `60` | Expiración del token mock |
| `VITE_AUTH_METHOD` | `ldap` | `db` o `ldap` |
| `VITE_LDAP_HOST` | `ldap.example.com` | Host LDAP |
| `VITE_LDAP_PORT` | `389` | Puerto LDAP |
| `VITE_LDAP_BASE_DN` | `dc=modu,dc=edu` | Base DN |
| `VITE_LDAP_DOMAIN` | `modu.edu` | Dominio institucional |

---

## 7. Pendientes y Problemas

| # | Problema | Impacto | Solución Propuesta |
|---|----------|---------|-------------------|
| P1 | ⚠️ Resuelto parcial: default de `api.ts` con `/api/v1` pero backend sin prefix | Fallaría si no hay `.env` | El `.env` del frontend usa `VITE_API_URL=http://localhost:3000` (sin `/api/v1`). Alinear también el default en `api.ts` |
| P2 | `POST /auth/ldap/login` referenciado pero no implementado | LDAP real no funciona | Implementar endpoint o eliminar del frontend si no se usará |
| P3 | Token guardado en `localStorage` y también en cookie httpOnly | Redundancia insegura | Eliminar `localStorage` y usar solo cookie. Ajustar `api.ts` para leer de cookie |
| P4 | ✅ **Resuelto** — tipos `User` distintos al backend (`nombre` vs `firstName`/`lastName`, `rol` vs `role`) | Inconsistencia al integrar | Tipos unificados en `User` (name/role) y mapeo con `mapRawUser()` para `/auth/login` y `/auth/me` |
| P5 | No hay manejo de refresh token automático | Token expirado requiere re-login | Implementar interceptor que refresh automáticamente |
| P6 | No hay endpoint de subida de documentos para `UploadDocumentView` | La vista de subir documento es solo UI | Crear endpoint backend de ingesta y conectar con `rag.ts` |

> **Documentos relacionados**: [API & Integrations (Backend)](../backend/04-api-integrations.md), [Frontend Security](04-security.md), [Frontend Modules](01-modules-pages.md)