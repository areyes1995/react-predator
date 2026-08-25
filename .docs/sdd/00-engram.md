# 🧠 Engram — Memoria del Proyecto Modu

> **Propósito**: Este documento captura todo lo que el proyecto "debe recordar" durante su ciclo de vida. Cualquier desarrollador, IA o mantenedor **debe leer esto primero** antes de modificar el código.

---

## 1. Reglas del Dominio Inmutables

Estas reglas reflejan la naturaleza del negocio y **nunca deben cambiar** sin una revisión arquitectónica formal.

| # | Regla | Justificación |
|---|-------|---------------|
| R1 | Todo cambio de datos de una entidad debe registrarse en `SystemLog` (auditoría) | Trazabilidad obligatoria para sistemas educativos/institucionales |
| R2 | El registro de auditoría (`AuthLog`, `SystemLog`) nunca debe interrumpir el flujo principal | Regla "fire and forget" — el fallo de logging no debe tumbar una operación crítica |
| R3 | El hash de contraseña debe ser bcrypt con costo 10 | Política de seguridad mínima |
| R4 | Un usuario desactivado (`isActive = false`) o con soft delete (`deletedAt != null`) no puede autenticarse | Integridad del acceso |
| R5 | El `employeeId` debe almacenarse normalizado: mayúsculas, sin espacios ni caracteres especiales | Consistencia de búsqueda |
| R6 | El email debe almacenarse normalizado: minúsculas, sin espacios | Consistencia de login |
| R7 | Toda notificación pertenece exactamente a un usuario y no puede ser compartida | Privacidad de datos |
| R8 | El análisis de IA debe ser trazable: cada llamada debe persistirse en `AiAnalysis` | Auditabilidad, reproducibilidad, costos |
| R9 | El sistema de archivos debe ser abstracto mediante interfaz (`FileStorageService`), no acoplado a Azure | Portabilidad entre proveedores cloud |

---

## 2. Decisiones Arquitectónicas Vinculantes

Decisiones ya tomadas que no deben revertirse sin ADR formal.

| ID | Decisión | Alternativa descartada | Razón |
|----|----------|------------------------|-------|
| ADR-001 | Monorepo con pnpm workspaces | Multi-repo | Consistencia de tipos compartidos, single version, facilidad de CI |
| ADR-002 | NestJS como framework backend | Express, Fastify | Arquitectura modular nativa, DI, Guards, decoradores, ecosistema maduro |
| ADR-003 | Prisma como ORM | TypeORM, Drizzle | Generación de tipos, migraciones, DX, soporte PostgreSQL 14 |
| ADR-004 | Patrón Hexagonal (Puertos y Adaptadores) | MVC tradicional | Desacoplamiento de infraestructura, testabilidad, intercambiabilidad |
| ADR-005 | JWT + Passport + cookies httpOnly | Sesiones, OAuth2 puro | Stateless, compatible con frontend SPA, seguridad contra XSS |
| ADR-006 | React 19 + Vite 8 | Next.js, Remix | SPA ligera, no requiere SSR, simplicidad de deploy |
| ADR-007 | Tailwind CSS (v3 actual, migrar a v4 cuando estable) | CSS Modules, Styled Components | Consistencia, velocidad de desarrollo, no runtime |
| ADR-008 | PostgreSQL 14 como base de datos | MySQL 8, MongoDB | Requisito del negocio (compatibilidad con sistemas legacy educativos); PostgreSQL habilita pgvector para embeddings de IA |
| ADR-009 | Redis + BullMQ para colas | RabbitMQ, Kafka | Simplicidad, ya presente en el stack, suficiente throughput |
| ADR-010 | Azure Blob Storage + Azure Document Intelligence + OpenAI | AWS S3 + Textract, GCP | Contrato del cliente/usuario final |
| ADR-012 | Base vectorial (RAG) sobre pgvector | Servicio vectorial externo (Pinecone/Weaviate), OpenSearch | Búsqueda en la propia BD **sin IA**: semántica directa por vector (`<=>`), full-text (`search_vector`/trigram), listado de documentos (`GET /rag/documents`) y **contexto de chunk** (`GET /rag/chunks/:id/context`); tablas restauradas desde dump y modeladas en Prisma sin migraciones; embeddings `nvidia/nv-embedqa-e5-v5` (1024 dims); UI en Records View (búsqueda con expand/contexto + subida de documento) |
| ADR-013 | RBAC granular en base de datos | Roles como enum en código, permisos hardcodeados en guards | Roles, recursos y permisos en tablas (`Role`, `Resource`, `Permission`, `RolePermission`, `SystemUserRole`) sembradas desde constantes (`roles.seeder.ts`); `@Roles()` + `@Permissions()`; `RolesGuard` resuelve roles/permisos del usuario en BD con **bypass para `SUPERADMIN`**; los **permisos efectivos se exponen al frontend** (`SystemUserDto`/`AuthUserDto.permissions` vía `/auth/me` y `/auth/login`) para filtrar módulos/vistas/menú (visibilidad de UI, no autorización — el backend siempre valida). Roles sembrados: `SUPERADMIN`, `ADMIN`, `BASIC`. Endpoints REST de consulta RBAC añadidos 2026-08-20 (`/roles*`, `/permissions`) |

---

## 3. Convenciones Obligatorias

### 3.1 Estructura de Módulo Backend

```
modules/<dominio>/
├── controllers/       ← Solo routing + decoradores
├── services/
│   ├── interfaces/    ← Puerto (contrato)
│   └── default-*.ts   ← Adaptador (implementación)
├── repositories/
│   ├── interfaces/    ← Puerto
│   └── prisma-*.ts    ← Adaptador
├── dtos/              ← Data Transfer Objects
├── enums/             ← Enumeraciones del dominio
├── exceptions/        ← Excepciones específicas
└── <dominio>.module.ts
```

### 3.2 Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Módulos | kebab-case | `ai-analysis`, `system-user` |
| Clases | PascalCase | `DefaultAuthService`, `JwtGuard` |
| Interfaces | PascalCase | `AuthService`, `FileStorageService` |
| DTOs | PascalCase + sufijo `Dto` | `LoginAuthDto`, `SystemUserDto` |
| Archivos | kebab-case | `system-user.service.ts` |
| Controllers | PascalCase + `Controller` | `AuthController` |
| Servicios | PascalCase + `Service` | `DefaultAuthService` |

### 3.3 Inyección de Dependencias

- Usar **string tokens** para servicios con múltiples implementaciones: `@Inject('AuthService')`
- Usar clases directamente cuando hay una sola implementación
- Los módulos exportan los tokens, no las implementaciones concretas

### 3.4 Manejo de Errores

- Usar excepciones HTTP estándar de NestJS (`NotFoundException`, `ConflictException`, etc.)
- Crear excepciones de dominio solo cuando el error es específico del negocio
- El filtro global `PrismaExceptionFilter` captura errores de base de datos

---

## 4. Restricciones Técnicas

| # | Restricción | Motivo |
|---|-------------|--------|
| T1 | No usar `any` en TypeScript salvo en casos extremos documentados | Mantenibilidad y seguridad de tipos |
| T2 | No agregar dependencias sin aprobación del arquitecto | Control de deuda técnica y seguridad |
| T3 | Toda nueva tabla debe tener `createdAt`, `updatedAt` y opcionalmente `deletedAt` | Consistencia en el modelo de datos |
| T4 | Toda foreign key debe tener índice propio | Performance en consultas JOIN |
| T5 | No almacenar secrets en el código ni en variables de entorno del frontend (VITE_*) | Seguridad — todo VITE_* se expone al cliente |
| T6 | El frontend nunca debe confiar en el token JWT para decisiones de UI sin validar con el backend | Seguridad — el token puede estar manipulado |
| T7 | No exponer datos sensibles (passwordHash, tokens) en respuestas API | Privacidad y seguridad |
| T8 | Toda comunicación con servicios externos (Azure, OpenAI) debe tener timeout y manejo de fallos | Resiliencia |
| T9 | Si la búsqueda semántica acepta texto libre, el vector de consulta debe generarse con el **mismo modelo** de embeddings que los chunks (`nvidia/nv-embedqa-e5-v5`, `input_type=query`). La búsqueda directa por vector (`<=>`) y la full-text (`search_vector`/trigram) **no requieren IA** | Los vectores de consulta deben ser comparables con los almacenados |

---

## 5. Suposiciones del Proyecto

| # | Suposición | Impacto si cambia |
|---|------------|-------------------|
| S1 | El sistema operará mayoritariamente en instituciones educativas con PostgreSQL 14 + pgvector | Migrar a otro motor requeriría cambiar Prisma schema y seeders |
| S2 | Los usuarios tienen email institucional único | Soportar múltiples emails por usuario requeriría rediseño del modelo |
| S3 | La infraestructura cloud será Azure | Migrar a AWS/GCP requeriría reimplementar Storage, DI y posiblemente AI |
| S4 | El volumen de análisis de IA es moderado (< 1000/día) | Escalar requeriría rediseñar colas y caché |
| S5 | El frontend es una SPA sin necesidad de SSR ni SEO | Si se requiere SEO, migrar a Next.js o similar |
| S6 | Los usuarios pueden autenticarse contra LDAP o base de datos local | Si se requiere otro método (SSO, OAuth2 social), extender AuthService |

---

## 6. Contexto Esencial

### 6.1 ¿Qué resuelve Modu?

> ⚠️ **Información faltante**: No hay una definición formal del negocio. Basado en el código existente:
> - Gestión de usuarios con roles RBAC (`SUPERADMIN`, `ADMIN`, `BASIC`) persistidos en BD (`Role`/`Permission`/`Resource`) y sembrados desde `roles.seeder.ts`
> - Procesamiento de documentos con OCR (Azure Document Intelligence)
> - Análisis de texto con IA (OpenAI) con trazabilidad completa
> - Notificaciones internas por usuario
> - Auditoría de eventos de autenticación y cambios de datos
> - Almacenamiento de archivos en Azure Blob

### 6.2 Flujo de datos de alto nivel

```
Usuario → Frontend (React) → API (NestJS) → Prisma → PostgreSQL
                                    ├── Azure Blob Storage (archivos)
                                    ├── Azure Document Intelligence (OCR)
                                    ├── OpenAI (análisis IA)
                                    └── pgvector (búsqueda semántica RAG — SQL crudo)
```

### 6.3 Tipos de análisis IA soportados

| Tipo | Propósito |
|------|-----------|
| `VALIDATION_REQUEST_ITEM` | Análisis de texto genérico (sentimiento, keywords, resumen) |
| `PENSUM_IMPORT` | Importación de pensum académico |
| `STUDENT_SUBJECT_IMPORT` | Importación de materias de estudiantes |

---

## 7. Documentos Relacionados

| Documento | Ubicación |
|-----------|-----------|
| Project Overview | [01-project-overview.md](01-project-overview.md) |
| Architecture | [02-architecture.md](02-architecture.md) |
| Backend Modules | [backend/01-modules.md](backend/01-modules.md) |
| Data Model | [backend/02-data-model.md](backend/02-data-model.md) |
| Business Logic | [backend/03-business-logic.md](backend/03-business-logic.md) |
| API & Integrations | [backend/04-api-integrations.md](backend/04-api-integrations.md) |
| Backend Security | [backend/05-security.md](backend/05-security.md) |
| Backend Testing | [backend/06-testing-strategy.md](backend/06-testing-strategy.md) |
| **Backend Roadmap & TODO** | [backend/07-roadmap-todo.md](backend/07-roadmap-todo.md) |
| **Pagination & Filters** | [backend/08-pagination-filtering.md](backend/08-pagination-filtering.md) |
| Frontend Modules | [frontend/01-modules-pages.md](frontend/01-modules-pages.md) |
| UI/UX Design System | [frontend/02-ui-ux-design-system.md](frontend/02-ui-ux-design-system.md) |
| Frontend API Client | [frontend/03-api-client.md](frontend/03-api-client.md) |
| Frontend Security | [frontend/04-security.md](frontend/04-security.md) |
| Frontend Testing | [frontend/05-testing-strategy.md](frontend/05-testing-strategy.md) |
| **Frontend Roadmap & TODO** | [frontend/06-roadmap-todo.md](frontend/06-roadmap-todo.md) |
| Dev Conventions | [09-development-conventions.md](09-development-conventions.md) |
| Deployment | [10-deployment-infrastructure.md](10-deployment-infrastructure.md) |
| Roadmap & ADRs | [12-roadmap-adr.md](12-roadmap-adr.md) |

---

> **Versión**: 1.0.0

## 8. Metodología SDD

> **Propósito**: Describir la metodología de desarrollo de sistemas (SDD) aplicada al proyecto Modu.

### 8.1 Fases del proyecto

| Fase | Entregable | Herramientas |
|------|------------|------------|
| 1. Análisis | Documentación de requerimientos, diagramas de casos de uso | Markdown, Lucidchart |
| 2. Diseño | Diagramas C4, ADRs, contratos de API | Mermaid, Draw.io |
| 3. Implementación | Código fuente, tests unitarios y de integración | NestJS, Prisma, Jest |
| 4. Verificación | Cobertura de pruebas >=80%, revisión de código | GitHub Actions, CodeQL |
| 5. Despliegue | CI/CD, Docker, Helm charts | GitHub Actions, Docker Hub |
| 6. Mantenimiento | Monitoreo, actualización de documentación | Prometheus, Grafana |

### 8.2 Principios clave

- **Documentar primero**: Cada decisión importante se registra como ADR.
- **Versionado**: Todas las decisiones versionadas y referenciadas en el Engram.
- **Seguridad por diseño**: Cada ADR que afecte seguridad pasa por revisión.
- **Código como documentos**: Comentarios y convenciones alineados con documentación.
- **Automatización**: CI/CD y scripts de generación de documentación.

### 8.3 Integración con Engram

Todas las nuevas decisiones se agregan en `00-engram.md` como ADRs y se enlazan desde aquí.

### 8.4 Checklist de Desarrollo

| ✔️ | Check | Descripción |
|---|-------|-------------|
| 1 | Rama `feat/<scope>` | Cumplir Convenciones de Commits |
| 2 | `npm run lint` | Linter sin advertencias |
| 3 | `npm run test` | Cobertura >=80% en módulos nuevos |
| 4 | `npm run build` | Compilar sin errores |
| 5 | `git commit --no-edit` | Mensaje de commit conforme Convenciones |
| 6 | `git push` | Abrir PR para revisión |
| 7 | `npm run docs:update` | Actualizar documentación si corresponde |
| 8 | `npm run premerge:checks` | Ejecutar check premerge |

> Este checklist también se almacena en `00-engram.md`.

**Última revisión**: 2026-08-19
**Próxima revisión sugerida**: Cuando se agregue un nuevo módulo o servicio externo
> **Última revisión**: 2026-08-19
> **Próxima revisión sugerida**: Cuando se agregue un nuevo módulo o servicio externo