package com.ottopos.service;

import com.ottopos.dto.ProductoResponse;
import com.ottopos.model.Producto;
import com.ottopos.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio encargado de gestionar la lógica de negocio
 * relacionada con los productos de OttoPOS.
 *
 * Esta clase comunica los controladores con el repositorio
 * de productos y centraliza las operaciones del inventario.
 */
@Service
public class ProductoService {

    /**
     * Repositorio utilizado para acceder a los productos
     * almacenados en la base de datos.
     */
    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Obtiene todos los productos registrados en el sistema.
     *
     * @return lista de productos registrados
     */
    public List<Producto> listarProductos() {

        return productoRepository.findAll();

    }

    /**
     * Obtiene todos los productos y los convierte
     * al formato de respuesta ProductoResponse.
     *
     * @return lista de productos en formato DTO
     */
    public List<ProductoResponse> listarProductosResponse() {

        return productoRepository.findAll()
                .stream()
                .map(producto -> new ProductoResponse(
                        producto.getId(),
                        producto.getNombre(),
                        producto.getReferencia(),
                        producto.getPrecio(),
                        producto.getStock(),
                        producto.getCategoria(),
                        producto.getEstado()
                ))
                .toList();

    }

    /**
     * Guarda un producto en la base de datos.
     *
     * @param producto producto que se desea guardar
     * @return producto guardado
     */
    public Producto guardarProducto(
            Producto producto) {

        return productoRepository.save(producto);

    }

    /**
     * Busca un producto utilizando su identificador.
     *
     * @param id identificador del producto
     * @return producto encontrado o null si no existe
     */
    public Producto buscarPorId(Long id) {

        return productoRepository.findById(id)
                .orElse(null);

    }

    /**
     * Elimina un producto de la base de datos.
     *
     * @param id identificador del producto que se eliminará
     */
    public void eliminarProducto(Long id) {

        productoRepository.deleteById(id);

    }

}