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