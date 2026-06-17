# ── Stage 1: dependency installation ──────────────────────────────────────
# Use a full Python image to install dependencies with compiled extensions
FROM python:3.11-slim AS builder

WORKDIR /app

# Copy only requirements first (Docker layer cache: dependencies don't 
# rebuild when only source code changes)
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Stage 2: lean runtime image ────────────────────────────────────────────
# Slim image has no build tools — smaller attack surface, faster pulls
FROM python:3.11-slim AS runtime

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy application source code
COPY src/ ./src/

# Create a non-root user — running as root in containers is a security risk
RUN useradd -m -u 1001 appuser
USER appuser

# Expose the port FastAPI listens on
EXPOSE 8000

# Health check baked into the image for Docker-level health monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Start the application
CMD ["python", "src/main.py"]
