package com.ottopos.controller;

import com.ottopos.dto.VentaRequest;
import com.ottopos.entity.Venta;
import com.ottopos.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST encargado de gestionar las ventas
 * realizadas en el sistema OttoPOS.
 *
 * Esta clase expone los servicios web utilizados para
 * consultar y registrar las ventas del sistema.
 */
@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    /**
     * Servicio encargado de ejecutar la lógica de negocio
     * relacionada con las ventas.
     */
    @Autowired
    private VentaService ventaService;

    /**
     * Obtiene todas las ventas registradas en el sistema.
     *
     * @return lista de ventas registradas
     */
    @GetMapping
    public List<Venta> listarVentas() {

        return ventaService.listarVentas();

    }

    /**
     * Registra una nueva venta en el sistema.
     *
     * @param request información de la venta y sus detalles
     * @return venta guardada
     */
    @PostMapping
    public Venta registrarVenta(
            @RequestBody VentaRequest request) {

        return ventaService.guardarVenta(request);

    }

}