package com.ottopos.main;

import com.ottopos.dao.ProductoDAO;
import com.ottopos.model.Producto;
import java.util.List;

public class Main {
    public static void main(String[] args) {

        ProductoDAO dao = new ProductoDAO();

        // ➕ INSERT
        System.out.println("--- INSERTAR ---");
        Producto nuevo = new Producto(0, "Hamburguesa", 15000.0, 50);
        dao.insertar(nuevo);

        // 🔍 READ
        System.out.println("\n--- LISTAR ---");
        List<Producto> lista = dao.listarTodos();
        for (Producto p : lista) {
            System.out.println(p);
        }

        // ✏️ UPDATE
        System.out.println("\n--- ACTUALIZAR ---");
        Producto actualizado = new Producto(1, "Hamburguesa Especial", 18000.0, 40);
        dao.actualizar(actualizado);

        // 🗑️ DELETE
        System.out.println("\n--- ELIMINAR ---");
        dao.eliminar(1);
    }
}
