from fastapi import FastAPI, Request
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
    return {"status": "ok", "message": "AI Chatbot API is running"}


@app.get("/api/debug-env")
async def debug_env():
    """Temporary debug endpoint — REMOVE after fixing JWT issue."""
    jwt_secret = os.getenv("SUPABASE_JWT_SECRET", "")
    supabase_url = os.getenv("SUPABASE_URL", "")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    return {
        "jwt_secret_loaded": bool(jwt_secret),
        "jwt_secret_length": len(jwt_secret),
        "jwt_secret_first5": jwt_secret[:5] if jwt_secret else "EMPTY",
        "supabase_url_loaded": bool(supabase_url),
        "service_key_loaded": bool(service_key),
    }


@app.post("/api/debug-token")
async def debug_token(request: Request):
    """Temporary debug endpoint — REMOVE after fixing JWT issue."""
    from jose import jwt, JWTError
    auth_header = request.headers.get("authorization", "")
    if not auth_header.startswith("Bearer "):
        return {"error": "No Bearer token in Authorization header"}

    token = auth_header.split(" ", 1)[1]
    jwt_secret = os.getenv("SUPABASE_JWT_SECRET", "")

    # Step 1: Read token header without verification
    try:
        header = jwt.get_unverified_header(token)
    except Exception as e:
        return {"error": f"Cannot read token header: {str(e)}"}

    # Step 2: Read token claims without verification
    try:
        claims = jwt.get_unverified_claims(token)
    except Exception as e:
        claims = {"error": str(e)}

    # Step 3: Try to decode with the secret
    try:
        payload = jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        decode_result = {"success": True, "sub": payload.get("sub")}
    except JWTError as e:
        decode_result = {"success": False, "error": str(e)}

    return {
        "token_header": header,
        "token_claims_keys": list(claims.keys()) if isinstance(claims, dict) else claims,
        "jwt_secret_length": len(jwt_secret),
        "jwt_secret_first5": jwt_secret[:5] if jwt_secret else "EMPTY",
        "decode_result": decode_result,
    }


# Register routers
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(study_buddy.router, prefix="/api/study", tags=["Study Buddy"])
app.include_router(placement.router, prefix="/api/placement", tags=["Placement Prep"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
