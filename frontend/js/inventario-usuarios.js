// ===== OTTOPOS - INVENTARIO.JS =====

const Inventario = {

  items: [
    { id: 'a1', nombre: 'Arepa Burger',  stock: 20, minimo: 5 },
    { id: 'a2', nombre: 'Arepa Queso',   stock: 30, minimo: 5 },
    { id: 'a3', nombre: 'Arepa Chorizo', stock: 15, minimo: 5 },
    { id: 'a4', nombre: 'Arepa Mixta',   stock: 10, minimo: 5 },
    { id: 'b1', nombre: 'CocaCola',      stock: 24, minimo: 6 },
    { id: 'b2', nombre: 'Sprite',        stock: 18, minimo: 6 },
    { id: 'b3', nombre: 'Quatro',        stock: 12, minimo: 6 }
  ],

  renderizar() {
    const lista = document.getElementById('lista-inventario');
    if (!lista) return;

    lista.innerHTML = '';

    this.items.forEach(item => {
      const bajo = item.stock <= item.minimo;
      const div  = document.createElement('div');
      div.className = 'inv-item';
      div.innerHTML = `
        <span class="inv-nombre">${item.nombre}</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="inv-badge ${bajo ? 'bajo' : ''}">${item.stock} uds</span>
          <button class="btn btn-sm btn-outline" onclick="Inventario.editar('${item.id}')" title="Editar stock">✏️</button>
        </div>
      `;
      lista.appendChild(div);
    });

    // Alerta de stock bajo
    const bajos = this.items.filter(i => i.stock <= i.minimo);
    const alertEl = document.getElementById('inv-alerta');
    if (alertEl) {
      if (bajos.length > 0) {
        alertEl.textContent = `⚠️ Stock bajo: ${bajos.map(b => b.nombre).join(', ')}`;
        alertEl.classList.add('visible');
      } else {
        alertEl.classList.remove('visible');
      }
    }
  },

  editar(id) {
    const item     = this.items.find(i => i.id === id);
    if (!item) return;

    const nuevo = prompt(`Stock actual de "${item.nombre}": ${item.stock}\n\nNueva cantidad:`, item.stock);

    if (nuevo === null) return; // Canceló

    const cantidad = parseInt(nuevo);
    if (isNaN(cantidad) || cantidad < 0) {
      App.toast('❌ Cantidad inválida');
      return;
    }

    item.stock = cantidad;
    this.renderizar();
    App.toast(`✓ Stock de ${item.nombre} actualizado a ${cantidad}`);
  },

  // Descontar stock por venta (llamado desde Ventas)
  descontarVenta(pedido) {
    pedido.forEach(item => {
      const prod = this.items.find(p => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.cantidad);
      }
    });
    this.renderizar();
  }
};


// ===== OTTOPOS - USUARIOS.JS =====

const Usuarios = {

  lista: [
    { nombre: 'Administrador', rol: 'Admin',    usuario: 'admin' }
  ],

  roles: ['Admin', 'Operador', 'Caja'],

  agregar() {
    const inputNombre  = document.getElementById('nuevoUsuario');
    const inputUsuario = document.getElementById('nuevoLogin');
    const inputRol     = document.getElementById('nuevoRol');

    const nombre  = inputNombre?.value.trim();
    const usuario = inputUsuario?.value.trim();
    const rol     = inputRol?.value || 'Operador';

    // Validaciones
    let errores = false;

    if (!nombre) {
      this._marcarError('nuevoUsuario', 'msg-nombre-usr', 'Ingresa el nombre');
      errores = true;
    }

    if (!usuario) {
      this._marcarError('nuevoLogin', 'msg-login-usr', 'Ingresa el nombre de usuario');
      errores = true;
    } else if (this.lista.find(u => u.usuario === usuario)) {
      this._marcarError('nuevoLogin', 'msg-login-usr', 'Ese usuario ya existe');
      errores = true;
    }

    if (errores) return;

    this.lista.push({ nombre, rol, usuario });
    this._limpiarForm();
    this.renderizar();
    App.toast(`✓ Usuario "${nombre}" agregado como ${rol}`);
  },

  eliminar(usuario) {
    if (usuario === 'admin') {
      App.toast('❌ No puedes eliminar al administrador');
      return;
    }

    if (confirm(`¿Eliminar al usuario "${usuario}"?`)) {
      this.lista = this.lista.filter(u => u.usuario !== usuario);
      this.renderizar();
      App.toast('Usuario eliminado');
    }
  },

  renderizar() {
    const lista = document.getElementById('listaUsuarios');
    if (!lista) return;

    lista.innerHTML = '';

    // Usuarios del sistema
    const todos = [
      ...this.lista,
      ...Registro.clientes.map(c => ({ nombre: c.nombre, rol: 'Cliente', usuario: c.usuario, cedula: c.cedula, correo: c.correo }))
    ];

    todos.forEach(u => {
      const li = document.createElement('li');
      li.className = 'usuario-item';
      li.innerHTML = `
        <div>
          <div class="usuario-nombre">${u.nombre}</div>
          <div style="font-size:12px;color:var(--gris-medio);">@${u.usuario}${u.cedula ? ' · CC: ' + u.cedula : ''}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="usuario-rol rol-${u.rol.toLowerCase()}">${u.rol}</span>
          ${u.usuario !== 'admin' ? `<button class="btn btn-sm btn-danger" onclick="Usuarios.eliminar('${u.usuario}')" title="Eliminar">✕</button>` : ''}
        </div>
      `;
      lista.appendChild(li);
    });
  },

  _marcarError(inputId, msgId, texto) {
    const input = document.getElementById(inputId);
    const msg   = document.getElementById(msgId);
    if (input) input.classList.add('error');
    if (msg)   { msg.textContent = texto; msg.classList.add('visible'); }
  },

  _limpiarForm() {
    ['nuevoUsuario', 'nuevoLogin'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('error', 'valido'); }
    });
    ['msg-nombre-usr', 'msg-login-usr'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('visible');
    });
  }
};

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', () => {
  ['nuevoUsuario', 'nuevoLogin'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
        input.classList.add('valido');
      } else {
        input.classList.remove('valido');
      }
    });
  });
});


// ===== OTTOPOS - REPORTES.JS =====

const Reportes = {
  ventas: [],

  registrarVenta(venta) {
    this.ventas.push(venta);
    console.log('Venta registrada:', venta);
  },

  totalDia() {
    return this.ventas.reduce((acc, v) => acc + v.total, 0);
  }
};
