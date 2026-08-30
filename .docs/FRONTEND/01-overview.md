# Frontend - Visi\u00f3n General

## 1. Tecnolog\u00eda

| Propiedad      | Valor                              |
|----------------|------------------------------------|
| Framework      | React 19 + Vite                    |
| Lenguaje       | TypeScript 5                       |
| Routing        | React Router 7                     |
| State Mgmt     | React Context                      |
| Data Tables    | @tanstack/react-table              |
| Charts         | recharts                           |
| Icons          | lucide-react                       |
| Styling        | Tailwind CSS 3                     |
| i18n           | i18next                            |
| Build          | Vite + esbuild                     |
| Package Mgr    | pnpm 10.17.1                       |

## 2. Stack Frontend

```
┌─────────────────────────────────────────────┐
│           React 19 + Vite                     │
├─────────────────────────────────────────────┤
│ Pages → Components → Services → Context      │
├─────────────────────────────────────────────┤
│ Tailwind CSS + PostCSS + Autoprefixer       │
├─────────────────────────────────────────────┤
│ Backend API (http://localhost:4000/api)      │
└─────────────────────────────────────────────┘
```

## 3. Estructura Frontend

```
apps/frontend/src/
├── App.tsx                       # React root (Auth + Theme + Router)
├── main.tsx                      # Entry point
├── index.css                     # Tailwind + base styles
│
├── components/                   # Componentes UI reutilizables
│   ├── charts/                   # Gr\u00e1ficas (recharts)
│   ├── home/                     # Widgets de home page
│   ├── layout/                   # AppLayout con sidebar + header
│   ├── menu/                     # Men\u00fa de navegaci\u00f3n
│   ├── records/                  # Tablas y vistas de records
│   ├── settings/                 # Vistas de configuraci\u00f3n
│   ├── sidebar/                  # Sidebar navigation
│   └── ui/                       # Componentes base (button, form, etc.)
│
├── context/                      # React Context providers
│   ├── AuthContext.tsx           # Auth state + user + permissions
│   ├── ThemeContext.tsx          # Theme toggle
│   └── ReloadNotificationContext.tsx
│
├── i18n/                         # Internacionalizaci\u00f3n
│   └── locales/                  # Locales (en/es)
│
├── mocks/                        # Mock data para dev
│   └── auth.ts                   # Mock login/user
│
├── pages/                        # Rutas de la aplicaci\u00f3n
│   ├── admin/                    # Admin dashboard
│   ├── home/                     # Home dashboard
│   ├── integrations/             # Conexiones y sincronizaci\u00f3n
│   ├── records/                  # Vistas de registros din\u00e1micos
│   ├── reports/                  # Reportes y gr\u00e1ficas
│   ├── Login.tsx                 # Login page
│   └── NotFound.tsx              # 404
│
├── records/                      # Sistema de records din\u00e1micos
│   ├── module-types.ts           # Tipos de m\u00f3dulos
│   ├── records.config.tsx        # Configuraci\u00f3n de registros
│   └── types.ts                  # Tipos TS
│
├── routes/                       # Configuraci\u00f3n de rutas
│   ├── guards.tsx                # ProtectedRoute, GuestRoute
│   ├── index.tsx                 # createBrowserRouter tree
│   ├── menu.config.tsx           # Men\u00fa navigation config
│   └── records-route.tsx         # Dynamic records route logic
│
└── services/                     # Servicios API
    ├── api.ts                    # HTTP client + refresh token
    ├── auth.ts                   # Auth login/logout/validate
    ├── config-events.ts          # Config event listeners
    ├── json-config.ts            # JSON config storage
    ├── module-validator.ts       # Module validation
    ├── rag.ts                    # RAG service
    └── rbac.ts                   # RBAC service
```

## 4. Principios de Dise\u00f1o

1. **Component-Based** - React component composition
2. **Context State** - React Context for global state
3. **Route Guards** - Protected/Guest routes with auth
4. **Dynamic Records** - Modular, permission-based records system
5. **Mock Fallback** - Mock data when `VITE_MOCK_ENABLED=true`
6. **Responsive** - Mobile-first with Tailwind breakpoints
7. **i18n Ready** - i18next structure for localization
8. **Lazy Loading** - Routes split with React Router

## 5. Variables de Entorno

```env
VITE_API_URL="http://localhost:4000/api/v1"
VITE_AUTH_METHOD="db"
VITE_MOCK_ENABLED="true"
VITE_LDAP_HOST=""
VITE_LDAP_PORT="389"
VITE_LDAP_BASE_DN=""
```

## 6. Dev Flow

```bash
# Dev server
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

- Dev: `localhost:5173` (Vite)
- API proxy: `/api` → `http://localhost:4000`
- CORS: Browser native (same origin via proxy)

## 7. Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
```
