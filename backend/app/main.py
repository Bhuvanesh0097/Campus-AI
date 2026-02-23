from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, study_buddy, placement, feedback, analytics

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "AI Chatbot API is running"}


# Register routers
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(study_buddy.router, prefix="/api/study", tags=["Study Buddy"])
app.include_router(placement.router, prefix="/api/placement", tags=["Placement Prep"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
