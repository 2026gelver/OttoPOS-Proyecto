package com.ottopos.repository;

import com.ottopos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio encargado de gestionar el acceso a los datos
 * de los productos en la base de datos.
 *
 * Extiende JpaRepository para utilizar las operaciones CRUD
 * proporcionadas por Spring Data JPA.
 */
@Repository
public interface ProductoRepository
        extends JpaRepository<Producto, Long> {

}