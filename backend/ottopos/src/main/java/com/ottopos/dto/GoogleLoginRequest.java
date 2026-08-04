package com.ottopos.dto;

/**
 * DTO utilizado para recibir la solicitud
 * de autenticación con Google.
 *
 * Contiene el ID token (JWT) que Google
 * entrega al frontend después de que el
 * usuario inicia sesión con su cuenta.
 */
public class GoogleLoginRequest {

    /**
     * ID token (JWT) emitido por Google.
     */
    private String idToken;

    /**
     * Constructor vacío requerido por Jackson.
     */
    public GoogleLoginRequest() {
    }

    /**
     * Obtiene el ID token de Google.
     *
     * @return ID token de Google
     */
    public String getIdToken() {

        return idToken;

    }

    /**
     * Asigna el ID token de Google.
     *
     * @param idToken ID token de Google
     */
    public void setIdToken(String idToken) {

        this.idToken = idToken;

    }

}