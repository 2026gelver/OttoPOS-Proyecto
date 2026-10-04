package com.ottopos.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración de CORS para la aplicación OttoPOS.
 *
 * Permite controlar las solicitudes realizadas desde
 * diferentes orígenes hacia la API REST del sistema.
 */
@Configuration
public class CorsConfig {

    /**
     * Orígenes permitidos para acceder a la API.
     *
     * Se leen desde la propiedad {@code ottopos.cors.allowed-origins}
     * (configurable con la variable de entorno CORS_ALLOWED_ORIGINS).
     * Por defecto se permiten GitHub Pages y los orígenes locales
     * de desarrollo. En producción agrega tu dominio propio.
     */
    @Value("${ottopos.cors.allowed-origins:https://2026gelver.github.io,http://localhost:8080,http://localhost:5500,http://127.0.0.1:5500}")
    private String[] allowedOrigins;

    /**
     * Configura las reglas de acceso CORS para la aplicación.
     *
     * @return configuración de Spring MVC con las reglas CORS
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {

            /**
             * Define los orígenes, métodos y encabezados
             * permitidos para las solicitudes de la API.
             *
             * @param registry registro utilizado para configurar
             *                 las reglas CORS
             */
            @Override
            public void addCorsMappings(
                    CorsRegistry registry) {

                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "OPTIONS"
                        )
                        .allowedHeaders("*");
            }

        };

    }

}