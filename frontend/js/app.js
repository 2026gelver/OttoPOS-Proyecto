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
     * Mapa de permisos por rol.
     *
     * Define qué módulos puede acceder cada rol
     * dentro del sistema OttoPOS.
     */
    permisos: {

        Admin: [
            "ventas",
            "inventario",
            "usuarios",
            "reportes",
            "pedidos"
        ],

        Operador: [
            "ventas",
            "inventario",
            "reportes",
            "pedidos"
        ],

        Caja: [
            "ventas",
            "pedidos"
        ],

        Cliente: [
            "ventas"
        ]

    },

    /**
     * Verifica si el usuario actual tiene permiso
     * para acceder a un módulo específico.
     *
     * @param {string} modulo identificador del módulo
     * @returns {boolean} true si tiene permiso, false si no
     */
    puede(modulo) {

        const usuario =
            this.state.usuarioActual;

        if (!usuario) return false;

        const rol =
            usuario.rol || "";

        const permitidos =
            this.permisos[rol] || [];

        return permitidos.includes(modulo);

    },

    /**
     * Aplica los permisos del usuario actual
     * al menú principal, mostrando u ocultando
     * las tarjetas según el rol.
     */
    aplicarPermisosMenu() {

        const modulos = [
            "ventas",
            "inventario",
            "usuarios",
            "reportes",
            "pedidos"
        ];

        modulos.forEach(modulo => {

            const tarjeta =
                document.getElementById(
                    "menu-" + modulo
                );

            if (!tarjeta) return;

            tarjeta.style.display =
                this.puede(modulo)
                    ? ""
                    : "none";

        });

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
     * Verifica que el usuario actual tenga permiso
     * para acceder a la pantalla solicitada.
     *
     * @param {string} pantalla identificador de la pantalla
     *                           que se desea mostrar
     */
    ir(pantalla) {

        // ==========================
        // CONTROL DE PERMISOS
        // ==========================

        /**
         * Si el usuario no tiene permiso para
         * acceder a la pantalla solicitada,
         * se redirige a una pantalla permitida.
         *
         * El menú siempre está permitido
         * para usuarios autenticados.
         */
        if (
            pantalla !== "login" &&
            pantalla !== "registro" &&
            pantalla !== "menu" &&
            !App.puede(pantalla)
        ) {

            const usuario =
                App.state.usuarioActual;

            if (usuario) {

                // Redirige a ventas si tiene permiso,
                // de lo contrario al menú.
                App.navegacion.ir(
                    App.puede("ventas")
                        ? "ventas"
                        : "menu"
                );

            } else {

                App.navegacion.ir("login");

            }

            return;

        }

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

        // ==========================
        // APLICAR PERMISOS AL MENÚ
        // ==========================

        /**
         * Cuando se muestra el menú principal,
         * se filtran las tarjetas según el rol.
         */
        if (pantalla === "menu") {

            App.aplicarPermisosMenu();

        }

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

        if (
            pantalla === "pedidos" &&
            typeof Pedidos !== "undefined"
        ) {

            Pedidos.cargarPedidos();

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