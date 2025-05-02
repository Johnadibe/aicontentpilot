import openai
import re
import math
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from typing import List, Dict, Any, Optional, Tuple
from textstat import textstat
import json

from app.core.config import settings
from app.models.optimization import (
    SEOAnalysisRequest, SEOAnalysisResponse,
    ReadabilityRequest, ReadabilityResponse, ReadabilityMetrics,
    GrammarCheckRequest, GrammarCheckResponse, GrammarIssue,
    SentimentAnalysisRequest, SentimentAnalysisResponse, SentimentScore, EmotionScore,
    KeywordDensityRequest, KeywordDensityResponse,
    MetadataGeneratorRequest, MetadataGeneratorResponse,
    ContentImproverRequest, ContentImproverResponse
)

# Download NLTK resources
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class ContentOptimizer:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.stop_words = set(stopwords.words('english'))
    
    async def analyze_seo(self, request: SEOAnalysisRequest) -> SEOAnalysisResponse:
        """Analyze content for SEO optimization."""
        # Extract basic metrics
        word_count = len(re.findall(r'\b\w+\b', request.content))
        sentence_count = len(sent_tokenize(request.content))
        paragraph_count = len(re.split(r'\n\s*\n', request.content))
        
        # Calculate keyword density
        keyword_density = {}
        if request.primary_keyword:
            primary_keyword_count = len(re.findall(r'\b' + re.escape(request.primary_keyword.lower()) + r'\b', request.content.lower()))
            keyword_density[request.primary_keyword] = primary_keyword_count / word_count if word_count > 0 else 0
        
        if request.secondary_keywords:
            for keyword in request.secondary_keywords:
                keyword_count = len(re.findall(r'\b' + re.escape(keyword.lower()) + r'\b', request.content.lower()))
                keyword_density[keyword] = keyword_count / word_count if word_count > 0 else 0
        
        # Analyze content structure
        headers = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', request.content, re.IGNORECASE | re.DOTALL)
        lists = re.findall(r'<[ou]l[^>]*>.*?</[ou]l>', request.content, re.IGNORECASE | re.DOTALL)
        images = re.findall(r'<img[^>]*>', request.content, re.IGNORECASE)
        
        content_structure = {
            "word_count": word_count,
            "sentence_count": sentence_count,
            "paragraph_count": paragraph_count,
            "headers_count": len(headers),
            "lists_count": len(lists),
            "images_count": len(images),
            "avg_paragraph_length": word_count / paragraph_count if paragraph_count > 0 else 0,
            "avg_sentence_length": word_count / sentence_count if sentence_count > 0 else 0
        }
        
        # Extract meta tags if URL is provided
        meta_tags = {}
        
        # Get AI-powered suggestions
        suggestions = await self._get_seo_suggestions(request.content, request.primary_keyword, content_structure)
        
        # Calculate overall score (simplified algorithm)
        score_factors = [
            min(100, content_structure["word_count"] / 10),  # 1 point per 10 words up to 100
            100 if content_structure["headers_count"] >= 3 else content_structure["headers_count"] * 33.3,
            100 if content_structure["images_count"] >= 2 else content_structure["images_count"] * 50,
            100 if 15 <= content_structure["avg_sentence_length"] <= 25 else max(0, 100 - abs(content_structure["avg_sentence_length"] - 20) * 5),
            100 if request.primary_keyword and keyword_density.get(request.primary_keyword, 0) >= 0.01 and keyword_density.get(request.primary_keyword, 0) <= 0.03 else 0
        ]
        
        overall_score = int(sum(score_factors) / len(score_factors))
        
        return SEOAnalysisResponse(
            overall_score=overall_score,
            keyword_density=keyword_density,
            readability_score=textstat.flesch_reading_ease(request.content),
            content_structure=content_structure,
            meta_tags=meta_tags,
            suggestions=suggestions
        )
    
    async def analyze_readability(self, request: ReadabilityRequest) -> ReadabilityResponse:
        """Analyze content readability."""
        # Calculate readability metrics
        flesch_kincaid = textstat.flesch_kincaid_grade(request.content)
        gunning_fog = textstat.gunning_fog(request.content)
        smog = textstat.smog_index(request.content)
        
        # Calculate average grade level
        average_grade_level = (flesch_kincaid + gunning_fog + smog) / 3
        
        # Tokenize content
        sentences = sent_tokenize(request.content)
        words = word_tokenize(request.content.lower())
        
        # Calculate average sentence length
        average_sentence_length = len(words) / len(sentences) if sentences else 0
        
        # Identify complex words (simplified approach)
        complex_words = []
        complex_word_count = 0
        
        for word in set(words):
            if word.isalpha() and len(word) > 3 and textstat.syllable_count(word) >= 3:
                complex_words.append({
                    "word": word,
                    "alternative": ""  # Will be filled by AI
                })
                complex_word_count += 1
        
        complex_word_percentage = complex_word_count / len(words) if words else 0
        
        # Identify long sentences
        long_sentences = []
        for i, sentence in enumerate(sentences):
            sentence_words = word_tokenize(sentence)
            if len(sentence_words) > 25:  # Threshold for long sentences
                long_sentences.append({
                    "sentence": sentence,
                    "word_count": len(sentence_words),
                    "position": i
                })
        
        # Passive voice detection (simplified)
        passive_sentences = []
        passive_count = 0
        
        for i, sentence in enumerate(sentences):
            # Simple heuristic for passive voice detection
            if re.search(r'\b(is|are|was|were|be|been|being)\s+\w+ed\b', sentence, re.IGNORECASE):
                passive_sentences.append({
                    "sentence": sentence,
                    "position": i
                })
                passive_count += 1
        
        passive_voice_percentage = passive_count / len(sentences) if sentences else 0
        
        # Get AI-powered suggestions for readability improvement
        suggestions = await self._get_readability_suggestions(
            request.content, 
            average_grade_level, 
            complex_word_percentage, 
            passive_voice_percentage,
            request.target_audience
        )
        
        # Determine grade level category
        grade_level = "College" if average_grade_level >= 12 else (
            "High School" if average_grade_level >= 9 else (
                "Middle School" if average_grade_level >= 6 else "Elementary School"
            )
        )
        
        # Fill in alternatives for complex words using AI
        if complex_words:
            complex_words = await self._get_simpler_alternatives(complex_words)
        
        metrics = ReadabilityMetrics(
            flesch_kincaid=flesch_kincaid,
            gunning_fog=gunning_fog,
            smog=smog,
            average_grade_level=average_grade_level,
            average_sentence_length=average_sentence_length,
            complex_word_percentage=complex_word_percentage,
            passive_voice_percentage=passive_voice_percentage
        )
        
        return ReadabilityResponse(
            metrics=metrics,
            grade_level=grade_level,
            complex_words=complex_words[:20],  # Limit to top 20
            long_sentences=long_sentences[:10],  # Limit to top 10
            passive_sentences=passive_sentences[:10],  # Limit to top 10
            suggestions=suggestions
        )
    
    async def check_grammar(self, request: GrammarCheckRequest) -> GrammarCheckResponse:
        """Check grammar and spelling in content."""
        # This is a simplified implementation using AI for grammar checking
        # In a production environment, you might want to use a dedicated grammar checking API
        
        system_prompt = "You are an expert grammar and language checker. Analyze the text for grammar, spelling, style, and punctuation issues."
        
        user_prompt = f"Analyze the following text for language issues:\n\n{request.content}\n\n"
        user_prompt += "Provide your analysis as a JSON object with the following structure:\n"
        user_prompt += "{\n"
        user_prompt += '  "issues": [\n'
        user_prompt += '    {\n'
        user_prompt += '      "type": "grammar|spelling|style|punctuation",\n'
        user_prompt += '      "text": "the problematic text",\n'
        user_prompt += '      "offset": 123,\n'
        user_prompt += '      "length": 5,\n'
        user_prompt += '      "suggestions": ["suggestion1", "suggestion2"],\n'
        user_prompt += '      "explanation": "explanation of the issue"\n'
        user_prompt += '    }\n'
        user_prompt += '  ],\n'
        user_prompt += '  "corrected_text": "the fully corrected text",\n'
        user_prompt += '  "statistics": {\n'
        user_prompt += '    "grammar": 5,\n'
        user_prompt += '    "spelling": 3,\n'
        user_prompt += '    "style": 2,\n'
        user_prompt += '    "punctuation": 1\n'
        user_prompt += '  }\n'
        user_prompt += '}'
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=3000,
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response)
            
            # Convert to our model
            issues = []
            for issue_data in result.get("issues", []):
                issues.append(GrammarIssue(
                    type=issue_data.get("type", "grammar"),
                    text=issue_data.get("text", ""),
                    offset=issue_data.get("offset", 0),
                    length=issue_data.get("length", 0),
                    suggestions=issue_data.get("suggestions", []),
                    explanation=issue_data.get("explanation")
                ))
            
            return GrammarCheckResponse(
                issues=issues,
                corrected_text=result.get("corrected_text", request.content),
                total_issues=len(issues),
                statistics=result.get("statistics", {"grammar": 0, "spelling": 0, "style": 0, "punctuation": 0})
            )
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return GrammarCheckResponse(
                issues=[],
                corrected_text=request.content,
                total_issues=0,
                statistics={"grammar": 0, "spelling": 0, "style": 0, "punctuation": 0}
            )
    
    async def analyze_sentiment(self, request: SentimentAnalysisRequest) -> SentimentAnalysisResponse:
        """Analyze sentiment of content."""
        system_prompt = "You are an expert sentiment analyst. Analyze the emotional tone and sentiment of the text."
        
        user_prompt = f"Analyze the sentiment of the following text:\n\n{request.content}\n\n"
        user_prompt += "Provide your analysis as a JSON object with the following structure:\n"
        user_prompt += "{\n"
        user_prompt += '  "overall_sentiment": "positive|neutral|negative",\n'
        user_prompt += '  "sentiment_score": {\n'
        user_prompt += '    "positive": 0.7,\n'
        user_prompt += '    "neutral": 0.2,\n'
        user_prompt += '    "negative": 0.1,\n'
        user_prompt += '    "compound": 0.6\n'
        user_prompt += '  },\n'
        
        if request.detailed:
            user_prompt += '  "emotions": {\n'
            user_prompt += '    "joy": 0.6,\n'
            user_prompt += '    "sadness": 0.1,\n'
            user_prompt += '    "anger": 0.05,\n'
            user_prompt += '    "fear": 0.05,\n'
            user_prompt += '    "surprise": 0.1,\n'
            user_prompt += '    "disgust": 0.1\n'
            user_prompt += '  },\n'
            user_prompt += '  "sentence_analysis": [\n'
            user_prompt += '    {\n'
            user_prompt += '      "sentence": "This is an example sentence.",\n'
            user_prompt += '      "sentiment": "positive",\n'
            user_prompt += '      "score": 0.8\n'
            user_prompt += '    }\n'
            user_prompt += '  ],\n'
        
        user_prompt += '  "suggestions": ["suggestion1", "suggestion2"]\n'
        user_prompt += '}'
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=3000,
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response)
            
            # Extract sentiment data
            overall_sentiment = result.get("overall_sentiment", "neutral")
            sentiment_score_data = result.get("sentiment_score", {})
            sentiment_score = SentimentScore(
                positive=sentiment_score_data.get("positive", 0.0),
                neutral=sentiment_score_data.get("neutral", 0.0),
                negative=sentiment_score_data.get("negative", 0.0),
                compound=sentiment_score_data.get("compound", 0.0)
            )
            
            # Extract emotions if detailed analysis was requested
            emotions = None
            if request.detailed and "emotions" in result:
                emotions_data = result.get("emotions", {})
                emotions = EmotionScore(
                    joy=emotions_data.get("joy", 0.0),
                    sadness=emotions_data.get("sadness", 0.0),
                    anger=emotions_data.get("anger", 0.0),
                    fear=emotions_data.get("fear", 0.0),
                    surprise=emotions_data.get("surprise", 0.0),
                    disgust=emotions_data.get("disgust", 0.0)
                )
            
            # Extract sentence-level analysis if detailed
            sentence_analysis = None
            if request.detailed and "sentence_analysis" in result:
                sentence_analysis = result.get("sentence_analysis", [])
            
            suggestions = result.get("suggestions", [])
            
            return SentimentAnalysisResponse(
                overall_sentiment=overall_sentiment,
                sentiment_score=sentiment_score,
                emotions=emotions,
                sentence_analysis=sentence_analysis,
                suggestions=suggestions
            )
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return SentimentAnalysisResponse(
                overall_sentiment="neutral",
                sentiment_score=SentimentScore(positive=0.0, neutral=1.0, negative=0.0, compound=0.0),
                suggestions=["Error analyzing sentiment"]
            )
    
    async def analyze_keyword_density(self, request: KeywordDensityRequest) -> KeywordDensityResponse:
        """Analyze keyword density in content."""
        # Tokenize content
        words = word_tokenize(request.content.lower())
        filtered_words = [word for word in words if word.isalpha() and word not in self.stop_words]
        total_words = len(filtered_words)
        
        # Calculate primary keyword density
        primary_keyword_lower = request.primary_keyword.lower()
        primary_keyword_count = len(re.findall(r'\b' + re.escape(primary_keyword_lower) + r'\b', request.content.lower()))
        primary_keyword_density = primary_keyword_count / total_words if total_words > 0 else 0
        
        # Calculate secondary keyword densities
        secondary_keyword_densities = {}
        if request.secondary_keywords:
            for keyword in request.secondary_keywords:
                keyword_lower = keyword.lower()
                keyword_count = len(re.findall(r'\b' + re.escape(keyword_lower) + r'\b', request.content.lower()))
                secondary_keyword_densities[keyword] = keyword_count / total_words if total_words > 0 else 0
        
        # Calculate keyword distribution
        sentences = sent_tokenize(request.content)
        keyword_distribution = {request.primary_keyword: []}
        
        for i, sentence in enumerate(sentences):
            if re.search(r'\b' + re.escape(primary_keyword_lower) + r'\b', sentence.lower()):
                keyword_distribution[request.primary_keyword].append(i)
        
        if request.secondary_keywords:
            for keyword in request.secondary_keywords:
                keyword_lower = keyword.lower()
                keyword_distribution[keyword] = []
                for i, sentence in enumerate(sentences):
                    if re.search(r'\b' + re.escape(keyword_lower) + r'\b', sentence.lower()):
                        keyword_distribution[keyword].append(i)
        
        # Define optimal density ranges
        optimal_density_range = {
            "primary": {"min": 0.01, "max": 0.03, "optimal": 0.02},
            "secondary": {"min": 0.005, "max": 0.015, "optimal": 0.01}
        }
        
        # Generate overoptimization warnings
        overoptimization_warnings = []
        if primary_keyword_density > optimal_density_range["primary"]["max"]:
            overoptimization_warnings.append(f"Primary keyword '{request.primary_keyword}' appears too frequently ({primary_keyword_density:.1%}). Aim for {optimal_density_range['primary']['optimal']:.1%}.")
        
        for keyword, density in secondary_keyword_densities.items():
            if density > optimal_density_range["secondary"]["max"]:
                overoptimization_warnings.append(f"Secondary keyword '{keyword}' appears too frequently ({density:.1%}). Aim for {optimal_density_range['secondary']['optimal']:.1%}.")
        
        # Generate suggestions using AI
        suggestions = await self._get_keyword_suggestions(
            request.content,
            request.primary_keyword,
            primary_keyword_density,
            secondary_keyword_densities,
            optimal_density_range
        )
        
        # Generate semantic keywords using AI
        semantic_keywords = await self._generate_semantic_keywords(request.primary_keyword) if request.primary_keyword else []
        
        return KeywordDensityResponse(
            primary_keyword_density=primary_keyword_density,
            secondary_keyword_densities=secondary_keyword_densities,
            keyword_distribution=keyword_distribution,
            optimal_density_range=optimal_density_range,
            overoptimization_warnings=overoptimization_warnings,
            suggestions=suggestions,
            semantic_keywords=semantic_keywords
        )
    
    async def generate_metadata(self, request: MetadataGeneratorRequest) -> MetadataGeneratorResponse:
        """Generate title and meta description options."""
        system_prompt = "You are an SEO metadata expert. Generate optimized title tags and meta descriptions for web content."
        
        user_prompt = f"Generate SEO-optimized title tags and meta descriptions for the following content:\n\n"
        user_prompt += f"Content: {request.content[:1000]}...\n\n"  # Limit content length
        user_prompt += f"Primary Keyword: {request.primary_keyword}\n"
        
        if request.secondary_keywords:
            user_prompt += f"Secondary Keywords: {', '.join(request.secondary_keywords)}\n"
        
        if request.brand_name:
            user_prompt += f"Brand Name: {request.brand_name}\n"
        
        user_prompt += f"Title Character Limit: {request.character_limit_title}\n"
        user_prompt += f"Description Character Limit: {request.character_limit_description}\n\n"
        
        user_prompt += "Provide your response as a JSON object with the following structure:\n"
        user_prompt += "{\n"
        user_prompt += '  "title_options": ["Title 1", "Title 2", "Title 3"],\n'
        user_prompt += '  "meta_description_options": ["Description 1", "Description 2", "Description 3"],\n'
        user_prompt += '  "title_ratings": {\n'
        user_prompt += '    "Title 1": 0.9,\n'
        user_prompt += '    "Title 2": 0.8,\n'
        user_prompt += '    "Title 3": 0.7\n'
        user_prompt += '  },\n'
        user_prompt += '  "keyword_placement_analysis": {\n'
        user_prompt += '    "primary_keyword_in_title": true,\n'
        user_prompt += '    "primary_keyword_position_title": "beginning",\n'
        user_prompt += '    "primary_keyword_in_description": true,\n'
        user_prompt += '    "secondary_keywords_in_title": 1,\n'
        user_prompt += '    "secondary_keywords_in_description": 2\n'
        user_prompt += '  },\n'
        user_prompt += '  "ctr_optimization_tips": ["Tip 1", "Tip 2", "Tip 3"]\n'
        user_prompt += '}'
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response)
            
            return MetadataGeneratorResponse(
                title_options=result.get("title_options", []),
                meta_description_options=result.get("meta_description_options", []),
                title_ratings=result.get("title_ratings", {}),
                keyword_placement_analysis=result.get("keyword_placement_analysis", {}),
                ctr_optimization_tips=result.get("ctr_optimization_tips", [])
            )
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return MetadataGeneratorResponse(
                title_options=["Error generating title options"],
                meta_description_options=["Error generating meta description options"],
                title_ratings={},
                keyword_placement_analysis={},
                ctr_optimization_tips=["Error generating CTR optimization tips"]
            )
    
    async def improve_content(self, request: ContentImproverRequest) -> ContentImproverResponse:
        """Improve content based on specified parameters."""
        system_prompt = f"You are an expert content editor specializing in {request.improvement_type} improvements."
        
        user_prompt = f"Improve the following content to make it more {request.improvement_type}:\n\n{request.content}\n\n"
        user_prompt += f"Transformation level (1-100): {request.transformation_level}\n"
        
        if request.preserve_keywords:
            user_prompt += f"Keywords to preserve: {', '.join(request.preserve_keywords)}\n"
        
        if request.target_audience:
            user_prompt += f"Target audience: {request.target_audience}\n"
        
        user_prompt += "\nProvide your response as a JSON object with the following structure:\n"
        user_prompt += "{\n"
        user_prompt += '  "improved_content": "The improved content goes here...",\n'
        user_prompt += '  "changes_summary": {\n'
        user_prompt += '    "sentence_structure_changes": 5,\n'
        user_prompt += '    "word_choice_improvements": 10,\n'
        user_prompt += '    "clarity_enhancements": 3,\n'
        user_prompt += '    "engagement_improvements": 4\n'
        user_prompt += '  },\n'
        user_prompt += '  "improvement_metrics": {\n'
        user_prompt += '    "readability_before": 65.2,\n'
        user_prompt += '    "readability_after": 72.8,\n'
        user_prompt += '    "engagement_score_before": 60,\n'
        user_prompt += '    "engagement_score_after": 75\n'
        user_prompt += '  },\n'
        user_prompt += '  "suggestions_for_further_improvement": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]\n'
        user_prompt += '}'
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=3000,
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response)
            
            return ContentImproverResponse(
                improved_content=result.get("improved_content", request.content),
                original_content=request.content,
                changes_summary=result.get("changes_summary", {}),
                improvement_metrics=result.get("improvement_metrics", {}),
                suggestions_for_further_improvement=result.get("suggestions_for_further_improvement", [])
            )
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return ContentImproverResponse(
                improved_content=request.content,
                original_content=request.content,
                changes_summary={},
                improvement_metrics={},
                suggestions_for_further_improvement=["Error improving content"]
            )
    
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
    
    async def _get_seo_suggestions(self, content: str, primary_keyword: Optional[str], content_structure: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get SEO improvement suggestions using AI."""
        system_prompt = "You are an SEO expert. Provide actionable suggestions to improve content for search engines."
        
        user_prompt = f"Analyze the following content metrics and provide SEO improvement suggestions:\n\n"
        user_prompt += f"Content Structure: {json.dumps(content_structure)}\n"
        
        if primary_keyword:
            user_prompt += f"Primary Keyword: {primary_keyword}\n"
        
        user_prompt += "\nProvide your suggestions as a JSON array with the following structure for each suggestion:\n"
        user_prompt += "[\n"
        user_prompt += "  {\n"
        user_prompt += '    "category": "content_structure|keyword_usage|readability|meta_tags|technical",\n'
        user_prompt += '    "issue": "Description of the issue",\n'
        user_prompt += '    "suggestion": "Actionable suggestion to fix the issue",\n'
        user_prompt += '    "priority": "high|medium|low"\n'
        user_prompt += "  }\n"
        user_prompt += "]"
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response)
            if isinstance(result, list):
                return result
            return []
        except json.JSONDecodeError:
            return []
    
    async def _get_readability_suggestions(self, content: str, grade_level: float, complex_word_percentage: float, passive_voice_percentage: float, target_audience: Optional[str]) -> List[str]:
        """Get readability improvement suggestions using AI."""
        system_prompt = "You are a readability expert. Provide actionable suggestions to improve content readability."
        
        user_prompt = f"Analyze the following content metrics and provide readability improvement suggestions:\n\n"
        user_prompt += f"Grade Level: {grade_level:.1f}\n"
        user_prompt += f"Complex Word Percentage: {complex_word_percentage:.1%}\n"
        user_prompt += f"Passive Voice Percentage: {passive_voice_percentage:.1%}\n"
        
        if target_audience:
            user_prompt += f"Target Audience: {target_audience}\n"
        
        user_prompt += "\nProvide your suggestions as a JSON array of strings."
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response)
            if isinstance(result, list):
                return result
            return []
        except json.JSONDecodeError:
            return []
    
    async def _get_simpler_alternatives(self, complex_words: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Get simpler alternatives for complex words using AI."""
        if not complex_words:
            return []
        
        system_prompt = "You are a vocabulary expert. Provide simpler alternatives for complex words."
        
        words = [item["word"] for item in complex_words]
        user_prompt = f"Provide simpler alternatives for the following complex words:\n\n"
        user_prompt += f"{', '.join(words)}\n\n"
        user_prompt += "Provide your response as a JSON object where keys are the complex words and values are their simpler alternatives."
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response)
            
            # Update complex_words with alternatives
            for item in complex_words:
                word = item["word"]
                if word in result:
                    item["alternative"] = result[word]
            
            return complex_words
        except json.JSONDecodeError:
            return complex_words
    
    async def _get_keyword_suggestions(self, content: str, primary_keyword: str, primary_density: float, secondary_densities: Dict[str, float], optimal_ranges: Dict[str, Dict[str, float]]) -> List[str]:
        """Get keyword usage suggestions using AI."""
        system_prompt = "You are a keyword optimization expert. Provide actionable suggestions to improve keyword usage."
        
        user_prompt = f"Analyze the following keyword metrics and provide optimization suggestions:\n\n"
        user_prompt += f"Primary Keyword: {primary_keyword}\n"
        user_prompt += f"Primary Keyword Density: {primary_density:.1%}\n"
        user_prompt += f"Optimal Primary Keyword Density Range: {optimal_ranges['primary']['min']:.1%} - {optimal_ranges['primary']['max']:.1%}\n\n"
        
        if secondary_densities:
            user_prompt += "Secondary Keywords:\n"
            for keyword, density in secondary_densities.items():
                user_prompt += f"- {keyword}: {density:.1%}\n"
            user_prompt += f"Optimal Secondary Keyword Density Range: {optimal_ranges['secondary']['min']:.1%} - {optimal_ranges['secondary']['max']:.1%}\n\n"
        
        user_prompt += "Provide your suggestions as a JSON array of strings."
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response)
            if isinstance(result, list):
                return result
            return []
        except json.JSONDecodeError:
            return []
    
    async def _generate_semantic_keywords(self, keyword: str) -> List[str]:
        """Generate semantic keywords related to the primary keyword."""
        system_prompt = "You are an SEO expert specializing in semantic keyword research."
        
        user_prompt = f"Generate a list of 15 semantic keywords related to '{keyword}'. These should be terms and phrases that are semantically related to the main keyword and would help with SEO. Provide the result as a JSON array."
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response)
            if isinstance(result, list):
                return result
            return []
        except json.JSONDecodeError:
            return []
