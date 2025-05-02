from fastapi import APIRouter
from app.api.endpoints import content, images, optimization, templates

api_router = APIRouter()
api_router.include_router(content.router, prefix="/content", tags=["content"])
api_router.include_router(images.router, prefix="/images", tags=["images"])
api_router.include_router(optimization.router, prefix="/optimization", tags=["optimization"])
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
