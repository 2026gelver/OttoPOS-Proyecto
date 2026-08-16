// ===== OTTOPOS - LOGIN.JS =====

/**
 * Objeto encargado de gestionar el inicio de sesión
 * de los usuarios de OttoPOS.
 *
 * Permite validar usuarios internos y clientes registrados
 * en la base de datos, además de controlar el acceso
 * según el rol del usuario.
 */
const Login = {

  /**
   * Usuarios internos del sistema.
   *
   * Contiene las credenciales iniciales de los usuarios
   * administrativos y operativos.
   */
  usuarios: [

    {
      usuario: 'admin',
      clave: '1234',
      rol: 'Admin',
      nombre: 'Administrador'
    },

    {
      usuario: 'operador',
      clave: '0000',
      rol: 'Operador',
      nombre: 'Operador 1'
    },

    {
      usuario: 'caja',
      clave: '9999',
      rol: 'Caja',
      nombre: 'Cajero 1'
    }

  ],


  /**
   * Valida las credenciales ingresadas
   * y permite el acceso al sistema.
   *
   * Los usuarios internos se validan localmente
   * y los clientes se consultan desde la base de datos.
   *
   * @returns {Promise<void>}
   */
  async ingresar() {

    const usuario =
      document
        .getElementById('usuario')
        .value
        .trim();

    const clave =
      document
        .getElementById('clave')
        .value
        .trim();

    const msgEl =
      document
        .getElementById('msg-login');


    // Limpia los errores anteriores.
    this._limpiarErrores();


    let errores = false;


    /**
     * Valida que el usuario haya sido ingresado.
     */
    if (!usuario) {

      this._marcarError(
        'usuario',
        'Ingresa tu usuario'
      );

      errores = true;

    }


    /**
     * Valida que la contraseña haya sido ingresada.
     */
    if (!clave) {

      this._marcarError(
        'clave',
        'Ingresa tu contraseña'
      );

      errores = true;

    }


    // Detiene el proceso si existen errores.
    if (errores) return;


    // ==========================
    // BUSCAR USUARIOS DEL SISTEMA
    // ==========================

    /**
     * Busca inicialmente el usuario
     * entre las credenciales internas.
     */
    let encontrado =
      this.usuarios.find(

        u =>
          u.usuario === usuario
          && u.clave === clave

      );


    // ==========================
    // BUSCAR CLIENTES EN MYSQL
    // ==========================

    /**
     * Si el usuario no fue encontrado localmente,
     * consulta los usuarios registrados en la base de datos.
     */
    if (!encontrado) {

      try {

        const usuariosBD =
          await API.obtenerUsuarios();


        /**
         * Busca el usuario en la base de datos.
         *
         * El nombre de usuario se obtiene de la parte
         * anterior al símbolo @ del correo electrónico.
         */
        encontrado =
          usuariosBD.find(u => {

            const usuarioBD =
              u.correo

                ? u.correo.split('@')[0]

                : '';


            return (

              usuarioBD.toLowerCase()
                === usuario.toLowerCase()

              && u.contrasena === clave

              && u.estado === true

            );

          });


      } catch (error) {

        console.error(error);


        this._mostrarMsg(

          msgEl,

          '❌ No fue posible conectar con el servidor',

          'error'

        );


        return;

      }

    }


    // ==========================
    // LOGIN CORRECTO
    // ==========================

    /**
     * Verifica si las credenciales
     * corresponden a un usuario válido.
     */
    if (encontrado) {


      /**
       * Guarda el usuario autenticado
       * en el estado global de la aplicación.
       */
      App.state.usuarioActual =
        encontrado;


      /**
       * Muestra el nombre del usuario
       * en la interfaz principal.
       */
      document
        .getElementById('header-usuario')
        .textContent =
        encontrado.nombre;


      const btn =
        document
          .getElementById('btn-login');


      btn.textContent =
        '✓ Ingresando...';


      btn.style.background =
        'var(--exito)';


      /**
       * Redirige al usuario según su rol.
       */
      setTimeout(() => {


        btn.textContent =
          'Ingresar';


        btn.style.background =
          '';


        /**
         * El cliente solo tiene acceso
         * al módulo de ventas.
         */
        if (encontrado.rol === 'Cliente') {


          document
            .getElementById('titulo-ventas')
            .textContent =
            'Mi Pedido';


          mostrar('ventas');


        } else if (encontrado.rol === 'Caja') {


          /**
           * El cajero accede directamente
           * al módulo de ventas, su única función.
           */
          document
            .getElementById('titulo-ventas')
            .textContent =
            'Nueva Venta';


          mostrar('ventas');


        } else {


          /**
           * Los usuarios administrativos y operativos
           * acceden al menú principal del sistema.
           *
           * El menú se filtra automáticamente
           * según los permisos del rol.
           */
          mostrar('menu');

          App.aplicarPermisosMenu();

        }


      }, 700);


    } else {


      /**
       * Marca visualmente los campos
       * cuando las credenciales son incorrectas.
       */
      const inputs =
        document
          .querySelectorAll('#login input');


      inputs.forEach(i => {


        i.classList.add('error');


        setTimeout(() => {

          i.classList.remove('error');

        }, 600);


      });


      this._mostrarMsg(

        msgEl,

        '❌ Usuario o contraseña incorrectos',

        'error'

      );

    }

  },


  /**
   * Cierra la sesión del usuario actual.
   *
   * Solicita confirmación y restablece
   * la información de la sesión.
   */
  cerrarSesion() {


    if (confirm('¿Deseas cerrar sesión?')) {


      /**
       * Elimina el usuario actual
       * del estado global.
       */
      App.state.usuarioActual =
        null;


      /**
       * Limpia los campos del formulario
       * de inicio de sesión.
       */
      document
        .getElementById('usuario')
        .value = '';


      document
        .getElementById('clave')
        .value = '';


      /**
       * Restablece el título del módulo de ventas.
       */
      document
        .getElementById('titulo-ventas')
        .textContent =
        'Nueva Venta';


      /**
       * Regresa a la pantalla de login.
       */
      mostrar('login');


      App.toast(
        'Sesión cerrada'
      );

    }

  },


  /**
   * Marca un campo del formulario
   * como inválido y muestra un mensaje.
   *
   * @param {string} campoId identificador del campo
   * @param {string} mensaje mensaje de validación
   */
  _marcarError(
    campoId,
    mensaje
  ) {


    const input =
      document
        .getElementById(campoId);


    const msgEl =
      document
        .getElementById(
          'msg-' + campoId
        );


    if (input) {

      input.classList.add('error');

    }


    if (msgEl) {


      msgEl.textContent =
        mensaje;


      msgEl.classList.add(
        'visible'
      );

    }

  },


  /**
   * Limpia los errores visuales
   * del formulario de login.
   */
  _limpiarErrores() {


    document

      .querySelectorAll(
        '#login input'
      )

      .forEach(

        i =>
          i.classList.remove(
            'error',
            'valido'
          )

      );


    document

      .querySelectorAll(
        '#login .msg-error'
      )

      .forEach(

        m =>
          m.classList.remove(
            'visible'
          )

      );


    const msgLogin =
      document
        .getElementById(
          'msg-login'
        );


    if (msgLogin) {

      msgLogin.classList.remove(
        'visible'
      );

    }

  },


  /**
   * Muestra un mensaje de validación
   * en la interfaz de login.
   *
   * @param {HTMLElement} el elemento HTML
   * @param {string} texto mensaje a mostrar
   * @param {string} tipo tipo de mensaje
   */
  _mostrarMsg(
    el,
    texto,
    tipo
  ) {


    if (!el) return;


    el.textContent =
      texto;


    el.className =

      tipo === 'error'

        ? 'msg-error visible'

        : 'msg-exito visible';

  }

};


// ===== REGISTRO DE CLIENTES =====

/**
 * Objeto encargado de gestionar
 * el registro de nuevos clientes.
 */
const Registro = {


  /**
   * Lista local de clientes registrados
   * durante la sesión actual.
   */
  clientes: [],


  /**
   * Registra un nuevo cliente en OttoPOS.
   *
   * Valida los datos ingresados y guarda el cliente
   * en la base de datos mediante la API.
   *
   * @returns {Promise<void>}
   */
  async registrar() {


    const nombre =
      document
        .getElementById('reg-nombre')
        .value
        .trim();


    const cedula =
      document
        .getElementById('reg-cedula')
        .value
        .trim();


    const correo =
      document
        .getElementById('reg-correo')
        .value
        .trim();


    const celular =
      document
        .getElementById('reg-celular')
        .value
        .trim();


    const usuario =
      document
        .getElementById('reg-usuario')
        .value
        .trim();


    const clave =
      document
        .getElementById('reg-clave')
        .value
        .trim();


    // Limpia los errores anteriores.
    this._limpiarErrores();


    let errores = false;


    /**
     * Valida el nombre del cliente.
     */
    if (!nombre) {


      this._marcarError(

        'reg-nombre',

        'msg-reg-nombre',

        'Ingresa tu nombre'

      );


      errores = true;

    }


    /**
     * Valida la cédula del cliente.
     */
    if (!cedula) {


      this._marcarError(

        'reg-cedula',

        'msg-reg-cedula',

        'Ingresa tu cédula'

      );


      errores = true;


    } else if (
      !/^\d{6,12}$/.test(cedula)
    ) {


      this._marcarError(

        'reg-cedula',

        'msg-reg-cedula',

        'Cédula inválida (solo números)'

      );


      errores = true;

    }


    /**
     * Valida el correo electrónico.
     */
    if (!correo) {


      this._marcarError(

        'reg-correo',

        'msg-reg-correo',

        'Ingresa tu correo'

      );


      errores = true;


    } else if (

      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/

        .test(correo)

    ) {


      this._marcarError(

        'reg-correo',

        'msg-reg-correo',

        'Correo inválido'

      );


      errores = true;

    }


    /**
     * Valida el número celular.
     */
    if (!celular) {


      this._marcarError(

        'reg-celular',

        'msg-reg-celular',

        'Ingresa tu celular'

      );


      errores = true;


    } else if (
      !/^\d{7,10}$/.test(celular)
    ) {


      this._marcarError(

        'reg-celular',

        'msg-reg-celular',

        'Número inválido (7-10 dígitos)'

      );


      errores = true;

    }


    /**
     * Valida el nombre de usuario.
     */
    if (!usuario) {


      this._marcarError(

        'reg-usuario',

        'msg-reg-usuario',

        'Elige un nombre de usuario'

      );


      errores = true;


    } else if (
      this._usuarioExiste(usuario)
    ) {


      this._marcarError(

        'reg-usuario',

        'msg-reg-usuario',

        'Ese usuario ya está en uso'

      );


      errores = true;

    }


    /**
     * Valida la contraseña.
     */
    if (!clave) {


      this._marcarError(

        'reg-clave',

        'msg-reg-clave',

        'Ingresa una contraseña'

      );


      errores = true;


    } else if (
      clave.length < 4
    ) {


      this._marcarError(

        'reg-clave',

        'msg-reg-clave',

        'Mínimo 4 caracteres'

      );


      errores = true;

    }


    // Detiene el registro si existen errores.
    if (errores) return;


    // ==========================
    // GUARDAR CLIENTE EN MYSQL
    // ==========================

    /**
     * Construye el objeto cliente
     * que será enviado a la API.
     */
    const cliente = {


      nombre: nombre,


      correo: correo,


      contrasena: clave,


      /**
       * Todo usuario registrado desde
       * este formulario obtiene el rol Cliente.
       */
      rol: 'Cliente',


      estado: true

    };


    try {


      /**
       * Guarda el cliente en la base de datos.
       */
      await API.guardarUsuario(
        cliente
      );


      /**
       * Conserva una copia local
       * del cliente registrado.
       */
      this.clientes.push({


        nombre,


        cedula,


        correo,


        celular,


        usuario,


        clave,


        rol: 'Cliente'

      });


    } catch (error) {


      console.error(error);


      App.toast(

        '❌ No fue posible registrar el cliente.'

      );


      return;

    }


    // ==========================
    // MOSTRAR ÉXITO
    // ==========================

    /**
     * Muestra el mensaje de registro exitoso.
     */
    const exito =
      document
        .getElementById(
          'msg-reg-exito'
        );


    exito.textContent =
      '✓ ¡Cuenta creada! Ya puedes ingresar con tu usuario.';


    exito.classList.add(
      'visible'
    );


    /**
     * Limpia los campos del formulario
     * después del registro exitoso.
     */
    [

      'reg-nombre',

      'reg-cedula',

      'reg-correo',

      'reg-celular',

      'reg-usuario',

      'reg-clave'

    ].forEach(id => {


      const el =
        document
          .getElementById(id);


      if (el) {


        el.value =
          '';


        el.classList.remove(
          'valido'
        );

      }

    });


    /**
     * Muestra un mensaje de bienvenida.
     */
    App.toast(
      `✓ Bienvenido ${nombre}!`
    );


    /**
     * Regresa al login después
     * de mostrar el mensaje de éxito.
     */
    setTimeout(() => {


      exito.classList.remove(
        'visible'
      );


      mostrar('login');


    }, 2000);

  },


  /**
   * Verifica si un nombre de usuario
   * ya se encuentra registrado.
   *
   * @param {string} usuario nombre de usuario
   * @returns {boolean} true si existe
   */
  _usuarioExiste(
    usuario
  ) {


    const enAdmin =
      Login.usuarios.find(

        u =>
          u.usuario === usuario

      );


    const enCliente =
      this.clientes.find(

        u =>
          u.usuario === usuario

      );


    return !!(
      enAdmin
      || enCliente
    );

  },


  /**
   * Marca un campo del formulario de registro
   * como inválido.
   *
   * @param {string} inputId identificador del campo
   * @param {string} msgId identificador del mensaje
   * @param {string} texto mensaje de error
   */
  _marcarError(

    inputId,

    msgId,

    texto

  ) {


    const input =
      document
        .getElementById(inputId);


    const msg =
      document
        .getElementById(msgId);


    if (input) {

      input.classList.add(
        'error'
      );

    }


    if (msg) {


      msg.textContent =
        texto;


      msg.classList.add(
        'visible'
      );

    }

  },


  /**
   * Limpia los errores visuales
   * del formulario de registro.
   */
  _limpiarErrores() {


    document

      .querySelectorAll(
        '#registro input'
      )

      .forEach(

        i =>
          i.classList.remove(
            'error',
            'valido'
          )

      );


    document

      .querySelectorAll(
        '#registro .msg-error'
      )

      .forEach(

        m =>
          m.classList.remove(
            'visible'
          )

      );


    const exito =
      document
        .getElementById(
          'msg-reg-exito'
        );


    if (exito) {


      exito.classList.remove(
        'visible'
      );

    }

  }

};


// ===== VALIDACIÓN EN TIEMPO REAL =====

/**
 * Configura las validaciones en tiempo real
 * de los formularios de login y registro.
 */
document.addEventListener(
  'DOMContentLoaded',
  () => {


    // ==========================
    // VALIDACIÓN LOGIN
    // ==========================

    /**
     * Valida los campos del login
     * mientras el usuario escribe.
     */
    [

      'usuario',

      'clave'

    ].forEach(id => {


      const input =
        document
          .getElementById(id);


      if (!input) return;


      /**
       * Valida el contenido del campo
       * cuando cambia su valor.
       */
      input.addEventListener(
        'input',
        () => {


          const msgEl =
            document
              .getElementById(
                'msg-' + id
              );


          if (
            input.value.trim()
          ) {


            input.classList.remove(
              'error'
            );


            input.classList.add(
              'valido'
            );


            if (msgEl) {


              msgEl.classList.remove(
                'visible'
              );

            }


          } else {


            input.classList.remove(
              'valido'
            );

          }

        }
      );


      /**
       * Permite iniciar sesión
       * presionando la tecla Enter.
       */
      input.addEventListener(
        'keydown',
        e => {


          if (
            e.key === 'Enter'
          ) {


            Login.ingresar();

          }

        }
      );

    });


    // ==========================
    // VALIDACIÓN REGISTRO
    // ==========================

    /**
     * Campos del formulario de registro
     * que serán validados en tiempo real.
     */
    [

      'reg-nombre',

      'reg-cedula',

      'reg-correo',

      'reg-celular',

      'reg-usuario',

      'reg-clave'

    ].forEach(id => {


      const input =
        document
          .getElementById(id);


      if (!input) return;


      /**
       * Actualiza visualmente el estado
       * del campo mientras el usuario escribe.
       */
      input.addEventListener(
        'input',
        () => {


          if (
            input.value.trim()
          ) {


            input.classList.remove(
              'error'
            );


            input.classList.add(
              'valido'
            );


          } else {


            input.classList.remove(
              'valido'
            );

          }

        }
      );

    });

  }
);
// ==================================================
// AUTENTICACIÓN CON GOOGLE
// ==================================================

/**
 * Procesa la respuesta de Google Sign-In.
 *
 * Recibe el ID token emitido por Google, lo envía
 * al backend para su validación y autentica al
 * usuario en OttoPOS.
 *
 * @param {Object} response respuesta de Google
 * @returns {Promise<void>}
 */
async function handleGoogleLogin(response) {

    const idToken =
        response && response.credential;

    if (!idToken) {

        App.toast(
            '❌ No se recibió el token de Google.'
        );

        return;

    }

    const msgEl =
        document
            .getElementById('msg-login');

    try {

        /**
         * Envía el token al backend
         * para validarlo y autenticar al usuario.
         */
        const usuario =
            await API.autenticarConGoogle(idToken);

        // ==========================
        // LOGIN CORRECTO
        // ==========================

        /**
         * Guarda el usuario autenticado
         * en el estado global de la aplicación.
         */
        App.state.usuarioActual =
            usuario;

        /**
         * Muestra el nombre del usuario
         * en la interfaz principal.
         */
        document
            .getElementById('header-usuario')
            .textContent =
            usuario.nombre;

        /**
         * El cliente de Google solo tiene acceso
         * al módulo de ventas.
         */
        document
            .getElementById('titulo-ventas')
            .textContent =
            'Mi Pedido';

        mostrar('ventas');

        App.toast(
            `✓ Bienvenido ${usuario.nombre}!`
        );

    } catch (error) {

        console.error(error);

        Login._mostrarMsg(
            msgEl,
            `❌ ${error.message}`,
            'error'
        );

    }

}
