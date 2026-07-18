package com.ottopos.dto;

import java.util.List;

/**
 * Objeto de transferencia de datos utilizado para recibir
 * la información de una venta desde el frontend de OttoPOS.
 *
 * Esta clase contiene el método de pago y los detalles
 * de los productos incluidos en la venta.
 */
public class VentaRequest {

    /**
     * Método de pago seleccionado para la venta.
     */
    private String metodoPago;

    /**
     * Lista de detalles de productos incluidos en la venta.
     */
    private List<DetalleVentaRequest> detalles;

    /**
     * Obtiene el método de pago de la venta.
     *
     * @return método de pago seleccionado
     */
    public String getMetodoPago() {

        return metodoPago;

    }

    /**
     * Asigna el método de pago de la venta.
     *
     * @param metodoPago método de pago seleccionado
     */
    public void setMetodoPago(
            String metodoPago) {

        this.metodoPago = metodoPago;

    }

    /**
     * Obtiene los detalles de la venta.
     *
     * @return lista de detalles de la venta
     */
    public List<DetalleVentaRequest> getDetalles() {

        return detalles;

    }

    /**
     * Asigna los detalles de la venta.
     *
     * @param detalles lista de productos incluidos en la venta
     */
    public void setDetalles(
            List<DetalleVentaRequest> detalles) {

        this.detalles = detalles;

    }

}