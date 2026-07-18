# 🧇 OttoPOS — Estructura del Proyecto

## Estructura de carpetas

```
OttoPOS/
├── index.html                  ← Archivo principal (todas las pantallas)
├── css/
│   └── styles.css              ← Todos los estilos del sistema
├── js/
│   ├── app.js                  ← Estado global y navegación
│   ├── login.js                ← Lógica de autenticación y validación
│   ├── ventas.js               ← Módulo de ventas y facturación
│   └── inventario-usuarios.js ← Inventario, usuarios y reportes
└── img/
    └── (logo, íconos, etc.)
```

## Usuarios de prueba

| Usuario   | Contraseña | Rol      |
|-----------|------------|----------|
| admin     | 1234       | Admin    |
| operador  | 0000       | Operador |
| caja      | 9999       | Caja     |

## Funcionalidades

### Login
- Validación en tiempo real (campo por campo)
- Mensajes de error animados
- Enter para confirmar

### Ventas
- Agregar/eliminar productos del pedido
- Total actualizado en tiempo real
- Selección de medio de pago
- Factura modal con número y fecha

### Inventario
- Ver stock actual
- Editar cantidades
- Alerta de stock bajo

### Usuarios
- Agregar usuarios con rol
- Validación de campos
- Eliminar usuarios

## Cómo abrir en VS Code

1. Abrir la carpeta `OttoPOS/` en VS Code
2. Instalar la extensión **Live Server**
3. Click derecho sobre `index.html` → **Open with Live Server**
