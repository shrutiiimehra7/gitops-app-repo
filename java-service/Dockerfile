# ── Stage 1: build the JAR with Maven ─────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder

# Install Maven (mvnw wrapper not used — we install Maven directly)
RUN apk add --no-cache maven

WORKDIR /app

# Copy POM first so dependency layer is cached separately from source
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build (skip tests — tests run in CI, not in image build)
COPY src/ ./src/
RUN mvn package -DskipTests --no-transfer-progress

# ── Stage 2: lean JRE runtime image ───────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/target/java-service-*.jar app.jar

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
