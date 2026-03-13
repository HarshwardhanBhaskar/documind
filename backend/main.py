"""
main.py
──────────────────────────────────────────────────────────────────────────────
DocuMind FastAPI application entrypoint.

Run in development:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

API docs (auto-generated):
    http://localhost:8000/docs      ← Swagger UI
    http://localhost:8000/redoc     ← ReDoc
"""

import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load .env before any other imports that read env vars
load_dotenv()

from routers import auth, documents, merge, processing, upload, usage, utilities, smart_classify  # noqa: E402

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(name)s  %(message)s",
)
logger = logging.getLogger("documind")

# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="DocuMind – Intelligent Document Toolkit API",
    description=(
        "REST API for DocuMind: upload, OCR, AI classify, and extract "
        "structured data from PDF / image documents.  All endpoints are "
        "protected with Supabase JWT bearer authentication."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    contact={
        "name":  "DocuMind Team",
        "email": "support@documind.ai",
    },
    license_info={
        "name": "MIT",
    },
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
# In production replace "*" with your exact frontend origin,
# e.g. "https://app.documind.ai"
_CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(documents.router)
app.include_router(processing.router)
app.include_router(merge.router)
app.include_router(usage.router)
app.include_router(utilities.router)
app.include_router(smart_classify.router)

# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"], summary="Health check")
async def root():
    return {
        "status":  "ok",
        "service": "DocuMind API",
        "version": "1.0.0",
        "docs":    "/docs",
    }


@app.get("/health", tags=["Health"], summary="Liveness probe")
async def health():
    return {"status": "healthy"}


# ─── Startup / shutdown events ────────────────────────────────────────────────
@app.on_event("startup")
async def on_startup():
    logger.info("DocuMind API starting up…")
    # Validate that required env vars are present at startup
    required = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]
    missing  = [k for k in required if not os.getenv(k)]
    if missing:
        logger.error("Missing required environment variables: %s", missing)
        logger.error("Copy .env.example → .env and fill in the values.")
    else:
        logger.info("Environment variables validated ✓")


@app.on_event("shutdown")
async def on_shutdown():
    logger.info("DocuMind API shutting down.")


# ─── Dev entrypoint ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=True,
    )
