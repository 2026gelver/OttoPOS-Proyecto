# 🚀 Guía de despliegue gratuito de OttoPOS

Stack 100 % sin costo:

| Pieza | Servicio | URL |
|---|---|---|
| Frontend (web) | GitHub Pages | https://2026gelver.github.io/OttoPOS-Proyecto/ |
| Backend (API REST) | Render (Free) | https://<TU-API>.onrender.com |
| Base de datos | Aiven (MySQL Free) | ver conexión en Aiven |

---

## Paso 1 — Base de datos en Aiven (MySQL Free)

1. Crea una cuenta en https://aiven.io (no pide tarjeta de crédito).
2. Crea un servicio **MySQL** y elige el plan **Free**.
3. Espera a que el estado sea **RUNNING**.
4. Abre la pestaña **Overview** → **Connection info**:
   - Copia el **Host**, **Port**, **Database name** (normalmente `defaultdb`),
     el **User** (normalmente `avnadmin`) y la **Password**.
5. Opcional: en la pestaña del servicio, crea una base llamada `ottopos` y
   da permiso al usuario. Si usas `defaultdb` no hace falta.

**Conexión en Spring Boot** (se definen como variables de entorno en Render):

```
SPRING_DATASOURCE_URL=jdbc:mysql://TU_HOST:TU_PUERTO/defaultdb?ssl-mode=REQUIRED
SPRING_DATASOURCE_USERNAME=avnadmin
SPRING_DATASOURCE_PASSWORD=TU_CONTRASENA
```

> La tabla y las columnas se crean solas al arrancar la app
> (`spring.jpa.hibernate.ddl-auto=update`).

---

## Paso 2 — Backend en Render (Free)

1. Crea una cuenta en https://render.com (puedes entrar con GitHub).
2. **New +** → **Web Service** → conecta el repositorio `OttoPOS-Proyecto`.
3. Configuración:
   - **Name**: `ottopos-api` (te dará la URL `https://ottopos-api.onrender.com`).
   - **Runtime**: `Docker` (usa el `Dockerfile` del proyecto).
   - **Root Directory**: `backend/ottopos`.
   - **Plan**: `Free`.
4. En **Environment**, define las variables del Paso 1
   (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).
   Render inyecta `PORT` automáticamente.
5. **Create Web Service** y espera el build (la primera vez ~5-10 min).
6. Verifica la API entrando a `https://ottopos-api.onrender.com/api/productos`
   (debe devolver JSON, no error).

> ⚠️ Plan Free: el servicio se detiene a los 15 min sin uso y la primera
> petición tarda ~50 s en despertar. Suficiente para demostración/evidencia;
> para uso comercial real se recomienda un plan de pago o VPS.

---

## Paso 3 — Frontend en GitHub Pages (gratis)

1. En GitHub, abre el repositorio → **Settings** → **Pages**:
   - **Source**: selecciona **"GitHub Actions"** (importante).
2. El flujo `.github/workflows/pages.yml` publica la carpeta `frontend/`
   en cada push a `master`.
3. La web queda en: **https://2026gelver.github.io/OttoPOS-Proyecto/**

**Conectar el frontend con tu API:**
- Si creaste el servicio de Render con el nombre `ottopos-api` (como indica el
  Paso 2), **no necesitas cambiar nada**: `frontend/js/config.js` ya apunta a
  `https://ottopos-api.onrender.com/api`.
- Si le pusiste otro nombre, abre `frontend/js/config.js` y reemplaza
  `ottopos-api` por el nombre de tu servicio de Render.
- Haz push: el flujo redespliega automáticamente.

> **CORS:** la API solo acepta peticiones desde GitHub Pages
> (`https://2026gelver.github.io`) y orígenes locales por defecto. Cuando uses
> un **dominio propio**, agrégalo en Render como variable de entorno:
> `CORS_ALLOWED_ORIGINS=https://tudominio.com,https://2026gelver.github.io`.

---

## Paso 4 — (Opcional) Login con Google

Para que el botón "Continuar con Google" funcione en la web pública:

1. Entra a https://console.cloud.google.com → Crea/Abre el proyecto.
2. **APIs y servicios** → **Pantalla de consentimiento** → verifica dominio
   (opcional, solo si tu app quedará publicada con dominio propio).
3. **Credenciales** → OAuth 2.0 → edita el cliente usado en `index.html`
   (debe ser de tipo **Aplicación web**).
4. En **Orígenes de JavaScript autorizados** (Authorized JavaScript origins)
   añade las URL públicas del frontend:
   - `https://2026gelver.github.io`   (GitHub Pages)
   - `https://tudominio.com`          (si usarás dominio propio)
   
   > ⚠️ IMPORTANTE: para Google Sign-In (GSI) lo que se configura son los
   > **orígenes de JavaScript autorizados**, no las "URIs de redireccionamiento".
   > El backend valida el token en `POST /api/auth/google`, así que no necesita
   > URI de redirección.
5. Guarda. (La URL pública del frontend y de la API.)

---

## Paso 5 — Registros finales

Cuando todo esté desplegado, las URLs para el negocio son:

- **Web del sistema**: https://2026gelver.github.io/OttoPOS-Proyecto/
- **API REST**: https://ottopos-api.onrender.com
- **BD**: Aiven MySQL (solo accesible desde el backend)

Usuarios de prueba: `admin/1234`, `operador/0000`, `caja/9999`.