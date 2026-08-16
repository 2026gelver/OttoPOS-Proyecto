// =======================================
// IMAGENES-PRODUCTOS.JS
// Mapeo de productos a sus imágenes
// =======================================

/**
 * Mapeo de nombres de productos a sus
 * rutas de imagen correspondientes.
 *
 * Se usa como respaldo cuando el producto
 * no tiene imagenUrl configurada en la BD.
 */
const IMAGENES_PRODUCTOS = {

    "arepa burger": "img/Arepa Burger.jpg",
    "arepa queso": "img/Arepa Queso.jpg",
    "arepa mixta": "img/Arepa Mixta.jpg",
    "arepa chorizo": "img/Arepa Chorizo.jpg",
    "arepa pizza": "img/AREPA PIZZA.jpg",
    "coca cola": "img/Coca Cola.jpg",
    "colombiana": "img/Colombiana.jpg",
    "agua": "img/Agua.jpg",
    "quatro": "img/Quatro.jpg",
    "sprite": "img/Sprite.jpg",
    "manzana": "img/Manzana.png"

};

/**
 * Obtiene la imagen mapeada según el nombre
 * de un producto.
 *
 * @param {string} nombre nombre del producto
 * @returns {string} ruta de la imagen mapeada
 *                   o el logo por defecto
 */
function obtenerImagenPorNombre(nombre) {

    const clave =
        (nombre || "")
            .toLowerCase()
            .trim();

    return IMAGENES_PRODUCTOS[clave]
        || "img/logo.png";

}

/**
 * Obtiene la imagen de un producto.
 *
 * Prioridad:
 * 1. imagenUrl del producto (si existe)
 * 2. Imagen del mapeo según el nombre
 * 3. Logo por defecto
 *
 * @param {Object} producto producto a evaluar
 * @returns {string} ruta de la imagen
 */
function obtenerImagenProducto(producto) {

    if (
        producto.imagenUrl
        && producto.imagenUrl.trim() !== ""
    ) {

        return producto.imagenUrl;

    }

    return obtenerImagenPorNombre(
        producto.nombre
    );

}

/**
 * Maneja el error de carga de una imagen
 * en la interfaz.
 *
 * Intenta mostrar primero la imagen mapeada
 * según el nombre del producto. Si ya se está
 * mostrando esa imagen o el logo, se queda
 * con el logo por defecto.
 *
 * @param {HTMLImageElement} imagen elemento img
 * @param {string} nombre nombre del producto
 */
function imagenFallback(imagen, nombre) {

    const imagenNombre =
        obtenerImagenPorNombre(nombre);

    const actual =
        imagen.getAttribute("src");

    if (
        actual === imagenNombre
        || actual === "img/logo.png"
    ) {

        imagen.src = "img/logo.png";

        return;

    }

    imagen.src = imagenNombre;

}
