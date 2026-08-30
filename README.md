<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS Backend Starter

Backend starter listo para usar con **NestJS**, **Prisma ORM**, **MySQL 8**, **Redis** y **Docker**, ejecutándose con **Node 22**.

---

## 📦 Stack tecnológico

- **Node.js 22** + **TypeScript 5**
- **NestJS 11** con inyección de dependencias y arquitectura modular
- **Prisma ORM 7** — type-safe, migraciones, queries optimizadas
- **MySQL 8** — base de datos relacional
- **Redis 7** — colas BullMQ + caché
- **Docker** + **Docker Compose** — entornos dev y prod
- **pnpm** — gestor de paquetes rápido

---

## 🧱 Módulos incluidos

| Módulo | Descripción |
|--------|-------------|
| **Auth** | Autenticación JWT + Passport (local + jwt strategies) + guards de roles |
| **System User** | Gestión de usuarios con roles RBAC (SUPERADMIN, ADMIN, ANALYST), contraseñas hasheadas |
| **Auth Log** | Registro de eventos de autenticación (login éxito/fallo, logout) |
| **System Log** | Auditoría de cambios en entidades del sistema |
| **Storage** | Subida/descarga de archivos a Azure Blob Storage |
| **Document** | Extracción de texto de documentos (Azure Document Intelligence) |
| **AI Analysis** | Orquestación de llamadas a proveedores de IA con trazabilidad completa |
| **Notification** | Sistema de notificaciones internas por usuario |
| **CLI** | Comandos de consola (nest-commander) para tareas administrativas |

---

## 🏗 Arquitectura

Cada módulo sigue el patrón **interfaz → implementación** con repositorios abstractos:

```
src/modules/<domain>/
├── controllers/        # Endpoints REST
├── services/
│   ├── interfaces/     # Contratos
│   └── default-*.ts    # Implementaciones
├── repositories/
│   ├── interfaces/     # Contratos de datos
│   └── prisma-*.ts     # Implementaciones Prisma
├── dtos/               # DTOs con validación
├── enums/              # Enumeraciones
└── <domain>.module.ts  # Módulo NestJS
```

### Principios aplicados
- **Inyección de dependencias** — módulos importan interfaces, el contenedor resuelve implementaciones
- **Repository Pattern** — abstracción de base de datos
- **Unit of Work** — transacciones atómicas
- **DTOs con validación** — class-validator + class-transformer

---

## ⚙️ Requisitos

- Docker + Docker Compose

No necesitas MySQL, Redis ni Node instalados localmente.

---

## 🚀 Inicio rápido

```bash
# 1. Clonar y entrar
git clone <tu-repo> && cd backend-starter

# 2. Crear .env (basado en .env.example)
cp .env.example .env

# 3. Iniciar en modo desarrollo
docker compose -f docker-compose.dev.yml up

# La API estará en: http://localhost:4000
# Swagger en:       http://localhost:4000/api
```

---

## 📄 Variables de entorno (.env)

```
# MYSQL
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=app_db
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword

# PRISMA
DATABASE_URL="mysql://appuser:apppassword@mysql:3306/app_db"

# REDIS
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redispassword

# JWT
SECRET_PASSPORT=your-secret-key

# AZURE STORAGE
AZURE_STORAGE_CONNECTION_STRING=

# AZURE DOCUMENT INTELLIGENCE
AZURE_DI_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_DI_KEY=

# OPENAI (opcional)
OPENAI_API_URL=https://your-openai-instance.openai.azure.com/
OPENAI_API_KEY=

# APP
PORT=3000
```

---

## 🐳 Comandos Docker

```bash
# Desarrollo (hot reload)
docker compose -f docker-compose.dev.yml up
docker compose -f docker-compose.dev.yml down

# Producción
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml down

# Resetear base de datos
docker compose -f docker-compose.dev.yml down -v
```

---

## 🛠 Scripts disponibles

```bash
# Desarrollo
pnpm start:dev        # Hot reload
pnpm start:debug      # Debug mode

# CLI
pnpm start:cli user:create-admin --email admin@test.com --password 12345 ...

or 

pnpm run start:cli user:create-admin --email 'admin@test.com' --password Admin@1234 --first-name Admin --last-name Sistema --role BASIC
  
# Testing
pnpm test             # Unit tests
pnpm test:e2e         # E2E tests
pnpm test:cov         # Coverage

# Build
pnpm build            # Compilar a dist/
pnpm start:prod       # Producción
```

---

## 🔧 Agregar un nuevo módulo

```bash
# 1. Generar módulo con Nest CLI
npx nest g module modules/<nombre>

# 2. Crear estructura
src/modules/<nombre>/
├── controllers/
├── services/
│   ├── interfaces/
│   └── default-*.ts
├── repositories/
│   ├── interfaces/
│   └── prisma-*.ts
├── dtos/
├── enums/
└── <nombre>.module.ts

# 3. Agregar modelo en prisma/schema.prisma
# 4. Crear migración: npx prisma migrate dev --name <nombre>
# 5. Importar módulo en app.module.ts
```

---

## 🔐 Primer inicio de sesión

```bash
# 1. Crear el administrador inicial
pnpm run start:cli user:create-admin \
  --email admin@tuapp.com \
  --password tucontraseña \
  --first-name Admin \
  --last-name Sistema \
  --personal-id 12345678

# 2. Login (POST /auth/login) con email + password
# 3. Usar el token JWT en los headers: Authorization: Bearer <token>
```

---

## 📁 Estructura del proyecto

```
.
├── prisma/
│   ├── schema.prisma       # Modelos de base de datos
│   ├── prisma.module.ts    # Módulo NestJS para Prisma
│   └── prisma.service.ts   # Servicio singleton PrismaClient
│
├── src/
│   ├── main.ts             # Entry point HTTP
│   ├── main-cli.ts         # Entry point CLI
│   ├── app.module.ts       # Módulo raíz
│   │
│   ├── cli/                # Comandos CLI
│   ├── logger/             # Winston logger
│   ├── shared/             # Código compartido (DTOs, filtros, Unit of Work)
│   └── modules/            # Módulos funcionales
│       ├── auth/           # Autenticación JWT
│       ├── auth-log/       # Logs de autenticación
│       ├── system-user/    # Usuarios del sistema
│       ├── SystemLog/      # Auditoría
│       ├── storage/        # Azure Blob Storage
│       ├── document/       # Azure Document Intelligence
│       ├── ai-analysis/    # Análisis con IA
│       └── notification/   # Notificaciones
│
├── test/                   # Tests E2E
├── Dockerfile              # Build multi-stage
├── docker-compose.dev.yml  # Entorno desarrollo
├── docker-compose.prod.yml # Entorno producción
└── .github/workflows/      # CI/CD
```