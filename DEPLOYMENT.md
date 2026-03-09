# 🚀 Guía de Despliegue en Render - Emilio

Esta guía te ayudará a desplegar tu aplicación full-stack (Backend + Frontend + PostgreSQL) en Render utilizando un archivo Blueprint.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Archivo render.yaml](#archivo-renderyaml)
- [Paso a Paso](#paso-a-paso)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Ejecutar el Seed de Prisma](#ejecutar-el-seed-de-prisma)
- [Verificación Post-Despliegue](#verificación-post-despliegue)
- [Comandos Útiles](#comandos-útiles)
- [Solución de Problemas](#solución-de-problemas)
- [Limitaciones del Plan Free](#limitaciones-del-plan-free)

---

## 📦 Requisitos Previos

- Cuenta de GitHub con el repositorio del proyecto
- Cuenta en [Render](https://render.com) (puedes registrarte gratis con GitHub)
- Git instalado localmente
- Node.js y npm instalados

---

## 📁 Estructura del Proyecto

```
emilio/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── render.yaml          ← Ya creado
└── DEPLOYMENT.md        ← Este archivo
```

---

## 📄 Archivo render.yaml

✅ **El archivo `render.yaml` ya está creado en la raíz del proyecto.**

Contiene la configuración para:
- **Backend API**: Node.js + Express + Prisma
- **Frontend**: React + Vite (static site)
- **Base de datos**: PostgreSQL

---

## 🔧 Paso a Paso

### **1. Subir los Archivos al Repositorio**

```bash
# Verifica que estás en la raíz del proyecto
cd c:\Users\nicol\github\emilio

# Verifica que los archivos existan
dir render.yaml
dir DEPLOYMENT.md

# Agrega los archivos al repositorio
git add render.yaml DEPLOYMENT.md
git commit -m "Add Render deployment configuration and documentation"
git push origin main
```

### **2. Crear Cuenta en Render**

1. Ve a [https://render.com](https://render.com)
2. Haz clic en **"Get Started"**
3. Selecciona **"Sign in with GitHub"**
4. Autoriza a Render para acceder a tus repositorios

### **3. Crear el Blueprint**

1. En el Render Dashboard, haz clic en **"New +"** (esquina superior derecha)
2. Selecciona **"Blueprint"**
3. Conecta tu repositorio de GitHub: **`emilio`**
4. Render detectará automáticamente el archivo **`render.yaml`**
5. Revisa la configuración mostrada:
   - ✅ `emilio-backend` (Web Service)
   - ✅ `emilio-frontend` (Static Site)
   - ✅ `emilio-db` (PostgreSQL Database)
6. Haz clic en **"Apply"**

### **4. Esperar el Despliegue Inicial**

Render comenzará a:
- Crear la base de datos PostgreSQL
- Construir y desplegar el backend
- Construir y desplegar el frontend

Esto puede tomar **5-10 minutos**. Puedes ver el progreso en tiempo real en los logs.

---

## 🔐 Configuración de Variables de Entorno

### **Variables del Backend**

Después de que los servicios se creen, verifica estas variables en **`emilio-backend`** → **Environment**:

```bash
NODE_ENV=production
PORT=4000
DATABASE_URL=[auto-generado por Render]
JWT_SECRET=[auto-generado o configura manualmente]
ADMIN_PASSWORD=[auto-generado o configura manualmente]
```

**Recomendación:** Configura manualmente `JWT_SECRET` y `ADMIN_PASSWORD` por seguridad:

1. Ve a **`emilio-backend`** → **Environment**
2. Edita o agrega:
   ```
   JWT_SECRET=tu_secreto_jwt_super_seguro_de_al_menos_32_caracteres
   ADMIN_PASSWORD=tu_password_admin_seguro
   ```
3. Haz clic en **"Save Changes"**
4. El servicio se redespliegará automáticamente

### **Variables del Frontend**

Verifica en **`emilio-frontend`** → **Environment**:

```bash
VITE_API_URL=https://emilio-backend.onrender.com/api
```

**Importante:** Esta URL debe incluir `/api` al final.

---

## 🌱 Ejecutar el Seed de Prisma

El seed inicial poblará tu base de datos con categorías, negocios y eventos de ejemplo.

### **Opción A: Desde el Shell de Render (Recomendado)**

1. Ve a **`emilio-backend`** en tu Render Dashboard
2. Haz clic en la pestaña **"Shell"** (lado derecho)
3. Espera a que se abra la terminal
4. Ejecuta:
   ```bash
   cd backend
   npx prisma db seed
   ```
5. Verás la salida confirmando que los datos se insertaron

### **Opción B: Automatizar en el Build**

Si quieres que el seed se ejecute automáticamente en cada deploy, modifica el `buildCommand` en `render.yaml`:

```yaml
buildCommand: cd backend && npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed
```

**⚠️ Advertencia:** Esto ejecutará el seed en cada redespliegue, lo que puede crear datos duplicados si no usas `skipDuplicates`.

---

## ✅ Verificación Post-Despliegue

### **1. Verificar el Backend**

Visita: `https://emilio-backend.onrender.com/api/health`

Deberías ver:
```json
{
  "status": "ok"
}
```

### **2. Verificar el Frontend**

Visita: `https://emilio-frontend.onrender.com`

Deberías ver la página principal de tu aplicación.

### **3. Probar la Conexión Frontend-Backend**

1. En el frontend, navega a la página de Negocios o Eventos
2. Verifica que los datos se carguen correctamente
3. Si ves datos vacíos, ejecuta el seed de Prisma

### **4. Probar el Login de Admin**

1. Ve a: `https://emilio-frontend.onrender.com/admin/login`
2. Ingresa:
   - **Username:** `admin`
   - **Password:** El valor que configuraste en `ADMIN_PASSWORD`
3. Deberías poder acceder al dashboard de administración

---

## 🛠️ Comandos Útiles

### **Ver Logs en Tiempo Real**

En Render Dashboard:
- Ve al servicio (backend o frontend)
- Haz clic en la pestaña **"Logs"**

### **Acceder al Shell del Backend**

1. Ve a **`emilio-backend`**
2. Clic en **"Shell"**
3. Ejecuta comandos:
   ```bash
   # Ver estructura de carpetas
   ls -la
   
   # Ver variables de entorno
   env | grep DATABASE_URL
   
   # Ejecutar migraciones
   cd backend && npx prisma migrate deploy
   
   # Ejecutar seed
   cd backend && npx prisma db seed
   
   # Ver status de migraciones
   cd backend && npx prisma migrate status
   ```

### **Redesplegar Manualmente**

Si necesitas forzar un redespliegue:
1. Ve al servicio
2. Haz clic en **"Manual Deploy"** → **"Deploy latest commit"**

### **Comandos de Prisma (Local)**

```bash
# Generar Prisma Client
cd backend
npx prisma generate

# Ejecutar migraciones pendientes
npx prisma migrate deploy

# Ver estado de migraciones
npx prisma migrate status

# Ejecutar seed
npx prisma db seed

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Abrir Prisma Studio
npx prisma studio
```

---

## 🐛 Solución de Problemas

### **Error: "Cannot connect to database"**

**Solución:**
1. Verifica que la variable `DATABASE_URL` esté configurada correctamente
2. Ve a **`emilio-db`** y copia la **Internal Database URL**
3. Pégala manualmente en **`emilio-backend`** → **Environment** → `DATABASE_URL`

### **Error: "Module not found" o errores de build**

**Solución:**
1. Verifica que `package.json` tenga todas las dependencias
2. En el Shell, ejecuta:
   ```bash
   cd backend
   npm install
   ```
3. Redespliega el servicio

### **Frontend no se conecta al Backend**

**Solución:**
1. Verifica que `VITE_API_URL` en el frontend apunte a la URL correcta del backend
2. Actualiza el CORS en `backend/src/app.js`:
   ```javascript
   app.use(
     cors({
       origin: [
         'https://emilio-frontend.onrender.com',
         'http://localhost:5173'
       ],
       credentials: true,
       methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
       allowedHeaders: ["Content-Type", "Authorization"],
     })
   );
   ```
3. Redespliega el backend después de hacer el cambio

### **El servicio se duerme (Plan Free)**

**Comportamiento normal:** Los servicios gratuitos se duermen después de 15 minutos de inactividad.

**Solución temporal:**
- La primera petición después de que se duerma puede tardar 50 segundos
- Considera usar un servicio de "ping" como [UptimeRobot](https://uptimerobot.com/) (gratis) para mantenerlo activo

**Solución permanente:**
- Actualiza a un plan de pago ($7/mes por servicio)

### **Las imágenes subidas desaparecen**

**Problema:** En el plan free, el disco es efímero. Los archivos subidos se pierden cuando el servicio se redespliega.

**Solución:** Usa un servicio externo de almacenamiento:
- [Cloudinary](https://cloudinary.com/) (gratis hasta 25GB)
- [AWS S3](https://aws.amazon.com/s3/)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

### **Error: "Prisma Client not generated"**

**Solución:**
```bash
cd backend
npx prisma generate
```

O verifica que el `buildCommand` incluya `npx prisma generate`.

---

## ⚠️ Limitaciones del Plan Free

| Característica | Plan Free | Solución |
|----------------|-----------|----------|
| **Tiempo de inactividad** | Se duerme después de 15 min | UptimeRobot o plan de pago |
| **Disco efímero** | Las cargas se pierden | Cloudinary/S3 |
| **Base de datos** | Expira a los 90 días | Plan de pago o migrate a otro servicio |
| **Ancho de banda** | 100 GB/mes | Plan de pago |
| **Build time** | 500 horas/mes compartidas | Suficiente para proyectos pequeños |
| **RAM** | 512 MB | Plan de pago si necesitas más |

---

## 🌐 URLs Finales

Después del despliegue exitoso, tendrás:

| Servicio | URL |
|----------|-----|
| **Backend API** | `https://emilio-backend.onrender.com` |
| **Frontend** | `https://emilio-frontend.onrender.com` |
| **Health Check** | `https://emilio-backend.onrender.com/api/health` |
| **Admin Login** | `https://emilio-frontend.onrender.com/admin/login` |

---

## 🔄 Workflow de Actualización

Para actualizaciones futuras:

1. **Hacer cambios localmente**
   ```bash
   # Edita tu código
   git add .
   git commit -m "Tu mensaje de commit"
   git push origin main
   ```

2. **Despliegue Automático**
   - Render detectará el push a `main`
   - Redespliegará automáticamente (`autoDeploy: true`)
   - Verás el progreso en los logs

3. **Si hay cambios en el schema de Prisma**
   ```bash
   # Local: crear migración
   cd backend
   npx prisma migrate dev --name nombre_cambio
   
   # Push al repo
   git add .
   git commit -m "Add database migration"
   git push origin main
   
   # Render ejecutará automáticamente: npx prisma migrate deploy
   ```

---

## 📚 Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Render Blueprint Reference](https://render.com/docs/blueprint-spec)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## 📝 Checklist de Despliegue

- [ ] Archivo `render.yaml` creado y pusheado al repo
- [ ] Cuenta de Render creada y conectada a GitHub
- [ ] Blueprint aplicado en Render Dashboard
- [ ] Base de datos PostgreSQL creada
- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] Variables de entorno configuradas (`JWT_SECRET`, `ADMIN_PASSWORD`)
- [ ] Seed de Prisma ejecutado
- [ ] Health check funcionando (`/api/health`)
- [ ] Login de admin funcionando
- [ ] Datos cargándose correctamente en el frontend

---

## 🎉 ¡Listo!

Tu aplicación está ahora desplegada en producción. Si tienes problemas, revisa los logs en Render Dashboard o consulta la sección de [Solución de Problemas](#solución-de-problemas).

**¿Necesitas ayuda?** Abre un issue en el repositorio o consulta la documentación de Render.

---

**Última actualización:** Marzo 9, 2026
