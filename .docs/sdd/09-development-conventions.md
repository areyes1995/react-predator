# Development Conventions — Modu

> **Propósito**: Establecer las convenciones de desarrollo que todo contribuyente debe seguir. Las reglas vinculantes están en el [Engram](00-engram.md).

---

## 1. Flujo de Trabajo con Git

### 1.1 Estrategia de Branching

```
main         → Producción (solo merge desde release/hotfix)
├── develop  → Integración (branch base para features)
├── feat/*   → Nuevas funcionalidades (desde develop)
├── fix/*    → Correcciones (desde develop)
├── release/*→ Preparación de release (desde develop)
└── hotfix/* → Correcciones urgentes en producción (desde main)
```

### 1.2 Formato de Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance>): <descripción>

[opcional: cuerpo]
[opcional: footer]
```

Tipos permitidos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`.

Ejemplos:
```
feat(ai-analysis): add cache invalidation by TTL
fix(auth): handle expired refresh token gracefully
docs(sdd): add backend business logic document
```

## 2. Estructura de Archivos

### 2.1 Backend

Ver [Engram - Convenciones](00-engram.md#3-convenciones-obligatorias) para la estructura de módulos.

Reglas adicionales:

- Un archivo = una exportación principal (clase/función)
- Los DTOs van planos (sin lógica), la transformación está en los servicios
- Los controladores no contienen lógica de negocio
- Los servicios no conocen HTTP (ni Request, ni Response)

### 2.2 Frontend

```
src/
├── components/
│   ├── ui/           ← Componentes atómicos (Button, Input, Carousel)
│   └── layout/       ← Layouts (Header, Sidebar, Shell)
├── pages/            ← Páginas del router (Login, Dashboard, NotFound)
├── context/          ← React Context providers
├── services/         ← Capa HTTP (api.ts, auth.ts)
├── hooks/            ← Custom hooks (futuro)
├── mocks/            ← Datos falsos para desarrollo
├── types/            ← Interfaces y tipos compartidos (futuro)
├── App.tsx           ← Raíz de la aplicación (importa el router de ./routes)
├── routes/           ← Router separado: tabla de rutas (index.tsx), guards (guards.tsx),
│                      RecordsRoute (records-route.tsx) y menú del sidebar (menu.config.tsx)
├── main.tsx          ← Entry point
└── index.css         ← Estilos globales
```

## 3. TypeScript

| Regla | Valor |
|-------|-------|
| strict mode | `true` |
| noImplicitAny | `true` |
| strictNullChecks | `true` |
| ES2022 modules | `true` |
| Ruta base | `src/` (backend), `src/` (frontend) |
| Path aliases | `@modu/*` para paquetes internos |

## 4. Estilo de Código

- Usar `Prettier` con la configuración del proyecto (`.prettierrc`)
- Usar `ESLint` con `eslint.config.mjs` del root
- No usar `console.log` en producción — usar `LoggerService` (Winston)
- Los nombres de variables en inglés (el dominio en español si aplica)
- Tests junto al módulo: `*.spec.ts`

## 5. Paquetes y Dependencias

- Preferir dependencias oficiales de NestJS o de la comunidad estable
- No agregar dependencias sin revisión
- Las dependencias de desarrollo van en `devDependencies`
- Usar `pnpm` — no mezclar con npm/yarn

## 6. Documentación

- Todo endpoint público debe tener decoradores `@ApiResponse` de Swagger
- Las interfaces de servicios deben tener JSDoc explicando el propósito
- Los DTOs deben tener `@ApiProperty` para generación de Swagger
- Los cambios arquitectónicos requieren ADR (ver [Roadmap & ADRs](12-roadmap-adr.md))

> **Documentos relacionados**: [Engram](00-engram.md), [Architecture](02-architecture.md)