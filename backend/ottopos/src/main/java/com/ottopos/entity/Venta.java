package com.ottopos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad que representa una venta registrada
 * en el sistema OttoPOS.
 *
 * Esta clase almacena la información general de la venta
 * y su relación con los detalles de los productos vendidos.
 */
@Entity
@Table(name = "venta")
public class Venta {

    /**
     * Identificador único de la venta.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Fecha y hora en la que se realizó la venta.
     */
    private LocalDateTime fecha;

    /**
     * Valor total de la venta.
     */
    private Double total;

    /**
     * Método de pago utilizado para realizar la venta.
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
    @Column(name = "tipo_pedido")
    private String tipoPedido;

    /**
     * Número de mesa si el pedido es de mesa.
     */
    @Column(name = "numero_mesa")
    private String numeroMesa;

    /**
     * Estado del pedido: "en_proceso", "entregado" o "cancelado".
     */
    @Column(name = "estado")
    private String estado;

    /**
     * Lista de detalles asociados a la venta.
     */
    @OneToMany(mappedBy = "venta")
    private List<DetalleVenta> detalles;

    /**
     * Obtiene el identificador de la venta.
     *
     * @return identificador de la venta
     */
    public Long getId() {

        return id;

    }

    /**
     * Obtiene la fecha y hora de la venta.
     *
     * @return fecha y hora de la venta
     */
    public LocalDateTime getFecha() {

        return fecha;

    }

    /**
     * Asigna la fecha y hora de la venta.
     *
     * @param fecha fecha y hora de la venta
     */
    public void setFecha(
            LocalDateTime fecha) {

        this.fecha = fecha;

    }

    /**
     * Obtiene el total de la venta.
     *
     * @return valor total de la venta
     */
    public Double getTotal() {

        return total;

    }

    /**
     * Asigna el valor total de la venta.
     *
     * @param total valor total de la venta
     */
    public void setTotal(
            Double total) {

        this.total = total;

    }

    /**
     * Obtiene el método de pago utilizado.
     *
     * @return método de pago de la venta
     */
    public String getMetodoPago() {

        return metodoPago;

    }

    /**
     * Asigna el método de pago utilizado.
     *
     * @param metodoPago método de pago de la venta
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
     * Obtiene el estado del pedido.
     *
     * @return estado del pedido ("en_proceso", "entregado" o "cancelado")
     */
    public String getEstado() {

        return estado;

    }

    /**
     * Asigna el estado del pedido.
     *
     * @param estado estado del pedido
     */
    public void setEstado(
            String estado) {

        this.estado = estado;

    }

    /**
     * Obtiene los detalles asociados a la venta.
     *
     * @return lista de detalles de la venta
     */
    public List<DetalleVenta> getDetalles() {

        return detalles;

    }

    /**
     * Asigna los detalles asociados a la venta.
     *
     * @param detalles lista de detalles de la venta
     */
    public void setDetalles(
            List<DetalleVenta> detalles) {

        this.detalles = detalles;

    }

}