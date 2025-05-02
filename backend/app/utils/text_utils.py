import re
from typing import Optional

def extract_meta_description(content: str) -> Optional[str]:
    """Extract meta description from content if present."""
    meta_pattern = re.compile(r"Meta Description:?\s*(.*?)(?:\n\n|\n$|$)", re.IGNORECASE | re.DOTALL)
    match = meta_pattern.search(content)
    
    if match:
        description = match.group(1).strip()
        # Limit to 160 characters
        if len(description) > 160:
            description = description[:157] + "..."
        return description
    
    return None

def count_words(text: str) -> int:
    """Count the number of words in a text."""
    if not text:
        return 0
    
    # Split by whitespace and count non-empty words
    words = [word for word in text.split() if word.strip()]
    return len(words)
