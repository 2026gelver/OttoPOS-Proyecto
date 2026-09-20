package com.ottopos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ottopos.model.Usuario;
import com.ottopos.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Pruebas de integración del módulo de Usuarios (GA9 Plan de Pruebas).
 * Cubre CP-026 (crear), CP-027 (editar), CP-028 (eliminar) y
 * CP-008 (registro de cliente con rol Cliente). Usa H2 en memoria.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UsuarioControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @BeforeEach
    void limpiarDatos() {
        usuarioRepository.deleteAll();
    }

    @Test
    @DisplayName("CP-026 — Crear usuario con rol y estado")
    void crearUsuario() throws Exception {

        Map<String, Object> body = Map.of(
                "nombre", "Carlos Pérez TEST",
                "correo", "carlos@correo.com",
                "contrasena", "1234",
                "rol", "Operador",
                "estado", true
        );

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Carlos Pérez TEST"))
                .andExpect(jsonPath("$.rol").value("Operador"))
                .andExpect(jsonPath("$.estado").value(true));

        assertThat(usuarioRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("CP-008 — Registro de cliente con rol Cliente")
    void crearClienteConRolCliente() throws Exception {

        Map<String, Object> body = Map.of(
                "nombre", "María García TEST",
                "correo", "maria@correo.com",
                "contrasena", "clave123",
                "rol", "Cliente",
                "estado", true
        );

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rol").value("Cliente"))
                .andExpect(jsonPath("$.estado").value(true));
    }

    @Test
    @DisplayName("CP-027 — Editar usuario (cambio de rol y estado)")
    void editarUsuario() throws Exception {

        Usuario existente = new Usuario();
        existente.setNombre("Usuario Original TEST");
        existente.setCorreo("original@correo.com");
        existente.setContrasena("0000");
        existente.setRol("Operador");
        existente.setEstado(true);
        existente = usuarioRepository.save(existente);

        Map<String, Object> body = Map.of(
                "nombre", "Usuario Original TEST",
                "correo", "original@correo.com",
                "contrasena", "0000",
                "rol", "Caja",
                "estado", false
        );

        mockMvc.perform(put("/api/usuarios/{id}", existente.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rol").value("Caja"))
                .andExpect(jsonPath("$.estado").value(false));

        Usuario actualizado =
                usuarioRepository.findById(existente.getId()).orElseThrow();

        assertThat(actualizado.getRol()).isEqualTo("Caja");
        assertThat(actualizado.getEstado()).isFalse();
    }

    @Test
    @DisplayName("CP-028 — Eliminar usuario existente")
    void eliminarUsuario() throws Exception {

        Usuario existente = new Usuario();
        existente.setNombre("Usuario a Eliminar TEST");
        existente.setCorreo("eliminar@correo.com");
        existente.setContrasena("1234");
        existente.setRol("Operador");
        existente.setEstado(true);
        existente = usuarioRepository.save(existente);

        mockMvc.perform(delete("/api/usuarios/{id}", existente.getId()))
                .andExpect(status().isOk());

        assertThat(usuarioRepository.count()).isZero();
    }

    @Test
    @DisplayName("Smoke — Listar usuarios y verificar estado (regla 8)")
    void listarUsuariosPermiteVerificarEstado() throws Exception {

        Usuario activo = new Usuario();
        activo.setNombre("Activo TEST");
        activo.setCorreo("activo@correo.com");
        activo.setContrasena("1234");
        activo.setRol("Operador");
        activo.setEstado(true);
        usuarioRepository.save(activo);

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].estado").value(true));
    }

}