# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (cached if not changed)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
# Note: Using wildcard to match the artifact name Santal-Engineers-Welfare-Association-0.0.1-SNAPSHOT.jar
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
