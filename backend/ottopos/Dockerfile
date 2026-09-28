# ============================================================
# Dockerfile - OttoPOS Backend (Spring Boot, Java 21)
# Utilizado por Render para compilar y ejecutar la API REST.
# ============================================================

# ---------- ETAPA 1: compilar el JAR con Maven + JDK 21 ------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# -DskipTests evita ejecutar pruebas (usan H2) durante el build en la nube
RUN mvn -q -DskipTests package

# ---------- ETAPA 2: imagen final con JRE 21 -----------------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/ottopos-0.0.1-SNAPSHOT.jar app.jar

# Render inyecta la variable PORT en tiempo de ejecución;
# application.properties la usa con server.port=${PORT:8081}
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]