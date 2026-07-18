package com.ottopos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación OttoPOS.
 *
 * Se encarga de iniciar la aplicación Spring Boot
 * y cargar la configuración principal del sistema.
 */
@SpringBootApplication
public class OttoposApplication {

    /**
     * Método principal que inicia la aplicación OttoPOS.
     *
     * @param args argumentos recibidos al iniciar la aplicación
     */
    public static void main(String[] args) {

        SpringApplication.run(
                OttoposApplication.class,
                args
        );

    }

}