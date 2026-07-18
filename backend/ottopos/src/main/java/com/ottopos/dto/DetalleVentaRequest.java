package com.ottopos.dto;

/**
 * Objeto de transferencia de datos utilizado para recibir
 * la información de un detalle de venta desde el frontend.
 *
 * Esta clase representa el producto y la cantidad solicitada
 * dentro de una venta.
 */
public class DetalleVentaRequest {

    /**
     * Identificador del producto solicitado.
     */
    private Long productoId;

    /**
     * Cantidad de unidades solicitadas del producto.
     */
    private Integer cantidad;

    /**
     * Obtiene el identificador del producto.
     *
     * @return identificador del producto
     */
    public Long getProductoId() {

        return productoId;

    }

    /**
     * Asigna el identificador del producto.
     *
     * @param productoId identificador del producto
     */
    public void setProductoId(
            Long productoId) {

        this.productoId = productoId;

    }

    /**
     * Obtiene la cantidad solicitada del producto.
     *
     * @return cantidad de unidades solicitadas
     */
    public Integer getCantidad() {

        return cantidad;

    }

    /**
     * Asigna la cantidad solicitada del producto.
     *
     * @param cantidad cantidad de unidades solicitadas
     */
    public void setCantidad(
            Integer cantidad) {

        this.cantidad = cantidad;

    }

}