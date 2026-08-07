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

    const nombre =
        (producto.nombre || "")
            .toLowerCase()
            .trim();

    return IMAGENES_PRODUCTOS[nombre]
        || "img/logo.png";

}