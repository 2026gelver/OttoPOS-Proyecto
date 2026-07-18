package com.ottopos.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ottopos.model.Producto;

/**
 * Entidad que representa el detalle de una venta
 * realizada en el sistema OttoPOS.
 *
 * Esta clase almacena la cantidad, el precio y el subtotal
 * de un producto asociado a una venta.
 */
@Entity
@Table(name = "detalle_venta")
public class DetalleVenta {

    /**
     * Identificador único del detalle de venta.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Cantidad de unidades del producto vendidas.
     */
    private Integer cantidad;

    /**
     * Precio del producto al momento de realizar la venta.
     */
    private Double precio;

    /**
     * Valor total del detalle de venta.
     */
    private Double subtotal;

    /**
     * Venta a la que pertenece este detalle.
     *
     * Se ignora en la respuesta JSON para evitar
     * referencias circulares.
     */
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "venta_id")
    private Venta venta;

    /**
     * Producto asociado al detalle de la venta.
     */
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    /**
     * Obtiene el identificador del detalle.
     *
     * @return identificador del detalle
     */
    public Long getId() {

        return id;

    }

    /**
     * Obtiene la cantidad de productos vendidos.
     *
     * @return cantidad de productos
     */
    public Integer getCantidad() {

        return cantidad;

    }

    /**
     * Asigna la cantidad de productos vendidos.
     *
     * @param cantidad cantidad de productos
     */
    public void setCantidad(
            Integer cantidad) {

        this.cantidad = cantidad;

    }

    /**
     * Obtiene el precio del producto.
     *
     * @return precio del producto
     */
    public Double getPrecio() {

        return precio;

    }

    /**
     * Asigna el precio del producto.
     *
     * @param precio precio del producto
     */
    public void setPrecio(
            Double precio) {

        this.precio = precio;

    }

    /**
     * Obtiene el subtotal del detalle de venta.
     *
     * @return subtotal del detalle
     */
    public Double getSubtotal() {

        return subtotal;

    }

    /**
     * Asigna el subtotal del detalle de venta.
     *
     * @param subtotal subtotal del detalle
     */
    public void setSubtotal(
            Double subtotal) {

        this.subtotal = subtotal;

    }

    /**
     * Obtiene la venta asociada al detalle.
     *
     * @return venta asociada
     */
    public Venta getVenta() {

        return venta;

    }

    /**
     * Asigna la venta asociada al detalle.
     *
     * @param venta venta a la que pertenece el detalle
     */
    public void setVenta(
            Venta venta) {

        this.venta = venta;

    }

    /**
     * Obtiene el producto asociado al detalle.
     *
     * @return producto asociado
     */
    public Producto getProducto() {

        return producto;

    }

    /**
     * Asigna el producto asociado al detalle.
     *
     * @param producto producto asociado al detalle
     */
    public void setProducto(
            Producto producto) {

        this.producto = producto;

    }

}