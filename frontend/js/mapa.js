// =======================================
// MAPA.JS
// Mapa de ubicación del negocio con Leaflet
// =======================================

/**
 * Inicializa el mapa de OpenStreetMap
 * con un marcador en la ubicación del negocio.
 */
function inicializarMapa() {

    const contenedor =
        document.getElementById(
            "mapa-negocio"
        );

    if (!contenedor) return;

    // Coordenadas del negocio (Ibagué, Tolima)
    const latitud = 4.389496;
    const longitud = -75.139941;

    // Crear el mapa centrado en la ubicación
    const mapa = L.map(
        "mapa-negocio",
        {
            center: [latitud, longitud],
            zoom: 16,
            scrollWheelZoom: false
        }
    );

    // Capa de mapa base (OpenStreetMap)
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(mapa);

    // Marcador de la ubicación del negocio
    const marcador = L.marker(
        [latitud, longitud]
    ).addTo(mapa);

    // Popup con el nombre del negocio
    marcador.bindPopup(
        "<strong>🧇 OttoPOS</strong><br>Nuestro negocio está aquí"
    ).openPopup();

}