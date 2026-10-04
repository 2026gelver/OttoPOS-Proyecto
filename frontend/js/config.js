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
     * Corresponde al Web Service "ottopos-api" de Render.
     */
    API_PRODUCCION: "https://ottopos-api.onrender.com/api",

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
            : "https://ottopos-api.onrender.com/api"

};