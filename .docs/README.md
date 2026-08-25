# 📐 Documentación de Diseño de Software (SDD)

Bienvenido a la documentación SDD del proyecto **Modu**.

Este directorio contiene los documentos de diseño de software que describen la arquitectura, componentes, datos, interfaces, seguridad y operación del sistema.

---

## 📚 Índice de documentos

### Documentación vigente

| # | Documento | Descripción |
|---|-----------|-------------|
| 1 | [Engram — Memoria del Proyecto](./sdd/00-engram.md) | Reglas inmutables, ADRs, convenciones, suposiciones y contexto esencial. **Leer primero** |
| 2 | [Project Overview](./sdd/01-project-overview.md) | Visión, alcance, stack, stakeholders |
| 3 | [Architecture](./sdd/02-architecture.md) | Arquitectura hexagonal, diagramas C4, flujo de requests |
| 4 | [Development Conventions](./sdd/09-development-conventions.md) | Git flow, estructura de archivos, estilo, dependencias |
| 5 | [Deployment & Infrastructure](./sdd/10-deployment-infrastructure.md) | Docker, CI/CD, variables de entorno |
| 6 | [Roadmap & ADRs](./sdd/12-roadmap-adr.md) | Decisiones arquitectónicas y hoja de ruta |

### Backend

| # | Documento | Descripción |
|---|-----------|-------------|
| 1 | [Backend Modules](./sdd/backend/01-modules.md) | Módulos, servicios, repositorios, controladores |
| 2 | [Data Model](./sdd/backend/02-data-model.md) | Modelo entidad-relación, esquema Prisma |
| 3 | [Business Logic](./sdd/backend/03-business-logic.md) | Reglas de negocio, Unit of Work |
| 4 | [API & Integrations](./sdd/backend/04-api-integrations.md) | API REST, Swagger, integraciones (Azure, OpenAI) |
| 5 | [Security](./sdd/backend/05-security.md) | Autenticación JWT, roles, guards |
| 6 | [Testing Strategy](./sdd/backend/06-testing-strategy.md) | Tests unitarios, E2E, integración |
| 7 | [Pagination & Filters](./sdd/backend/08-pagination-filtering.md) | Uso del helper `paginatePrisma`: tipos de filtro y paginación |

### Frontend

| # | Documento | Descripción |
|---|-----------|-------------|
| 1 | [Frontend Modules & Pages](./sdd/frontend/01-modules-pages.md) | Páginas, rutas, dominio `records/` |
| 2 | [UI/UX Design System](./sdd/frontend/02-ui-ux-design-system.md) | Design tokens, temas, componentes, i18n |
| 3 | [API Client](./sdd/frontend/03-api-client.md) | Cliente HTTP, mocks, manejo de errores |
| 4 | [Frontend Security](./sdd/frontend/04-security.md) | Almacenamiento de tokens, buenas prácticas |
| 5 | [Testing Strategy](./sdd/frontend/05-testing-strategy.md) | Estrategia de pruebas del frontend |

### Planes y pendientes

| Documento | Descripción |
|-----------|-------------|
| [Backend Roadmap & TODO](./sdd/backend/07-roadmap-todo.md) | Plan del backend: cimentación, seguridad/RBAC, conexiones, sync, reportes |
| [Frontend Roadmap & TODO](./sdd/frontend/06-roadmap-todo.md) | Plan del frontend: limpieza demo, routing, páginas de producto, UX |

### Otros

| Documento | Descripción |
|-----------|-------------|
| [CHANGELOG](./CHANGELOG.md) | Historial de cambios del proyecto |

---

## 🎯 Propósito

Este SDD sirve como referencia técnica para:

- **Comprender** la arquitectura y el diseño del sistema
- **Incorporar** nuevos desarrolladores al proyecto
- **Tomar decisiones** de diseño informadas
- **Extender** el sistema con nuevos módulos y funcionalidades
- **Mantener** consistencia arquitectónica a lo largo del tiempo

---

## 🧭 Cómo usar esta documentación

### Si eres nuevo en el proyecto
1. Comienza con el [Engram](./sdd/00-engram.md)
2. Luego revisa el [Project Overview](./sdd/01-project-overview.md)
3. Finalmente el [Architecture](./sdd/02-architecture.md)

### Si necesitas agregar un nuevo módulo
1. Revisa [Backend Modules](./sdd/backend/01-modules.md) para entender el patrón
2. Sigue el [checklist de desarrollo](./sdd/00-engram.md#84-checklist-de-desarrollo)

### Si buscas un detalle específico
Usa la tabla de contenido y navega al documento relevante.
