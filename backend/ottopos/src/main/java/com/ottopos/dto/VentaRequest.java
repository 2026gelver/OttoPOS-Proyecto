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
     * Nombre del usuario que realizó la venta.
     */
    private String usuarioNombre;

    /**
     * Rol del usuario que realizó la venta.
     */
    private String usuarioRol;

    /**
     * Tipo de pedido: "mesa" o "llevar".
     */
    private String tipoPedido;

    /**
     * Número de mesa si el pedido es de mesa.
     */
    private String numeroMesa;

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
     * Obtiene el nombre del usuario que realizó la venta.
     *
     * @return nombre del usuario vendedor
     */
    public String getUsuarioNombre() {

        return usuarioNombre;

    }

    /**
     * Asigna el nombre del usuario que realizó la venta.
     *
     * @param usuarioNombre nombre del usuario vendedor
     */
    public void setUsuarioNombre(
            String usuarioNombre) {

        this.usuarioNombre = usuarioNombre;

    }

    /**
     * Obtiene el rol del usuario que realizó la venta.
     *
     * @return rol del usuario vendedor
     */
    public String getUsuarioRol() {

        return usuarioRol;

    }

    /**
     * Asigna el rol del usuario que realizó la venta.
     *
     * @param usuarioRol rol del usuario vendedor
     */
    public void setUsuarioRol(
            String usuarioRol) {

        this.usuarioRol = usuarioRol;

    }

    /**
     * Obtiene el tipo de pedido de la venta.
     *
     * @return tipo de pedido ("mesa" o "llevar")
     */
    public String getTipoPedido() {

        return tipoPedido;

    }

    /**
     * Asigna el tipo de pedido de la venta.
     *
     * @param tipoPedido tipo de pedido ("mesa" o "llevar")
     */
    public void setTipoPedido(
            String tipoPedido) {

        this.tipoPedido = tipoPedido;

    }

    /**
     * Obtiene el número de mesa de la venta.
     *
     * @return número de mesa o null si es para llevar
     */
    public String getNumeroMesa() {

        return numeroMesa;

    }

    /**
     * Asigna el número de mesa de la venta.
     *
     * @param numeroMesa número de mesa o null si es para llevar
     */
    public void setNumeroMesa(
            String numeroMesa) {

        this.numeroMesa = numeroMesa;

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