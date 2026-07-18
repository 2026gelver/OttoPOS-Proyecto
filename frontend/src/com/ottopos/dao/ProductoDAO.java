package com.ottopos.dao;

import com.ottopos.connection.ConexionDB;
import com.ottopos.model.Producto;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductoDAO {

    // ➕ CREATE
    public boolean insertar(Producto p) {
        String sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
        try (Connection conn = ConexionDB.obtenerConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, p.getNombre());
            ps.setDouble(2, p.getPrecio());
            ps.setInt(3, p.getStock());
            ps.executeUpdate();
            System.out.println("✅ Producto insertado correctamente");
            return true;
        } catch (SQLException e) {
            System.out.println("❌ Error al insertar: " + e.getMessage());
            return false;
        }
    }

    // 🔍 READ
    public List<Producto> listarTodos() {
        List<Producto> lista = new ArrayList<>();
        String sql = "SELECT * FROM productos";
        try (Connection conn = ConexionDB.obtenerConexion();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                Producto p = new Producto(
                    rs.getInt("id"),
                    rs.getString("nombre"),
                    rs.getDouble("precio"),
                    rs.getInt("stock")
                );
                lista.add(p);
            }
        } catch (SQLException e) {
            System.out.println("❌ Error al listar: " + e.getMessage());
        }
        return lista;
    }

    // ✏️ UPDATE
    public boolean actualizar(Producto p) {
        String sql = "UPDATE productos SET nombre=?, precio=?, stock=? WHERE id=?";
        try (Connection conn = ConexionDB.obtenerConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, p.getNombre());
            ps.setDouble(2, p.getPrecio());
            ps.setInt(3, p.getStock());
            ps.setInt(4, p.getId());
            ps.executeUpdate();
            System.out.println("✅ Producto actualizado correctamente");
            return true;
        } catch (SQLException e) {
            System.out.println("❌ Error al actualizar: " + e.getMessage());
            return false;
        }
    }

    // 🗑️ DELETE
    public boolean eliminar(int id) {
        String sql = "DELETE FROM productos WHERE id=?";
        try (Connection conn = ConexionDB.obtenerConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
            System.out.println("✅ Producto eliminado correctamente");
            return true;
        } catch (SQLException e) {
            System.out.println("❌ Error al eliminar: " + e.getMessage());
            return false;
        }
    }
}
