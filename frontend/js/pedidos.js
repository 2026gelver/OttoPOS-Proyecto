// =======================================
// OTTOPOS - PEDIDOS.JS
// Módulo para gestionar el estado de los pedidos
// =======================================

const Pedidos = {

    pedidos: [],

    filtroEstado: "todos",

    // ==========================
    // CARGAR PEDIDOS
    // ==========================
    async cargarPedidos() {

        const contenedor =
            document.getElementById("lista-pedidos");

        if (!contenedor) return;

        contenedor.innerHTML = `
            <div style="text-align:center;padding:30px;">
                <div style="font-size:36px;">⏳</div>
                <p>Cargando pedidos...</p>
            </div>
        `;

        try {

            const respuesta = await fetch(
                `${CONFIG.API_URL}/ventas`
            );

            if (!respuesta.ok) {

                throw new Error(
                    "Error al consultar pedidos"
                );

            }

            const ventas = await respuesta.json();

            // Ordenar de más reciente a más antiguo.
            this.pedidos = ventas.sort(
                (a, b) => new Date(b.fecha) - new Date(a.fecha)
            );

            this.renderizar();

        } catch (error) {

            console.error(
                "Error cargando pedidos:",
                error
            );

            contenedor.innerHTML = `
                <div style="text-align:center;padding:30px;">
                    <div style="font-size:40px;">⚠️</div>
                    <p>No se pudieron cargar los pedidos</p>
                    <small>
                        Verifica que OttoPOS esté conectado
                    </small>
                </div>
            `;

        }

    },


    // ==========================
    // RENDERIZAR PEDIDOS
    // ==========================
    renderizar() {

        const contenedor =
            document.getElementById("lista-pedidos");

        if (!contenedor) return;

        // Aplicar filtro por estado.
        const pedidosFiltrados =
            this.filtroEstado === "todos"
                ? this.pedidos
                : this.pedidos.filter(
                    venta =>
                        (venta.estado || "en_proceso") ===
                        this.filtroEstado
                );

        if (pedidosFiltrados.length === 0) {

            contenedor.innerHTML = `
                <p style="text-align:center;color:var(--gris-medio);font-size:13px;padding:20px;">
                    No hay pedidos registrados todavía.
                </p>
            `;

            return;

        }

        contenedor.innerHTML = "";

        pedidosFiltrados.forEach(venta => {

            contenedor.appendChild(
                this._crearTarjetaPedido(venta)
            );

        });

    },


    // ==========================
    // FILTRAR POR ESTADO
    // ==========================
    filtrarPorEstado(estado) {

        this.filtroEstado = estado;

        this.renderizar();

    },


    // ==========================
    // CREAR TARJETA DE PEDIDO
    // ==========================
    _crearTarjetaPedido(venta) {

        const tarjeta =
            document.createElement("div");

        tarjeta.className = "pedido-card";

        // ==========================
        // TIPO DE PEDIDO
        // ==========================
        let tipoPedidoHTML = "";

        if (
            venta.tipoPedido === "mesa"
        ) {

            tipoPedidoHTML = `
                <div class="pedido-tipo mesa">
                    🍽️ Mesa ${venta.numeroMesa || ""}
                </div>
            `;

        } else {

            tipoPedidoHTML = `
                <div class="pedido-tipo llevar">
                    🛍️ Para llevar
                </div>
            `;

        }

        // ==========================
        // ESTADO
        // ==========================
        const estado =
            venta.estado || "en_proceso";

        const estadoMap = {
            "en_proceso": {
                texto: "🟠 En proceso",
                clase: "estado-en-proceso"
            },
            "entregado": {
                texto: "🟢 Entregado",
                clase: "estado-entregado"
            },
            "cancelado": {
                texto: "🔴 Cancelado",
                clase: "estado-cancelado"
            }
        };

        const estadoInfo =
            estadoMap[estado] || estadoMap["en_proceso"];

        // ==========================
        // DETALLES DE PRODUCTOS
        // ==========================
        let htmlDetalles = "";

        (venta.detalles || []).forEach(detalle => {

            // Nombre del producto.
            const nombreProducto =
                detalle.producto
                    ? detalle.producto.nombre
                    : "Producto";

            // Observaciones.
            const obs = [];

            if (detalle.conQueso) obs.push("queso");
            if (detalle.conTomate) obs.push("tomate");
            if (detalle.conCebolla) obs.push("cebolla");
            if (detalle.conMantequilla) obs.push("mantequilla");

            let htmlObs = "";

            if (obs.length > 0) {

                htmlObs = `
                    <div class="pedido-detalle-obs">
                        📝 Obs: ${obs.join(", ")}
                    </div>
                `;

            }

            // Adición de queso.
            let htmlAdicion = "";

            if (detalle.adicionQueso > 0) {

                htmlAdicion = `
                    <div class="pedido-detalle-obs">
                        🧀 + Adición queso x${detalle.adicionQueso}
                        (+$${(detalle.adicionQueso * 1000).toLocaleString("es-CO")})
                    </div>
                `;

            }

            htmlDetalles += `
                <div class="pedido-item">
                    <div>
                        <div>
                            ${nombreProducto} x${detalle.cantidad}
                        </div>
                        ${htmlObs}
                        ${htmlAdicion}
                    </div>
                    <div class="pedido-item-subtotal">
                        $${Number(detalle.subtotal || 0).toLocaleString("es-CO")}
                    </div>
                </div>
            `;

        });

        // ==========================
        // FORMATO FECHA
        // ==========================
        const fecha = venta.fecha
            ? new Date(venta.fecha)
            : new Date();

        const fechaTexto =
            fecha.toLocaleDateString("es-CO");

        const horaTexto =
            fecha.toLocaleTimeString("es-CO");

        // ==========================
        // BOTONES DE ESTADO
        // ==========================
        let botonesHTML = "";

        if (estado === "en_proceso") {

            botonesHTML = `
                <div class="pedido-botones">
                    <button
                        class="btn btn-success btn-sm"
                        onclick="Pedidos.cambiarEstado(${venta.id}, 'entregado')">
                        ✅ Entregado
                    </button>
                    <button
                        class="btn btn-danger btn-sm"
                        onclick="Pedidos.cambiarEstado(${venta.id}, 'cancelado')">
                        ❌ Cancelado
                    </button>
                </div>
            `;

        }

        // ==========================
        // TARJETA FINAL
        // ==========================
        tarjeta.innerHTML = `
            <div class="pedido-header">
                <div class="pedido-numero">
                    Pedido #${venta.id}
                </div>
                <span class="pedido-estado ${estadoInfo.clase}">
                    ${estadoInfo.texto}
                </span>
            </div>

            <div class="pedido-meta">
                <span>📅 ${fechaTexto} — ${horaTexto}</span>
                ${tipoPedidoHTML}
            </div>

            <div class="pedido-meta">
                <span>👤 Vendedor: ${venta.usuarioNombre || "Sistema"}</span>
                <span>💳 ${venta.metodoPago || ""}</span>
            </div>

            <div class="pedido-detalles">
                ${htmlDetalles}
            </div>

            <div class="pedido-total">
                <span>TOTAL</span>
                <span>$${Number(venta.total || 0).toLocaleString("es-CO")}</span>
            </div>

            ${botonesHTML}
        `;

        return tarjeta;

    },


    // ==========================
    // CAMBIAR ESTADO
    // ==========================
    async cambiarEstado(id, estado) {

        try {

            const respuesta = await fetch(
                `${CONFIG.API_URL}/ventas/${id}/estado?estado=${estado}`,
                {
                    method: "PUT"
                }
            );

            if (!respuesta.ok) {

                throw new Error(
                    "Error al actualizar el estado"
                );

            }

            App.toast(
                estado === "entregado"
                    ? "✅ Pedido entregado."
                    : "❌ Pedido cancelado."
            );

            // Refrescar la lista.
            this.cargarPedidos();

        } catch (error) {

            console.error(
                "Error cambiando estado:",
                error
            );

            App.toast(
                "❌ No fue posible actualizar el estado."
            );

        }

    }

};