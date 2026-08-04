const Usuarios = {

    usuarios: [],
    usuarioEditando: null,

    // ==========================
    // CARGAR USUARIOS
    // ==========================
    async cargarUsuarios() {

        try {

            const respuesta = await fetch('http://localhost:8081/api/usuarios');

            if (!respuesta.ok) {
                throw new Error('Error al consultar usuarios');
            }

            this.usuarios = await respuesta.json();

            this.renderizar();

        } catch (error) {

            console.error('Error cargando usuarios:', error);

            alert('No se pudieron cargar los usuarios');

        }

    },

    // ==========================
    // RENDERIZAR USUARIOS
    // ==========================
    renderizar() {

        const contenedor = document.getElementById('lista-usuarios');

        if (!contenedor) return;

        contenedor.innerHTML = '';

        if (this.usuarios.length === 0) {

            contenedor.innerHTML = `
                <p style="text-align:center;">
                    No hay usuarios registrados
                </p>
            `;

            return;
        }

        this.usuarios.forEach(usuario => {

            contenedor.innerHTML += `

                <div class="producto-card">

                    <div>
                        <strong>${usuario.nombre}</strong>

                        <br>

                        <small>
                            ${usuario.correo}
                        </small>

                        <br>

                        <small>
                            Rol: ${usuario.rol}
                        </small>

                        <br>

                        <small>
                            Estado:
                            ${usuario.estado ? 'Activo' : 'Inactivo'}
                        </small>

                    </div>

                    <div>

                        <button
                            class="btn btn-outline"
                            onclick="Usuarios.editarUsuario(${usuario.id})">

                            ✏️ Editar

                        </button>

                        <button
                            class="btn btn-danger"
                            onclick="Usuarios.eliminarUsuario(${usuario.id})">

                            🗑 Eliminar

                        </button>

                    </div>

                </div>

            `;

        });

    },

    // ==========================
    // GUARDAR USUARIO
    // ==========================
    async guardarUsuario() {

        const nombre =
            document.getElementById('usr-nombre').value.trim();

        const correo =
            document.getElementById('usr-correo').value.trim();

        const contrasena =
            document.getElementById('usr-contrasena').value.trim();

        const rol =
            document.getElementById('usr-rol').value;

        const estado =
            document.getElementById('usr-estado').checked;

        if (!nombre || !correo || !contrasena) {

            alert('Completa todos los campos obligatorios');

            return;

        }

        const usuario = {

            nombre: nombre,
            correo: correo,
            contrasena: contrasena,
            rol: rol,
            estado: estado

        };

        try {

            let url = 'http://localhost:8081/api/usuarios';

            let metodo = 'POST';

            if (this.usuarioEditando !== null) {

                url += '/' + this.usuarioEditando;

                metodo = 'PUT';

            }

            const respuesta = await fetch(url, {

                method: metodo,

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(usuario)

            });

            if (!respuesta.ok) {

                throw new Error('Error al guardar usuario');

            }

            alert(
                this.usuarioEditando === null
                    ? 'Usuario creado correctamente'
                    : 'Usuario actualizado correctamente'
            );

            this.limpiarFormulario();

            await this.cargarUsuarios();

        } catch (error) {

            console.error(error);

            alert('Error al guardar el usuario');

        }

    },

    // ==========================
    // EDITAR USUARIO
    // ==========================
    editarUsuario(id) {

        const usuario =
            this.usuarios.find(u => u.id === id);

        if (!usuario) return;

        document.getElementById('usr-nombre').value =
            usuario.nombre;

        document.getElementById('usr-correo').value =
            usuario.correo;

        document.getElementById('usr-contrasena').value =
            usuario.contrasena;

        document.getElementById('usr-rol').value =
            usuario.rol;

        document.getElementById('usr-estado').checked =
            usuario.estado;

        this.usuarioEditando = id;

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    },

    // ==========================
    // ELIMINAR USUARIO
    // ==========================
    async eliminarUsuario(id) {

        const confirmar =
            confirm('¿Seguro que deseas eliminar este usuario?');

        if (!confirmar) return;

        try {

            const respuesta = await fetch(
                'http://localhost:8081/api/usuarios/' + id,
                {
                    method: 'DELETE'
                }
            );

            if (!respuesta.ok) {

                throw new Error('Error al eliminar usuario');

            }

            alert('Usuario eliminado correctamente');

            await this.cargarUsuarios();

        } catch (error) {

            console.error(error);

            alert('Error al eliminar el usuario');

        }

    },

    // ==========================
    // LIMPIAR FORMULARIO
    // ==========================
    limpiarFormulario() {

        document.getElementById('usr-nombre').value = '';

          document.getElementById('usr-correo').value =
            usuario.correo;

        document.getElementById('usr-contrasena').value =
            usuario.contrasena;

        document.getElementById('usr-rol').value =
            usuario.rol;

        document.getElementById('usr-estado').checked =
            usuario.estado;

    }

};