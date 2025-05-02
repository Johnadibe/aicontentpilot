import openai
from typing import List

from app.core.config import settings
from app.models.images import ImageGenerationRequest, ImageGenerationResponse

class ImageGenerator:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
    
    async def generate_image(self, request: ImageGenerationRequest) -> ImageGenerationResponse:
        """Generate images based on the prompt."""
        try:
            # Call OpenAI API for image generation
            response = openai.images.generate(
                model="dall-e-3",
                prompt=request.prompt,
                n=request.num_images,
                size=f"{request.width}x{request.height}"
            )
            
            # Extract image URLs
            image_urls = [image.url for image in response.data]
            
            return ImageGenerationResponse(images=image_urls)
        except Exception as e:
            raise Exception(f"Error generating image: {str(e)}")
