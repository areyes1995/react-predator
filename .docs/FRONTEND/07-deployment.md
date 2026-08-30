# Frontend - Despliegue y Build

## 1. Build Process

### Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react(), serveLocalConfig()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: { usePolling: true },
    hmr: { overlay: true },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

### Plugin: serveLocalConfig
```typescript
// Middleware para servir archivos de configuraci\u00f3n locales
GET /local-config/{key}.json → serve static JSON
POST /local-config/{key}.json → write JSON to file
```

## 2. Scripts

```bash
# Development (localhost:5173)
pnpm dev

# Build (dist/)
pnpm build

# Preview (local preview of build)
pnpm preview
```

## 3. Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css      # Compiled Tailwind CSS
│   ├── index-[hash].js       # Bundled React app
│   └── [chunk]-[hash].js     # Lazy loaded chunks
```

## 4. Docker (Production)

### Dockerfile (Frontend)
```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Config
```nginx
server {
  listen 80;
  location / {
    try_files $uri $uri/ /index.html;
  }
  location /api {
    proxy_pass http://backend:4000;
  }
}
```

## 5. Docker Compose Integration

### Dev (`docker-compose.dev.yml`)
```yaml
services:
  frontend:
    build: ./apps/frontend
    ports:
      - "5173:5173"
    volumes:
      - ./apps/frontend/src:/app/src
    environment:
      - VITE_API_URL=http://localhost:4000/api/v1
      - VITE_MOCK_ENABLED=true
```

### Prod (`docker-compose.prod.yml`)
```yaml
services:
  frontend:
    build: ./apps/frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=/api/v1
      - VITE_MOCK_ENABLED=false
```

## 6. Environment Variables

| Variable             | Dev            | Prod           |
|---------------------|----------------|----------------|
| VITE_API_URL        | localhost:4000 | /api/v1 (proxy)|
| VITE_MOCK_ENABLED   | true           | false          |
| VITE_AUTH_METHOD    | db             | db/ldap        |
| VITE_LDAP_HOST      | localhost      | ldap.company   |

## 7. Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  curl -f http://localhost:80/ || exit 1
```

## 8. TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```
