// =======================================
// OTTOPOS - VENTAS.JS
// =======================================

const Ventas = {

    productos: [],

    pedido: [],

    clientes: [],

    clienteActual: 1,

    total: 0,

    tipoPedido: "llevar",

    numeroMesa: "",


    // ==========================
    // SELECCIONAR TIPO DE PEDIDO
    // ==========================

    seleccionarTipoPedido(tipo) {

        this.tipoPedido = tipo;

        const btnMesa =
            document.getElementById("btn-tipo-mesa");

        const btnLlevar =
            document.getElementById("btn-tipo-llevar");

        const mesaGroup =
            document.getElementById("mesa-input-group");

        if (tipo === "mesa") {

            btnMesa.classList.add("activo");
            btnLlevar.classList.remove("activo");

            mesaGroup.style.display = "block";

        } else {

            btnLlevar.classList.add("activo");
            btnMesa.classList.remove("activo");

            mesaGroup.style.display = "none";

            this.numeroMesa = "";

            const inputMesa =
                document.getElementById("numero-mesa");

            if (inputMesa) inputMesa.value = "";

        }

    },


    // ==========================
    // CARGAR PRODUCTOS
    // ==========================

    async cargarProductos() {

        try {

            this.productos =
                await API.obtenerProductos();

            this.renderizarCatalogo();

            this._renderPedido();

            this._renderPedidosGuardados();

        } catch (error) {

            console.error(error);

            App.toast(
                "❌ No fue posible cargar los productos."
            );

        }

    },


    // ==========================
    // RENDERIZAR CATÁLOGO POR SECCIONES
    // ==========================

    renderizarCatalogo() {

        const seccionArepas =
            document.getElementById("seccion-arepas");

        const seccionBebidas =
            document.getElementById("seccion-bebidas");

        if (!seccionArepas || !seccionBebidas) return;

        seccionArepas.innerHTML = "";
        seccionBebidas.innerHTML = "";

        // Ordenar de mayor a menor precio.
        this.productos.sort(
            (a, b) => b.precio - a.precio
        );

        // Separar arepas y bebidas.
        const arepas =
            this.productos.filter(p => {
                const cat = (p.categoria || "").toLowerCase();
                return cat.includes("arepa") || cat.includes("pan");
            });

        const bebidas =
            this.productos.filter(p => {
                const cat = (p.categoria || "").toLowerCase();
                return !cat.includes("arepa") && !cat.includes("pan");
            });

        // Renderizar arepas.
        arepas.forEach(producto => {

            if (!producto.estado) return;

            seccionArepas.appendChild(
                this._crearTarjetaArepa(producto)
            );

        });

        // Renderizar bebidas.
        bebidas.forEach(producto => {

            if (!producto.estado) return;

            seccionBebidas.appendChild(
                this._crearTarjetaBebida(producto)
            );

        });

    },


    // ==========================
    // CREAR TARJETA DE AREPA
    // ==========================

    _crearTarjetaArepa(producto) {

        const tarjeta =
            document.createElement("div");

        tarjeta.className = "tarjeta-producto";

        const idBase = "arepa-" + producto.id;

        tarjeta.innerHTML = `

            <div style="display:flex;align-items:center;gap:12px;">

                <img
                    src="${obtenerImagenProducto(producto)}"
                    alt="${producto.nombre}"
                    class="prod-imagen"
                    onerror="imagenFallback(this, '${producto.nombre}')">

                <div style="flex:1;">

                    <div class="prod-nombre">
                        ${producto.nombre}
                    </div>

                    <div class="prod-precio">
                        $${Number(producto.precio).toLocaleString("es-CO")}
                    </div>

                </div>

                <input
                    id="${idBase}-cantidad"
                    class="input-cantidad"
                    type="number"
                    min="0"
                    value="0">

            </div>

            <div class="observaciones-seccion">

                <div class="observaciones-titulo">
                    📝 Observaciones
                </div>

                <div class="observaciones-grid">

                    <label class="obs-item">
                        <input type="checkbox" id="${idBase}-queso" class="obs-check">
                        Con queso
                    </label>

                    <label class="obs-item">
                        <input type="checkbox" id="${idBase}-tomate" class="obs-check">
                        Con tomate
                    </label>

                    <label class="obs-item">
                        <input type="checkbox" id="${idBase}-cebolla" class="obs-check">
                        Con cebolla
                    </label>

                    <label class="obs-item">
                        <input type="checkbox" id="${idBase}-mantequilla" class="obs-check">
                        Con mantequilla
                    </label>

                </div>

            </div>

            <div class="adicion-seccion">

                <div class="adicion-titulo">
                    🧀 Adición de queso
                </div>

                <div class="adicion-btns">

                    <label class="adicion-item">
                        <input type="radio" name="adicion-${producto.id}" value="0" checked>
                        Sin
                    </label>

                    <label class="adicion-item">
                        <input type="radio" name="adicion-${producto.id}" value="2">
                        x2 <small>+$2.000</small>
                    </label>

                    <label class="adicion-item">
                        <input type="radio" name="adicion-${producto.id}" value="3">
                        x3 <small>+$3.000</small>
                    </label>

                    <label class="adicion-item">
                        <input type="radio" name="adicion-${producto.id}" value="4">
                        x4 <small>+$4.000</small>
                    </label>

                </div>

            </div>

        `;

        return tarjeta;

    },


    // ==========================
    // CREAR TARJETA DE BEBIDA
    // ==========================

    _crearTarjetaBebida(producto) {

        const tarjeta =
            document.createElement("div");

        tarjeta.className = "tarjeta-producto";

        const idBase = "bebida-" + producto.id;

        tarjeta.innerHTML = `

            <div style="display:flex;align-items:center;gap:12px;">

                <img
                    src="${obtenerImagenProducto(producto)}"
                    alt="${producto.nombre}"
                    class="prod-imagen"
                    onerror="imagenFallback(this, '${producto.nombre}')">

                <div style="flex:1;">

                    <div class="prod-nombre">
                        ${producto.nombre}
                    </div>

                    <div class="prod-precio">
                        $${Number(producto.precio).toLocaleString("es-CO")}
                    </div>

                </div>

                <input
                    id="${idBase}-cantidad"
                    class="input-cantidad"
                    type="number"
                    min="0"
                    value="0">

            </div>

        `;

        return tarjeta;

    },


    // ==========================
    // AGREGAR AL PEDIDO
    // ==========================

    agregarAlPedido() {

        let agregados = 0;

        this.productos.forEach(producto => {

            const esArepa =
                (producto.categoria || "").toLowerCase().includes("arepa");

            const prefijo =
                esArepa ? "arepa-" : "bebida-";

            const input =
                document.getElementById(
                    `${prefijo}${producto.id}-cantidad`
                );

            if (!input) return;

            const cantidad =
                parseInt(input.value) || 0;

            if (cantidad <= 0) return;

            if (cantidad > producto.stock) {

                App.toast(
                    `⚠️ Stock insuficiente para ${producto.nombre}`
                );

                return;

            }

            // Recolectar observaciones y adición para arepas.
            let observaciones = null;
            let adicionQueso = 0;

            if (esArepa) {

                const chkQueso =
                    document.getElementById(`${prefijo}${producto.id}-queso`);
                const chkTomate =
                    document.getElementById(`${prefijo}${producto.id}-tomate`);
                const chkCebolla =
                    document.getElementById(`${prefijo}${producto.id}-cebolla`);
                const chkMantequilla =
                    document.getElementById(`${prefijo}${producto.id}-mantequilla`);

                const radioAdicion =
                    document.querySelector(
                        `input[name="adicion-${producto.id}"]:checked`
                    );

                observaciones = {
                    conQueso: chkQueso ? chkQueso.checked : false,
                    conTomate: chkTomate ? chkTomate.checked : false,
                    conCebolla: chkCebolla ? chkCebolla.checked : false,
                    conMantequilla: chkMantequilla ? chkMantequilla.checked : false
                };

                adicionQueso =
                    radioAdicion ? parseInt(radioAdicion.value) : 0;

            }

            const subtotal =
                cantidad * producto.precio
                + adicionQueso * 1000.0;

            // Buscar si ya existe el mismo item con las mismas opciones.
            const existente =
                this.pedido.find(
                    item =>
                        item.id === producto.id
                        &&
                        item.adicionQueso === adicionQueso
                        &&
                        JSON.stringify(item.observaciones || {})
                        === JSON.stringify(observaciones || {})
                );

            if (existente) {

                existente.cantidad += cantidad;

                existente.subtotal =
                    existente.cantidad * producto.precio
                    + existente.adicionQueso * 1000.0;

            } else {

                this.pedido.push({

                    id: producto.id,

                    nombre: producto.nombre,

                    precio: producto.precio,

                    cantidad: cantidad,

                    observaciones: observaciones,

                    adicionQueso: adicionQueso,

                    subtotal: subtotal

                });

            }

            // Limpiar cantidad.
            input.value = 0;

            // Limpiar observaciones.
            if (esArepa) {

                const chkQueso =
                    document.getElementById(`${prefijo}${producto.id}-queso`);
                const chkTomate =
                    document.getElementById(`${prefijo}${producto.id}-tomate`);
                const chkCebolla =
                    document.getElementById(`${prefijo}${producto.id}-cebolla`);
                const chkMantequilla =
                    document.getElementById(`${prefijo}${producto.id}-mantequilla`);

                if (chkQueso) chkQueso.checked = false;
                if (chkTomate) chkTomate.checked = false;
                if (chkCebolla) chkCebolla.checked = false;
                if (chkMantequilla) chkMantequilla.checked = false;

                const radioSin =
                    document.querySelector(
                        `input[name="adicion-${producto.id}"][value="0"]`
                    );

                if (radioSin) radioSin.checked = true;

            }

            agregados++;

        });

        if (agregados === 0) {

            App.toast(
                "Seleccione al menos un producto."
            );

            return;

        }

        this._recalcularTotal();

        this._renderPedido();

        App.toast(
            "✅ Productos agregados."
        );

    },


    // ==========================
    // CREAR PEDIDO DE CLIENTE
    // ==========================

    crearPedidoCliente() {

        if (this.pedido.length === 0) {

            App.toast(
                "⚠️ El pedido está vacío. Agrega productos primero."
            );

            return;

        }

        if (this.clientes.length >= 8) {

            App.toast(
                "⚠️ Máximo 8 clientes por factura."
            );

            return;

        }

        // Guardar una copia del pedido actual como cliente.
        this.clientes.push({

            numero: this.clienteActual,

            items: JSON.parse(
                JSON.stringify(this.pedido)
            ),

            total: this.pedido.reduce(
                (sum, item) => sum + item.subtotal,
                0
            )

        });

        // Limpiar el pedido actual.
        this.pedido = [];

        this.total = 0;

        this._recalcularTotal();

        this._renderPedido();

        this._renderPedidosGuardados();

        // Incrementar el cliente actual.
        this.clienteActual++;

        // Actualizar el botón.
        const btn =
            document.getElementById("btn-crear-cliente");

        if (btn) {

            if (this.clienteActual > 8) {

                btn.style.display = "none";

            } else {

                btn.textContent =
                    `➕ Crear Pedido Cliente ${this.clienteActual}`;

            }

        }

        App.toast(
            `✅ Pedido Cliente ${this.clienteActual - 1} guardado.`
        );

    },


    // ==========================
    // EDITAR PEDIDO DE CLIENTE
    // ==========================

    editarCliente(numero) {

        const cliente =
            this.clientes.find(c => c.numero === numero);

        if (!cliente) return;

        // Si hay items en el pedido actual, preguntar.
        if (this.pedido.length > 0) {

            if (!confirm("El pedido actual se descartará. ¿Continuar?")) {
                return;
            }

        }

        // Cargar los items del cliente en el pedido actual.
        this.pedido =
            JSON.parse(
                JSON.stringify(cliente.items)
            );

        this._recalcularTotal();

        this._renderPedido();

        // Eliminar el cliente guardado (se volverá a guardar al finalizar).
        this.clientes =
            this.clientes.filter(c => c.numero !== numero);

        this._renderPedidosGuardados();

        App.toast(
            `✏️ Editando pedido del Cliente ${numero}`
        );

    },


    // ==========================
    // ELIMINAR PEDIDO DE CLIENTE
    // ==========================

    eliminarCliente(numero) {

        if (!confirm(`¿Eliminar el pedido del Cliente ${numero}?`)) {
            return;
        }

        this.clientes =
            this.clientes.filter(c => c.numero !== numero);

        // Si el cliente eliminado era el último, volver a mostrar el botón.
        if (this.clienteActual > 8) {

            const btn =
                document.getElementById("btn-crear-cliente");

            if (btn) {

                btn.style.display = "";
                btn.textContent =
                    `➕ Crear Pedido Cliente ${this.clienteActual}`;

            }

            this.clienteActual--;

        }

        this._renderPedidosGuardados();

        App.toast(
            `🗑️ Pedido Cliente ${numero} eliminado.`
        );

    },


    // ==========================
    // RENDERIZAR PEDIDOS GUARDADOS
    // ==========================

    _renderPedidosGuardados() {

        const contenedor =
            document.getElementById("pedidos-guardados");

        if (!contenedor) return;

        contenedor.innerHTML = "";

        if (this.clientes.length === 0) {

            contenedor.innerHTML = `
                <p style="text-align:center;color:var(--gris-medio);font-size:13px;">
                    No hay pedidos guardados todavía.
                </p>
            `;

            return;

        }

        // Ordenar por número de cliente.
        const ordenados =
            [...this.clientes].sort((a, b) => a.numero - b.numero);

        ordenados.forEach(cliente => {

            const div =
                document.createElement("div");

            div.className = "cliente-guardado";

            const resumen =
                cliente.items
                    .map(item => `${item.cantidad}x ${item.nombre}`)
                    .join(", ");

            div.innerHTML = `

                <div style="flex:1;">

                    <div class="cliente-titulo">
                        👤 Cliente ${cliente.numero}
                    </div>

                    <div class="cliente-resumen">
                        ${resumen}
                    </div>

                    <div class="cliente-total">
                        $${cliente.total.toLocaleString("es-CO")}
                    </div>

                </div>

                <div style="display:flex;gap:6px;">

                    <button
                        class="btn btn-outline btn-sm"
                        onclick="Ventas.editarCliente(${cliente.numero})"
                        title="Editar">
                        ✏️
                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="Ventas.eliminarCliente(${cliente.numero})"
                        title="Eliminar">
                        🗑️
                    </button>

                </div>

            `;

            contenedor.appendChild(div);

        });

    },


    // ==========================
    // ELIMINAR PRODUCTO
    // ==========================

    eliminarItem(id) {

        this.pedido =
            this.pedido.filter(

                item =>
                    item.id !== id

            );

        this._recalcularTotal();

        this._renderPedido();

    },


    // ==========================
    // CONFIRMAR VENTA
    // ==========================

    confirmarVenta() {

        // Debe haber al menos un pedido guardado
        // o items en el pedido actual.
        if (
            this.clientes.length === 0
            &&
            this.pedido.length === 0
        ) {

            App.toast(
                "⚠️ No hay pedidos para confirmar."
            );

            return;

        }

        // Leer el número de mesa si es pedido de mesa.
        if (this.tipoPedido === "mesa") {

            const inputMesa =
                document.getElementById("numero-mesa");

            const valor =
                inputMesa ? inputMesa.value.trim() : "";

            if (!valor) {

                App.toast(
                    "⚠️ Ingresa el número de mesa."
                );

                return;

            }

            this.numeroMesa = valor;

        }

        // Renderizar el resumen de la venta
        // antes de mostrar el método de pago.
        this._renderResumenVenta();

        document
            .getElementById(
                "pago-section"
            )
            .classList.add("visible");

        document
            .getElementById(
                "pago-section"
            )
            .scrollIntoView({

                behavior: "smooth"

            });

    },


    // ==========================
    // RENDERIZAR RESUMEN DE VENTA
    // ==========================

    _renderResumenVenta() {

        const contenedor =
            document.getElementById(
                "resumen-venta"
            );

        if (!contenedor) return;

        const todos =
            this._obtenerTodosLosPedidos();

        if (todos.length === 0) {

            contenedor.innerHTML = `
                <p style="text-align:center;color:var(--gris-medio);font-size:13px;">
                    No hay pedidos para resumir.
                </p>
            `;

            return;

        }

        let htmlResumen = "";

        let totalGeneral = 0;

        todos.forEach(cliente => {

            let htmlItems = "";

            let subtotalCliente = 0;

            cliente.items.forEach(item => {

                // Observaciones.
                let obsTexto = "";

                const obs =
                    item.observaciones || {};

                const observacionesSeleccionadas = [];

                if (obs.conQueso) observacionesSeleccionadas.push("queso");
                if (obs.conTomate) observacionesSeleccionadas.push("tomate");
                if (obs.conCebolla) observacionesSeleccionadas.push("cebolla");
                if (obs.conMantequilla) observacionesSeleccionadas.push("mantequilla");

                if (observacionesSeleccionadas.length > 0) {

                    obsTexto = `
                        <div style="font-size:10px;color:var(--gris-medio);">
                            Obs: ${observacionesSeleccionadas.join(", ")}
                        </div>
                    `;

                }

                // Adición de queso.
                let adicionTexto = "";

                if (item.adicionQueso > 0) {

                    adicionTexto = `
                        <div style="font-size:10px;color:var(--cafe-light);">
                            + Adición queso x${item.adicionQueso}
                        </div>
                    `;

                }

                htmlItems += `

                    <div class="resumen-item">

                        <div>

                            <div>
                                ${item.nombre} x${item.cantidad}
                            </div>

                            ${obsTexto}

                            ${adicionTexto}

                        </div>

                        <div>
                            $${item.subtotal.toLocaleString("es-CO")}
                        </div>

                    </div>

                `;

                subtotalCliente += item.subtotal;

            });

            totalGeneral += subtotalCliente;

            htmlResumen += `

                <div class="resumen-cliente">

                    <div class="resumen-cliente-titulo">
                        👤 Cliente ${cliente.numero}
                    </div>

                    ${htmlItems}

                    <div class="resumen-cliente-total">
                        <span>Subtotal</span>
                        <span>$${subtotalCliente.toLocaleString("es-CO")}</span>
                    </div>

                </div>

            `;

        });

        htmlResumen += `

            <div class="resumen-total">
                <span>TOTAL GENERAL</span>
                <span>$${totalGeneral.toLocaleString("es-CO")}</span>
            </div>

        `;

        contenedor.innerHTML = htmlResumen;

    },


    // ==========================
    // OBTENER TODOS LOS PEDIDOS
    // ==========================

    _obtenerTodosLosPedidos() {

        const todos = [];

        // Si hay un pedido actual sin guardar, agregarlo como cliente pendiente.
        if (this.pedido.length > 0) {

            todos.push({
                numero: this.clienteActual,
                items: this.pedido,
                total: this.pedido.reduce(
                    (sum, item) => sum + item.subtotal,
                    0
                )
            });

        }

        // Agregar los pedidos guardados.
        this.clientes.forEach(c => {
            todos.push(c);
        });

        // Ordenar por número de cliente.
        return todos.sort((a, b) => a.numero - b.numero);

    },


    // ==========================
    // GENERAR FACTURA
    // ==========================

    async generarFactura(metodoPago) {

        const todos =
            this._obtenerTodosLosPedidos();

        if (todos.length === 0) return;

        // ==========================
        // BLOQUEAR VENTA SIN USUARIO
        // ==========================

        if (
            !App.state.usuarioActual
            ||
            !App.state.usuarioActual.nombre
        ) {

            App.toast(
                "⚠️ Debes iniciar sesión para registrar la venta."
            );

            return;

        }

        let ventaGuardada;

        try {

            // Aplanar todos los items de todos los clientes.
            const detalles =
                todos.flatMap(cliente =>
                    cliente.items.map(item => ({

                        productoId: item.id,

                        cantidad: item.cantidad,

                        observaciones: item.observaciones || null,

                        adicionQueso: item.adicionQueso || 0

                    }))
                );

            const ventaRequest = {

                metodoPago: metodoPago,

                usuarioNombre:
                    App.state.usuarioActual.nombre,

                usuarioRol:
                    App.state.usuarioActual.rol
                    || "Sistema",

                tipoPedido: this.tipoPedido,

                numeroMesa:
                    this.tipoPedido === "mesa"
                        ? this.numeroMesa
                        : null,

                detalles: detalles

            };

            // Guardar venta en MySQL
            ventaGuardada =
                await API.guardarVenta(
                    ventaRequest
                );

        } catch (error) {

            console.error(error);

            App.toast(
                "❌ Error al guardar la venta."
            );

            return;

        }

        const ahora = new Date();

        // ==========================
        // FACTURA REAL DE MYSQL
        // ==========================

        const numeroFactura =
            ventaGuardada.id;

        // ==========================
        // ACTUALIZAR INVENTARIO LOCAL
        // ==========================

        if (
            typeof Inventario !== "undefined"
        ) {

            todos.forEach(cliente => {

                cliente.items.forEach(item => {

                    const producto =
                        Inventario.items.find(
                            p => p.id === item.id
                        );

                    if (producto) {

                        producto.stock -=
                            item.cantidad;

                    }

                });

            });

            Inventario.renderizar();

        }

        // ==========================
        // CONSTRUIR FACTURA POR CLIENTE
        // ==========================

        let htmlFactura = "";

        let totalGeneral = 0;

        todos.forEach(cliente => {

            let htmlClienteItems = "";

            let subtotalCliente = 0;

            cliente.items.forEach(item => {

                // Observaciones.
                let obsTexto = "";

                const obs =
                    item.observaciones || {};

                const observacionesSeleccionadas = [];

                if (obs.conQueso) observacionesSeleccionadas.push("queso");
                if (obs.conTomate) observacionesSeleccionadas.push("tomate");
                if (obs.conCebolla) observacionesSeleccionadas.push("cebolla");
                if (obs.conMantequilla) observacionesSeleccionadas.push("mantequilla");

                if (observacionesSeleccionadas.length > 0) {

                    obsTexto = `
                        <div style="font-size:10px;color:var(--gris-medio);">
                            Obs: ${observacionesSeleccionadas.join(", ")}
                        </div>
                    `;

                }

                // Adición de queso.
                let adicionTexto = "";

                if (item.adicionQueso > 0) {

                    adicionTexto = `
                        <div style="font-size:10px;color:var(--cafe-light);">
                            + Adición queso x${item.adicionQueso}
                            (+$${(item.adicionQueso * 1000).toLocaleString("es-CO")})
                        </div>
                    `;

                }

                htmlClienteItems += `

                    <div class="factura-item">

                        <div>

                            <div>
                                ${item.nombre} x${item.cantidad}
                            </div>

                            ${obsTexto}

                            ${adicionTexto}

                        </div>

                        <div>
                            $${item.subtotal.toLocaleString("es-CO")}
                        </div>

                    </div>

                `;

                subtotalCliente += item.subtotal;

            });

            totalGeneral += subtotalCliente;

            htmlFactura += `

                <div class="factura-cliente">

                    <div class="factura-cliente-titulo">
                        👤 Cliente ${cliente.numero}
                    </div>

                    ${htmlClienteItems}

                    <div class="factura-cliente-total">
                        <span>Subtotal Cliente ${cliente.numero}</span>
                        <span>$${subtotalCliente.toLocaleString("es-CO")}</span>
                    </div>

                </div>

            `;

        });

        // ==========================
        // MOSTRAR FACTURA
        // ==========================

        document
            .getElementById(
                "factura-contenido"
            )
            .innerHTML = `

                <div class="factura-header">

                    <div class="factura-logo">

                        🧇 OttoPOS

                    </div>

                    <div class="factura-fecha">

                        Factura #${numeroFactura}

                    </div>

                    <div class="factura-fecha">

                        ${ahora.toLocaleDateString("es-CO")}

                    </div>

                    <div class="factura-fecha">

                        ${ahora.toLocaleTimeString("es-CO")}

                    </div>

                    <div class="factura-vendedor">

                        👤 Vendedor: ${App.state.usuarioActual.nombre}

                    </div>

                    <div class="factura-vendedor">

                        📋 Rol: ${App.state.usuarioActual.rol || "Sistema"}

                    </div>

                    <div class="factura-tipo-pedido">

                        ${
                            this.tipoPedido === "mesa"
                                ? `🍽️ Mesa ${this.numeroMesa}`
                                : "🛍️ Para llevar"
                        }

                    </div>

                </div>

                ${htmlFactura}

                <div class="factura-total">

                    <span>

                        TOTAL GENERAL

                    </span>

                    <span>

                        $${totalGeneral.toLocaleString("es-CO")}

                    </span>

                </div>

                <div class="factura-pago">

                    Pago: ${metodoPago}

                </div>

            `;

        document
            .getElementById(
                "modal-factura"
            )
            .classList.add("visible");

        this._reiniciar();

    },


    // ==========================
    // IMPRIMIR FACTURA
    // ==========================

    imprimirFactura() {

        // Contenido de la factura generado en #factura-contenido.
        const contenido =
            document.getElementById('factura-contenido').innerHTML;

        // Abrir una ventana de impresión limpia, solo con la factura.
        const ventana = window.open('', '_blank', 'width=420,height=600');

        if (!ventana) {
            App.toast(
                '⚠️ Permite las ventanas emergentes para imprimir.'
            );
            return;
        }

        ventana.document.open();

        ventana.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Factura OttoPOS</title>
                <style>
                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }
                    body {
                        font-family: 'Arial', sans-serif;
                        color: #2C1A0E;
                        width: 100%;
                        max-width: 320px;
                        margin: 0 auto;
                        padding: 16px;
                        background: #fff;
                    }
                    /* Conservar la proporción de las imágenes */
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                        object-fit: contain !important;
                        display: block;
                        margin: 0 auto 8px;
                    }
                    .factura-header {
                        text-align: center;
                        padding-bottom: 12px;
                        border-bottom: 2px dashed #C8BFB0;
                        margin-bottom: 12px;
                    }
                    .factura-logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #6B3F1F;
                        letter-spacing: 2px;
                        margin-bottom: 4px;
                    }
                    .factura-fecha {
                        font-size: 12px;
                        color: #8B5E3C;
                    }
                    .factura-vendedor {
                        font-size: 12px;
                        color: #6B3F1F;
                        font-weight: bold;
                        margin-top: 4px;
                    }
                    .factura-cliente {
                        margin-bottom: 12px;
                        padding: 10px;
                        background: #F0EDE8;
                        border-radius: 8px;
                    }
                    .factura-cliente-titulo {
                        font-size: 13px;
                        font-weight: bold;
                        color: #6B3F1F;
                        padding-bottom: 6px;
                        border-bottom: 1px solid #C8BFB0;
                        margin-bottom: 6px;
                    }
                    .factura-item {
                        display: flex;
                        justify-content: space-between;
                        font-size: 13px;
                        padding: 4px 0;
                    }
                    .factura-cliente-total {
                        display: flex;
                        justify-content: space-between;
                        font-size: 13px;
                        font-weight: bold;
                        color: #8B5E3C;
                        padding-top: 6px;
                        border-top: 1px dashed #C8BFB0;
                        margin-top: 6px;
                    }
                    .factura-total {
                        display: flex;
                        justify-content: space-between;
                        font-weight: bold;
                        font-size: 16px;
                        padding: 12px 0 6px;
                        border-top: 2px solid #6B3F1F;
                        margin-top: 8px;
                        color: #6B3F1F;
                    }
                    .factura-pago {
                        text-align: center;
                        font-size: 12px;
                        color: #8B5E3C;
                        margin-top: 6px;
                        padding: 6px;
                        background: #F0EDE8;
                        border-radius: 8px;
                    }
                    @media print {
                        body {
                            max-width: 100%;
                            padding: 0;
                        }
                        .factura-header,
                        .factura-cliente,
                        .factura-total,
                        .factura-pago {
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        @page {
                            size: auto;
                            margin: 10mm;
                        }
                    }
                </style>
            </head>
            <body>
                ${contenido}
                <script>
                    window.onload = function () {
                        window.print();
                        window.onafterprint = function () {
                            window.close();
                        };
                    };
                <\/script>
            </body>
            </html>
        `);

        ventana.document.close();

    },


    // ==========================
    // CERRAR FACTURA
    // ==========================

    cerrarFactura() {

        document
            .getElementById(
                "modal-factura"
            )
            .classList.remove("visible");

    },


    // ==========================
    // VOLVER
    // ==========================

    volver() {

        const usuario =
            App.state.usuarioActual;

        if (
            usuario
            &&
            (
                usuario.rol === "Cliente"
                ||
                usuario.rol === "Caja"
            )
        ) {

            Login.cerrarSesion();

            return;

        }

        mostrar("menu");

    },


    // ==========================
    // RECALCULAR TOTAL
    // ==========================

    _recalcularTotal() {

        this.total =
            this.pedido.reduce(

                (total, item) =>

                    total + item.subtotal,

                0

            );

        document
            .getElementById(
                "total-valor"
            )
            .textContent =

            "$"
            + this.total.toLocaleString(
                "es-CO"
            );

    },


    // ==========================
    // RENDER PEDIDO
    // ==========================

    _renderPedido() {

        const lista =
            document.getElementById(
                "listaVentas"
            );

        if (!lista) return;

        lista.innerHTML = "";

        if (this.pedido.length === 0) {

            lista.innerHTML = `
                <li style="color:var(--gris-medio);font-size:13px;list-style:none;text-align:center;">
                    El pedido está vacío.
                </li>
            `;

            return;

        }

        this.pedido.forEach(item => {

            const li =
                document.createElement(
                    "li"
                );

            // Observaciones.
            let obsTexto = "";

            const obs =
                item.observaciones || {};

            const observacionesSeleccionadas = [];

            if (obs.conQueso) observacionesSeleccionadas.push("queso");
            if (obs.conTomate) observacionesSeleccionadas.push("tomate");
            if (obs.conCebolla) observacionesSeleccionadas.push("cebolla");
            if (obs.conMantequilla) observacionesSeleccionadas.push("mantequilla");

            if (observacionesSeleccionadas.length > 0) {

                obsTexto =
                    `<div style="font-size:10px;color:var(--gris-medio);">
                        Obs: ${observacionesSeleccionadas.join(", ")}
                    </div>`;

            }

            let adicionTexto = "";

            if (item.adicionQueso > 0) {

                adicionTexto =
                    `<div style="font-size:10px;color:var(--cafe-light);">
                        + Adición queso x${item.adicionQueso}
                    </div>`;

            }

            li.innerHTML = `

                <div>

                    <div>
                        ${item.nombre} x${item.cantidad}
                    </div>

                    ${obsTexto}

                    ${adicionTexto}

                </div>

                <div style="display:flex;align-items:center;gap:8px;">

                    <span>
                        $${item.subtotal.toLocaleString("es-CO")}
                    </span>

                    <button

                        class="btn btn-danger btn-sm"

                        onclick="Ventas.eliminarItem(${item.id})">

                        ✕

                    </button>

                </div>

            `;

            lista.appendChild(li);

        });

    },


    // ==========================
    // REINICIAR VENTA
    // ==========================

    _reiniciar() {

        this.pedido = [];

        this.clientes = [];

        this.clienteActual = 1;

        this.total = 0;

        // Restablecer tipo de pedido a "Para llevar".
        this.tipoPedido = "llevar";

        this.numeroMesa = "";

        // Restablecer UI del tipo de pedido.
        const btnMesa = document.getElementById("btn-tipo-mesa");
        const btnLlevar = document.getElementById("btn-tipo-llevar");
        const mesaGroup = document.getElementById("mesa-input-group");
        const inputMesa = document.getElementById("numero-mesa");

        if (btnMesa) btnMesa.classList.remove("activo");
        if (btnLlevar) btnLlevar.classList.add("activo");
        if (mesaGroup) mesaGroup.style.display = "none";
        if (inputMesa) inputMesa.value = "";

        this._recalcularTotal();

        this._renderPedido();

        this._renderPedidosGuardados();

        // Restablecer botón de cliente.
        const btn =
            document.getElementById("btn-crear-cliente");

        if (btn) {

            btn.style.display = "";
            btn.textContent = "➕ Crear Pedido Cliente 1";

        }

        const pago =
            document.getElementById(
                "pago-section"
            );

        if (pago) {

            pago.classList.remove(
                "visible"
            );

        }

    }

};