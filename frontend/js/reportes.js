// =======================================
// OTTOPOS - REPORTES.JS
// Reportes conectados a ventas reales
// =======================================

const Reportes = {

    ventas: [],

    periodoActual: 'hoy',

    // ==========================
    // CARGAR VENTAS DESDE MYSQL
    // ==========================
    async cargarVentas() {

        try {

            const respuesta = await fetch(
                'http://localhost:8081/api/ventas'
            );

            if (!respuesta.ok) {

                throw new Error('Error al consultar ventas');

            }

            this.ventas = await respuesta.json();

            this.renderizar();

        } catch (error) {

            console.error('Error cargando reportes:', error);

            const contenedor =
                document.getElementById('reporte-contenido');

            if (contenedor) {

                contenedor.innerHTML = `
                    <div style="text-align:center;padding:30px;">
                        <div style="font-size:40px;">⚠️</div>

                        <p>
                            No se pudieron cargar los reportes
                        </p>

                        <small>
                            Verifica que OttoPOS esté conectado
                        </small>
                    </div>
                `;

            }

        }

    },


    // ==========================
    // FILTRAR POR PERÍODO
    // ==========================
    _filtrar(periodo) {

        const ahora = new Date();

        const hoy =
            ahora.getFullYear()
            + '-'
            + String(ahora.getMonth() + 1).padStart(2, '0')
            + '-'
            + String(ahora.getDate()).padStart(2, '0');


        return this.ventas.filter(venta => {

            const fechaVenta =
                String(venta.fecha).substring(0, 10);


            if (periodo === 'hoy') {

                return fechaVenta === hoy;

            }


            if (periodo === 'semana') {

                const fecha = new Date(
                    fechaVenta + 'T00:00:00'
                );


                const inicio = new Date();

                inicio.setHours(0, 0, 0, 0);

                inicio.setDate(
                    inicio.getDate() - 7
                );


                return fecha >= inicio;

            }


            if (periodo === 'mes') {

                const partes =
                    fechaVenta.split('-');


                return Number(partes[0])
                    === ahora.getFullYear()
                    &&
                    Number(partes[1])
                    === ahora.getMonth() + 1;

            }


            if (periodo === 'anteriores') {

                const partes =
                    fechaVenta.split('-');


                const anioVenta =
                    Number(partes[0]);

                const mesVenta =
                    Number(partes[1]);


                const anioActual =
                    ahora.getFullYear();

                const mesActual =
                    ahora.getMonth() + 1;


                return anioVenta < anioActual

                    ||

                    (

                        anioVenta === anioActual

                        &&

                        mesVenta < mesActual

                    );

            }


            return true;

        });

    },


    // ==========================
    // CALCULAR ESTADÍSTICAS
    // ==========================
    _stats(lista) {

        const totalPesos =
            lista.reduce(

                (total, venta) =>
                    total + Number(venta.total || 0),

                0

            );


        const totalVentas =
            lista.length;


        const porProducto = {};


        lista.forEach(venta => {

            if (!venta.detalles) return;


            venta.detalles.forEach(detalle => {

                const nombre =
                    detalle.producto?.nombre
                    || 'Producto';


                if (!porProducto[nombre]) {

                    porProducto[nombre] = {

                        cantidad: 0,

                        ingresos: 0

                    };

                }


                porProducto[nombre].cantidad +=
                    Number(detalle.cantidad || 0);


                porProducto[nombre].ingresos +=
                    Number(detalle.subtotal || 0);

            });

        });


        const ranking =

            Object.entries(porProducto)

                .map(([nombre, datos]) => ({

                    nombre,

                    ...datos

                }))

                .sort(

                    (a, b) =>
                        b.cantidad - a.cantidad

                );


        const porMetodo = {};


        lista.forEach(venta => {

            const metodo =
                venta.metodoPago || 'Otro';


            porMetodo[metodo] =
                (porMetodo[metodo] || 0)
                + Number(venta.total || 0);

        });


        return {

            totalPesos,

            totalVentas,

            ranking,

            porMetodo

        };

    },


    // ==========================
    // FORMATEAR HORA
    // ==========================
    _formatearHora(fecha) {

        if (!fecha) return '';

        const valor =
            String(fecha);


        return valor.substring(11, 16);

    },


    // ==========================
    // NORMALIZAR ROL
    // ==========================
    _normalizarRol(rol) {

        const mapa = {

            admin: 'Administrador',

            administrador: 'Administrador',

            cliente: 'Cliente',

            operador: 'Operador',

            caja: 'Caja'

        };


        const clave =
            String(rol || '')
                .toLowerCase()
                .trim();


        return mapa[clave] || 'Sistema';

    },


    // ==========================
    // DESCARGAR EXCEL
    // ==========================
    descargarExcel(periodo = this.periodoActual) {

        const lista =
            this._filtrar(periodo);


        if (lista.length === 0) {

            alert(
                'No hay ventas para descargar en este período.'
            );

            return;

        }


        const periodoNombre = {

            hoy: 'Hoy',

            semana: '7_dias',

            mes: 'Este_mes',

            anteriores: 'Meses_anteriores'

        }[periodo];


        // ==========================
        // HOJA DE VENTAS
        // ==========================

        const ventasExcel = lista.map(venta => ({

            'Número de venta':
                venta.id,

            'Fecha':
                String(venta.fecha)
                    .substring(0, 10),

            'Hora':
                this._formatearHora(
                    venta.fecha
                ),

            'Usuario':
                venta.usuarioNombre || 'Sistema',

            'ROL':
                this._normalizarRol(
                    venta.usuarioRol
                ),

            'Método de pago':
                venta.metodoPago,

            'Total':
                Number(venta.total || 0)

        }));


        const hojaVentas =
            XLSX.utils.json_to_sheet(
                ventasExcel
            );


        // ==========================
        // RESUMEN
        // ==========================

        const stats =
            this._stats(lista);


        const resumenExcel = [

            {

                'Concepto':
                    'Total vendido',

                'Valor':
                    stats.totalPesos

            },

            {

                'Concepto':
                    'Ventas realizadas',

                'Valor':
                    stats.totalVentas

            },

            {

                'Concepto':
                    'Ticket promedio',

                'Valor':

                    stats.totalVentas > 0

                        ? Math.round(

                            stats.totalPesos
                            / stats.totalVentas

                        )

                        : 0

            },

            {

                'Concepto':
                    'Total efectivo',

                'Valor':
                    stats.porMetodo.Efectivo || 0

            },

            {

                'Concepto':
                    'Total transferencia',

                'Valor':
                    stats.porMetodo.Transferencia || 0

            }

        ];


        const hojaResumen =
            XLSX.utils.json_to_sheet(
                resumenExcel
            );


        // ==========================
        // CREAR LIBRO EXCEL
        // ==========================

        const libro =
            XLSX.utils.book_new();


        XLSX.utils.book_append_sheet(

            libro,

            hojaVentas,

            'Ventas'

        );


        XLSX.utils.book_append_sheet(

            libro,

            hojaResumen,

            'Resumen'

        );


        // ==========================
        // DESCARGAR
        // ==========================

        XLSX.writeFile(

            libro,

            `OttoPOS_Reporte_${periodoNombre}.xlsx`

        );

    },


    // ==========================
    // RENDERIZAR REPORTES
    // ==========================
    renderizar(periodo = this.periodoActual) {

        this.periodoActual =
            periodo;


        document
            .querySelectorAll('.tab-btn')
            .forEach(btn =>
                btn.classList.remove('activo')
            );


        const tabActivo =
            document.getElementById(
                'tab-' + periodo
            );


        if (tabActivo) {

            tabActivo.classList.add('activo');

        }


        const lista =
            this._filtrar(periodo);


        const stats =
            this._stats(lista);


        const contenedor =
            document.getElementById(
                'reporte-contenido'
            );


        if (!contenedor) return;


        const periodoLabel = {

            hoy: 'Hoy',

            semana: 'Últimos 7 días',

            mes: 'Este mes',

            anteriores: 'Meses anteriores'

        }[periodo];


        let html = `

            <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">

                <button
                    class="btn btn-outline"
                    onclick="Reportes.descargarExcel('${periodo}')"
                    style="width:100%;">

                    📥 Descargar Excel

                </button>

            </div>


            <div class="reporte-cards">

                <div class="reporte-card">

                    <div class="reporte-card-valor">

                        $${stats.totalPesos.toLocaleString('es-CO')}

                    </div>

                    <div class="reporte-card-label">

                        💰 Total vendido

                    </div>

                </div>


                <div class="reporte-card">

                    <div class="reporte-card-valor">

                        ${stats.totalVentas}

                    </div>

                    <div class="reporte-card-label">

                        🧾 Ventas realizadas

                    </div>

                </div>


                <div class="reporte-card">

                    <div class="reporte-card-valor">

                        $

                        ${

                            stats.totalVentas > 0

                                ? Math.round(

                                    stats.totalPesos
                                    / stats.totalVentas

                                ).toLocaleString('es-CO')

                                : 0

                        }

                    </div>

                    <div class="reporte-card-label">

                        📊 Ticket promedio

                    </div>

                </div>

            </div>

        `;


        // ==========================
        // MÉTODOS DE PAGO
        // ==========================

        html += `

            <h3 style="margin-top:20px;">

                💳 Métodos de Pago

            </h3>

            <div style="display:flex;gap:10px;margin-bottom:8px;">

        `;


        Object.entries(stats.porMetodo)

            .forEach(([metodo, total]) => {

                html += `

                    <div class="reporte-card" style="flex:1;">

                        <div class="reporte-card-valor">

                            $${total.toLocaleString('es-CO')}

                        </div>

                        <div class="reporte-card-label">

                            💳 ${metodo}

                        </div>

                    </div>

                `;

            });


        html += `</div>`;


        // ==========================
        // RANKING
        // ==========================

        if (stats.ranking.length > 0) {

            html += `

                <h3>

                    🏆 Ranking de Productos

                    <span style="font-size:11px;font-weight:400;color:var(--gris-medio);">

                        (${periodoLabel})

                    </span>

                </h3>

                <div class="ranking-lista">

            `;


            stats.ranking.forEach((producto, indice) => {

                const medalla =

                    indice === 0 ? '🥇' :

                    indice === 1 ? '🥈' :

                    indice === 2 ? '🥉' :

                    `${indice + 1}.`;


                const esMax =
                    indice === 0;


                const esMin =

                    indice === stats.ranking.length - 1
                    &&
                    stats.ranking.length > 1;


                html += `

                    <div class="ranking-item

                        ${esMax ? 'ranking-max' : ''}

                        ${esMin ? 'ranking-min' : ''}

                    ">

                        <span class="ranking-pos">

                            ${medalla}

                        </span>

                        <span class="ranking-nombre">

                            ${producto.nombre}

                        </span>

                        <span class="ranking-datos">

                            <strong>

                                ${producto.cantidad} uds

                            </strong>

                            <span style="color:var(--gris-medio);font-size:12px;">

                                $${producto.ingresos.toLocaleString('es-CO')}

                            </span>

                        </span>

                    </div>

                `;

            });


            html += `</div>`;


        } else {

            html += `

                <div style="text-align:center;padding:30px 0;color:var(--gris-medio);">

                    <div style="font-size:40px;margin-bottom:8px;">

                        📭

                    </div>

                    <div style="font-size:14px;">

                        Sin ventas registradas para

                        ${periodoLabel.toLowerCase()}

                    </div>

                </div>

            `;

        }


        // ==========================
        // HISTORIAL
        // ==========================

        if (lista.length > 0) {

            html += `

                <h3 style="margin-top:20px;">

                    📋 Historial

                </h3>

                <div class="historial-lista">

            `;


            [...lista]

                .reverse()

                .forEach(venta => {

                    const hora =
                        this._formatearHora(
                            venta.fecha
                        );


                    html += `

                        <div class="historial-item">

                            <div>

                                <div style="font-size:13px;font-weight:600;">

                                    Venta #${venta.id}

                                </div>

                                <div style="font-size:11px;color:var(--gris-medio);">

                                    ${hora}

                                    · ${venta.metodoPago}

                                </div>

                            </div>

                            <div style="font-weight:700;color:var(--cafe);">

                                $${Number(venta.total).toLocaleString('es-CO')}

                            </div>

                        </div>

                    `;

                });


            html += `</div>`;

        }


        contenedor.innerHTML =
            html;

    }

};