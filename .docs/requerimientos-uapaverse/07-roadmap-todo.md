# 07 - Roadmap y Todo del Proyecto

## 1. Estado Actual

### Backend Completado
- [x] Autenticaci\u00f3n JWT + Passport (local + jwt strategies)
- [x] Guardas de autenticaci\u00f3n y roles
- [x] CRUD de SystemUser con RBAC b\u00e1sico
- [x] Sistema de logs (SystemLog + AuthLog)
- [x] Notificaciones internas
- [x] Azure Blob Storage integration
- [x] Azure Document Intelligence integration
- [x] AI Analysis module con OpenAI
- [x] RAG tables (vectoriales, con seeder)
- [x] Health check endpoint
- [x] Swagger/OpenAPI documentation
- [x] Dockerfile multi-stage build
- [x] Docker Compose (dev + prod)

### Frontend Completado
- [x] React 19 + Vite + React Router 7
- [x] Frontend auth flow con context
- [x] Frontend RBAC guards
- [x] Frontend records system con m\u00f3dulos din\u00e1micos
- [x] i18n structure (i18next)
- [x] Theme toggle (dark/light)
- [x] Layout con sidebar + header
- [x] Charts con recharts
- [x] Tables con @tanstack/react-table

### En Progreso
- [ ] Completar m\u00f3dulos de sincronizaci\u00f3n (Sync/Ingestion)
- [ ] Implementar jobs async con BullMQ
- [ ] Completar RBAC granular (permisos detallados)
- [ ] Conectar frontend con endpoints reales (reemplazar mocks)

## 2. Pr\u00f3ximos Pasos (Priorizados)

### 2.1 Backend Core

| Prioridad | Tarea | Archivo(s) | Referencia |
|-----------|-------|-----------|-------------|
| P0 | Implementar repositorios de conexi\u00f3n a sistemas externos | `modules/*/repositories/` | Schema `Connection` |
| P0 | Completar m\u00f3dulos HR (Organization, Department, Job, Employee) | `modules/hr/` | Schema `Organization`, `Employee` |
| P1 | Implementar Sync/Ingestion con BullMQ jobs | `modules/sync/` | Schema `SyncJob`, `StagingEmployee` |
| P1 | Completar RbacModule con permisos granulares | `modules/rbac/` | Schema `07-roadmap-todo.md §4` |
| P2 | Implementar notificaciones push/websocket | `modules/notification/` | Schema `Notification` |
| P2 | Crear endpoints de exportaci\u00f3n de datos | New module | API spec |
| P3 | Implementar rate limiting | `shared/filters/` | Security |

### 2.2 Frontend

| Prioridad | Tarea | Archivo(s) | Estado |
|-----------|-------|-----------|--------|
| P0 | Conectar frontend con endpoints reales (reemplazar mocks) | `services/*.ts` | Mock activo |
| P0 | Implementar vista de conexiones | `pages/integrations/` | Parcial |
| P1 | Implementar tabla de datos din\u00e1micos (records) | `records/`, `components/records/` | Estructura lista |
| P1 | Implementar reportes con gr\u00e1ficas | `pages/reports/`, `components/charts/` | Parcial |
| P1 | Completar vista de administraci\u00f3n | `pages/admin/` | Parcial |
| P2 | Agregar lazy loading en routes | `routes/index.tsx` | No implementado |
| P2 | Implementar error boundaries | `App.tsx` | No implementado |
| P3 | Agregar internacionalizaci\u00f3n completa | `i18n/` | Estructura lista |

### 2.3 Infrastructure

| Prioridad | Tarea | Archivo(s) | Estado |
|-----------|-------|-----------|--------|
| P0 | Configurar CI/CD pipeline | `.github/workflows/` | No existe |
| P0 | Agregar health checks a Redis | `docker-compose*.yml` | No existe |
| P1 | Configurar logging centralizado | `logger/` | Local files only |
| P1 | Configurar monitoring (Prometheus + Grafana) | New docker-compose | No existe |
| P2 | Implementar backups autom\u00e1ticos de DB | Docker volumes | No existe |
| P3 | Configurar CDN para assets frontend | Vite config | No existe |

## 3. Modelos de Base de Datos Pendientes

### 3.1 M\u00f3dulos con modelo en schema pero sin implementaci\u00f3n

| Modelo | M\u00f3dulo | Estado |
|--------|--------|--------|
| `Connection` | Connections | Schema listo, API pendiente |
| `Organization`, `Department`, `Job` | HR Catalogs | Schema listo, API pendiente |
| `Employee`, `EmployeeDetail` | Employees | Schema listo, API pendiente |
| `EmploymentHistory` | Employees | Schema listo, API pendiente |
| `Assignment` | Employees | Schema listo, API pendiente |
| `Platform` | Sync/Platform | Schema listo, API pendiente |
| `SyncJob`, `PlatformSyncLog` | Sync | Schema listo, API pendiente |
| `StagingEmployee`, `StagingExit` | Sync Staging | Schema listo, API pendiente |
| `StagingGenesysUser` | Sync | Schema listo, API pendiente |
| `ExitReason`, `EmployeeExit` | Turnover | Schema listo, API pendiente |
| `ExitInterview`, `ExitActionItem` | Turnover | Schema listo, API pendiente |
| `DataQualityCheck` | Turnover | Schema listo, API pendiente |
| `IdentityChangeLog` | Sync | Schema listo, API pendiente |

### 3.2 Tablas Vectoriales (RAG)

- [ ] Configurar pgvector extension en PostgreSQL
- [ ] Crear seeder para poblacion de vectores
- [ ] Implementar endpoint de b\u00fasqueda sem\u00e1ntica

## 4. Roadmap de Permisos RBAC

### 4.1 Roles Actuales

| Rol | Descripci\u00f3n | Acceso |
|-----|-------------|--------|
| SUPERADMIN | Acceso total al sistema | Todos los recursos |
| ADMIN | Administraci\u00f3n b\u00e1sica | Recursos limitados |
| ANALYST | Solo lectura de reportes | Reports |
| USER | Usuario b\u00e1sico | Registro b\u00e1sico |
| BASIC | Sin privilegios | Ninguno |

### 4.2 Recursos a Implementar

| Recurso | Permisos | Estado |
|---------|----------|--------|
| `module:auth` | `auth:read`, `auth:write` | Implementado |
| `module:system-users` | `users:read`, `users:write`, `users:delete` | Implementado |
| `module:connections` | `connections:read`, `connections:write`, `connections:test` | Pendiente |
| `module:records` | `records:read`, `records:write` | Pendiente |
| `module:reports` | `reports:read` | Pendiente |
| `module:admin` | `admin:*` | Implementado |
| `module:rag` | `rag:upload`, `rag:search` | Parcial |

### 4.3 Modelo de Permisos

```
Resource ──[1:N]── Permission ──[N:N]── RolePermission ──[N:1]── Role
                                                        │
                                                   SystemUser
                                                         │
                                                   SystemUserRole
```

**Acci\u00f3n pendiente:** Crear seeder `roles.seeder.ts` para poblar roles y permisos iniciales.

## 5. Tech Debt

| ID | Descripci\u00f3n | Impacto | Archivo |
|----|-------------|---------|---------|
| TD-01 | Reemplazar `# disabled` en scripts de build/build:api | Alto | `package.json` |
| TD-02 | docker-compose usa MySQL pero schema es PostgreSQL | Alto | `docker-compose*.yml` |
| TD-03 | Frontend: TypeScript ~6.0.2 es versi\u00f3n imposible | Alto | `apps/frontend/package.json` |
| TD-04 | Frontend: Vite ^8.1.1 es versi\u00f3n imposible | Alto | `apps/frontend/package.json` |
| TD-05 | Agregar health checks a Redis | Medio | `docker-compose*.yml` |
| TD-06 | Implementar pagination en todos los endpoints | Medio | Todos los modules |
| TD-07 | Configurar error boundaries en frontend | Alto | `App.tsx` |
| TD-08 | Agregar API versioning | Medio | `vite.config.ts` |
| TD-09 | Implementar request/response interceptors | Medio | `services/api.ts` |

## 6. Bugs a Corregir

### 6.1 docker-compose.dev.yml
- **Problema:** Usa `mysql:8.0` pero la aplicaci\u00f3n usa PostgreSQL
- **Acci\u00f3n:** Reemplazar con `postgres:14`

### 6.2 docker-compose.prod.yml
- **Problema:** Sin health check para Redis
- **Acci\u00f3n:** Agregar `command: redis-server --requirepass redis_password` y healthcheck

### 6.3 Frontend package.json
- **Problema:** `"typescript": "~6.0.2"` no existe
- **Soluci\u00f3n:** Cambiar a `"~5.9.3"`
- **Problema:** `"vite": "^8.1.1"` no existe
- **Soluci\u00f3n:** Cambiar a `"^6.x.x"`

## 7. Próximos Sprints

### Sprint 1 (2 semanas)
- [ ] Corregir docker-compose MySQL → PostgreSQL
- [ ] Corregir frontend package.json versiones
- [ ] Completar CRUD de conexiones externas
- [ ] Implementar endpoints de employees

### Sprint 2 (2 semanas)
- [ ] Configurar CI/CD pipeline
- [ ] Implementar Sync/Ingestion con BullMQ
- [ ] Completar vista de records en frontend
- [ ] Agregar paginaci\u00f3n a todos los endpoints

### Sprint 3 (2 semanas)
- [ ] Completar m\u00f3dulos HR y Turnover
- [ ] Implementar reportes con gr\u00e1ficas
- [ ] Agregar health checks a Redis
- [ ] Implementar b\u00fasqueda sem\u00e1ntica RAG
