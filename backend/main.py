from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any

from app.routers import blog, social, email_content, ad_copy, product, seo, image
from app.auth.auth_handler import verify_token
from app.models.content import ContentGenerationParams, ContentResponse, ImageGenerationParams
from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(f"logs/api_{datetime.now().strftime('%Y%m%d')}.log")
    ]
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AI Content Pilot API",
    description="API for AI-powered content generation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(blog.router, prefix="/generate", tags=["Blog Content"])
app.include_router(social.router, prefix="/generate", tags=["Social Media Content"])
app.include_router(email_content.router, prefix="/generate", tags=["Email Content"])
app.include_router(ad_copy.router, prefix="/generate", tags=["Ad Copy"])
app.include_router(product.router, prefix="/generate", tags=["Product Descriptions"])
app.include_router(seo.router, prefix="/generate", tags=["SEO Content"])
app.include_router(image.router, prefix="/generate", tags=["Image Generation"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred. Please try again later."}
    )

@app.get("/")
async def root():
    return {"message": "Welcome to AI Content Pilot API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)
    
    # Run the FastAPI app with uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
