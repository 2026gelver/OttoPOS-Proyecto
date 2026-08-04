package com.ottopos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

/**
 * Entidad que representa un usuario registrado
 * en el sistema OttoPOS.
 *
 * Esta clase permite almacenar y gestionar la información
 * de los usuarios, sus credenciales, roles y estado.
 */
@Entity
@Table(name = "usuario")
public class Usuario {

    /**
     * Identificador único del usuario.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre completo del usuario.
     */
    @Column(nullable = false)
    private String nombre;

    /**
     * Correo electrónico utilizado por el usuario.
     */
    @Column(nullable = false, unique = true)
    private String correo;

    /**
     * Contraseña de acceso del usuario.
     */
    @Column(nullable = false)
    private String contrasena;

    /**
     * Rol asignado al usuario dentro del sistema.
     */
    @Column(nullable = false)
    private String rol;

    /**
     * Indica si el usuario se encuentra activo.
     */
    @Column(nullable = false)
    private Boolean estado;

    /**
     * Constructor vacío requerido por JPA.
     */
    public Usuario() {
    }

    /**
     * Obtiene el identificador del usuario.
     *
     * @return identificador del usuario
     */
    public Long getId() {

        return id;

    }

    /**
     * Asigna el identificador del usuario.
     *
     * @param id identificador del usuario
     */
    public void setId(Long id) {

        this.id = id;

    }

    /**
     * Obtiene el nombre del usuario.
     *
     * @return nombre del usuario
     */
    public String getNombre() {

        return nombre;

    }

    /**
     * Asigna el nombre del usuario.
     *
     * @param nombre nombre del usuario
     */
    public void setNombre(String nombre) {

        this.nombre = nombre;

    }

    /**
     * Obtiene el correo electrónico del usuario.
     *
     * @return correo electrónico del usuario
     */
    public String getCorreo() {

        return correo;

    }

    /**
     * Asigna el correo electrónico del usuario.
     *
     * @param correo correo electrónico del usuario
     */
    public void setCorreo(String correo) {

        this.correo = correo;

    }

    /**
     * Obtiene la contraseña del usuario.
     *
     * @return contraseña del usuario
     */
    public String getContrasena() {

        return contrasena;

    }

    /**
     * Asigna la contraseña del usuario.
     *
     * @param contrasena contraseña del usuario
     */
    public void setContrasena(
            String contrasena) {

        this.contrasena = contrasena;

    }

    /**
     * Obtiene el rol asignado al usuario.
     *
     * @return rol del usuario
     */
    public String getRol() {

        return rol;

    }

    /**
     * Asigna el rol del usuario.
     *
     * @param rol rol asignado al usuario
     */
    public void setRol(String rol) {

        this.rol = rol;

    }

    /**
     * Obtiene el estado actual del usuario.
     *
     * @return estado del usuario
     */
    public Boolean getEstado() {

        return estado;

    }

    /**
     * Asigna el estado del usuario.
     *
     * @param estado estado del usuario
     */
    public void setEstado(Boolean estado) {

        this.estado = estado;

    }

}