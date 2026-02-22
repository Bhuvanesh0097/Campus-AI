import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
ALGORITHMS = ["HS256"]


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Validate Supabase JWT and return the user payload.
    Returns dict with 'sub' (user_id), 'email', 'role', etc.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=ALGORITHMS,
            options={"verify_aud": False},
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no user ID",
            )
        return {
            "user_id": user_id,
            "email": payload.get("email", ""),
            "role": payload.get("role", "authenticated"),
        }
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """Require admin role for protected endpoints."""
    from app.database import get_supabase

    db = get_supabase()
    result = (
        db.table("profiles")
        .select("role")
        .eq("id", user["user_id"])
        .single()
        .execute()
    )
    if not result.data or result.data.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    user["db_role"] = "admin"
    return user
