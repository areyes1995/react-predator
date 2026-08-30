# Modu - Documentaci\u00f3n de Dise\u00f1o del Sistema (SDD)

## 1. Visi\u00f3n General

| Propiedad      | Valor                                          |
|----------------|------------------------------------------------|
| Proyecto       | Modu                                           |
| Tipo           | Monorepo (Backend API + Frontend SPA)          |
| Versi\u00f3n API  | 1.0                                            |
| Stack          | Node.js 22 / TypeScript 5 / NestJS 11          |
| DB             | PostgreSQL (Prisma ORM 7)                      |
| Cach\u00e9/Queues | Redis 7 (BullMQ)                              |
| Deploy         | Docker / Docker Compose                        |
| Package Mgr    | pnpm 10.17.1                                   |

---

## \ud83d\udcc1 Estructura de Documentaci\u00f3n

```
.docs/
\u251c\u2500\u2500 BACKEND/              \u2190 Documentaci\u00f3n del API NestJS
\u2502   \u251c\u2500\u2500 01-overview.md        Visi\u00f3n general backend
\u2502   \u251c\u2500\u2500 02-database-design.md Prisma schema y modelos
\u2502   \u251c\u2500\u2500 03-api-specification.md Endpoints REST
\u2502   \u251c\u2500\u2500 04-module-specs.md    Especificaciones de m\u00f3dulos
\u2502   \u251c\u2500\u2500 05-security.md        Seguridad y auth
\u2502   \u2514\u2500\u2500 06-deployment.md      Docker, infraestructura
\u251c\u2500\u2500 FRONTEND/             \u2190 Documentaci\u00f3n del Frontend React
\u2502   \u251c\u2500\u2500 01-overview.md        Visi\u00f3n general frontend
\u2502   \u251c\u2500\u2500 02-system-architecture.md Componentes y estructura
\u2502   \u251c\u2500\u2500 03-pages-routes.md      Rutas y p\u00e1ginas
\u2502   \u251c\u2500\u2500 04-components.md        Componentes UI
\u2502   \u251c\u2500\u2500 05-services.md          Servicios API/Context
\u2502   \u251c\u2500\u2500 06-styling.md           Tailwind CSS y temas
\u2502   \u2514\u2500\u2500 07-deployment.md        Build y distribuci\u00f3n
\u2514\u2500\u2500 ROADMAP.md                \u2190 Plan de desarrollo (ra\u00edz del proyecto)
```

---

## 2. \u00d3rbita del Sistema

```
┌─────────────────────────────────────────────────────┐
│              FRONTEND (React 19 + Vite)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Records  │ │ Reports  │ │ Admin    │ │ Login  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└────────────────────────────┬────────────────────────┘
                             │ HTTP / WebSocket
┌────────────────────────────▼────────────────────────┐
│                    BACKEND API                         │
│              (NestJS 11 + Swagger)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Auth     │ │ System   │ │ Storage  │ │ AI     │ │
│  │ Module   │ │ User     │ │ Module   │ │ Module │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ RBAC     │ │ Logs     │ │ Notify   │ │ RAG    │ │
│  │ Module   │ │ Module   │ │ Module   │ │ Module │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
├─────────────────────────────────────────────────────┤
│ PRISMA ORM (abstraction layer)                      │
├─────────────────────────────────────────────────────┤
│ PostgreSQL  │  Redis  │  BullMQ Queues              │
└─────────────────────────────────────────────────────┘
```

---

## 3. Stack Tecnol\u00f3gico

| Capa         | Backend                              | Frontend                        |
|--------------|--------------------------------------|---------------------------------|
| Framework    | NestJS 11                            | React 19 + Vite                 |
| Lenguaje     | TypeScript 5                         | TypeScript 5                    |
| ORM          | Prisma 7                             | fetch + custom service          |
| DB           | PostgreSQL (Prisma adapter)          | (conecta a backend API)         |
| Auth         | Passport + JWT                       | localStorage + Context          |
| Routing      | (N/A - API REST)                     | React Router 7                  |
| State Mgmt   | NestJS DI                            | React Context                   |
| Tables       | (N/A)                                | @tanstack/react-table           |
| Charts       | (N/A)                                | recharts                        |
| Icons        | (N/A)                                | lucide-react                    |
| Styling      | (N/A)                                | Tailwind CSS 3                  |
| i18n         | (N/A)                                | i18next                         |
| Queues       | BullMQ                               | (N/A)                           |
| Logging      | Winston + Daily Rotate File          | (console)                       |

---

## 4. Glosario

| T\u00e9rmino        | Definici\u00f3n                                       |
|----------------|-----------------------------------------------------|
| SystemUser     | Usuario del sistema (login/password, RBAC)          |
| Employee       | Empleado con datos HR (departamento, job, etc.)     |
| SyncJob        | Trabajo de sincronizaci\u00f3n con sistemas externos     |
| Staging        | Tablas intermedias para payloads crudos             |
| AI Analysis    | Registro de llamadas a IA con hash input/output     |
| RAG            | Retrieval Augmented Generation con vectores         |
| Rbac           | Role-Based Access Control                           |
| Records        | M\u00f3dulos din\u00e1micos de datos en frontend               |

---

## 5. Documentaci\u00f3n Adicional

- [Roadmap y Plan de Desarrollo](../../07-roadmap-todo.md)
- [README del Proyecto](../../README.md)
