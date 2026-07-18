// =======================================
// API.JS
// Comunicación con Spring Boot
// =======================================

/**
 * Objeto encargado de centralizar la comunicación
 * entre el frontend de OttoPOS y la API REST
 * desarrollada con Spring Boot.
 */
const API = {

    /**
     * Obtiene la lista de productos registrados
     * en el sistema.
     *
     * @returns {Promise<Array>} lista de productos
     * @throws {Error} si ocurre un error al consultar
     *                 los productos
     */
    async obtenerProductos() {

        const respuesta = await fetch(
            `${CONFIG.API_URL}/productos`
        );

        if (!respuesta.ok) {

            throw new Error(
                "No fue posible obtener los productos."
            );

        }

        return await respuesta.json();

    },


    /**
     * Registra una nueva venta en OttoPOS.
     *
     * @param {Object} datosVenta información de la venta
     * @returns {Promise<Object>} venta guardada
     * @throws {Error} si ocurre un error al guardar
     *                 la venta
     */
    async guardarVenta(datosVenta) {

        const respuesta = await fetch(

            `${CONFIG.API_URL}/ventas`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(datosVenta)

            }

        );

        if (!respuesta.ok) {

            throw new Error(
                "No fue posible guardar la venta."
            );

        }

        // Devuelve la venta real guardada en MySQL.
        return await respuesta.json();

    },


    /**
     * Obtiene la lista de usuarios registrados
     * en el sistema.
     *
     * @returns {Promise<Array>} lista de usuarios
     * @throws {Error} si ocurre un error al consultar
     *                 los usuarios
     */
    async obtenerUsuarios() {

        const respuesta = await fetch(

            `${CONFIG.API_URL}/usuarios`

        );

        if (!respuesta.ok) {

            throw new Error(
                "No fue posible obtener los usuarios."
            );

        }

        return await respuesta.json();

    },


    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param {Object} usuario información del usuario
     * @returns {Promise<Object>} usuario guardado
     * @throws {Error} si ocurre un error al guardar
     *                 el usuario
     */
    async guardarUsuario(usuario) {

        const respuesta = await fetch(

            `${CONFIG.API_URL}/usuarios`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(usuario)

            }

        );

        if (!respuesta.ok) {

            throw new Error(
                "No fue posible guardar el usuario."
            );

        }

        return await respuesta.json();

    }

};