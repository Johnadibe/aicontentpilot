import openai
from typing import List, Dict, Any, Optional
import requests
from bs4 import BeautifulSoup
import json

from app.core.config import settings

class ResearchAgent:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
    
    async def research_topic(self, topic: str, depth: str = "medium") -> Dict[str, Any]:
        """Research a topic and provide structured information."""
        # First, generate research questions
        questions = await self._generate_research_questions(topic, depth)
        
        # Then, generate answers to those questions
        research_data = await self._generate_research_data(topic, questions)
        
        return {
            "topic": topic,
            "depth": depth,
            "questions": questions,
            "research_data": research_data,
            "summary": research_data.get("summary", "")
        }
    
    async def _generate_research_questions(self, topic: str, depth: str) -> List[str]:
        """Generate research questions for a topic."""
        depth_map = {
            "light": 3,
            "medium": 5,
            "deep": 8
        }
        num_questions = depth_map.get(depth, 5)
        
        system_prompt = "You are a research expert specializing in generating insightful research questions."
        
        user_prompt = f"Generate {num_questions} research questions for the topic: '{topic}'. These questions should help guide comprehensive research on this topic. Provide the questions as a JSON array."
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        # Parse the JSON response
        try:
            result = json.loads(response)
            questions = result.get("questions", [])
            return questions if isinstance(questions, list) else []
        except json.JSONDecodeError:
            return []
    
    async def _generate_research_data(self, topic: str, questions: List[str]) -> Dict[str, Any]:
        """Generate research data based on questions."""
        system_prompt = "You are a research expert providing comprehensive information on topics."
        
        user_prompt = f"Provide comprehensive research on the topic: '{topic}'. Address the following questions:\n\n"
        
        for i, question in enumerate(questions, 1):
            user_prompt += f"{i}. {question}\n"
        
        user_prompt += "\nProvide your response in a structured format with sections for each question, and include a summary at the end."
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=3000
        )
        
        # Extract summary if available
        summary = ""
        if "Summary:" in response:
            parts = response.split("Summary:", 1)
            if len(parts) > 1:
                summary = parts[1].strip()
        
        return {
            "content": response,
            "summary": summary
        }
    
    async def _call_openai(self, system_prompt: str, user_prompt: str, max_tokens: int = 2000, temperature: float = 0.7, response_format: Optional[Dict[str, str]] = None) -> str:
        """Call the OpenAI API with the given prompts."""
        try:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            kwargs = {
                "model": settings.DEFAULT_MODEL,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
            
            if response_format:
                kwargs["response_format"] = response_format
            
            response = openai.chat.completions.create(**kwargs)
            
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error calling OpenAI API: {str(e)}")
