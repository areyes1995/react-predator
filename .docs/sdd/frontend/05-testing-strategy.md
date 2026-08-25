# Testing Strategy — Modu (Frontend)

> **Propósito**: Definir la estrategia de pruebas para el frontend React.

---

## 1. Estado Actual

**⚠️ No hay tests implementados en el frontend.** No hay dependencias de testing en `package.json`, no hay archivos `*.spec.ts` ni `*.test.ts`.

---

## 2. Stack Recomendado

| Herramienta | Propósito |
|-------------|-----------|
| **Vitest** | Test runner (nativo de Vite, compatible con Jest API) |
| **@testing-library/react** | Renderizado y queries de componentes |
| **@testing-library/jest-dom** | Matchers DOM personalizados |
| **msw** (Mock Service Worker) | Mock de llamadas HTTP en tests |

**Por qué Vitest en lugar de Jest**:
- Configuración cero con Vite (mismo tooling)
- API compatible con Jest
- Mayor velocidad que Jest
- Soporte nativo de ESM y TypeScript

---

## 3. Tipos de Prueba

### 3.1 Unitarias

| Propiedad | Valor |
|-----------|-------|
| **Ubicación** | Junto al componente: `*.test.tsx` |
| **Lo que prueba** | Componentes UI, hooks, funciones de servicio |

**Prioridad**:
1. `FormInput` — render, onChange, forwardRef, icono, disabled
2. `FormButton` — render, loading state, children, icon, disabled
3. `FormField` — render, label, error message, children
4. `TextCarousel` — render, active item, transición

### 3.2 De Integración (Componentes + Contexto)

| Propiedad | Valor |
|-----------|-------|
| **Lo que prueba** | AuthContext + componentes que lo consumen |

**Escenarios a cubrir**:
1. `AuthProvider` + `Login` — login exitoso, login fallido, validación frontend
2. `AuthProvider` + `ProtectedRoute` — autenticado redirige a dashboard, no autenticado redirige a login
3. `AuthProvider` + `GuestRoute` — invitado ve login, autenticado redirige a dashboard

### 3.3 E2E (futuro)

| Propiedad | Valor |
|-----------|-------|
| **Herramienta** | Playwright o Cypress |
| **Lo que prueba** | Flujo completo login → dashboard → logout |

---

## 4. Mocks en Tests

### 4.1 Mock de API

Usar **msw** para interceptar llamadas HTTP en lugar de mockear `api.ts`:

```typescript
// Ejemplo de handler
http.post('*/auth/login', () => {
  return HttpResponse.json({
    token: 'mock-token',
    user: { id: '1', email: 'admin@modu.com', name: 'Admin', role: 'ADMIN' }
  })
})
```

### 4.2 Mock de AuthContext

Para componentes que consumen `useAuth()`, crear un wrapper personalizado:

```typescript
function renderWithAuth(ui: ReactElement, { authState }: { authState: Partial<AuthContextType> }) {
  return render(
    <AuthContext.Provider value={{ ...defaultAuthState, ...authState }}>
      {ui}
    </AuthContext.Provider>
  )
}
```

---

## 5. Cobertura Objetivo

| Tipo | Cobertura | Componentes |
|------|-----------|-------------|
| UI Components | 100% | FormInput, FormButton, FormField, TextCarousel |
| Auth flows | 100% | AuthContext, login, logout, validateToken |
| Guards | 100% | ProtectedRoute, GuestRoute |
| Pages | 80% | Login (form submission, validation), Dashboard |
| Services | 80% | api.ts (request/response), auth.ts (login flow) |

---

## 6. Comandos Propuestos

```bash
# Tests unitarios + integración
pnpm --filter @modu/frontend test

# Tests con cobertura
pnpm --filter @modu/frontend test -- --coverage

# Modo watch (desarrollo)
pnpm --filter @modu/frontend test -- --watch
```

---

## 7. Prioridad de Implementación

| Prioridad | Módulo | Prueba | Razón |
|-----------|--------|--------|-------|
| 1 | `FormInput`, `FormButton` | Unitaria | Componentes base de todo el sistema |
| 2 | `AuthContext` | Integración | Corazón de la autenticación |
| 3 | `Login page` | Integración | Flujo crítico |
| 4 | `ProtectedRoute`, `GuestRoute` | Unitaria | Seguridad de navegación |
| 5 | `api.ts`, `auth.ts` | Unitaria | Capa de comunicación |
| 6 | `TextCarousel`, `FormField` | Unitaria | Componentes secundarios |
| 7 | Dashboard | Integración | Una vez implementado |

> **Documentos relacionados**: [Frontend Modules](01-modules-pages.md), [API Client](03-api-client.md), [Frontend Security](04-security.md)