// ===== OTTOPOS - APP.JS =====

/**
 * Objeto principal de la aplicación OttoPOS.
 *
 * Se encarga de controlar el estado general,
 * la inicialización de la aplicación y la navegación
 * entre las diferentes pantallas del sistema.
 */
const App = {

    /**
     * Estado global de la aplicación.
     *
     * Almacena la información del usuario actual
     * y la pantalla que se encuentra activa.
     */
    state: {

        usuarioActual: null,

        pantalla: "login"

    },

    /**
     * Inicializa la aplicación OttoPOS.
     *
     * Configura la navegación y carga los productos
     * del inventario cuando el módulo se encuentra disponible.
     */
    init() {

        this.navegacion.init();

        if (
            typeof Inventario !== "undefined"
        ) {

            Inventario.cargarProductos();

        }

    },

    /**
     * Muestra un mensaje temporal al usuario.
     *
     * @param {string} mensaje texto que se mostrará
     * @param {number} duracion tiempo de visualización
     *                           del mensaje en milisegundos
     */
    toast(
        mensaje,
        duracion = 3000
    ) {

        const t =
            document.getElementById("toast");

        if (!t) return;

        t.textContent = mensaje;

        t.classList.add("visible");

        setTimeout(() => {

            t.classList.remove("visible");

        }, duracion);

    }

};


// ==========================
// NAVEGACIÓN
// ==========================

/**
 * Objeto encargado de gestionar
 * la navegación entre las pantallas
 * de OttoPOS.
 */
App.navegacion = {

    /**
     * Inicializa el módulo de navegación.
     *
     * Actualmente no requiere acciones
     * adicionales al iniciar la aplicación.
     */
    init() {

        // Sin acciones al iniciar.

    },

    /**
     * Cambia la pantalla activa de la aplicación.
     *
     * @param {string} pantalla identificador de la pantalla
     *                           que se desea mostrar
     */
    ir(pantalla) {

        document
            .querySelectorAll(".pantalla")
            .forEach(
                p => p.classList.remove("activa")
            );

        const destino =
            document.getElementById(pantalla);

        if (!destino) return;

        destino.classList.add("activa");

        App.state.pantalla =
            pantalla;

        window.scrollTo(0, 0);

        if (
            pantalla === "inventario" &&
            typeof Inventario !== "undefined"
        ) {

            Inventario.cargarProductos();

        }

        if (
            pantalla === "ventas" &&
            typeof Ventas !== "undefined"
        ) {

            Ventas.cargarProductos();

        }

    }

};


// ==========================
// FUNCIÓN GLOBAL
// ==========================

/**
 * Muestra una pantalla específica de OttoPOS.
 *
 * Esta función permite realizar la navegación
 * desde otros módulos y elementos del frontend.
 *
 * @param {string} pantalla identificador de la pantalla
 *                           que se desea mostrar
 */
function mostrar(pantalla) {

    App.navegacion.ir(pantalla);

}


// ==========================
// INICIAR APP
// ==========================

/**
 * Inicia la aplicación cuando el documento HTML
 * termina de cargar completamente.
 */
document.addEventListener(
    "DOMContentLoaded",
    () => {

        App.init();

    }
);