package com.ottopos.controller;

import com.ottopos.dto.GoogleLoginRequest;
import com.ottopos.dto.LoginRequest;
import com.ottopos.model.Usuario;
import com.ottopos.service.GoogleAuthService;
import com.ottopos.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST encargado de gestionar
 * la autenticación de usuarios en OttoPOS.
 *
 * Expone los endpoints utilizados para iniciar
 * sesión mediante proveedores externos como Google
 * o con credenciales de clientes registrados.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * Servicio encargado de validar los tokens
     * de Google y registrar a los clientes.
     */
    @Autowired
    private GoogleAuthService googleAuthService;

    /**
     * Servicio encargado de validar las credenciales
     * de los clientes registrados en la base de datos.
     */
    @Autowired
    private UsuarioService usuarioService;

    /**
     * Autentica a un cliente registrado con
     * nombre de usuario (o correo) y contraseña.
     *
     * @param request credenciales del cliente
     * @return usuario autenticado o mensaje de error
     */
    @PostMapping("/login")
    public ResponseEntity<?> iniciarSesion(
            @RequestBody LoginRequest request) {

        Usuario usuario =
                usuarioService.autenticar(
                        request.getUsuario(),
                        request.getClave()
                );

        if (usuario == null) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "error",
                    "Usuario o contraseña incorrectos"
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error);

        }

        // La contraseña nunca se incluye en la respuesta JSON
        // (el campo es WRITE_ONLY en la entidad Usuario).
        return ResponseEntity.ok(usuario);

    }

    /**
     * Autentica a un usuario utilizando
     * el ID token de Google.
     *
     * @param request solicitud con el ID token de Google
     * @return usuario autenticado o mensaje de error
     */
    @PostMapping("/google")
    public ResponseEntity<?> autenticarConGoogle(
            @RequestBody GoogleLoginRequest request) {

        try {

            Usuario usuario =
                    googleAuthService.autenticarConGoogle(
                            request.getIdToken()
                    );

            return ResponseEntity.ok(usuario);

        } catch (IllegalArgumentException e) {

            Map<String, String> error =
                    new HashMap<>();

            error.put("error", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error);

        }

    }

}