package com.ottopos.dto;

/**
 * Objeto de transferencia de datos utilizado para recibir
 * las observaciones de un producto desde el frontend.
 *
 * Esta clase contiene las opciones de personalización
 * de una arepa: queso, tomate, cebolla y mantequilla.
 */
public class ObservacionesRequest {

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

}