# Guia Comercial - Camara de Comercio

Proyecto fullstack para directorio de comercios local.

## Stack
- Frontend: React + Vite + CSS
- Backend: Node.js + Express
- DB: PostgreSQL
- ORM: Prisma (migraciones + seed)

## Estructura
```text
emilio/
  backend/
    prisma/
      migrations/
      schema.prisma
      seed.js
    src/
      config/
      middleware/
      routes/
      app.js
      server.js
    uploads/
    .env.example
  frontend/
    src/
      api/
      components/
      pages/
        admin/
    .env.example
```

## Configuracion rapida

### 1) Backend
```bash
cd backend
copy .env.example .env
```

Credenciales configuradas:
- PostgreSQL user: `postgres`
- PostgreSQL pass: `root`
- DB URL: `postgresql://postgres:root@localhost:5432/camara_comercio?schema=public`

Crear base de datos en PostgreSQL:
```sql
CREATE DATABASE camara_comercio;
```

Ejecutar migraciones + seed:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Levantar API:
```bash
npm run dev
```

Backend corre en: `http://localhost:4000`

### 2) Frontend
```bash
cd frontend
copy .env.example .env
npm run dev
```

Frontend corre en: `http://localhost:5173`

## CORS
- Backend habilita CORS para cualquier origen.
- Frontend además usa proxy en Vite para `/api` y `/uploads`.

## Endpoints API

### Publicos
- `GET /api/health`
- `GET /api/categories`
- `GET /api/businesses?search=&categoryId=`
- `GET /api/businesses/:id`

### Auth admin
- `POST /api/auth/login`
  - body: `{ "username": "admin", "password": "admin123" }`

### Admin (Bearer token)
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `DELETE /api/admin/categories/:id`
- `GET /api/admin/businesses`
- `POST /api/admin/businesses`
- `PUT /api/admin/businesses/:id`
- `DELETE /api/admin/businesses/:id`
- `POST /api/admin/upload/image` (multipart, campo `image`)

## Funcionalidades incluidas
- Sitio publico:
  - Home con info y destacados
  - Categorias
  - Listado de comercios
  - Busqueda por nombre
  - Filtro por categoria
  - Detalle de comercio
  - Contacto
- Panel admin:
  - Login simple
  - CRUD de categorias
  - CRUD de comercios
  - Subida de imagen y uso de URL
