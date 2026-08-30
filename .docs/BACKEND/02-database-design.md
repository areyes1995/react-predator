# Backend - Dise\u00f1o de Base de Datos

## 1. Tecnolog\u00eda

| Propiedad     | Valor                         |
|---------------|-------------------------------|
| Motor         | PostgreSQL                      |
| ORM           | Prisma 7                        |
| Schema File   | `prisma/schema.prisma`          |
| Multi-file    | `prisma/models/*.prisma`        |
| Migrations    | `prisma/migrations/`            |
| Seeders       | `prisma/seeders/*.seeder.ts`    |
| Config        | `prisma.config.ts`              |

## 2. Modelo de Datos Principal

### 2.1 Plataforma (RBAC)

```
SystemUser ──[N:N]── SystemUserRole ──[N:N]── RolePermission ──[N:1]── Resource
                                                        │
                                                   Permission
```

**Entidades:**
- `SystemUser` - Usuarios del sistema (id, email, passwordHash, roles)
- `Role` - Roles del sistema (SUPERADMIN, ADMIN, etc.)
- `Resource` - Recursos del sistema
- `Permission` - Permisos individuales
- `RolePermission` - Tabla N:N

### 2.2 Empleados y HR

```
Organization ── [N]── Department
                    └── [N]── Job
                            └── [N]── Employee
                                   ├── [N]── EmployeeDetail
                                   ├── [N]── EmploymentHistory
                                   ├── [N]── Assignment (self-ref supervisor)
                                   ├── [N]── IdentityChangeLog
                                   ├── [N]── EmployeeExit
                                   └── [N]── StagingEmployee
```

**Entidades:**
- `Organization`, `Department`, `Job`, `Lob`, `Modality`, `WorkLocation` - Cat\u00e1logos HR
- `Employee` - Entidad central de empleados
- `EmployeeDetail` - Detalles por plataforma externa
- `EmploymentHistory` - Historial de cambios
- `Assignment` - Asignaciones (supervisores, equipos)

### 2.3 Sincronizaci\u00f3n

```
Platform ── [N]── SyncJob
                  └── [N]── PlatformSyncLog
                          └── [N]── EmployeeDetail

StagingEmployee ← [Sync] → External Systems (Odoo, Genesys, Kimai)
StagingExit ← [Sync] → External Systems
```

**Entidades:**
- `Connection` - Conexiones a sistemas externos (API/DB)
- `Platform` - Plataformas externas
- `SyncJob` - Trabajos de sincronizaci\u00f3n
- `PlatformSyncLog` - Logs detallados
- `StagingEmployee`, `StagingExit`, `StagingGenesysUser` - Tablas de staging

### 2.4 Turnover / Exit Insights

```
EmployeeExit ── [1]── ExitReason
                    └── [N]── ExitInterview
                    └── [N]── ExitActionItem
DataQualityCheck → (entity + recordId)
```

**Entidades:**
- `ExitReason` - Categor\u00edas de salida
- `EmployeeExit` - Registros de salida
- `ExitInterview` - Entrevistas de salida
- `ExitActionItem` - Acciones derivadas
- `DataQualityCheck` - Checks de calidad

### 2.5 AI y Logs

```
SystemUser ── [N]── AiAnalysis
                  └── [N]── AuthLog
                  └── [N]── Notification
                  └── [N]── SystemLog
```

**Entidades:**
- `AiAnalysis` - Registro de llamadas IA (prompt, response, tokens, costo)
- `AuthLog` - Logs de autenticaci\u00f3n (login, logout)
- `Notification` - Notificaciones internas
- `SystemLog` - Auditor\u00eda de cambios

## 3. Enumeraciones

| Enum | Valores | Dominio |
|------|---------|---------|
| `AuthEvent` | LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT | Auth |
| `AiAnalysisType` | VALIDATION_REQUEST_ITEM, PENSUM_IMPORT, STUDENT_SUBJECT_IMPORT | AI |
| `AiAnalysisStatus` | PENDING, RUNNING, COMPLETED, FAILED | AI |
| `AiRecommendation` | APPROVE, REJECT, REVIEW_MANUAL | AI |
| `RecordStatus` | ACTIVE, INACTIVE | General |
| `EmployeeStatus` | ACTIVE, LICENSE, INACTIVE, TERMINATED, PENDING | HR |
| `SyncSource` | ODOO, GENESYS, KIMAI, INTRANET, OTHER | Sync |
| `SyncType` | PULL, PUSH, FULL, INCREMENTAL | Sync |
| `ConnectionType` | API, DATABASE | Connections |
| `ApiAuthType` | NONE, BEARER, BASIC, API_KEY, OAUTH2 | Connections |

## 4. Convenciones

| Convenci\u00f3n | Ejemplo |
|-----------|---------|
| IDs datos | `BigInt` con autoincrement |
| ID plataforma | `Int` con autoincrement |
| Timestamps | `createdAt`, `updatedAt` |
| Soft delete | `deletedAt` en todos los modelos |
| Secretos | `credentialsEncrypted` (AES-256-GCM) |
| \u00danico compuesto | `@@id([field1, field2])` |
| \u00cdndices | `@@index([...])` |

## 5. RAG Tables (Ignored by Prisma)

Las siguientes tablas tienen `@@ignore` y no se gestionan por migraciones Prisma:

- `documents` - Documents con metadata y vectores
- `document_chunks` - Chunks con embeddings
- `embedding_models` - Configuraciones de embedding
- `ingestion_runs` - Runs de ingesti\u00f3n

Acceso via `$queryRaw`. Se crean/restauran con `prisma/seeders/vector.seeder.ts`.
