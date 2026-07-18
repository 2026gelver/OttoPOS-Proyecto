package com.ottopos.config;

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
                        .allowedOrigins("*")
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