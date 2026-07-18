// ===== OTTOPOS - VENTAS.JS =====

const Ventas = {

    productos: [],

    pedido: [],

    total: 0,

    numFactura: 1000,

    // ==========================
    // CARGAR PRODUCTOS DESDE MYSQL
    // ==========================

    async cargarProductos() {

        try {

            this.productos = await API.obtenerProductos();

            this.renderizarCatalogo();

        } catch (error) {

            console.error(error);

            App.toast("❌ No fue posible cargar el catálogo.");

        }

    },

    // ==========================
    // CATÁLOGO DINÁMICO
    // ==========================

    renderizarCatalogo() {

        const contenedor = document.getElementById("catalogo-productos");

        if (!contenedor) return;

        contenedor.innerHTML = "";

        this.productos.forEach(producto => {

            if (producto.estado === false) return;

            const fila = document.createElement("div");

            fila.className = "fila-producto";

            fila.innerHTML = `
                <span class="prod-nombre">${producto.nombre}</span>

                <span class="prod-precio">
                    $${Number(producto.precio).toLocaleString("es-CO")}
                </span>

                <input
                    type="number"
                    min="0"
                    value="0"
                    id="prod-${producto.id}"
                    class="input-cantidad"
                >
            `;

            contenedor.appendChild(fila);

        });

    },
    },

// ==========================
// AGREGAR PRODUCTOS AL PEDIDO
// ==========================

agregarAlPedido() {

    let agregados = 0;

    this.productos.forEach(producto => {

        const input = document.getElementById(`prod-${producto.id}`);

        if (!input) return;

        const cantidad = parseInt(input.value) || 0;

        if (cantidad <= 0) return;

        // Validar stock
        if (cantidad > producto.stock) {

            App.toast(
                `⚠️ Stock insuficiente de ${producto.nombre}.
Disponible: ${producto.stock}`
            );

            input.value = 0;

            return;
        }

        const existente = this.pedido.find(p => p.id === producto.id);

        if (existente) {

            existente.cantidad += cantidad;

            existente.subtotal =
                existente.cantidad * existente.precio;

        } else {

            this.pedido.push({

                id: producto.id,

                nombre: producto.nombre,

                precio: producto.precio,

                cantidad: cantidad,

                subtotal: cantidad * producto.precio

            });

        }

        agregados++;

        input.value = 0;

    });

    if (agregados === 0) {

        App.toast("⚠️ Agrega al menos un producto.");

        return;

    }

    this._recalcularTotal();

    this._renderPedido();

    App.toast("✓ Productos agregados correctamente.");

},


  eliminarItem(id) {
    this.pedido = this.pedido.filter(i => i.id !== id);
    this._recalcularTotal();
    this._renderPedido();
  },

  confirmarVenta() {
    if (this.total === 0) { App.toast('⚠️ El pedido está vacío'); return; }
    document.getElementById('pago-section').classList.add('visible');
    document.getElementById('pago-section').scrollIntoView({ behavior: 'smooth' });
  },

  async generarFactura(metodo) {
    if (this.total === 0) return;

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    const hora  = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const numF  = this.numFactura++;
    const vendedor = App.state.usuarioActual?.nombre || 'Sistema';

    // ===============================
// Enviar venta al Backend (Spring Boot)
// ===============================

try {

    const ventaRequest = {

        metodoPago: metodo,

        detalles: this.pedido.map(item => ({

            productoId: item.id,

            cantidad: item.cantidad

        }))

    };

    await API.guardarVenta(ventaRequest);

    console.log("✅ Venta registrada correctamente.");

} catch (error) {

    console.error(error);

    App.toast("❌ Error al registrar la venta.");

    return;

}

// ===============================
// Actualizar inventario local
// ===============================

Inventario.descontarVenta(this.pedido);

// ===============================
// Registrar reporte local
// ===============================

Reportes.registrarVenta({
    numero: numF,
    items: [...this.pedido],
    total: this.total,
    metodo,
    fecha: ahora,
    vendedor
});

    // ── Construir HTML de factura ──
    let itemsHTML = '';
    this.pedido.forEach(item => {
      itemsHTML += `
        <div class="factura-item">
          <span>${item.nombre} x${item.cantidad}</span>
          <span>$${item.subtotal.toLocaleString('es-CO')}</span>
        </div>`;
    });

    document.getElementById('factura-contenido').innerHTML = `
      <div class="factura-header">
        <div class="factura-logo">🧇 OttoPOS</div>
        <div class="factura-fecha">Factura #${numF}</div>
        <div class="factura-fecha">${fecha} · ${hora}</div>
        <div class="factura-fecha">Vendedor: 001</div>
<div class="factura-fecha">Cliente: ${vendedor}</div>
      </div>
      ${itemsHTML}
      <div class="factura-total">
        <span>TOTAL</span>
        <span>$${this.total.toLocaleString('es-CO')}</span>
      </div>
      <div class="factura-pago">💳 Pago: ${metodo}</div>
    `;

    document.getElementById('modal-factura').classList.add('visible');
    this._reiniciar();
  },

  imprimirFactura() {
    const contenido = document.getElementById('factura-contenido').innerHTML;
    const ventana = window.open('', '_blank', 'width=400,height=650');
    const logoSrc = typeof LOGO_BASE64 !== 'undefined' ? LOGO_BASE64 : '';
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura OttoPOS</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap');
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: 'DM Sans', Arial, sans-serif; padding: 24px; max-width: 320px; margin: auto; color: #2C1A0E; }
          .print-header { text-align:center; padding-bottom:14px; border-bottom:2px dashed #C8BFB0; margin-bottom:14px; }
          .print-logo-img { width:80px; height:80px; border-radius:50%; object-fit:cover; border:2px solid #F4C542; margin-bottom:8px; }
          .factura-logo { font-size:22px; font-weight:700; color:#6B3F1F; letter-spacing:2px; margin-bottom:2px; }
          .factura-fecha { font-size:12px; color:#8B5E3C; margin-top:3px; }
          .factura-header { display:none; }
          .factura-item { display:flex; justify-content:space-between; font-size:13px; padding:5px 0; border-bottom:1px solid #F0EDE8; }
          .factura-total { display:flex; justify-content:space-between; font-weight:700; font-size:16px; padding:12px 0 6px; border-top:2px solid #6B3F1F; margin-top:8px; color:#6B3F1F; }
          .factura-pago { text-align:center; font-size:12px; color:#8B5E3C; margin-top:8px; padding:6px; background:#F0EDE8; border-radius:6px; }
          .gracias { text-align:center; font-size:12px; color:#C8BFB0; margin-top:16px; }
        </style>
      </head>
      <body>
        <div class="print-header">
          ${logoSrc ? `<img src="${logoSrc}" class="print-logo-img" alt="Logo">` : ''}
          <div class="factura-logo">OttoPOS</div>
          <div class="factura-fecha">Point of Sale System</div>
        </div>
        ${contenido}
        <div class="gracias">¡Gracias por su compra!</div>
        <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
      </body>
      </html>
    `);
    ventana.document.close();
  },

  cerrarFactura() {
    document.getElementById('modal-factura').classList.remove('visible');
  },

  volver() {
    if (App.state.usuarioActual?.rol === 'Cliente') {
      Login.cerrarSesion();
    } else {
      mostrar('menu');
    }
  },

  _recalcularTotal() {
    this.total = this.pedido.reduce((acc, i) => acc + i.subtotal, 0);
    const el = document.getElementById('total-valor');
    if (el) el.textContent = '$' + this.total.toLocaleString('es-CO');
  },

  _renderPedido() {
    const lista = document.getElementById('listaVentas');
    if (!lista) return;
    lista.innerHTML = '';
    this.pedido.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.nombre} <strong>x${item.cantidad}</strong></span>
        <span style="display:flex;align-items:center;gap:10px;">
          <strong>$${item.subtotal.toLocaleString('es-CO')}</strong>
          <button class="btn btn-sm btn-danger" onclick="Ventas.eliminarItem('${item.id}')">✕</button>
        </span>`;
      lista.appendChild(li);
    });
    if (this.pedido.length === 0) document.getElementById('pago-section').classList.remove('visible');
  },

  _reiniciar() {
    this.pedido = [];
    this.total  = 0;
    this._recalcularTotal();
    this._renderPedido();
    document.getElementById('pago-section').classList.remove('visible');
  }
};
