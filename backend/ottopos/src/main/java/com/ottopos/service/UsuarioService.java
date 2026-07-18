package com.ottopos.service;

import com.ottopos.model.Usuario;
import com.ottopos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
     * Elimina un usuario de la base de datos.
     *
     * @param id identificador del usuario que se eliminará
     */
    public void eliminarUsuario(Long id) {

        usuarioRepository.deleteById(id);

    }

}