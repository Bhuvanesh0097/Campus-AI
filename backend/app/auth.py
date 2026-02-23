import os
import httpx
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, jwk
from jose.utils import base64url_decode
import json

load_dotenv()

security = HTTPBearer()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

# Cache for JWKS keys
_jwks_cache = None


def _get_jwks():
    """Fetch and cache JWKS from Supabase for ES256 token verification."""
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    if not SUPABASE_URL:
        return None

    # Supabase exposes JWKS at this endpoint
    jwks_url = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
    try:
        response = httpx.get(jwks_url, timeout=10)
        if response.status_code == 200:
            _jwks_cache = response.json()
            return _jwks_cache
    except Exception as e:
        print(f"[AUTH] Failed to fetch JWKS: {e}")

    return None


def _get_public_key(token):
    """Get the appropriate public key from JWKS to verify the token."""
    try:
        header = jwt.get_unverified_header(token)
    except JWTError:
        return None, None

    alg = header.get("alg", "")
    kid = header.get("kid", "")

    # If HS256, use the JWT secret directly
    if alg == "HS256":
        return SUPABASE_JWT_SECRET, ["HS256"]

    # If ES256, fetch the public key from JWKS
    if alg == "ES256":
        jwks = _get_jwks()
        if not jwks or "keys" not in jwks:
            return None, None

        for key_data in jwks["keys"]:
            if key_data.get("kid") == kid or not kid:
                try:
                    from jwt import PyJWK
                    jwk_obj = PyJWK(key_data)
                    return jwk_obj.key, ["ES256"]
                except ImportError:
                    # Fallback: construct the key manually using jose
                    from jose.backends import ECKey
                    key = ECKey(key_data, algorithm="ES256")
                    return key, ["ES256"]
                except Exception as e:
                    print(f"[AUTH] Failed to construct key: {e}")

    return None, None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Validate Supabase JWT and return the user payload.
    Supports both HS256 (service/anon keys) and ES256 (user session tokens).
    Returns dict with 'sub' (user_id), 'email', 'role', etc.
    """
    token = credentials.credentials
    try:
        # Determine the right key and algorithm based on token header
        key, algorithms = _get_public_key(token)

        if key is None or algorithms is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to determine token signing key",
            )

        payload = jwt.decode(
            token,
            key,
            algorithms=algorithms,
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
