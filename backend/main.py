import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

APP_NAME = os.getenv("APP_NAME", "CashTwin Backend")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="Backend foundation for CashTwin"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": APP_NAME,
        "version": APP_VERSION
    }

# Register routers
from api.customers import router as customers_router
app.include_router(customers_router)

