package com.ottopos.model;

public class Producto {
    private int id;
    private String nombre;
    private double precio;
    private int stock;

    public Producto() {}

    public Producto(int id, String nombre, double precio, int stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    public int getId()              { return id; }
    public void setId(int id)       { this.id = id; }
    public String getNombre()       { return nombre; }
    public void setNombre(String n) { this.nombre = n; }
    public double getPrecio()       { return precio; }
    public void setPrecio(double p) { this.precio = p; }
    public int getStock()           { return stock; }
    public void setStock(int s)     { this.stock = s; }

    @Override
    public String toString() {
        return "Producto [id=" + id + ", nombre=" + nombre +
               ", precio=" + precio + ", stock=" + stock + "]";
    }
}
