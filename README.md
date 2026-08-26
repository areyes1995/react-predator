<p align="center">
  <img src="https://www.svgrepo.com/download/416805/react.svg" width="120" alt="React Logo" />
</p>

# General Frontend

Frontend de la aplicación **General** construido con **React**, **TypeScript**, **Vite** y **Tailwind CSS**.

---

## Stack tecnológico

- **Node.js 22** + **TypeScript**
- **React 19** + **React Router**
- **Vite** — bundler rápido
- **Tailwind CSS** — estilos utilitarios
- **pnpm** — gestor de paquetes

---

## Módulos incluidos

| Módulo | Descripción |
|--------|-------------|
| **Auth** | Contexto de autenticación con mock mode para desarrollo |
| **Layout** | Dashboard layout con sidebar, breadcrumbs y panel header |
| **Pages** | Páginas principales: Login, Home, Records, Reports, Admin, Integrations |
| **Components** | Componentes reusables: tablas, filtros, charts, forms, modals |
| **Services** | Clientes de API (auth, rag, rbac) con mock fallback |
| **i18n** | Internacionalización ES/EN con react-i18next |

---

## Inicio rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear .env (basado en .env.example)
cp .env.example .env

# 3. Iniciar en modo desarrollo
pnpm dev
```

La aplicación estará en: **http://localhost:5173**

---

## Variables de entorno (.env)

```
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Modu
VITE_TOKEN_EXPIRY_MINUTES=60
VITE_MOCK_ENABLED=true
VITE_AUTH_METHOD=ldap
```

---

## Scripts disponibles

```bash
pnpm dev        # Desarrollo con hot reload
pnpm build      # Compilar para producción
pnpm preview    # Preview del build
```

---

## Estructura del proyecto

```
.
├── src/
│   ├── components/   # Componentes UI reusables
│   ├── context/      # React contexts (Auth, Theme)
│   ├── i18n/         # Internacionalización
│   ├── pages/        # Páginas principales
│   ├── routes/       # Configuración de rutas y guards
│   ├── services/     # Clientes de API y servicios
│   └── main.tsx      # Entry point
│
├── public/           # Assets estáticos
├── vite.config.ts    # Configuración Vite
├── tailwind.config.js
├── tsconfig.app.json
└── tsconfig.node.json
```
