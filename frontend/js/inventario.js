// ======================================
// OTTOPOS - INVENTARIO.JS
// ======================================

/**
 * Objeto encargado de gestionar el módulo
 * de inventario de OttoPOS.
 *
 * Permite cargar, mostrar, guardar, editar
 * y eliminar productos del sistema.
 */
const Inventario = {

    /**
     * Lista local de productos cargados
     * desde la API.
     */
    items: [],

    /**
     * Identificador del producto que se está editando.
     *
     * Si su valor es null, se está registrando
     * un producto nuevo.
     */
    productoEditando: null,

    /**
     * Carga los productos registrados
     * desde la API de OttoPOS.
     *
     * @returns {Promise<void>}
     */
    async cargarProductos() {

        try {

            const respuesta = await fetch(
                `${CONFIG.API_URL}/productos`
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible obtener los productos."
                );

            }

            const productos =
                await respuesta.json();

            this.items = productos.map(producto => ({

                id: producto.id,
                nombre: producto.nombre,
                referencia: producto.referencia,
                precio: producto.precio,
                stock: producto.stock,
                categoria: producto.categoria,
                imagenUrl: producto.imagenUrl,
                estado: producto.estado,

                // Cantidad mínima para generar alerta.
                minimo: 5

            }));

            this.renderizar();

        } catch (error) {

            console.error(error);

            App.toast(
                "❌ Error al cargar el inventario."
            );

        }

    },


    /**
     * Muestra los productos del inventario
     * en la interfaz de usuario.
     *
     * También verifica si existen productos
     * con stock bajo y muestra una alerta.
     */
    renderizar() {

        const lista =
            document.getElementById(
                "lista-inventario"
            );

        if (!lista) return;

        lista.innerHTML = "";

        this.items.forEach(item => {

            const bajo =
                item.stock <= item.minimo;

            const div =
                document.createElement("div");

            div.className = "inv-item";

            div.innerHTML = `

                <img
                    src="${obtenerImagenProducto(item)}"
                    alt="${item.nombre}"
                    class="inv-imagen"
                    onerror="this.src='img/logo.png'">

                <div style="flex:1;">

                    <strong>
                        ${item.nombre}
                    </strong>

                    <br>

                    <small>
                        ${item.categoria}
                    </small>

                    <br>

                    <small>
                        Ref: ${item.referencia}
                    </small>

                </div>

                <div style="text-align:right;">

                    <div>
                        $${Number(
                            item.precio
                        ).toLocaleString("es-CO")}
                    </div>

                    <span class="inv-badge ${
                        bajo ? "bajo" : ""
                    }">

                        ${item.stock} uds

                    </span>

                    <div style="
                        margin-top:8px;
                        display:flex;
                        gap:6px;
                        justify-content:flex-end;
                    ">

                        <button
                            class="btn btn-sm btn-secondary"
                            onclick="Inventario.editarProducto(
                                ${item.id}
                            )">

                            ✏

                        </button>

                        <button
                            class="btn btn-sm btn-danger"
                            onclick="Inventario.eliminarProducto(
                                ${item.id}
                            )">

                            🗑

                        </button>

                    </div>

                </div>

            `;

            lista.appendChild(div);

        });

        const bajos =
            this.items.filter(
                item => item.stock <= item.minimo
            );

        const alerta =
            document.getElementById("inv-alerta");

        if (!alerta) return;

        if (bajos.length > 0) {

            alerta.textContent =
                "⚠️ Stock bajo: "
                + bajos
                    .map(item => item.nombre)
                    .join(", ");

            alerta.classList.add("visible");

        } else {

            alerta.classList.remove("visible");

        }

    },


    /**
     * Guarda un nuevo producto o actualiza
     * un producto existente.
     *
     * @returns {Promise<void>}
     */
    async guardarProducto() {

        const producto = {

            nombre:
                document
                    .getElementById("prod-nombre")
                    .value
                    .trim(),

            referencia:
                document
                    .getElementById("prod-referencia")
                    .value
                    .trim(),

            precio:
                Number(
                    document
                        .getElementById("prod-precio")
                        .value
                ),

            stock:
                Number(
                    document
                        .getElementById("prod-stock")
                        .value
                ),

            categoria:
                document
                    .getElementById("prod-categoria")
                    .value
                    .trim(),

            imagenUrl:
                document
                    .getElementById("prod-imagen")
                    .value
                    .trim(),

            estado:
                document
                    .getElementById("prod-estado")
                    .checked

        };

        if (

            !producto.nombre
            || !producto.referencia
            || producto.precio <= 0
            || producto.stock < 0
            || !producto.categoria

        ) {

            App.toast(
                "⚠️ Complete todos los campos."
            );

            return;

        }

        try {

            const url =
                this.productoEditando === null

                    ? `${CONFIG.API_URL}/productos`

                    : `${CONFIG.API_URL}/productos/${
                        this.productoEditando
                    }`;

            const metodo =
                this.productoEditando === null

                    ? "POST"

                    : "PUT";

            const respuesta =
                await fetch(

                    url,

                    {

                        method: metodo,

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(producto)

                    }

                );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible guardar el producto."
                );

            }

            App.toast(

                this.productoEditando === null

                    ? "✅ Producto guardado correctamente."

                    : "✅ Producto actualizado correctamente."

            );

            this.productoEditando = null;

            this.limpiarFormulario();

            document.querySelector(

                'button[onclick="Inventario.guardarProducto()"]'

            ).textContent =
                "💾 Guardar Producto";

            await this.cargarProductos();

        } catch (error) {

            console.error(error);

            App.toast(
                "❌ Error al guardar el producto."
            );

        }

    },


    /**
     * Carga la información de un producto
     * en el formulario para editarlo.
     *
     * @param {number} id identificador del producto
     */
    editarProducto(id) {

        const producto =
            this.items.find(
                p => p.id === id
            );

        if (!producto) return;

        this.productoEditando = id;

        document
            .getElementById("prod-nombre")
            .value = producto.nombre;

        document
            .getElementById("prod-referencia")
            .value = producto.referencia;

        document
            .getElementById("prod-precio")
            .value = producto.precio;

        document
            .getElementById("prod-stock")
            .value = producto.stock;

        document
            .getElementById("prod-categoria")
            .value = producto.categoria;

        document
            .getElementById("prod-imagen")
            .value = producto.imagenUrl || "";

        document
            .getElementById("prod-estado")
            .checked = producto.estado;

        document.querySelector(

            'button[onclick="Inventario.guardarProducto()"]'

        ).textContent =
            "💾 Actualizar Producto";

    },


    /**
     * Elimina un producto del sistema.
     *
     * Solicita confirmación al usuario antes
     * de realizar la eliminación.
     *
     * @param {number} id identificador del producto
     * @returns {Promise<void>}
     */
    async eliminarProducto(id) {

        const confirmar =
            confirm(
                "¿Está seguro de eliminar este producto?"
            );

        if (!confirmar) return;

        try {

            const respuesta =
                await fetch(

                    `${CONFIG.API_URL}/productos/${id}`,

                    {

                        method: "DELETE"

                    }

                );

            if (!respuesta.ok) {

                throw new Error(
                    "No fue posible eliminar."
                );

            }

            App.toast(
                "✅ Producto eliminado correctamente."
            );

            await this.cargarProductos();

        } catch (error) {

            console.error(error);

            App.toast(
                "❌ Error al eliminar el producto."
            );

        }

    },


    /**
     * Limpia todos los campos del formulario
     * de productos y restablece el estado activo.
     */
    limpiarFormulario() {

        document
            .getElementById("prod-nombre")
            .value = "";

        document
            .getElementById("prod-referencia")
            .value = "";

        document
            .getElementById("prod-precio")
            .value = "";

        document
            .getElementById("prod-stock")
            .value = "";

        document
            .getElementById("prod-categoria")
            .value = "";

        document
            .getElementById("prod-imagen")
            .value = "";

        document
            .getElementById("prod-estado")
            .checked = true;

    },


    /**
     * Descuenta localmente las cantidades
     * vendidas de los productos.
     *
     * @param {Array} pedido lista de productos vendidos
     */
    descontarVenta(pedido) {

        pedido.forEach(item => {

            const producto =
                this.items.find(
                    p => p.id === item.id
                );

            if (producto) {

                producto.stock -=
                    item.cantidad;

            }

        });

        this.renderizar();

    }

};