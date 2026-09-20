package com.ottopos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Pruebas de integración del módulo de Autenticación con Google
 * (GA9 Plan de Pruebas — CP-006).
 *
 * Verifica que un token de Google vacío/obligatorio sea rechazado
 * con HTTP 401 y mensaje de error, sin realizar llamadas de red.
 * Usa H2 en memoria (perfil "test").
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("CP-006 — Token de Google inválido es rechazado con 401")
    void tokenGoogleVacioDevuelve401() throws Exception {

        Map<String, Object> body = Map.of("idToken", "");

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error")
                        .value("El ID token de Google es obligatorio."));
    }

    @Test
    @DisplayName("CP-006 — Cuerpo sin token de Google es rechazado con 401")
    void sinTokenGoogleDevuelve401() throws Exception {

        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("idToken", null);

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error")
                        .value("El ID token de Google es obligatorio."));
    }

}