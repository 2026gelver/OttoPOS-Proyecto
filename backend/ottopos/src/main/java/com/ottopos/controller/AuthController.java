package com.ottopos.controller;

import com.ottopos.dto.GoogleLoginRequest;
import com.ottopos.model.Usuario;
import com.ottopos.service.GoogleAuthService;
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
 * sesión mediante proveedores externos como Google.
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