from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.auth import get_current_user
from app.database import get_supabase
from app.services.sentiment import analyze_sentiment

router = APIRouter()


class FeedbackRequest(BaseModel):
    category: str  # course, faculty, event, general
    subject: str
    rating: int  # 1-5
    comments: str = ""


@router.post("/submit")
async def submit_feedback(
    req: FeedbackRequest, user: dict = Depends(get_current_user)
):
    """Submit structured feedback."""
    if req.rating < 1 or req.rating > 5:
        return {"error": "Rating must be between 1 and 5"}, 400

    sentiment = analyze_sentiment(req.comments)

    db = get_supabase()
    result = (
        db.table("feedback_responses")
        .insert(
            {
                "user_id": user["user_id"],
                "category": req.category,
                "subject": req.subject,
                "rating": req.rating,
                "comments": req.comments,
                "sentiment": sentiment,
            }
        )
        .execute()
    )
    return {
        "feedback": result.data[0] if result.data else None,
        "detected_sentiment": sentiment,
        "message": "Feedback submitted successfully!",
    }


@router.get("/my-responses")
async def get_my_responses(user: dict = Depends(get_current_user)):
    """Get the current user's feedback submissions."""
    db = get_supabase()
    result = (
        db.table("feedback_responses")
        .select("*")
        .eq("user_id", user["user_id"])
        .order("created_at", desc=True)
        .execute()
    )
    return {"responses": result.data}
