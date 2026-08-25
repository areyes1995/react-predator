# Testing Strategy — Modu (Backend)

> **Propósito**: Definir la estrategia de pruebas para el backend.

---

## 1. Stack de Testing

| Herramienta | Propósito |
|-------------|-----------|
| **Jest** | Test runner y assertions |
| **Supertest** | Tests E2E HTTP |
| **ts-jest** | Transformer TypeScript |

---

## 2. Tipos de Prueba

### 2.1 Unitarias (Jest)

| Propiedad | Valor |
|-----------|-------|
| **Ubicación** | Junto al archivo: `*.spec.ts` |
| **Cobertura objetivo** | 80%+ en servicios, 100% en validaciones |
| **Mock de datos** | Prisma mockeado, servicios mockeados |
| **Lo que prueba** | Lógica de negocio, validaciones, transformaciones |

**Qué mockear**:
- `PrismaService` — retornar datos controlados
- Servicios externos (Azure, OpenAI) — retornar respuestas predecibles
- `JwtService` — retornar tokens mock

**Qué NO mockear**:
- DTOs y sus validaciones (se prueban con datos reales)
- Interfaces (no tienen implementación que probar)

**Ejemplo de estructura**:
```
modules/auth/
├── services/
│   ├── interfaces/
│   ├── default-auth.service.ts
│   └── default-auth.service.spec.ts  ← Tests aquí
├── controllers/
│   ├── auth.controller.ts
│   └── auth.controller.spec.ts       ← Tests aquí
```

### 2.2 E2E (Supertest)

| Propiedad | Valor |
|-----------|-------|
| **Ubicación** | `test/` en raíz de `apps/api/` |
| **Base de datos** | Test database (PostgreSQL separada) o mock |
| **Lo que prueba** | Flujo completo: controller → service → repository → DB |

**Endpoints a cubrir prioritariamente**:
1. `POST /auth/login` — éxito, fallo de email, fallo de password
2. `POST /auth/register` — éxito con ADMIN, fallo sin rol
3. `GET /auth/me` — token válido, token inválido, token expirado
4. `GET /users` — paginación, filtros
5. `POST /ai-analysis/analyze-text` — éxito, caché

### 2.3 Pruebas de Integración

Para módulos con dependencias externas (Azure, OpenAI), las pruebas deben usar **mocks** del servicio HTTP, no hacer llamadas reales a los proveedores.

---

## 3. Comandos

```bash
# Tests unitarios
pnpm test

# Tests con cobertura
pnpm test:cov

# Tests E2E
pnpm test:e2e
```

---

## 4. Estado Actual

| Módulo | Unit tests | E2E tests |
|--------|------------|-----------|
| Auth | ✅ Parcial (app.controller.spec.ts existe) | ❌ |
| SystemUser | ❌ | ❌ |
| AiAnalysis | ❌ | ❌ |
| Storage | ❌ | ❌ |
| Document | ❌ | ❌ |
| Notification | ❌ | ❌ |
| AuthLog | ❌ | ❌ |
| SystemLog | ❌ | ❌ |
| CLI | ❌ | ❌ |

---

## 5. Prioridad de Implementación

| Prioridad | Módulo | Razón |
|-----------|--------|-------|
| 1 | Auth | Flujo crítico de seguridad |
| 2 | AiAnalysis | Costo económico de cada llamada IA |
| 3 | SystemUser | CRUD base del sistema |
| 4 | Notification | Depende de usuarios |
| 5 | Storage | Depende de Azure (mockeable) |
| 6 | Document | Depende de Azure (mockeable) |
| 7 | AuthLog, SystemLog | Logging secundario |

> **Documentos relacionados**: [Backend Modules](01-modules.md), [Business Logic](03-business-logic.md)