# =========================================================
# Frontend Dockerfile
# =========================================================
FROM node:22-slim AS base

WORKDIR /app

# Install npm and use npm instead of pnpm
FROM base AS deps

COPY package.json package-lock.json ./

RUN npm install

# =========================================================
# Builder
# =========================================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY . .

RUN npm run build

# =========================================================
# Production image
# =========================================================
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
