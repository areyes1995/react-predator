# API & Integrations — Modu (Backend)

> **Propósito**: Documentar los contratos REST de la API y las integraciones con servicios externos.

---

## 1. Contratos REST

### 1.1 Auth

#### POST /auth/login

```
Request Body:
{
  email: string    // Email institucional
  password: string // Mínimo 8 caracteres
}

Response 201:
{
  token: string,        // JWT (expira 1h)
  refreshToken: string, // JWT (expira 7d)
  Expiration: string,   // ISO date
  User: {
    id: number,
    firstName: string,
    lastName: string,
    employeeId: string | null,
    email: string,
    phoneNumber: string | null,
    roles: string[],     // Nombres de rol RBAC, ej. ["ADMIN"]
    isActive: boolean,
    createdAt: string,
    updatedAt: string
  }
}

Response 401:
{ statusCode: 401, message: "Email or password is incorrect" }
```

**Headers de respuesta**: `Set-Cookie: access_token=<jwt>; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`

#### POST /auth/refresh

```
Body:
{
  refreshToken: string // Refresh token JWT (expira 7d)
}

Response 201: AuthResultDto (token 1h, refreshToken 2d, Expiration, User)
Response 401: { statusCode: 401, message: "Invalid or expired refresh token" | "User not found" | "User is not active" }
```

#### POST /auth/register

```
Headers: Authorization: Bearer <token>  (rol: ADMIN)

Request Body:
{
  firstName: string,   // Mínimo 3 caracteres
  lastName: string,    // Mínimo 3 caracteres
  employeeId: string,  // Opcional (vínculo a Employee)
  email: string,       // Email válido
  password: string,    // Mínimo 8 caracteres
  phoneNumber?: string,// Opcional, formato teléfono
  role?: string        // Nombre de rol RBAC: "SUPERADMIN" | "ADMIN" | "BASIC" (opcional, default BASIC)
}

Response 201:
SystemUserDto (roles: string[])
```

#### POST /auth/logout

```
Headers: Authorization: Bearer <token> | Cookie: access_token=<token>

Response 200:
(empty)

Headers de respuesta: Set-Cookie: access_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0
```

#### GET /auth/me

```
Headers: Authorization: Bearer <token> | Cookie: access_token=<token>

Response 200:
SystemUserDto
```

### 1.2 Users

#### GET /users

```
Headers: Authorization: Bearer <token>

Query Parameters:
  page: number     // Default 1
  pageSize: number // Default 10
  filter?: {       // Opcional
    id?: number,
    firstName?: string,
    lastName?: string,
    employeeId?: string,
    email?: string,
    phoneNumber?: string,
    role?: string,   // Nombre de rol RBAC: "ADMIN" | "BASIC" | "SUPERADMIN"
    isActive?: boolean
  }

Response 200:
{
  items: SystemUserDto[],  // items con roles: string[]
  totalItems: number,
  page: number,
  pageSize: number,
  totalPages: number
}

Response 401: Unauthorized
```

#### GET /users/:id

```
Headers: Authorization: Bearer <token>
Roles: ADMIN, BASIC

Path: /users/123

Response 200: SystemUserDto (roles: string[])
Response 404: { statusCode: 404, message: "System user with id 123 not found" }
```

#### GET /users/email/:email

```
Headers: Authorization: Bearer <token>
Roles: ADMIN

Path: /users/email/user@example.com

Response 200: SystemUserDto
Response 404: Not found
```

#### PUT /users/:id

```
Headers: Authorization: Bearer <token>
Roles: ADMIN

Request Body:
{
  firstName?: string,
  lastName?: string,
  phoneNumber?: string,
  role?: string,   // Nombre de rol RBAC existente
  isActive?: boolean
}

Response 200: SystemUserDto (actualizado, roles: string[])
Response 404: User not found
Response 400: Invalid role value
```

### 1.3 AiAnalysis

#### POST /ai-analysis/analyze-text

```
Headers: Authorization: Bearer <token>

Request Body:
{
  text: string   // Texto a analizar
}

Response 201:
{
  sentimiento: "positivo" | "negativo" | "neutral",
  palabrasClave: string[],
  resumen: string,
  cached: boolean,
  analysisId: number
}
```

#### GET /ai-analysis/:id

```
Headers: Authorization: Bearer <token>

Response 200:
{
  id: number,
  analysisType: string,
  provider: string,
  model: string,
  status: string,
  prompt: object,
  response: object,
  inputHash: string | null,
  promptTokens: number | null,
  completionTokens: number | null,
  totalTokens: number | null,
  processingTimeMs: number | null,
  createdAt: string,
  ...
}

Response 404: AI Analysis not found
```

#### GET /ai-analysis

```
Headers: Authorization: Bearer <token>
Roles: ADMIN, BASIC

Query Parameters:
  page: number     // Default 1
  pageSize: number // Default 10

Response 200: PagedResultDto<AiAnalysisDto>
```

### 1.4 Notifications

#### GET /notifications

```
Headers: Authorization: Bearer <token>

Query Parameters:
  page?: number      // Default 1
  pageSize?: number  // Default 10
  onlyUnread?: string// "true" para solo no leídas

Response 200:
{
  items: Notification[],
  totalItems: number,
  unreadCount: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

#### GET /notifications/unread-count

```
Response 200: { count: number }
```

#### PATCH /notifications/read-all

```
Response 200: { count: number }
```

#### PATCH /notifications/:id/read

```
Path: /notifications/123/read

Response 200: Notification (marcada como leída)
Response 404: Notification with ID 123 not found
```

---

## 2. Integraciones Externas

### 2.0 RAG (base vectorial) — `apps/api/src/modules/rag/`

> Endpoints **sin IA**: la semántica opera directo sobre el vector almacenado y la de texto usa full-text/trigram. Ver [Backend Modules](01-modules.md#113-módulo-rag--búsqueda-sin-ia) y [ADR-012](../12-roadmap-adr.md#adr-012-base-vectorial-rag-sobre-pgvector). Todos requieren JWT.

#### POST /rag/search — búsqueda semántica directa por vector

```
Body: { embedding: number[], limit?: 1..50, minScore?: 0..1, department?, project?, sensitivity? }
Response 201: { chunks: RagChunk[], totalMatches, executionTimeMs }
```
`ORDER BY embedding <=> $vector::vector LIMIT N` vía `$queryRaw`; `score = 1 - distance`. El cliente debe enviar el vector ya calculado (vectorización de consultas es opcional).

#### GET /rag/text-search?q=... — búsqueda full-text

```
Query: q, limit?: 1..50, department?, project?, sensitivity?
Response 200: { chunks: RagTextChunk[], totalMatches, executionTimeMs }
```
`websearch_to_tsquery` sobre `search_vector`, ranking `ts_rank_cd` + trigram `similarity()`; `rank` y `trigramSimilarity` por chunk.

#### GET /rag/documents?limit&offset — listado del índice

```
Query: limit? (default 50, máx 50), offset? (default 0)
Response 200: RagDocument[]  // con chunkCount (JOIN agregado sobre document_chunks)
```

#### GET /rag/chunks/:id/context?before&after — contexto de un chunk

```
Path: :id  (ID del chunk)
Query: before? (0..20, default 3), after? (0..20, default 3)
Response 200: { chunk: RagTextChunk, context: RagContextChunk[] }
```

Devuelve el chunk objetivo (con toda la metadata del documento) y sus vecinos del **mismo documento** por `chunk_index` (`>= idx-before` y `<= idx+after`, excluyendo el propio), ordenados por índice. `RagContextChunk` = `{ id, chunkIndex, content, sectionTitle, pageStart, pageEnd }` — contenido **completo** previo/posterior. Solo documentos `status = 'active'`; 404 si el chunk no existe.

#### DTOs (respuesta)

| DTO | Campos clave |
|-----|--------------|
| `RagChunk` | `id`, `chunkIndex`, `content`, `sectionTitle`, `pageStart`, `pageEnd`, `distance`, `score`, `documentId`, `documentTitle`, `originalFilename`, `sourcePath`, `department`, `project`, `sensitivity` |
| `RagTextChunk` | igual pero con `rank` y `trigramSimilarity` en lugar de `distance`/`score` |
| `RagDocument` | `id`, `title`, `originalFilename`, `sourcePath`, `department`, `project`, `sensitivity`, `status`, `chunkCount`, `createdAt` |
| `RagContextChunk` | `id`, `chunkIndex`, `content`, `sectionTitle`, `pageStart`, `pageEnd` |

### 2.1 Azure Blob Storage

| Propiedad | Valor |
|-----------|-------|
| **SDK** | `@azure/storage-blob` |
| **Auth** | Connection string (`AZURE_STORAGE_CONNECTION_STRING`) |
| **Client** | `BlobServiceClient.fromConnectionString()` |

**Operaciones**:

| Operación | Método del SDK |
|-----------|----------------|
| Subir archivo | `blockBlobClient.uploadData(buffer, { blobHTTPHeaders })` |
| Descargar | `blobClient.download()` → readableStreamBody |
| Eliminar | `blockBlobClient.deleteIfExists()` |
| Existencia | `blobClient.exists()` |
| URL pública | `blockBlobClient.url` |

### 2.2 Azure Document Intelligence

| Propiedad | Valor |
|-----------|-------|
| **SDK** | `@azure/ai-form-recognizer` |
| **Auth** | Endpoint + Key (`AZURE_DI_ENDPOINT`, `AZURE_DI_KEY`) |
| **Client** | `DocumentAnalysisClient(endpoint, AzureKeyCredential(key))` |
| **Model** | `prebuilt-layout` |

**Proceso**:
1. `client.beginAnalyzeDocument('prebuilt-layout', fileBuffer)`
2. `poller.pollUntilDone()`
3. Extraer páginas → `page.lines.map(l => l.content)`
4. Retornar `{ text, pages, raw }`

### 2.3 OpenAI

| Propiedad | Valor |
|-----------|-------|
| **Auth** | API Key + URL (`OPENAI_API_KEY`, `OPENAI_API_URL`) |
| **Protocolo** | HTTP POST directo (fetch) |
| **Payload** | `{ model, messages: [{role: "system", content}, {role: "user", content}], temperature }` |

**Manejo de Errores**:
- `OPENAI_API_URL` no seteada → `AiProviderConfigException`
- `OPENAI_API_KEY` no seteada → `AiProviderConfigException`
- Error HTTP → `AiProviderException` con status code y body
- JSON inválido en respuesta → `AiProviderParseException`
- Schema inválido → error de Zod (Schema validation failed)

---

## 3. DTOs por Módulo

| Módulo | DTOs |
|--------|------|
| Auth | `LoginAuthDto`, `RegisterAuthDto`, `RefreshAuthDto`, `AuthResultDto`, `AuthUserDto` |
| SystemUser | `SystemUserDto` (roles[]), `CreateSystemUserDto`, `UpdateSystemUserDto`, `UserQueryParameters` |
| AiAnalysis | `AnalyzeTextDto`, `AiAnalysisDto`, `AiAnalysisQueryParametersDto`, `RunAiAnalysisParams`, `RunAiAnalysisResult` |
| Storage | `UploadFileOptions`, `UploadFileResult`, `DownloadFileResult` |
| Document | `ExtractedDocument` |
| Notification | — (no tiene DTOs específicos, usa el modelo directo) |
| AuthLog | — (no tiene DTOs específicos) |
| SystemLog | `CreateSystemLogDto`, `UpdateSystemLogDto` |
| RAG | `RagSearchQueryDto`, `RagSearchResultDto`, `RagTextSearchQueryDto`, `RagTextSearchResultDto`, `RagDocumentDto`, `RagChunkContextQueryDto`, `RagChunkContextResultDto` |
| Rbac | `RoleDto`, `RoleSummaryDto`, `PermissionDto` |

## 4. RBAC (roles y permisos)

> **2026-08-20**: se añadieron **endpoints REST de consulta** (módulo `rbac`) — `GET /roles/all`, `GET /roles`, `GET /roles/:identifier` y `GET /permissions`. El CRUD completo de administración (crear/editar roles, asignar permisos) y los menús dinámicos (`GET /menus/me`) siguen pendientes.

| Artefacto | Ubicación | Contenido |
|-----------|-----------|-----------|
| `ROLES` | `modules/auth/constants/roles.constants.ts` | `SUPERADMIN`, `ADMIN`, `BASIC` |
| `ROLE_DEFINITIONS` | ídem | Rol → lista de permisos |
| `RESOURCES` | `modules/auth/constants/permissions.constants.ts` | `system-user`, `ai-analysis`, `notification`, `connection`, `rag`, `system-log`, `auth` |
| `PERMISSIONS` | ídem | `system-user:read/create/update/delete`, `ai-analysis:read/create`, `notification:read/update`, `connection:read/create/update/delete`, `rag:read/search`, `system-log:read` |
| `roles.seeder.ts` | `prisma/seeders/` | Upserts idempotentes de `Resource`, `Permission`, `Role`, `RolePermission` |

**Guard**: `RolesGuard` resuelve roles/permisos del usuario en BD; **`SUPERADMIN` hace bypass** (sin validar roles ni permisos). `@Roles()` valida **al menos uno** de los roles; `@Permissions()` valida **todos** los permisos requeridos.

### 4.1 Endpoints de consulta (módulo `rbac`)

| Método | Ruta | Roles | Respuesta |
|--------|------|-------|-----------|
| GET | `/roles/all` | — (solo `RolesGuard`) | `RoleDto[]` — roles con `permissions: PermissionDto[]` |
| GET | `/roles` | — (solo `RolesGuard`) | `RoleSummaryDto[]` — `{ id, name, description, isActive, permissionCount, ... }` |
| GET | `/roles/:identifier` | ADMIN | `RoleDto` — por id (numérico) o nombre; 404 `Role "<identifier>" not found` |
| GET | `/permissions` | ADMIN | `PermissionDto[]` — `{ id, name, description, resource, resourceId }`, ordenado por recurso+nombre |

> El controlador no tiene `@UseGuards(JwtGuard)` a nivel de clase (comentado); las rutas sin `@Roles` dependen únicamente de `RolesGuard`.

> **Documentos relacionados**: [Backend Modules](01-modules.md), [Business Logic](03-business-logic.md), [Backend Security](05-security.md), [Pagination & Filters](08-pagination-filtering.md)