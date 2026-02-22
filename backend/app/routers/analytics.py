from fastapi import APIRouter, Depends
from app.auth import require_admin
from app.database import get_supabase

router = APIRouter()


@router.get("/summary")
async def get_analytics_summary(user: dict = Depends(require_admin)):
    """Get feedback analytics summary (admin only)."""
    db = get_supabase()

    # Get all feedback
    result = db.table("feedback_responses").select("*").execute()
    data = result.data or []

    total = len(data)
    if total == 0:
        return {
            "total_responses": 0,
            "average_rating": 0,
            "by_category": {},
            "by_sentiment": {},
            "recent_feedback": [],
        }

    # Calculate metrics
    avg_rating = sum(r["rating"] for r in data) / total

    # Group by category
    by_category = {}
    for r in data:
        cat = r["category"]
        if cat not in by_category:
            by_category[cat] = {"count": 0, "total_rating": 0}
        by_category[cat]["count"] += 1
        by_category[cat]["total_rating"] += r["rating"]

    for cat in by_category:
        by_category[cat]["average_rating"] = round(
            by_category[cat]["total_rating"] / by_category[cat]["count"], 2
        )

    # Group by sentiment
    by_sentiment = {"positive": 0, "neutral": 0, "negative": 0}
    for r in data:
        sentiment = r.get("sentiment", "neutral")
        by_sentiment[sentiment] = by_sentiment.get(sentiment, 0) + 1

    # Recent feedback (last 10)
    recent = sorted(data, key=lambda x: x.get("created_at", ""), reverse=True)[:10]

    return {
        "total_responses": total,
        "average_rating": round(avg_rating, 2),
        "by_category": by_category,
        "by_sentiment": by_sentiment,
        "recent_feedback": recent,
    }


@router.get("/sentiment")
async def get_sentiment_breakdown(user: dict = Depends(require_admin)):
    """Get sentiment analysis breakdown (admin only)."""
    db = get_supabase()
    result = db.table("feedback_responses").select("sentiment, category, rating, created_at").execute()
    data = result.data or []

    # Group by category and sentiment
    breakdown = {}
    for r in data:
        cat = r["category"]
        sent = r.get("sentiment", "neutral")
        if cat not in breakdown:
            breakdown[cat] = {"positive": 0, "neutral": 0, "negative": 0}
        breakdown[cat][sent] += 1

    return {"sentiment_breakdown": breakdown, "total": len(data)}


@router.get("/ratings-over-time")
async def get_ratings_over_time(user: dict = Depends(require_admin)):
    """Get average ratings grouped by date (admin only)."""
    db = get_supabase()
    result = (
        db.table("feedback_responses")
        .select("rating, created_at")
        .order("created_at", desc=False)
        .execute()
    )
    data = result.data or []

    # Group by date
    by_date = {}
    for r in data:
        date = r["created_at"][:10]  # Extract YYYY-MM-DD
        if date not in by_date:
            by_date[date] = {"total": 0, "count": 0}
        by_date[date]["total"] += r["rating"]
        by_date[date]["count"] += 1

    timeline = [
        {
            "date": date,
            "average_rating": round(vals["total"] / vals["count"], 2),
            "count": vals["count"],
        }
        for date, vals in sorted(by_date.items())
    ]

    return {"timeline": timeline}
