from typing import Dict, Any, Optional
import logging

from app.services.openai_service import OpenAIService
from app.services.deepseek_service import DeepSeekService
from app.models.content import ContentGenerationParams, ImageGenerationParams

logger = logging.getLogger(__name__)

class AIAgentFactory:
    """
    Factory class to create and use different AI agents based on the content type
    """
    
    @staticmethod
    async def generate_content(content_type: str, params: ContentGenerationParams, provider: str = "openai") -> str:
        """
        Generate content based on the content type and parameters
        """
        # Get the system prompt for the content type
        system_prompt = AIAgentFactory._get_system_prompt(content_type)
        
        # Generate content using the specified provider
        if provider.lower() == "openai":
            return await OpenAIService.generate_content(params, system_prompt)
        elif provider.lower() == "deepseek":
            return await DeepSeekService.generate_content(params, system_prompt)
        else:
            raise ValueError(f"Unsupported AI provider: {provider}")
    
    @staticmethod
    async def generate_image(params: ImageGenerationParams) -> Dict[str, Any]:
        """
        Generate an image based on the parameters
        """
        # Currently only OpenAI is supported for image generation
        return await OpenAIService.generate_image(params)
    
    @staticmethod
    async def analyze_content(content: str, analysis_type: str, provider: str = "openai") -> Dict[str, Any]:
        """
        Analyze content based on the analysis type
        """
        if provider.lower() == "openai":
            return await OpenAIService.analyze_content(content, analysis_type)
        elif provider.lower() == "deepseek":
            return await DeepSeekService.analyze_content(content, analysis_type)
        else:
            raise ValueError(f"Unsupported AI provider: {provider}")
    
    @staticmethod
    def _get_system_prompt(content_type: str) -> str:
        """
        Get the system prompt for the specified content type
        """
        system_prompts = {
            "blog": """
                You are an expert blog content creator. Your task is to create a comprehensive, 
                engaging, and informative blog post based on the provided topic and parameters.
                
                Follow these guidelines:
                1. Create a compelling headline/title
                2. Write in a clear, engaging style appropriate for the specified audience and tone
                3. Include an introduction that hooks the reader
                4. Follow the provided outline (if any)
                5. Include relevant subheadings to organize the content
                6. Incorporate the specified keywords naturally throughout the text
                7. Provide actionable insights and valuable information
                8. End with a conclusion that summarizes key points and includes a call to action
                9. Aim for the specified word count
                
                Format the content with proper HTML tags for headings, paragraphs, lists, etc.
            """,
            
            "social": """
                You are an expert social media content creator. Your task is to create engaging
                social media posts based on the provided topic and parameters.
                
                Follow these guidelines:
                1. Create content appropriate for the specified platform (if mentioned)
                2. Use a tone that resonates with the target audience
                3. Keep the content concise and impactful
                4. Include relevant hashtags where appropriate
                5. Incorporate call-to-actions to encourage engagement
                6. Consider the character limits of different platforms
                
                If multiple posts are requested, create them as separate sections.
            """,
            
            "email": """
                You are an expert email copywriter. Your task is to create compelling email content
                based on the provided topic and parameters.
                
                Follow these guidelines:
                1. Create an attention-grabbing subject line
                2. Write a personalized greeting
                3. Open with a hook that captures interest
                4. Present the main message clearly and persuasively
                5. Include a clear call-to-action
                6. Close with an appropriate sign-off
                7. Use a tone appropriate for the specified audience and purpose
                8. Keep the content concise and focused
                
                Format the content as a complete email including subject line, body, and sign-off.
            """,
            
            "ad": """
                You are an expert advertising copywriter. Your task is to create compelling ad copy
                based on the provided topic and parameters.
                
                Follow these guidelines:
                1. Create attention-grabbing headlines
                2. Write concise, persuasive body copy
                3. Highlight key benefits and unique selling points
                4. Include a clear call-to-action
                5. Adapt the style to the specified platform (if mentioned)
                6. Use language that resonates with the target audience
                7. Stay within character/word limits for the ad format
                
                If multiple ad variations are requested, create them as separate sections.
            """,
            
            "product": """
                You are an expert product description writer. Your task is to create compelling
                product descriptions based on the provided information.
                
                Follow these guidelines:
                1. Start with an engaging opening that captures attention
                2. Highlight the key features and benefits of the product
                3. Use sensory and emotional language to create desire
                4. Address potential customer pain points and how the product solves them
                5. Include technical specifications where relevant
                6. Use a tone appropriate for the brand and target audience
                7. End with a call-to-action that encourages purchase
                
                Format the description in a way that's easy to scan with bullet points for features if appropriate.
            """,
            
            "seo": """
                You are an expert SEO content creator. Your task is to create search engine optimized
                content based on the provided topic and parameters.
                
                Follow these guidelines:
                1. Create an SEO-friendly title that includes the primary keyword
                2. Use the primary keyword in the first paragraph
                3. Incorporate secondary keywords naturally throughout the content
                4. Create a logical structure with H2 and H3 subheadings that include keywords where natural
                5. Write comprehensive, valuable content that addresses user search intent
                6. Include meta description suggestions
                7. Suggest internal and external linking opportunities
                8. Maintain readability and user engagement while optimizing for search
                
                Format the content with proper HTML tags for headings, paragraphs, lists, etc.
            """
        }
        
        return system_prompts.get(content_type, "You are an expert content creator. Create high-quality content based on the provided parameters.")
