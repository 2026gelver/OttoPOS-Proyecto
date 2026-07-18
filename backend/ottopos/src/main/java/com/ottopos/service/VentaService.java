package com.ottopos.service;

import com.ottopos.dto.DetalleVentaRequest;
import com.ottopos.dto.VentaRequest;
import com.ottopos.entity.DetalleVenta;
import com.ottopos.entity.Venta;
import com.ottopos.model.Producto;
import com.ottopos.repository.DetalleVentaRepository;
import com.ottopos.repository.ProductoRepository;
import com.ottopos.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio encargado de gestionar la lógica de negocio
 * relacionada con las ventas de OttoPOS.
 *
 * Esta clase coordina el registro de ventas, el cálculo
 * de totales, el almacenamiento de detalles y la actualización
 * del inventario.
 */
@Service
public class VentaService {

    /**
     * Repositorio utilizado para guardar y consultar
     * las ventas en la base de datos.
     */
    @Autowired
    private VentaRepository ventaRepository;

    /**
     * Repositorio utilizado para consultar y actualizar
     * los productos del inventario.
     */
    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Repositorio utilizado para guardar los detalles
     * asociados a cada venta.
     */
    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    /**
     * Obtiene todas las ventas registradas en el sistema.
     *
     * @return lista de ventas registradas
     */
    public List<Venta> listarVentas() {

        return ventaRepository.findAll();

    }

    /**
     * Registra una nueva venta en el sistema.
     *
     * Este método crea la venta, guarda sus detalles,
     * calcula el total, descuenta las cantidades vendidas
     * del inventario y actualiza la venta con el total final.
     *
     * @param request información de la venta y sus detalles
     * @return venta guardada con su identificador real
     */
    public Venta guardarVenta(
            VentaRequest request) {

        System.out.println(
                "========================================"
        );

        System.out.println(
                "Método de pago: "
                        + request.getMetodoPago()
        );

        System.out.println(
                "Detalles recibidos: "
                        + request.getDetalles()
        );

        System.out.println(
                "========================================"
        );

        Venta venta = new Venta();

        // Asigna la fecha y hora exacta de la venta.
        venta.setFecha(
                LocalDateTime.now()
        );

        // Asigna el método de pago seleccionado.
        venta.setMetodoPago(
                request.getMetodoPago()
        );

        // Inicializa el total de la venta.
        venta.setTotal(0.0);

        // Guarda inicialmente la venta para generar su ID.
        ventaRepository.save(venta);

        double totalVenta = 0.0;

        if (request.getDetalles() != null) {

            for (
                    DetalleVentaRequest detalleRequest
                    : request.getDetalles()
            ) {

                /*
                 * Busca el producto asociado al detalle
                 * de la venta.
                 */
                Producto producto =
                        buscarProducto(
                                detalleRequest.getProductoId()
                        );

                if (producto == null) {

                    throw new RuntimeException(
                            "Producto no encontrado. ID: "
                                    + detalleRequest.getProductoId()
                    );

                }

                /*
                 * Verifica que exista suficiente inventario
                 * para realizar la venta.
                 */
                if (
                        producto.getStock()
                                < detalleRequest.getCantidad()
                ) {

                    throw new RuntimeException(
                            "Stock insuficiente para el producto: "
                                    + producto.getNombre()
                    );

                }

                // Crea un nuevo detalle de venta.
                DetalleVenta detalle =
                        new DetalleVenta();

                // Relaciona el detalle con la venta.
                detalle.setVenta(venta);

                // Relaciona el detalle con el producto.
                detalle.setProducto(producto);

                // Asigna la cantidad vendida.
                detalle.setCantidad(
                        detalleRequest.getCantidad()
                );

                // Guarda el precio actual del producto.
                detalle.setPrecio(
                        producto.getPrecio()
                );

                // Calcula el subtotal del detalle.
                double subtotal =
                        producto.getPrecio()
                                * detalleRequest.getCantidad();

                detalle.setSubtotal(subtotal);

                System.out.println(
                        "Guardando detalle..."
                );

                System.out.println(
                        "Producto: "
                                + producto.getNombre()
                );

                System.out.println(
                        "Cantidad: "
                                + detalleRequest.getCantidad()
                );

                System.out.println(
                        "Precio: "
                                + producto.getPrecio()
                );

                System.out.println(
                        "Subtotal: "
                                + subtotal
                );

                // Guarda el detalle de la venta.
                detalleVentaRepository.save(detalle);

                System.out.println(
                        "Detalle guardado correctamente."
                );

                /*
                 * Descuenta del inventario la cantidad
                 * de productos vendidos.
                 */
                producto.setStock(
                        producto.getStock()
                                - detalleRequest.getCantidad()
                );

                // Actualiza el inventario en la base de datos.
                productoRepository.save(producto);

                // Acumula el subtotal en el total de la venta.
                totalVenta += subtotal;

            }

        }

        // Actualiza el total final de la venta.
        venta.setTotal(totalVenta);

        // Guarda la venta con su total definitivo.
        ventaRepository.save(venta);

        System.out.println(
                "========================================"
        );

        System.out.println(
                "Venta guardada correctamente."
        );

        System.out.println(
                "Total de la venta: "
                        + totalVenta
        );

        System.out.println(
                "========================================"
        );

        /*
         * Devuelve la venta con el ID real generado
         * por la base de datos MySQL.
         */
        return venta;

    }

    /**
     * Busca un producto utilizando su identificador.
     *
     * @param id identificador del producto
     * @return producto encontrado o null si no existe
     */
    private Producto buscarProducto(
            Long id) {

        Optional<Producto> producto =
                productoRepository.findById(id);

        return producto.orElse(null);

    }

}