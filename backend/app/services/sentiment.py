POSITIVE_WORDS = {
    "good", "great", "excellent", "amazing", "wonderful", "fantastic",
    "helpful", "clear", "engaging", "informative", "outstanding",
    "best", "love", "enjoy", "impressed", "recommend", "perfect",
    "brilliant", "awesome", "superb", "liked", "satisfied", "happy",
    "useful", "effective", "efficient", "well", "positive", "nice",
}

NEGATIVE_WORDS = {
    "bad", "poor", "terrible", "awful", "horrible", "worst",
    "boring", "confusing", "unclear", "unhelpful", "disappointing",
    "waste", "hate", "dislike", "frustrated", "difficult", "hard",
    "slow", "useless", "ineffective", "negative", "wrong", "fail",
    "annoying", "complicated", "issue", "problem", "lacking",
}


def analyze_sentiment(text: str) -> str:
    """
    Simple keyword-based sentiment analysis.
    Returns: 'positive', 'negative', or 'neutral'
    """
    if not text:
        return "neutral"

    words = set(text.lower().split())
    pos_count = len(words & POSITIVE_WORDS)
    neg_count = len(words & NEGATIVE_WORDS)

    if pos_count > neg_count:
        return "positive"
    elif neg_count > pos_count:
        return "negative"
    else:
        return "neutral"
