// =======================================
// OTTOPOS - VENTAS.JS
// =======================================

const Ventas = {

    productos: [],

    pedido: [],

    total: 0,


    // ==========================
    // CARGAR PRODUCTOS
    // ==========================

    async cargarProductos() {

        try {

            this.productos =
                await API.obtenerProductos();

            this.renderizarCatalogo();

        } catch (error) {

            console.error(error);

            App.toast(
                "❌ No fue posible cargar los productos."
            );

        }

    },


    // ==========================
    // RENDERIZAR CATÁLOGO
    // ==========================

    renderizarCatalogo() {

        const contenedor =
            document.getElementById(
                "catalogo-productos"
            );


        if (!contenedor) return;


        contenedor.innerHTML = "";


        this.productos.forEach(producto => {

            if (!producto.estado) return;


            const fila =
                document.createElement("div");


            fila.className =
                "fila-producto";


            fila.innerHTML = `

                <img
                    src="${obtenerImagenProducto(producto)}"
                    alt="${producto.nombre}"
                    class="prod-imagen"
                    onerror="this.src='img/logo.png'">

                <span class="prod-nombre">

                    ${producto.nombre}

                </span>


                <span class="prod-precio">

                    $${Number(
                        producto.precio
                    ).toLocaleString("es-CO")}

                </span>


                <input

                    id="prod-${producto.id}"

                    class="input-cantidad"

                    type="number"

                    min="0"

                    value="0">

            `;


            contenedor.appendChild(fila);

        });

    },


    // ==========================
    // AGREGAR AL PEDIDO
    // ==========================

    agregarAlPedido() {

        let agregados = 0;


        this.productos.forEach(producto => {

            const input =
                document.getElementById(
                    `prod-${producto.id}`
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


            const existente =
                this.pedido.find(

                    item =>
                        item.id === producto.id

                );


            if (existente) {

                existente.cantidad += cantidad;


                existente.subtotal =
                    existente.cantidad
                    * producto.precio;

            } else {

                this.pedido.push({

                    id: producto.id,

                    nombre: producto.nombre,

                    precio: producto.precio,

                    cantidad: cantidad,

                    subtotal:
                        cantidad
                        * producto.precio

                });

            }


            input.value = 0;


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

        if (this.pedido.length === 0) {

            App.toast(
                "⚠️ El pedido está vacío."
            );


            return;

        }


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
    // GENERAR FACTURA
    // ==========================

    async generarFactura(metodoPago) {

        if (this.pedido.length === 0) return;


        let ventaGuardada;


        try {

            const ventaRequest = {

                metodoPago: metodoPago,


                detalles: this.pedido.map(item => ({

                    productoId: item.id,

                    cantidad: item.cantidad

                }))

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


        const vendedor =
            App.state.usuarioActual?.nombre
            || "Sistema";


        // ==========================
        // ACTUALIZAR INVENTARIO LOCAL
        // ==========================

        if (
            typeof Inventario !== "undefined"
        ) {

            this.pedido.forEach(item => {

                const producto =
                    Inventario.items.find(

                        p =>
                            p.id === item.id

                    );


                if (producto) {

                    producto.stock -=
                        item.cantidad;

                }

            });


            Inventario.renderizar();

        }


        // ==========================
        // CONSTRUIR ITEMS FACTURA
        // ==========================

        let htmlItems = "";


        this.pedido.forEach(item => {

            htmlItems += `

                <div class="factura-item">

                    <span>

                        ${item.nombre}
                        x${item.cantidad}

                    </span>


                    <span>

                        $${item.subtotal.toLocaleString(
                            "es-CO"
                        )}

                    </span>

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

                        ${ahora.toLocaleDateString(
                            "es-CO"
                        )}

                    </div>


                    <div class="factura-fecha">

                        ${ahora.toLocaleTimeString(
                            "es-CO"
                        )}

                    </div>

                </div>


                ${htmlItems}


                <div class="factura-total">

                    <span>

                        TOTAL

                    </span>


                    <span>

                        $${this.total.toLocaleString(
                            "es-CO"
                        )}

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

        window.print();

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
        usuario.rol === "Cliente"
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


        lista.innerHTML = "";


        this.pedido.forEach(item => {

            const li =
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                <span>

                    ${item.nombre}

                    x${item.cantidad}

                </span>


                <span>

                    $${item.subtotal.toLocaleString(
                        "es-CO"
                    )}


                    <button

                        class="btn btn-danger btn-sm"

                        onclick="Ventas.eliminarItem(${item.id})">

                        ✕

                    </button>

                </span>

            `;


            lista.appendChild(li);

        });

    },


    // ==========================
    // REINICIAR VENTA
    // ==========================

    _reiniciar() {

        this.pedido = [];


        this.total = 0;


        this._recalcularTotal();


        this._renderPedido();


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