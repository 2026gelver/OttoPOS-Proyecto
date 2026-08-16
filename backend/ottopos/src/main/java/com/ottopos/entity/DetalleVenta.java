package com.ottopos.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ottopos.model.Producto;

/**
 * Entidad que representa el detalle de una venta
 * realizada en el sistema OttoPOS.
 *
 * Esta clase almacena la cantidad, el precio, el subtotal,
 * las observaciones y la adición de queso de un producto
 * asociado a una venta.
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
     * Indica si el producto lleva queso.
     */
    private Boolean conQueso;

    /**
     * Indica si el producto lleva tomate.
     */
    private Boolean conTomate;

    /**
     * Indica si el producto lleva cebolla.
     */
    private Boolean conCebolla;

    /**
     * Indica si el producto lleva mantequilla.
     */
    private Boolean conMantequilla;

    /**
     * Adición de queso seleccionada (0 = sin adición, 2 = x2, 3 = x3, 4 = x4).
     */
    private Integer adicionQueso;

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
     * Obtiene si el producto lleva queso.
     *
     * @return true si lleva queso, false si no
     */
    public Boolean getConQueso() {

        return conQueso;

    }

    /**
     * Asigna si el producto lleva queso.
     *
     * @param conQueso true si lleva queso, false si no
     */
    public void setConQueso(
            Boolean conQueso) {

        this.conQueso = conQueso;

    }

    /**
     * Obtiene si el producto lleva tomate.
     *
     * @return true si lleva tomate, false si no
     */
    public Boolean getConTomate() {

        return conTomate;

    }

    /**
     * Asigna si el producto lleva tomate.
     *
     * @param conTomate true si lleva tomate, false si no
     */
    public void setConTomate(
            Boolean conTomate) {

        this.conTomate = conTomate;

    }

    /**
     * Obtiene si el producto lleva cebolla.
     *
     * @return true si lleva cebolla, false si no
     */
    public Boolean getConCebolla() {

        return conCebolla;

    }

    /**
     * Asigna si el producto lleva cebolla.
     *
     * @param conCebolla true si lleva cebolla, false si no
     */
    public void setConCebolla(
            Boolean conCebolla) {

        this.conCebolla = conCebolla;

    }

    /**
     * Obtiene si el producto lleva mantequilla.
     *
     * @return true si lleva mantequilla, false si no
     */
    public Boolean getConMantequilla() {

        return conMantequilla;

    }

    /**
     * Asigna si el producto lleva mantequilla.
     *
     * @param conMantequilla true si lleva mantequilla, false si no
     */
    public void setConMantequilla(
            Boolean conMantequilla) {

        this.conMantequilla = conMantequilla;

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