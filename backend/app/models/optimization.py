from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Union

# SEO Analysis Models
class SEOAnalysisRequest(BaseModel):
    content: str
    url: Optional[str] = None
    primary_keyword: Optional[str] = None
    secondary_keywords: Optional[List[str]] = None
    target_audience: Optional[str] = None

class SEOAnalysisResponse(BaseModel):
    overall_score: int
    keyword_density: Dict[str, float]
    readability_score: float
    content_structure: Dict[str, Any]
    meta_tags: Dict[str, Any]
    suggestions: List[Dict[str, Any]]
    competitor_comparison: Optional[Dict[str, Any]] = None

# Readability Models
class ReadabilityRequest(BaseModel):
    content: str
    target_audience: Optional[str] = None

class ReadabilityMetrics(BaseModel):
    flesch_kincaid: float
    gunning_fog: float
    smog: float
    average_grade_level: float
    average_sentence_length: float
    complex_word_percentage: float
    passive_voice_percentage: float

class ReadabilityResponse(BaseModel):
    metrics: ReadabilityMetrics
    grade_level: str
    complex_words: List[Dict[str, str]]
    long_sentences: List[Dict[str, Any]]
    passive_sentences: List[Dict[str, Any]]
    suggestions: List[str]

# Grammar and Spelling Models
class GrammarCheckRequest(BaseModel):
    content: str
    check_style: bool = True
    check_punctuation: bool = True
    check_spelling: bool = True

class GrammarIssue(BaseModel):
    type: str  # grammar, spelling, style, punctuation
    text: str
    offset: int
    length: int
    suggestions: List[str]
    explanation: Optional[str] = None

class GrammarCheckResponse(BaseModel):
    issues: List[GrammarIssue]
    corrected_text: str
    total_issues: int
    statistics: Dict[str, int]

# Sentiment Analysis Models
class SentimentAnalysisRequest(BaseModel):
    content: str
    detailed: bool = False

class SentimentScore(BaseModel):
    positive: float
    neutral: float
    negative: float
    compound: float

class EmotionScore(BaseModel):
    joy: float
    sadness: float
    anger: float
    fear: float
    surprise: float
    disgust: float

class SentimentAnalysisResponse(BaseModel):
    overall_sentiment: str
    sentiment_score: SentimentScore
    emotions: Optional[EmotionScore] = None
    sentence_analysis: Optional[List[Dict[str, Any]]] = None
    suggestions: List[str]

# Keyword Density Models
class KeywordDensityRequest(BaseModel):
    content: str
    primary_keyword: str
    secondary_keywords: Optional[List[str]] = None
    analyze_competitors: bool = False
    competitor_urls: Optional[List[str]] = None

class KeywordDensityResponse(BaseModel):
    primary_keyword_density: float
    secondary_keyword_densities: Dict[str, float]
    keyword_distribution: Dict[str, List[int]]
    optimal_density_range: Dict[str, Dict[str, float]]
    overoptimization_warnings: List[str]
    suggestions: List[str]
    semantic_keywords: Optional[List[str]] = None

# Title and Meta Description Models
class MetadataGeneratorRequest(BaseModel):
    content: str
    primary_keyword: str
    secondary_keywords: Optional[List[str]] = None
    brand_name: Optional[str] = None
    character_limit_title: int = 60
    character_limit_description: int = 160

class MetadataGeneratorResponse(BaseModel):
    title_options: List[str]
    meta_description_options: List[str]
    title_ratings: Dict[str, float]
    keyword_placement_analysis: Dict[str, Any]
    ctr_optimization_tips: List[str]

# Content Improver Models
class ContentImproverRequest(BaseModel):
    content: str
    improvement_type: str  # clarity, engagement, professional, simple
    transformation_level: int = 50  # 1-100
    preserve_keywords: Optional[List[str]] = None
    target_audience: Optional[str] = None

class ContentImproverResponse(BaseModel):
    improved_content: str
    original_content: str
    changes_summary: Dict[str, Any]
    improvement_metrics: Dict[str, Any]
    suggestions_for_further_improvement: List[str]
