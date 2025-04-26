import openai
import logging
from typing import Dict, Any, List, Optional
import json

from app.config import settings
from app.models.content import ContentGenerationParams, ImageGenerationParams

# Configure OpenAI API key
openai.api_key = settings.OPENAI_API_KEY

logger = logging.getLogger(__name__)

class OpenAIService:
    @staticmethod
    async def generate_content(params: ContentGenerationParams, system_prompt: str) -> str:
        """
        Generate content using OpenAI's GPT models
        """
        try:
            # Prepare the user prompt based on the parameters
            user_prompt = f"Topic: {params.topic}\n"
            
            if params.keywords:
                user_prompt += f"Keywords: {params.keywords}\n"
            
            user_prompt += f"Target Audience: {params.audience}\n"
            user_prompt += f"Tone: {params.tone}\n"
            user_prompt += f"Length: Approximately {params.length} words\n"
            
            if params.outline:
                user_prompt += "Outline:\n"
                for i, section in enumerate(params.outline, 1):
                    user_prompt += f"{i}. {section}\n"
            
            if params.additional_context:
                user_prompt += f"\nAdditional Context: {params.additional_context}\n"
            
            # Make the API call to OpenAI
            response = await openai.ChatCompletion.acreate(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=params.length * 4,  # Estimate tokens based on desired word count
                temperature=settings.DEFAULT_TEMPERATURE,
            )
            
            # Extract and return the generated content
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Error generating content with OpenAI: {str(e)}")
            raise

    @staticmethod
    async def generate_image(params: ImageGenerationParams) -> Dict[str, Any]:
        """
        Generate an image using OpenAI's DALL-E models
        """
        try:
            response = await openai.Image.acreate(
                model=settings.IMAGE_GENERATION_MODEL,
                prompt=params.prompt,
                size=params.size,
                quality=params.quality,
                n=1,
            )
            
            return {
                "url": response.data[0].url,
                "metadata": {
                    "model": settings.IMAGE_GENERATION_MODEL,
                    "size": params.size,
                    "quality": params.quality,
                }
            }
        
        except Exception as e:
            logger.error(f"Error generating image with OpenAI: {str(e)}")
            raise

    @staticmethod
    async def analyze_content(content: str, analysis_type: str) -> Dict[str, Any]:
        """
        Analyze content using OpenAI's GPT models
        """
        try:
            system_prompts = {
                "seo": "You are an SEO expert. Analyze the provided content and provide SEO recommendations.",
                "readability": "You are a readability expert. Analyze the provided content and provide readability scores and suggestions.",
                "sentiment": "You are a sentiment analysis expert. Analyze the provided content and determine its sentiment and emotional tone.",
                "grammar": "You are a grammar expert. Analyze the provided content and identify any grammatical errors or improvements."
            }
            
            system_prompt = system_prompts.get(analysis_type, "You are a content analysis expert.")
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Analyze the following content and provide detailed feedback in JSON format with 'analysis' and 'suggestions' keys:\n\n{content}"}
                ],
                max_tokens=1000,
                temperature=0.5,
                response_format={"type": "json_object"}
            )
            
            # Parse the JSON response
            analysis_result = json.loads(response.choices[0].message.content)
            return analysis_result
        
        except Exception as e:
            logger.error(f"Error analyzing content with OpenAI: {str(e)}")
            raise
