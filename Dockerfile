# ------------------------------------------------------------------------------
# Multistage Dockerfile for SEWA Backend (Spring Boot) — optimized for Render
# ------------------------------------------------------------------------------

# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy dependency manifest first for better layer caching
COPY pom.xml .

# Resolve dependencies (cached unless pom.xml changes). Skip tests.
RUN mvn dependency:go-offline -B -q

# Copy source and build the application
COPY src ./src
RUN mvn package -DskipTests -B -q

# Spring Boot produces one executable JAR (ignore *-sources.jar if present)
RUN JAR=$(find target -maxdepth 1 -name '*.jar' ! -name '*-sources.jar' -print -quit) && \
    cp "$JAR" app.jar

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine

# Default port (Render sets PORT at runtime)
ENV PORT=8080

# Run as non-root for security
RUN addgroup -g 1000 app && adduser -u 1000 -G app -D app
WORKDIR /app

# Copy the built JAR from builder
COPY --from=builder /build/app.jar ./app.jar

# Render and most PaaS set PORT; Spring Boot reads server.port
USER app
EXPOSE 8080

# Use PORT from environment so Render can bind correctly
CMD ["sh", "-c", "exec java -Dserver.port=${PORT} -jar app.jar"]
