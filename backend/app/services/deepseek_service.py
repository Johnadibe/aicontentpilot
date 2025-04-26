import requests
import logging
from typing import Dict, Any, List, Optional
import json

from app.config import settings
from app.models.content import ContentGenerationParams

logger = logging.getLogger(__name__)

class DeepSeekService:
    API_BASE_URL = "https://api.deepseek.com/v1"
    
    @staticmethod
    async def generate_content(params: ContentGenerationParams, system_prompt: str) -> str:
        """
        Generate content using DeepSeek's language models
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
            
            # Make the API call to DeepSeek
            headers = {
                "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": params.length * 4,  # Estimate tokens based on desired word count
                "temperature": settings.DEFAULT_TEMPERATURE,
            }
            
            response = requests.post(
                f"{DeepSeekService.API_BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Extract and return the generated content
            return result["choices"][0]["message"]["content"]
        
        except Exception as e:
            logger.error(f"Error generating content with DeepSeek: {str(e)}")
            raise

    @staticmethod
    async def analyze_content(content: str, analysis_type: str) -> Dict[str, Any]:
        """
        Analyze content using DeepSeek's language models
        """
        try:
            system_prompts = {
                "seo": "You are an SEO expert. Analyze the provided content and provide SEO recommendations.",
                "readability": "You are a readability expert. Analyze the provided content and provide readability scores and suggestions.",
                "sentiment": "You are a sentiment analysis expert. Analyze the provided content and determine its sentiment and emotional tone.",
                "grammar": "You are a grammar expert. Analyze the provided content and identify any grammatical errors or improvements."
            }
            
            system_prompt = system_prompts.get(analysis_type, "You are a content analysis expert.")
            
            headers = {
                "Authorization": f"Bearer {settings.DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Analyze the following content and provide detailed feedback in JSON format with 'analysis' and 'suggestions' keys:\n\n{content}"}
                ],
                "max_tokens": 1000,
                "temperature": 0.5,
            }
            
            response = requests.post(
                f"{DeepSeekService.API_BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Parse the response as JSON
            analysis_text = result["choices"][0]["message"]["content"]
            
            # Extract JSON from the response text
            try:
                # Try to parse the entire response as JSON
                analysis_result = json.loads(analysis_text)
            except json.JSONDecodeError:
                # If that fails, try to extract JSON from the text
                import re
                json_match = re.search(r'```json\n(.*?)\n```', analysis_text, re.DOTALL)
                if json_match:
                    analysis_result = json.loads(json_match.group(1))
                else:
                    # Fallback to a simple structure
                    analysis_result = {
                        "analysis": analysis_text,
                        "suggestions": []
                    }
            
            return analysis_result
        
        except Exception as e:
            logger.error(f"Error analyzing content with DeepSeek: {str(e)}")
            raise
