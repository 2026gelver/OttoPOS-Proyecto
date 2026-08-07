package com.ottopos.dto;

/**
 * Objeto de transferencia de datos utilizado para enviar
 * la información de un producto desde el backend hacia
 * el frontend de OttoPOS.
 *
 * Esta clase permite controlar los datos de producto
 * que serán expuestos mediante la API REST.
 */
public class ProductoResponse {

    /**
     * Identificador único del producto.
     */
    private Long id;

    /**
     * Nombre del producto.
     */
    private String nombre;

    /**
     * Referencia del producto.
     */
    private String referencia;

    /**
     * Precio de venta del producto.
     */
    private Double precio;

    /**
     * Cantidad disponible del producto.
     */
    private Integer stock;

    /**
     * Categoría del producto.
     */
    private String categoria;

    /**
     * Estado actual del producto.
     */
    private Boolean estado;

    /**
     * URL de la imagen del producto.
     */
    private String imagenUrl;

    /**
     * Constructor vacío utilizado para crear
     * un objeto ProductoResponse sin datos iniciales.
     */
    public ProductoResponse() {
    }

    /**
     * Constructor utilizado para crear un producto
     * con todos sus datos iniciales.
     *
     * @param id identificador del producto
     * @param nombre nombre del producto
     * @param referencia referencia del producto
     * @param precio precio de venta del producto
     * @param stock cantidad disponible del producto
     * @param categoria categoría del producto
     * @param estado estado actual del producto
     */
    public ProductoResponse(
            Long id,
            String nombre,
            String referencia,
            Double precio,
            Integer stock,
            String categoria,
            Boolean estado,
            String imagenUrl) {

        this.id = id;
        this.nombre = nombre;
        this.referencia = referencia;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
        this.estado = estado;
        this.imagenUrl = imagenUrl;

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
     * Asigna el precio de venta del producto.
     *
     * @param precio precio del producto
     */
    public void setPrecio(Double precio) {

        this.precio = precio;

    }

    /**
     * Obtiene la cantidad disponible del producto.
     *
     * @return cantidad disponible del producto
     */
    public Integer getStock() {

        return stock;

    }

    /**
     * Asigna la cantidad disponible del producto.
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

    /**
     * Obtiene la URL de la imagen del producto.
     *
     * @return URL de la imagen del producto
     */
    public String getImagenUrl() {

        return imagenUrl;

    }

    /**
     * Asigna la URL de la imagen del producto.
     *
     * @param imagenUrl URL de la imagen del producto
     */
    public void setImagenUrl(String imagenUrl) {

        this.imagenUrl = imagenUrl;

    }

}
