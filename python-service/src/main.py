import logging
import json
import sys
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn

# ── Structured JSON logger ─────────────────────────────────────────────────
# Kubernetes log aggregators (Loki, Fluentd) parse JSON lines efficiently.
# Every log line is a valid JSON object with timestamp, level, and message.
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "service": "python-service",
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JSONFormatter())
logging.basicConfig(level=logging.INFO, handlers=[handler])
logger = logging.getLogger(__name__)

# ── FastAPI application ────────────────────────────────────────────────────
app = FastAPI(title="Python Service", version="1.0.0")

# In-memory store (replace with a real DB in production)
items_store = [
    {"id": 1, "name": "Widget Alpha", "status": "available"},
    {"id": 2, "name": "Widget Beta", "status": "sold"},
]

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log every incoming HTTP request with method, path, and status code."""
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code} for {request.method} {request.url.path}")
    return response

@app.get("/health")
async def health_check():
    """
    Kubernetes liveness and readiness probe endpoint.
    Must return 200 for the pod to receive traffic.
    """
    logger.info("Health check called")
    return {"status": "healthy", "service": "python-service", "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/items")
async def list_items():
    logger.info(f"Listing {len(items_store)} items")
    return {"items": items_store, "count": len(items_store)}

@app.get("/api/items/{item_id}")
async def get_item(item_id: int):
    item = next((i for i in items_store if i["id"] == item_id), None)
    if item is None:
        logger.warning(f"Item {item_id} not found")
        return JSONResponse(status_code=404, content={"error": f"Item {item_id} not found"})
    logger.info(f"Returning item {item_id}")
    return item

@app.post("/api/items")
async def create_item(item: dict):
    new_id = max(i["id"] for i in items_store) + 1 if items_store else 1
    new_item = {"id": new_id, **item}
    items_store.append(new_item)
    logger.info(f"Created new item with id {new_id}")
    return new_item

if __name__ == "__main__":
    logger.info("Starting Python service on port 8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
