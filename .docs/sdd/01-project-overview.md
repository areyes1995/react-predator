# Project Overview — Modu

> **Propósito**: Definir la visión, el alcance y el contexto del sistema.

---

## 1. Nombre del Proyecto

**Modu API** — Monorepo con Backend NestJS + Frontend React + Paquetes Compartidos.

## 2. Propósito del Sistema

Plataforma institucional para gestión de usuarios con roles, procesamiento de documentos mediante OCR, análisis de texto con IA, notificaciones internas y auditoría completa de eventos.

## 3. Stakeholders

| Rol | Descripción |
|-----|-------------|
| SUPERADMIN | Acceso total sin validación. Se omite el chequeo de roles y permisos |
| ADMIN | Acceso total. CRUD usuarios, configuración, logs (todos los permisos) |
| BASIC | Acceso de solo lectura. Búsqueda RAG y listado de documentos |

## 4. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Runtime | Node.js | 22+ |
| Backend Framework | NestJS | ^11 |
| Frontend Framework | React | 19 |
| Frontend Tooling | Vite | 8 |
| ORM | Prisma | ^7 |
| Base de Datos | PostgreSQL + pgvector | 14.0 / 0.7.x |
| Colas | BullMQ + Redis | 7.x |
| Auth | JWT + Passport + bcrypt | — |
| Estilos | Tailwind CSS | 3 |
| Paquetería | pnpm | ^10.17 |
| Contenedores | Docker | 24+ |
| CI/CD | GitHub Actions | — |

## 5. Servicios Externos

| Servicio | Propósito | Módulo |
|----------|-----------|--------|
| Azure Blob Storage | Almacenamiento de archivos (documentos, transcripciones) | Storage |
| Azure Document Intelligence | OCR y extracción de texto de documentos | Document |
| OpenAI (Azure) | Análisis de texto con IA | AiAnalysis |

## 6. Estructura del Monorepo

```
modu-api/
├── apps/
│   ├── api/              ← Backend NestJS (@modu/api)
│   └── frontend/         ← Frontend React (@modu/frontend)
├── packages/
│   ├── modu-shared/      ← DTOs, utilidades, filtros (@modu/shared)
│   └── modu-database/    ← Capa Prisma, Unit of Work (@modu/database)
├── tools/                ← Scripts utilitarios
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── Dockerfile
```

## 7. Módulos del Sistema

| Módulo | Capa | Propósito |
|--------|------|-----------|
| Auth | Backend | Login, register, refresh, JWT, guards, RBAC (roles + permisos) |
| SystemUser | Backend | CRUD de usuarios del sistema con roles RBAC |
| AuthLog | Backend | Registro de eventos de autenticación |
| SystemLog | Backend | Auditoría de cambios en entidades |
| AiAnalysis | Backend | Orquestación de llamadas a IA con trazabilidad |
| Storage | Backend | Almacenamiento abstracto de archivos |
| Document | Backend | OCR con Azure Document Intelligence |
| Notification | Backend | Notificaciones internas por usuario |
| CLI | Backend | Comandos administrativos (Commander) |

## 8. Limitaciones Conocidas

| # | Limitación | Impacto |
|---|------------|---------|
| L1 | No hay definición formal del negocio | Los módulos existen pero falta visión de producto para priorizar |
| L2 | Frontend solo tiene Login + Dashboard con datos mock (excepto RAG) | El contenido real del dashboard está por implementar |
| L3 | Backend no tiene endpoint LDAP real, pero frontend lo espera | Asimetría que bloquearía integración real |
| L4 | No hay estrategia de caché definida (salvo hash input en AiAnalysis) | Sin TTL ni invalidación |
| L5 | RBAC implementado en backend (modelos + guard + seeder) pero sin menús dinámicos ni UI de administración de permisos | No se puede asignar permisos desde el frontend aún |

> **Documentos relacionados**: [Engram](00-engram.md), [Architecture](02-architecture.md)