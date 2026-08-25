# Architecture — Modu

> **Propósito**: Describir la arquitectura general del sistema a nivel de contenedores, patrones y comunicación entre componentes.

---

## 1. Diagrama de Arquitectura (C4 — Nivel Contenedor)

```mermaid
C4Context
  title System Context - Modu

  Person(admin, "Super Administrador", "SUPERADMIN")
  Person(staff, "Operador", "BASIC")
  Person(student, "Administrador", "ADMIN")

  System_Boundary(modu, "Modu System") {
    Container(spa, "Frontend React", "React 19 + Vite 8", "Interfaz de usuario SPA")
    Container(api, "API NestJS", "NestJS 11 + TypeScript", "API REST con autenticación JWT")
    Container(db, "PostgreSQL", "PostgreSQL 14 + pgvector", "Base de datos relacional con búsqueda vectorial")
    Container(queue, "Redis + BullMQ", "Redis 7", "Colas de tareas asíncronas")
  }

  System_Ext(azureBlob, "Azure Blob Storage", "Almacenamiento de archivos")
  System_Ext(azureDI, "Azure Document Intelligence", "OCR y extracción de texto")
  System_Ext(openAI, "OpenAI (Azure)", "Análisis de texto con IA")

  Rel(admin, spa, "Usa", "HTTPS")
  Rel(staff, spa, "Usa", "HTTPS")
  Rel(student, spa, "Usa", "HTTPS")
  Rel(spa, api, "Consume API", "REST/JSON")
  Rel(api, db, "Lee/Escribe", "Prisma ORM")
  Rel(api, queue, "Encola/Procesa", "BullMQ")
  Rel(api, azureBlob, "Sube/Descarga", "HTTPS")
  Rel(api, azureDI, "OCR", "HTTPS")
  Rel(api, openAI, "Análisis IA", "HTTPS")
```

## 2. Patrón Arquitectónico: Hexagonal (Puertos y Adaptadores)

```
┌─────────────────────────────────────────────────────────┐
│                      Controllers                         │
│              (routing, validación, decoradores)          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    Services (lógica negocio)              │
│              ┌─────────────────────────────┐             │
│              │  interfaces/ (PUERTOS)      │             │
│              │  default-*.ts (ADAPTADORES) │             │
│              └─────────────────────────────┘             │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Repositories (datos)                     │
│              ┌─────────────────────────────┐             │
│              │  interfaces/ (PUERTOS)      │             │
│              │  prisma-*.ts (ADAPTADORES)  │             │
│              └─────────────────────────────┘             │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    Prisma → PostgreSQL                     │
│                    Azure Blob / DI / OpenAI              │
└─────────────────────────────────────────────────────────┘
```

### 2.1 Beneficio

El dominio (servicios + repositorios) no depende de infraestructura. Se puede reemplazar Prisma por otro ORM, Azure por AWS, o OpenAI por Anthropic cambiando solo el adaptador, sin tocar la lógica de negocio.

## 3. Flujo de Petición

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant G as Global Pipes (Validation)
    participant F as Global Filters (PrismaException)
    participant M as Middleware (CORS, Cookie)
    participant G2 as Guards (JwtGuard, RolesGuard)
    participant Ctrl as Controller
    participant Svc as Service
    participant Repo as Repository
    participant DB as PostgreSQL

    C->>M: HTTP Request (with JWT cookie/header)
    M->>G: Validate DTO
    G->>G2: Auth check
    G2->>Ctrl: Authorized
    Ctrl->>Svc: Call business logic
    Svc->>Repo: Query data
    Repo->>DB: Prisma query
    DB-->>Repo: Result
    Repo-->>Svc: Domain model
    Svc-->>Ctrl: DTO response
    Ctrl-->>C: JSON response
```

## 4. Comunicación entre Componentes

| Origen | Destino | Protocolo | Formato |
|--------|---------|-----------|---------|
| Frontend | Backend | HTTP/HTTPS | JSON (REST) |
| Backend | PostgreSQL | TCP (Prisma) | SQL |
| Backend | Redis | TCP (BullMQ) | Serializado |
| Backend | Azure Blob | HTTPS | Binario |
| Backend | Azure DI | HTTPS | JSON/Binario |
| Backend | OpenAI | HTTPS | JSON |

## 5. Paquetes Compartidos

### @modu/shared

| Artefacto | Propósito |
|-----------|-----------|
| `PaginationQueryDto` | DTO base para paginación (page, pageSize) |
| `PagedResultDto<T>` | Interfaz genérica para resultados paginados |
| `PrismaExceptionFilter` | Filtro global de excepciones Prisma |
| `normalization.util` | Utilidades de normalización (strings, IDs) |

### @modu/database

| Artefacto | Propósito |
|-----------|-----------|
| `PrismaModule` | Módulo NestJS que provee PrismaService |
| `PrismaService` | Servicio singleton de Prisma Client |
| `PrismaTx` | Tipo para transacciones Prisma |
| `PrismaUnitOfWork` | Implementación de Unit of Work con Prisma transaccional |

### Unit of Work

```typescript
// Contract
interface UnitOfWork {
  executeTransaction<T>(callback: (tx: PrismaTx) => Promise<T>): Promise<T>;
}

// Configuration
maxWait: 10s   // Espera máxima para obtener conexión
timeout: 60s   // Duración máxima de transacción
```

## 6. Decisiones Arquitectónicas Clave

Ver [Engram - ADRs](00-engram.md#2-decisiones-arquitectónicas-vinculantes) para la lista completa.

Destacadas:
- **Monorepo con pnpm** por consistencia de tipos y dependencias
- **Hexagonal** para desacoplar negocio de infraestructura
- **JWT + cookies httpOnly** para seguridad SPA
- **Unit of Work** para transacciones atómicas multi-entidad
- **RBAC granular en BD** (`Role`/`Permission`/`Resource` + `RolesGuard`) con bypass de `SUPERADMIN`

> **Documentos relacionados**: [Engram](00-engram.md), [Backend Modules](backend/01-modules.md), [Frontend Modules](frontend/01-modules-pages.md)