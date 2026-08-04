package com.ottopos.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.ottopos.model.Usuario;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.UUID;

/**
 * Servicio encargado de gestionar la autenticación
 * de usuarios mediante Google.
 *
 * Valida el ID token emitido por Google y registra
 * automáticamente al cliente en la base de datos
 * si aún no existe.
 */
@Service
public class GoogleAuthService {

    /**
     * Identificador de la aplicación de Google
     * utilizada para validar el token.
     */
    private static final String CLIENT_ID =
            "99632164511-pib4m0dovj4jn9a61du3jisgm1cte3oj.apps.googleusercontent.com";

    /**
     * Registro de eventos del servicio.
     */
    private static final Logger log =
            LoggerFactory.getLogger(GoogleAuthService.class);

    /**
     * Servicio encargado de gestionar los usuarios.
     */
    @Autowired
    private UsuarioService usuarioService;

    /**
     * Valida el ID token de Google y devuelve
     * el usuario autenticado.
     *
     * Si el correo del usuario no existe en la base
     * de datos, se registra automáticamente con el
     * rol Cliente.
     *
     * @param idToken ID token (JWT) emitido por Google
     * @return usuario autenticado
     * @throws IllegalArgumentException si el token es inválido
     */
    public Usuario autenticarConGoogle(String idToken) {

        if (idToken == null || idToken.isBlank()) {

            throw new IllegalArgumentException(
                    "El ID token de Google es obligatorio."
            );

        }

        GoogleIdToken token =
                verificarToken(idToken);

        if (token == null) {

            throw new IllegalArgumentException(
                    "El token de Google no es válido o ha expirado."
            );

        }

        GoogleIdToken.Payload payload =
                token.getPayload();

        String correo =
                payload.getEmail();

        String nombre =
                (String) payload.get("name");

        if (correo == null || correo.isBlank()) {

            throw new IllegalArgumentException(
                    "La cuenta de Google no tiene un correo asociado."
            );

        }

        if (nombre == null || nombre.isBlank()) {

            nombre = correo.split("@")[0];

        }

        // Busca el usuario por correo.
        Usuario usuario =
                usuarioService.buscarPorCorreo(correo);

        // Si no existe, lo registra como cliente.
        if (usuario == null) {

            usuario = new Usuario();

            usuario.setNombre(nombre);

            usuario.setCorreo(correo);

            // Contraseña aleatoria porque el campo es NOT NULL.
            usuario.setContrasena(
                    UUID.randomUUID().toString()
            );

            usuario.setRol("Cliente");

            usuario.setEstado(true);

            usuario =
                    usuarioService.guardarUsuario(usuario);

        }

        // Verifica que el usuario esté activo.
        if (!Boolean.TRUE.equals(usuario.getEstado())) {

            throw new IllegalArgumentException(
                    "El usuario se encuentra inactivo."
            );

        }

        return usuario;

    }

    /**
     * Verifica la firma, el emisor y la audiencia
     * del ID token de Google.
     *
     * @param idToken ID token (JWT) de Google
     * @return token verificado o null si es inválido
     */
    private GoogleIdToken verificarToken(String idToken) {

        try {

            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(
                            new NetHttpTransport(),
                            GsonFactory.getDefaultInstance()
                    )
                            .setAudience(
                                    Collections.singletonList(CLIENT_ID)
                            )
                            .build();

            GoogleIdToken token =
                    verifier.verify(idToken);

            if (token == null) {

                log.warn(
                        "El token de Google no pudo ser verificado."
                );

            }

            return token;

        } catch (GeneralSecurityException
                 | IOException e) {

            log.error(
                    "Error al verificar el token de Google: {}",
                    e.getMessage(),
                    e
            );

            return null;

        }

    }

}