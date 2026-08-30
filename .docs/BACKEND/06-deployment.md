# Backend - Despliegue e Infraestructura

## 1. Docker

### 1.1 Dockerfile Multi-stage

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json pnpm*.toml tsconfig*.json .husky/ ./
RUN pnpm install --frozen-lockfile --shamefully-honors-scripts
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npx nest build

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
CMD ["node", "dist/main", "--port", "4000"]
```

### 1.2 Docker Compose

| Archivo            | Prop\u00f3sito                        | Puertos                   |
|--------------------|------------------------------------|---------------------------|
| `docker-compose.dev.yml`  | Desarrollo con hot reload          | API :3000, FE :5173       |
| `docker-compose.prod.yml` | Producci\u00f3n (no hot reload)       | API :8500, FE :80         |

### 1.3 Servidores

| Servicio        | Imagen       | Puerto | Persistencia |
|-----------------|-------------|--------|-------------|
| postgres        | postgres:14 | 5432   | pgdata      |
| redis           | redis:7     | 6379   | redisdata   |
| api (dev)       | multi-stage | 3000   | logs        |
| api (prod)      | multi-stage | 8500   | logs        |

## 2. Health Check

```dockerfile
HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost:4000/api/ || exit 1
```

## 3. Variables de Entorno

```env
DATABASE_URL="postgresql://user:pass@postgres:5432/app_db"
SECRET_PASSPORT="your-jwt-secret"
REDIS_HOST="redis"
REDIS_PORT="6379"
REDIS_PASSWORD="redispassword"

AZURE_STORAGE_CONNECTION_STRING=""
AZURE_DI_ENDPOINT=""
AZURE_DI_KEY=""
OPENAI_API_KEY=""
PORT="3000"
```

## 4. Migraciones

```bash
# Dev
npx prisma migrate dev --name init

# Prod
npx prisma migrate deploy
npx prisma db seed
```

## 5. Scripts de Build

```bash
# Build backend
pnpm build:api

# Build frontend
pnpm build:frontend
```

## 6. Log Rotating

```typescript
const { DailyRotateFile } = require('winston-daily-rotate-file');

new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
})
```
