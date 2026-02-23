from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, study_buddy, placement, feedback, analytics
import os

app = FastAPI(
    title="AI Chatbot API",
    description="College AI Chatbot — Study Buddy, Placement Prep & Feedback",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],             # Allow all origins (safe with JWT auth)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    groq = os.getenv("GROQ_API_KEY", "")
    return {
        "status": "ok",
        "message": "AI Chatbot API is running",
        "groq_configured": bool(groq),
        "groq_key_prefix": groq[:8] + "..." if len(groq) > 8 else "NOT SET",
    }


# Register routers
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(study_buddy.router, prefix="/api/study", tags=["Study Buddy"])
app.include_router(placement.router, prefix="/api/placement", tags=["Placement Prep"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
