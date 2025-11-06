# ---- Build stage ----
FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn -DskipTests package

# ---- Run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Spring Boot will read ${PORT} from the environment (you already have server.port=${PORT})
CMD ["java", "-jar", "app.jar"]
