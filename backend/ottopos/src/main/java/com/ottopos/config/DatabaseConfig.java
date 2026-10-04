package com.ottopos.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

/**
 * Configuración de la conexión a MySQL.
 *
 * Construye la URL JDBC en Java a partir de variables de entorno cortas
 * ({@code DB_HOST}, {@code DB_PORT}, {@code DB_NAME}, {@code DB_USER} y
 * {@code DB_PASS}), limpiando cada valor con {@code trim()} para evitar
 * errores por caracteres invisibles (espacios o saltos de línea) que se
 * cuelan al pegar las variables en Render o en un archivo .env.
 *
 * Si se define {@code SPRING_DATASOURCE_URL}, esta tiene prioridad
 * (compatibilidad con el método anterior).
 *
 * La clase se desactiva con el perfil "test" para que las pruebas
 * automatizadas sigan usando H2 en memoria.
 */
@Configuration
@Profile("!test")
public class DatabaseConfig {

    /**
     * Registro de eventos de la configuración.
     */
    private static final Logger log =
            LoggerFactory.getLogger(DatabaseConfig.class);

    /**
     * URL completa opcional (método antiguo, tiene prioridad).
     */
    @Value("${SPRING_DATASOURCE_URL:}")
    private String urlCompleta;

    /**
     * Host de la base de datos.
     */
    @Value("${DB_HOST:localhost}")
    private String dbHost;

    /**
     * Puerto de la base de datos.
     */
    @Value("${DB_PORT:3306}")
    private String dbPort;

    /**
     * Nombre de la base de datos.
     */
    @Value("${DB_NAME:ottopos}")
    private String dbName;

    /**
     * Usuario de la base de datos.
     */
    @Value("${DB_USER:root}")
    private String dbUser;

    /**
     * Contraseña de la base de datos.
     */
    @Value("${DB_PASS:}")
    private String dbPass;

    /**
     * Crea el origen de datos principal de la aplicación.
     *
     * @return origen de datos configurado para MySQL
     */
    @Bean
    @Primary
    public DataSource dataSource() {

        String host = limpiar(dbHost);
        String port = limpiar(dbPort);
        String nombre = limpiar(dbName);
        String usuario = limpiar(dbUser);
        String password = limpiar(dbPass);
        String urlSobrescrita = limpiar(urlCompleta);

        // Si no hay URL completa definida, se construye con los valores
        // limpios de las variables cortas.
        String url = urlSobrescrita.isBlank()
                ? "jdbc:mysql://" + host + ":" + port
                        + "/" + nombre + "?ssl-mode=REQUIRED"
                : urlSobrescrita;

        DriverManagerDataSource dataSource =
                new DriverManagerDataSource();

        dataSource.setDriverClassName(
                "com.mysql.cj.jdbc.Driver"
        );

        dataSource.setUrl(url);

        dataSource.setUsername(usuario);

        dataSource.setPassword(password);

        log.info(
                "📡 Base de datos configurada -> host={}, puerto={}, bd={}, usuario={}",
                host, port, nombre, usuario
        );

        log.info(
                "☕ URL JDBC (contraseña oculta): {}",
                enmascarar(url, password)
        );

        return dataSource;

    }

    /**
     * Elimina espacios y saltos de línea de un valor.
     *
     * @param valor valor a limpiar
     * @return valor limpio o cadena vacía si es null
     */
    private String limpiar(String valor) {

        return valor == null ? "" : valor.trim();

    }

    /**
     * Reemplaza la contraseña de la URL por asteriscos
     * para poder mostrarla de forma segura en los logs.
     *
     * @param url      URL JDBC
     * @param password contraseña incluida en la URL
     * @return URL con la contraseña oculta
     */
    private String enmascarar(
            String url,
            String password) {

        if (password == null || password.isBlank()) {

            return url;

        }

        return url.replace(password, "••••••");

    }

}