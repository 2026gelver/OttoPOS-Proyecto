package com.ottopos.model;

import jakarta.persistence.*;

/**
 * Representa un producto registrado en el sistema OttoPOS.
 *
 * Esta entidad se encuentra relacionada con la tabla producto
 * de la base de datos y permite gestionar la información
 * del inventario.
 */
@Entity
@Table(name = "producto")
public class Producto {

    /**
     * Identificador único del producto.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre del producto.
     */
    @Column(nullable = false)
    private String nombre;

    /**
     * Referencia única del producto.
     */
    @Column(nullable = false, unique = true)
    private String referencia;

    /**
     * Precio de venta del producto.
     */
    @Column(nullable = false)
    private Double precio;

    /**
     * Cantidad disponible del producto en el inventario.
     */
    @Column(nullable = false)
    private Integer stock;

    /**
     * Categoría a la que pertenece el producto.
     */
    @Column(nullable = false)
    private String categoria;

    /**
     * Indica si el producto se encuentra activo en el sistema.
     */
    @Column(nullable = false)
    private Boolean estado;

    /**
     * Constructor vacío requerido por JPA.
     */
    public Producto() {
    }

    /**
     * Obtiene el identificador del producto.
     *
     * @return identificador del producto
     */
    public Long getId() {
        return id;
    }

    /**
     * Asigna el identificador del producto.
     *
     * @param id identificador del producto
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Obtiene el nombre del producto.
     *
     * @return nombre del producto
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Asigna el nombre del producto.
     *
     * @param nombre nombre del producto
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Obtiene la referencia del producto.
     *
     * @return referencia del producto
     */
    public String getReferencia() {
        return referencia;
    }

    /**
     * Asigna la referencia del producto.
     *
     * @param referencia referencia del producto
     */
    public void setReferencia(String referencia) {
        this.referencia = referencia;
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
    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    /**
     * Obtiene la cantidad disponible en inventario.
     *
     * @return cantidad disponible del producto
     */
    public Integer getStock() {
        return stock;
    }

    /**
     * Asigna la cantidad disponible en inventario.
     *
     * @param stock cantidad disponible del producto
     */
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    /**
     * Obtiene la categoría del producto.
     *
     * @return categoría del producto
     */
    public String getCategoria() {
        return categoria;
    }

    /**
     * Asigna la categoría del producto.
     *
     * @param categoria categoría del producto
     */
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    /**
     * Obtiene el estado del producto.
     *
     * @return estado del producto
     */
    public Boolean getEstado() {
        return estado;
    }

    /**
     * Asigna el estado del producto.
     *
     * @param estado estado del producto
     */
    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

}