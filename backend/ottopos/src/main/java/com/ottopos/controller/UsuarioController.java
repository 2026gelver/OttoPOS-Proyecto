package com.ottopos.controller;

import com.ottopos.model.Usuario;
import com.ottopos.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST encargado de gestionar las solicitudes
 * relacionadas con los usuarios de OttoPOS.
 *
 * Esta clase expone los servicios web utilizados para
 * consultar, registrar, actualizar y eliminar usuarios.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    /**
     * Servicio encargado de ejecutar la lógica de negocio
     * relacionada con los usuarios.
     */
    @Autowired
    private UsuarioService usuarioService;

    /**
     * Obtiene todos los usuarios registrados en el sistema.
     *
     * @return lista de usuarios registrados
     */
    @GetMapping
    public List<Usuario> listarUsuarios() {

        return usuarioService.listarUsuarios();

    }

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param usuario información del usuario que se desea guardar
     * @return usuario guardado
     */
    @PostMapping
    public Usuario guardarUsuario(
            @RequestBody Usuario usuario) {

        return usuarioService.guardarUsuario(usuario);

    }

    /**
     * Busca un usuario utilizando su identificador.
     *
     * @param id identificador del usuario
     * @return usuario encontrado
     */
    @GetMapping("/{id}")
    public Usuario buscarPorId(
            @PathVariable Long id) {

        return usuarioService.buscarPorId(id);

    }

    /**
     * Actualiza la información de un usuario existente.
     *
     * @param id identificador del usuario que se actualizará
     * @param usuario nuevos datos del usuario
     * @return usuario actualizado
     */
    @PutMapping("/{id}")
    public Usuario actualizarUsuario(
            @PathVariable Long id,
            @RequestBody Usuario usuario) {

        Usuario existente =
                usuarioService.buscarPorId(id);

        if (existente == null) {

            return null;

        }

        existente.setNombre(
                usuario.getNombre()
        );

        existente.setCorreo(
                usuario.getCorreo()
        );

        existente.setContrasena(
                usuario.getContrasena()
        );

        existente.setRol(
                usuario.getRol()
        );

        existente.setEstado(
                usuario.getEstado()
        );

        return usuarioService.guardarUsuario(
                existente
        );

    }

    /**
     * Elimina un usuario del sistema utilizando su ID.
     *
     * @param id identificador del usuario que se eliminará
     */
    @DeleteMapping("/{id}")
    public void eliminarUsuario(
            @PathVariable Long id) {

        usuarioService.eliminarUsuario(id);

    }

}