package com.ottopos.dto;

/**
 * Objeto de transferencia de datos utilizado para recibir
 * las credenciales de inicio de sesión de un cliente.
 */
public class LoginRequest {

    /**
     * Nombre de usuario (parte anterior al @ del correo)
     * o correo electrónico del cliente.
     */
    private String usuario;

    /**
     * Contraseña ingresada por el cliente.
     */
    private String clave;

    /**
     * Constructor vacío requerido por Jackson.
     */
    public LoginRequest() {
    }

    /**
     * Obtiene el usuario o correo del cliente.
     *
     * @return usuario o correo
     */
    public String getUsuario() {

        return usuario;

    }

    /**
     * Asigna el usuario o correo del cliente.
     *
     * @param usuario usuario o correo
     */
    public void setUsuario(String usuario) {

        this.usuario = usuario;

    }

    /**
     * Obtiene la contraseña del cliente.
     *
     * @return contraseña del cliente
     */
    public String getClave() {

        return clave;

    }

    /**
     * Asigna la contraseña del cliente.
     *
     * @param clave contraseña del cliente
     */
    public void setClave(String clave) {

        this.clave = clave;

    }

}