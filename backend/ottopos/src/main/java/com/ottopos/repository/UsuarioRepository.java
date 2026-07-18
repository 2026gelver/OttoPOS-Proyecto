package com.ottopos.repository;

import com.ottopos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio encargado de gestionar el acceso a los datos
 * de los usuarios en la base de datos.
 *
 * Extiende JpaRepository para utilizar las operaciones CRUD
 * proporcionadas por Spring Data JPA.
 */
@Repository
public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

}