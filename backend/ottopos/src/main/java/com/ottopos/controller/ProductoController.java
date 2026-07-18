package com.ottopos.controller;

import com.ottopos.dto.ProductoResponse;
import com.ottopos.model.Producto;
import com.ottopos.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST encargado de gestionar las solicitudes
 * relacionadas con los productos de OttoPOS.
 *
 * Esta clase expone los servicios web utilizados para consultar,
 * registrar, actualizar y eliminar productos.
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    /**
     * Servicio encargado de ejecutar la lógica de negocio
     * relacionada con los productos.
     */
    @Autowired
    private ProductoService productoService;

    /**
     * Obtiene todos los productos registrados en el sistema.
     *
     * @return lista de productos disponibles
     */
    @GetMapping
    public List<ProductoResponse> listarProductos() {

        return productoService.listarProductosResponse();

    }

    /**
     * Registra un nuevo producto en el sistema.
     *
     * @param producto información del producto que se desea guardar
     * @return producto guardado
     */
    @PostMapping
    public Producto guardarProducto(
            @RequestBody Producto producto) {

        return productoService.guardarProducto(producto);

    }

    /**
     * Busca un producto utilizando su identificador.
     *
     * @param id identificador del producto
     * @return producto encontrado
     */
    @GetMapping("/{id}")
    public Producto buscarPorId(
            @PathVariable Long id) {

        return productoService.buscarPorId(id);

    }

    /**
     * Actualiza la información de un producto existente.
     *
     * @param id identificador del producto que se actualizará
     * @param producto nuevos datos del producto
     * @return producto actualizado
     */
    @PutMapping("/{id}")
    public Producto actualizarProducto(
            @PathVariable Long id,
            @RequestBody Producto producto) {

        Producto existente =
                productoService.buscarPorId(id);

        if (existente == null) {

            return null;

        }

        existente.setNombre(
                producto.getNombre()
        );

        existente.setReferencia(
                producto.getReferencia()
        );

        existente.setPrecio(
                producto.getPrecio()
        );

        existente.setStock(
                producto.getStock()
        );

        existente.setCategoria(
                producto.getCategoria()
        );

        existente.setEstado(
                producto.getEstado()
        );

        return productoService.guardarProducto(
                existente
        );

    }

    /**
     * Elimina un producto del sistema utilizando su ID.
     *
     * @param id identificador del producto que se eliminará
     */
    @DeleteMapping("/{id}")
    public void eliminarProducto(
            @PathVariable Long id) {

        productoService.eliminarProducto(id);

    }

}