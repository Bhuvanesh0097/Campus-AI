from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.auth import get_current_user
from app.database import get_supabase
from app.services.gemini import generate_response

router = APIRouter()


class CreateSessionRequest(BaseModel):
    module: str  # study_buddy, placement_prep, feedback
    title: str = "New Chat"


class SendMessageRequest(BaseModel):
    content: str


@router.post("/sessions")
async def create_session(
    req: CreateSessionRequest, user: dict = Depends(get_current_user)
):
    """Create a new chat session."""
    db = get_supabase()
    result = (
        db.table("chat_sessions")
        .insert(
            {
                "user_id": user["user_id"],
                "module": req.module,
                "title": req.title,
            }
        )
        .execute()
    )
    return {"session": result.data[0] if result.data else None}


@router.get("/sessions")
async def list_sessions(user: dict = Depends(get_current_user)):
    """List all chat sessions for the current user."""
    db = get_supabase()
    result = (
        db.table("chat_sessions")
        .select("*")
        .eq("user_id", user["user_id"])
        .order("created_at", desc=True)
        .execute()
    )
    return {"sessions": result.data}


@router.get("/sessions/{session_id}/messages")
async def get_messages(session_id: str, user: dict = Depends(get_current_user)):
    """Get all messages in a chat session."""
    db = get_supabase()
    # Verify session belongs to user
    session = (
        db.table("chat_sessions")
        .select("*")
        .eq("id", session_id)
        .eq("user_id", user["user_id"])
        .single()
        .execute()
    )
    if not session.data:
        return {"error": "Session not found"}, 404

    messages = (
        db.table("chat_messages")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at", desc=False)
        .execute()
    )
    return {"messages": messages.data}


@router.post("/sessions/{session_id}/messages")
async def send_message(
    session_id: str,
    req: SendMessageRequest,
    user: dict = Depends(get_current_user),
):
    """Send a message and get AI response."""
    db = get_supabase()

    # Verify session belongs to user
    session = (
        db.table("chat_sessions")
        .select("*")
        .eq("id", session_id)
        .eq("user_id", user["user_id"])
        .single()
        .execute()
    )
    if not session.data:
        return {"error": "Session not found"}, 404

    # Save user message
    db.table("chat_messages").insert(
        {
            "session_id": session_id,
            "role": "user",
            "content": req.content,
        }
    ).execute()

    # Get previous messages for context
    prev_messages = (
        db.table("chat_messages")
        .select("role, content")
        .eq("session_id", session_id)
        .order("created_at", desc=False)
        .limit(10)
        .execute()
    )

    # Build conversation context
    context = "\n".join(
        [f"{m['role']}: {m['content']}" for m in (prev_messages.data or [])]
    )

    # Generate AI response
    module = session.data.get("module", "general")
    system_prompt = _get_system_prompt(module)
    full_prompt = f"{system_prompt}\n\nConversation so far:\n{context}\n\nUser: {req.content}\n\nAssistant:"

    ai_response = await generate_response(full_prompt)

    # Save AI response
    db.table("chat_messages").insert(
        {
            "session_id": session_id,
            "role": "assistant",
            "content": ai_response,
        }
    ).execute()

    # Update session title if first message
    if len(prev_messages.data or []) <= 1:
        short_title = req.content[:50] + ("..." if len(req.content) > 50 else "")
        db.table("chat_sessions").update({"title": short_title}).eq(
            "id", session_id
        ).execute()

    return {
        "user_message": req.content,
        "assistant_message": ai_response,
    }


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str, user: dict = Depends(get_current_user)):
    """Delete a chat session and its messages."""
    db = get_supabase()
    db.table("chat_messages").delete().eq("session_id", session_id).execute()
    db.table("chat_sessions").delete().eq("id", session_id).eq(
        "user_id", user["user_id"]
    ).execute()
    return {"status": "deleted"}


def _get_system_prompt(module: str) -> str:
    prompts = {
        "study_buddy": """You are Study Buddy, an AI learning assistant. Help students understand concepts, 
explain topics clearly, provide examples, and assist with study-related questions. 
Be encouraging and educational.""",
        "placement_prep": """You are a Placement Preparation Assistant. Help students prepare for job interviews, 
aptitude tests, and career readiness. Provide practical advice, practice questions, 
and constructive feedback.""",
        "feedback": """You are a Feedback Collection Assistant. Help users provide structured feedback 
about courses, faculty, or events. Ask follow-up questions to get detailed responses. 
Be professional and neutral.""",
    }
    return prompts.get(module, "You are a helpful AI assistant.")
