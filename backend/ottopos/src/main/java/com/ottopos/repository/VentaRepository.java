package com.ottopos.repository;

import com.ottopos.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio encargado de gestionar el acceso a los datos
 * de las ventas en la base de datos.
 *
 * Extiende JpaRepository para utilizar las operaciones CRUD
 * proporcionadas por Spring Data JPA.
 */
@Repository
public interface VentaRepository
        extends JpaRepository<Venta, Long> {

    /**
     * Busca una venta cargando también sus detalles
     * y los productos asociados a cada detalle.
     *
     * Se utiliza JOIN FETCH para evitar problemas de
     * carga perezosa (LazyInitializationException) al
     * acceder a los detalles fuera del contexto de JPA.
     *
     * @param id identificador de la venta
     * @return venta con sus detalles y productos cargados
     */
    @Query(
            "SELECT v FROM Venta v "
                    + "LEFT JOIN FETCH v.detalles d "
                    + "LEFT JOIN FETCH d.producto "
                    + "WHERE v.id = :id"
    )
    Optional<Venta> findByIdWithDetalles(
            @Param("id") Long id
    );

}
