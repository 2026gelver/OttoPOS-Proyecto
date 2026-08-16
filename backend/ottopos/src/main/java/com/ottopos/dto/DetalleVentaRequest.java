package com.ottopos.dto;

/**
 * Objeto de transferencia de datos utilizado para recibir
 * la información de un detalle de venta desde el frontend.
 *
 * Esta clase representa el producto, la cantidad solicitada,
 * las observaciones y la adición de queso dentro de una venta.
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
     * Observaciones del producto (con queso, tomate, cebolla, mantequilla).
     */
    private ObservacionesRequest observaciones;

    /**
     * Adición de queso seleccionada (0 = sin adición, 2 = x2, 3 = x3, 4 = x4).
     */
    private Integer adicionQueso;

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

    /**
     * Obtiene las observaciones del producto.
     *
     * @return observaciones del producto
     */
    public ObservacionesRequest getObservaciones() {

        return observaciones;

    }

    /**
     * Asigna las observaciones del producto.
     *
     * @param observaciones observaciones del producto
     */
    public void setObservaciones(
            ObservacionesRequest observaciones) {

        this.observaciones = observaciones;

    }

    /**
     * Obtiene la adición de queso seleccionada.
     *
     * @return adición de queso (0, 2, 3 o 4)
     */
    public Integer getAdicionQueso() {

        return adicionQueso;

    }

    /**
     * Asigna la adición de queso seleccionada.
     *
     * @param adicionQueso adición de queso (0, 2, 3 o 4)
     */
    public void setAdicionQueso(
            Integer adicionQueso) {

        this.adicionQueso = adicionQueso;

    }

}