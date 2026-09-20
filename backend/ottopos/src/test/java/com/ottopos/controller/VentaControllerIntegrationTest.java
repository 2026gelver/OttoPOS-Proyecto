package com.ottopos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ottopos.model.Producto;
import com.ottopos.repository.DetalleVentaRepository;
import com.ottopos.repository.ProductoRepository;
import com.ottopos.repository.VentaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Pruebas de integración del módulo de Ventas (GA9 Plan de Pruebas).
 * Cubre CP-011, CP-012, CP-013, CP-014, CP-016, CP-019, CP-020,
 * CP-021 y las reglas de negocio críticas, usando H2 en memoria.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class VentaControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    private Producto arepaQueso;

    private Producto cocaCola;

    @BeforeEach
    void limpiarYPrepararDatos() {

        // Orden correcto por integridad referencial:
        // detalle_venta → venta → producto.
        detalleVentaRepository.deleteAll();
        ventaRepository.deleteAll();
        productoRepository.deleteAll();

        arepaQueso = crearProducto(
                "Arepa Queso TEST",
                "TEST-AQ-001",
                7000.0,
                10,
                "Arepas",
                true
        );

        cocaCola = crearProducto(
                "Coca Cola TEST",
                "TEST-CC-001",
                3000.0,
                20,
                "Bebidas",
                true
        );
    }

    @Test
    @DisplayName("CP-011 — Venta 'para llevar' exitosa con cálculo correcto del total")
    void registrarVentaParaLlevarCalculaTotalCorrecto() throws Exception {

        Map<String, Object> body = cuerpoVenta(
                "llevar", null, "Efectivo", "Caja", "Caja",
                List.of(
                        detalle(arepaQueso.getId(), 2, null, 0),
                        detalle(cocaCola.getId(), 1, null, 0)
                )
        );

        mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(17000.0))
                .andExpect(jsonPath("$.estado").value("en_proceso"))
                .andExpect(jsonPath("$.tipoPedido").value("llevar"))
                .andExpect(jsonPath("$.metodoPago").value("Efectivo"));
    }

    @Test
    @DisplayName("CP-012 — Venta en mesa con número de mesa")
    void registrarVentaEnMesaConNumero() throws Exception {

        Map<String, Object> body = cuerpoVenta(
                "mesa", "3", "Tarjeta", "Operador", "Operador",
                List.of(detalle(arepaQueso.getId(), 1, null, 0))
        );

        mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tipoPedido").value("mesa"))
                .andExpect(jsonPath("$.numeroMesa").value("3"))
                .andExpect(jsonPath("$.total").value(7000.0));
    }

    @Test
    @DisplayName("CP-013 — Venta con observaciones y adición de queso (recargo aplicado)")
    void ventaConAdicionDeQuesoIncluyeRecargo() throws Exception {

        Map<String, Object> observaciones = new LinkedHashMap<>();
        observaciones.put("conQueso", true);
        observaciones.put("conTomate", true);
        observaciones.put("conCebolla", false);
        observaciones.put("conMantequilla", false);

        Map<String, Object> body = cuerpoVenta(
                "llevar", null, "Efectivo", "Admin", "Administrador",
                List.of(detalle(arepaQueso.getId(), 1, observaciones, 2))
        );

        // Arepa Queso $7.000 + adición queso x2 (+$2.000) = $9.000
        mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(9000.0));
    }

    @Test
    @DisplayName("CP-016 — Venta descuenta stock del inventario")
    void ventaDescuentaStock() throws Exception {

        Map<String, Object> body = cuerpoVenta(
                "llevar", null, "Efectivo", "Caja", "Caja",
                List.of(detalle(arepaQueso.getId(), 2, null, 0))
        );

        mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());

        Producto actualizado =
                productoRepository.findById(arepaQueso.getId()).orElseThrow();

        // Stock inicial 10 - 2 vendidas = 8
        assertThat(actualizado.getStock()).isEqualTo(8);
    }

    @Test
    @DisplayName("CP-005 — Venta con stock insuficiente se rechaza")
    void ventaConStockInsuficienteSeRechaza() throws Exception {

        Producto productoPoquito = crearProducto(
                "Arepa Corta TEST",
                "TEST-AC-001",
                5000.0,
                2,
                "Arepas",
                true
        );

        Map<String, Object> body = cuerpoVenta(
                "llevar", null, "Efectivo", "Caja", "Caja",
                List.of(detalle(productoPoquito.getId(), 5, null, 0))
        );

        // Stock 2 solicitando 5 → la venta se rechaza (el error se
        // propaga como RuntimeException en el entorno de pruebas).
        assertThatThrownBy(() -> mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))))
                .hasRootCauseInstanceOf(RuntimeException.class)
                .hasRootCauseMessage(
                        "Stock insuficiente para el producto: Arepa Corta TEST"
                );

        // El stock no se modifica.
        Producto actualizado =
                productoRepository.findById(productoPoquito.getId()).orElseThrow();

        assertThat(actualizado.getStock()).isEqualTo(2);
    }

    @Test
    @DisplayName("Regla 4 — Venta con producto inexistente se rechaza")
    void ventaConProductoInexistenteSeRechaza() throws Exception {

        Map<String, Object> body = cuerpoVenta(
                "llevar", null, "Efectivo", "Caja", "Caja",
                List.of(detalle(999999L, 1, null, 0))
        );

        // Producto inexistente → la venta se rechaza (RuntimeException).
        assertThatThrownBy(() -> mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))))
                .hasRootCauseInstanceOf(RuntimeException.class)
                .hasRootCauseMessage("Producto no encontrado. ID: 999999");
    }

    @Test
    @DisplayName("CP-019 — Marcar pedido como entregado")
    void marcarPedidoEntregado() throws Exception {

        Long idVenta = registrarVentaComo(arepaQueso, 1);

        mockMvc.perform(put("/api/ventas/{id}/estado", idVenta)
                        .param("estado", "entregado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("entregado"));
    }

    @Test
    @DisplayName("CP-020 — Cancelar pedido devuelve stock al inventario")
    void cancelarPedidoDevuelveStock() throws Exception {

        int stockInicial = arepaQueso.getStock(); // 10

        Long idVenta = registrarVentaComo(arepaQueso, 3);

        Producto despuesDeVenta =
                productoRepository.findById(arepaQueso.getId()).orElseThrow();

        assertThat(despuesDeVenta.getStock()).isEqualTo(stockInicial - 3);

        mockMvc.perform(put("/api/ventas/{id}/estado", idVenta)
                        .param("estado", "cancelado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("cancelado"));

        // El stock vuelve al valor anterior (10).
        Producto despuesDeCancelar =
                productoRepository.findById(arepaQueso.getId()).orElseThrow();

        assertThat(despuesDeCancelar.getStock()).isEqualTo(stockInicial);
    }

    @Test
    @DisplayName("Regla 7 — Reactivar pedido cancelado vuelve a descontar stock")
    void reactivarPedidoCanceladoDescuentaStockNuevamente() throws Exception {

        int stockInicial = arepaQueso.getStock(); // 10

        Long idVenta = registrarVentaComo(arepaQueso, 2);

        // Cancelar → devuelve stock (10)
        mockMvc.perform(put("/api/ventas/{id}/estado", idVenta)
                        .param("estado", "cancelado"))
                .andExpect(status().isOk());

        assertThat(productoRepository.findById(arepaQueso.getId())
                .orElseThrow().getStock()).isEqualTo(stockInicial);

        // Reactivar a entregado → vuelve a descontar (8)
        mockMvc.perform(put("/api/ventas/{id}/estado", idVenta)
                        .param("estado", "entregado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("entregado"));

        assertThat(productoRepository.findById(arepaQueso.getId())
                .orElseThrow().getStock()).isEqualTo(stockInicial - 2);
    }

    @Test
    @DisplayName("CP-007 / Regla 5 — Estado de pedido inválido se rechaza")
    void estadoDePedidoInvalidoSeRechaza() throws Exception {

        Long idVenta = registrarVentaComo(arepaQueso, 1);

        // Estado inválido → la transacción se revierte (RuntimeException).
        assertThatThrownBy(() -> mockMvc.perform(put("/api/ventas/{id}/estado", idVenta)
                        .param("estado", "pendiente")))
                .hasRootCauseInstanceOf(RuntimeException.class)
                .hasRootCauseMessage("Estado inválido: pendiente");

        // El estado original se conserva.
        assertThat(ventaRepository.findById(idVenta)
                .orElseThrow().getEstado()).isEqualTo("en_proceso");
    }

    @Test
    @DisplayName("CP-014 — Venta sin productos (backend la acepta con total 0; validación en frontend)")
    void ventaSinProductosQuedaConTotalCero() throws Exception {

        Map<String, Object> body = cuerpoVenta(
                "llevar", null, "Efectivo", "Caja", "Caja",
                List.of()
        );

        mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(0.0));
    }

    @Test
    @DisplayName("CP-021 — Listar ventas devuelve el registro creado")
    void listarVentasDevuelveRegistros() throws Exception {

        registrarVentaComo(arepaQueso, 1);

        mockMvc.perform(get("/api/ventas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        assertThat(ventaRepository.count()).isEqualTo(1);
    }

    // ============================================================
    // Utilidades
    // ============================================================

    private Producto crearProducto(
            String nombre,
            String referencia,
            Double precio,
            Integer stock,
            String categoria,
            Boolean estado
    ) {

        Producto producto = new Producto();

        producto.setNombre(nombre);
        producto.setReferencia(referencia);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setCategoria(categoria);
        producto.setEstado(estado);
        producto.setImagenUrl(null);

        return productoRepository.save(producto);
    }

    private Map<String, Object> cuerpoVenta(
            String tipoPedido,
            String numeroMesa,
            String metodoPago,
            String usuarioNombre,
            String usuarioRol,
            List<Map<String, Object>> detalles
    ) {

        Map<String, Object> cuerpo = new LinkedHashMap<>();

        cuerpo.put("metodoPago", metodoPago);
        cuerpo.put("usuarioNombre", usuarioNombre);
        cuerpo.put("usuarioRol", usuarioRol);
        cuerpo.put("tipoPedido", tipoPedido);
        cuerpo.put("numeroMesa", numeroMesa);
        cuerpo.put("detalles", detalles);

        return cuerpo;
    }

    private Map<String, Object> detalle(
            Long productoId,
            Integer cantidad,
            Map<String, Object> observaciones,
            Integer adicionQueso
    ) {

        Map<String, Object> detalle = new LinkedHashMap<>();

        detalle.put("productoId", productoId);
        detalle.put("cantidad", cantidad);
        detalle.put("observaciones", observaciones);
        detalle.put("adicionQueso", adicionQueso);

        return detalle;
    }

    private Long registrarVentaComo(
            Producto producto,
            Integer cantidad
    ) throws Exception {

        Map<String, Object> body = cuerpoVenta(
                "llevar", null, "Efectivo", "Caja", "Caja",
                List.of(detalle(producto.getId(), cantidad, null, 0))
        );

        MvcResult resultado = mockMvc.perform(post("/api/ventas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(
                resultado.getResponse().getContentAsString()
        ).get("id").asLong();
    }

}