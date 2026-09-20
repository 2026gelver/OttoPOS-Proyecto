package com.ottopos;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Prueba de contexto de la aplicación OttoPOS.
 *
 * Verifica que el contexto de Spring Boot arranca correctamente
 * usando la base de datos H2 en memoria (perfil "test").
 */
@SpringBootTest
@ActiveProfiles("test")
class OttoposApplicationTests {

	@Test
	void contextLoads() {
	}

}
