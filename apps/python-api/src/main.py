from fastapi import FastAPI, HTTPException
from datetime import datetime
import logging
import uvicorn

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger("python-api")

app = FastAPI(title="Python API", version="1.0.0")

# Sample data
items = [
    {"id": 1, "name": "Laptop", "price": 999.99},
    {"id": 2, "name": "Phone", "price": 499.99},
    {"id": 3, "name": "Tablet", "price": 299.99},
]

@app.get("/")
def health_check():
    logger.info("Health check called")
    return {
        "status": "healthy",
        "service": "python-api",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/items")
def get_items():
    logger.info(f"Fetching all items, count={len(items)}")
    return {"items": items, "total": len(items)}

@app.get("/items/{item_id}")
def get_item(item_id: int):
    logger.info(f"Fetching item id={item_id}")
    item = next((i for i in items if i["id"] == item_id), None)
    if not item:
        logger.warning(f"Item id={item_id} not found")
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    return item

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
