package com.ottopos.service;

import com.ottopos.model.Usuario;
import com.ottopos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio encargado de gestionar la lógica de negocio
 * relacionada con los usuarios de OttoPOS.
 *
 * Esta clase centraliza las operaciones de consulta,
 * registro, búsqueda y eliminación de usuarios.
 */
@Service
public class UsuarioService {

    /**
     * Repositorio utilizado para acceder a los usuarios
     * almacenados en la base de datos.
     */
    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Obtiene todos los usuarios registrados en el sistema.
     *
     * @return lista de usuarios registrados
     */
    public List<Usuario> listarUsuarios() {

        return usuarioRepository.findAll();

    }

    /**
     * Guarda un usuario en la base de datos.
     *
     * @param usuario usuario que se desea guardar
     * @return usuario guardado
     */
    public Usuario guardarUsuario(
            Usuario usuario) {

        return usuarioRepository.save(usuario);

    }

    /**
     * Busca un usuario utilizando su identificador.
     *
     * @param id identificador del usuario
     * @return usuario encontrado o null si no existe
     */
    public Usuario buscarPorId(Long id) {

        return usuarioRepository.findById(id)
                .orElse(null);

    }

    /**
     * Busca un usuario utilizando su correo electrónico.
     *
     * @param correo correo electrónico del usuario
     * @return usuario encontrado o null si no existe
     */
    public Usuario buscarPorCorreo(String correo) {

        Optional<Usuario> usuario =
                usuarioRepository.findByCorreo(correo);

        return usuario.orElse(null);

    }

    /**
     * Valida las credenciales (usuario y contraseña) de un
     * cliente registrado en la base de datos.
     *
     * El nombre de usuario corresponde a la parte anterior al
     * símbolo @ del correo electrónico, aunque también se acepta
     * el correo completo.
     *
     * @param usuario nombre de usuario o correo del cliente
     * @param clave   contraseña ingresada
     * @return usuario autenticado o null si las credenciales
     *         no son válidas o el usuario está inactivo
     */
    public Usuario autenticar(
            String usuario,
            String clave) {

        if (usuario == null || clave == null) {

            return null;

        }

        String usuarioIngresado =
                usuario.trim();

        return usuarioRepository.findAll().stream()
                .filter(u -> {

                    String nombreUsuario =
                            u.getCorreo() != null
                                    ? u.getCorreo().split("@")[0]
                                    : "";

                    boolean mismoUsuario =
                            (u.getCorreo() != null
                                    && u.getCorreo().equalsIgnoreCase(
                                            usuarioIngresado))
                                    || nombreUsuario.equalsIgnoreCase(
                                            usuarioIngresado);

                    return mismoUsuario
                            && clave.equals(u.getContrasena())
                            && Boolean.TRUE.equals(u.getEstado());

                })
                .findFirst()
                .orElse(null);

    }

    /**
     * Elimina un usuario de la base de datos.
     *
     * @param id identificador del usuario que se eliminará
     */
    public void eliminarUsuario(Long id) {

        usuarioRepository.deleteById(id);

    }

}