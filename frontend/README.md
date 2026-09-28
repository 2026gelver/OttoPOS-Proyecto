# 🧇 OttoPOS

OttoPOS es un sistema web desarrollado para administrar un negocio de venta de arepas. Permite gestionar ventas, inventario, usuarios y generar facturas de forma sencilla e intuitiva.

## 🚀 Tecnologías utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Java
- Spring Boot

### Base de datos
- MySQL

## 📁 Estructura del proyecto

```text
OttoPOS-Proyecto/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   └── img/
└── README.md
```

## 👤 Usuarios de prueba

| Usuario | Contraseña | Rol |
|---------|------------|------|
| admin | 1234 | Administrador |
| operador | 0000 | Operador |
| caja | 9999 | Caja |

## ✅ Funcionalidades

- Inicio de sesión con validación de usuarios.
- Gestión de ventas y facturación.
- Administración de inventario.
- Gestión de usuarios.
- Reportes del sistema.
- Interfaz web responsive.

## ⚙️ Requisitos

- Java JDK 21
- Spring Boot
- MySQL
- XAMPP
- Visual Studio Code

## ▶️ Ejecución del proyecto

1. Iniciar MySQL desde XAMPP.
2. Ejecutar el backend con Spring Boot.
3. Abrir el frontend desde Visual Studio Code.
4. Ejecutar `index.html` con Live Server.

## 🚀 Despliegue en línea (gratuito)

El proyecto se publica con tres servicios sin costo:

| Servicio | Función |
|---|---|
| **GitHub Pages** | Aloja el frontend (`https://2026gelver.github.io/OttoPOS-Proyecto/`) |
| **Render (Free)** | Ejecuta el backend Spring Boot (API REST) |
| **Aiven MySQL Free** | Base de datos en la nube |

La carpeta [`deploy/`](../deploy/GUIA-DEPLOY.md) contiene la guía paso a paso:
crear la BD en Aiven, desplegar el backend en Render y activar GitHub Pages.
El flujo automático está en [`.github/workflows/pages.yml`](../.github/workflows/pages.yml).

> ⚠️ Plan gratuito de Render: el servicio se duerme a los 15 min de inactividad
> (la primera petición tarda ~50 s en despertar). Ideal para demostración.

## 👨‍💻 Autor

**Gelver Rodríguez**

Proyecto desarrollado como evidencia para el programa **Tecnólogo en Análisis y Desarrollo de Software (ADSO) - SENA**.