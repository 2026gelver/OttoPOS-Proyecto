package com.ottopos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ottopos.model.Producto;
import com.ottopos.repository.ProductoRepository;
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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Pruebas de integración del módulo de Inventario (GA9 Plan de Pruebas).
 * Cubre CP-022 (crear), CP-023 (editar), CP-024 (eliminar) y
 * la validación de referencia única. Usa H2 en memoria.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductoControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductoRepository productoRepository;

    @BeforeEach
    void limpiarDatos() {
        productoRepository.deleteAll();
    }

    @Test
    @DisplayName("CP-022 — Crear producto en el inventario")
    void crearProducto() throws Exception {

        Map<String, Object> body = Map.of(
                "nombre", "Arepa Especial TEST",
                "referencia", "AR-ESP-001",
                "precio", 8000.0,
                "stock", 15,
                "categoria", "Arepas",
                "estado", true
        );

        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Arepa Especial TEST"))
                .andExpect(jsonPath("$.referencia").value("AR-ESP-001"))
                .andExpect(jsonPath("$.precio").value(8000.0))
                .andExpect(jsonPath("$.stock").value(15));

        assertThat(productoRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("CP-022 — Referencia duplicada es rechazada")
    void crearProductoConReferenciaDuplicadaEsRechazado() {

        Producto existente = new Producto();
        existente.setNombre("Arepa Queso");
        existente.setReferencia("AR-DUP-001");
        existente.setPrecio(5000.0);
        existente.setStock(10);
        existente.setCategoria("Arepas");
        existente.setEstado(true);
        productoRepository.save(existente);

        Producto duplicado = new Producto();
        duplicado.setNombre("Arepa Duplicada");
        duplicado.setReferencia("AR-DUP-001");
        duplicado.setPrecio(6000.0);
        duplicado.setStock(5);
        duplicado.setCategoria("Arepas");
        duplicado.setEstado(true);

        // La columna referencia es única → la BD rechaza el duplicado.
        assertThatThrownBy(() -> productoRepository.save(duplicado))
                .isInstanceOf(Exception.class);

        assertThat(productoRepository.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("CP-023 — Editar producto existente")
    void editarProducto() throws Exception {

        Producto existente = new Producto();
        existente.setNombre("Arepa Básica TEST");
        existente.setReferencia("AR-BAS-001");
        existente.setPrecio(8000.0);
        existente.setStock(15);
        existente.setCategoria("Arepas");
        existente.setEstado(true);
        existente = productoRepository.save(existente);

        Map<String, Object> body = Map.of(
                "nombre", "Arepa Básica TEST",
                "referencia", "AR-BAS-001",
                "precio", 8500.0,
                "stock", 12,
                "categoria", "Arepas",
                "estado", true,
                "imagenUrl", "https://ejemplo.com/arepa.png"
        );

        mockMvc.perform(put("/api/productos/{id}", existente.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.precio").value(8500.0))
                .andExpect(jsonPath("$.stock").value(12));

        Producto actualizado =
                productoRepository.findById(existente.getId()).orElseThrow();

        assertThat(actualizado.getPrecio()).isEqualTo(8500.0);
        assertThat(actualizado.getStock()).isEqualTo(12);
        assertThat(actualizado.getImagenUrl())
                .isEqualTo("https://ejemplo.com/arepa.png");
    }

    @Test
    @DisplayName("CP-024 — Eliminar producto existente")
    void eliminarProducto() throws Exception {

        Producto existente = new Producto();
        existente.setNombre("Producto Descartable TEST");
        existente.setReferencia("AR-ELI-001");
        existente.setPrecio(2000.0);
        existente.setStock(3);
        existente.setCategoria("Otros");
        existente.setEstado(true);
        existente = productoRepository.save(existente);

        mockMvc.perform(delete("/api/productos/{id}", existente.getId()))
                .andExpect(status().isOk());

        assertThat(productoRepository.count()).isZero();
    }

    @Test
    @DisplayName("Smoke — Listar productos del catálogo")
    void listarProductos() throws Exception {

        Producto existente = new Producto();
        existente.setNombre("Arepa Mixta TEST");
        existente.setReferencia("AR-MIX-001");
        existente.setPrecio(9000.0);
        existente.setStock(20);
        existente.setCategoria("Arepas");
        existente.setEstado(true);
        productoRepository.save(existente);

        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Arepa Mixta TEST"));
    }

}