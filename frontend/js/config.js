// =======================================
// CONFIGURACIÓN GENERAL DE LA API
// =======================================

/**
 * Objeto que centraliza la configuración
 * de comunicación entre el frontend de OttoPOS
 * y la API REST desarrollada con Spring Boot.
 */
const CONFIG = {

    /**
     * URL base de la API de producción (hosting en Render).
     * Se usa cuando la app se sirve desde Internet
     * (GitHub Pages o dominio propio).
     * IMPORTANTE: reemplaza <TU-API> por la URL real
     * que obtendrás al crear el Web Service en Render.
     */
    API_PRODUCCION: "https://<TU-API>.onrender.com/api",

    /**
     * URL base utilizada para realizar
     * las solicitudes a la API REST.
     * En local (Live Server/archivo) usa el backend local;
     * en producción usa la API cloud.
     */
    API_URL:
        (window.location.hostname === "localhost"
            || window.location.hostname === "127.0.0.1"
            || window.location.protocol === "file:")
            ? "http://localhost:8081/api"
            : "https://<TU-API>.onrender.com/api"

};