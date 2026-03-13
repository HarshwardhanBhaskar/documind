"""
routers/auth.py
──────────────────────────────────────────────────────────────────────────────
Authentication endpoints using Supabase Auth.

Endpoints
─────────
POST /auth/signup   – create a new account
POST /auth/login    – sign in and receive JWT
POST /auth/logout   – invalidate the current session
POST /auth/refresh  – refresh access token
GET  /auth/user     – get the authenticated user's profile
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database.models import (
    LoginRequest,
    MessageResponse,
    SignUpRequest,
    TokenResponse,
    UserResponse,
)
from database.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _extract_token(credentials: HTTPAuthorizationCredentials) -> str:
    return credentials.credentials


def _supabase_error(e: Exception, fallback: str = "Authentication error") -> HTTPException:
    """Convert a Supabase exception into a clean FastAPI HTTPException."""
    msg = str(e)
    if "Invalid login credentials" in msg:
        return HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")
    if "User already registered" in msg:
        return HTTPException(status.HTTP_409_CONFLICT, "Email already in use.")
    if "expired" in msg.lower():
        return HTTPException(status.HTTP_401_UNAUTHORIZED, "Token expired – please log in again.")
    return HTTPException(status.HTTP_400_BAD_REQUEST, fallback)


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new DocuMind account",
)
async def signup(body: SignUpRequest):
    """
    Register a new user with Supabase Auth.
    Returns an access token on success.
    """
    try:
        response = supabase.auth.sign_up(
            {
                "email":    body.email,
                "password": body.password,
                "options":  {"data": {"full_name": body.full_name}},
            }
        )
    except Exception as e:
        raise _supabase_error(e, "Could not create account.") from e

    session = response.session
    user    = response.user

    if session is None or user is None:
        # Supabase may require email confirmation
        raise HTTPException(
            status.HTTP_202_ACCEPTED,
            "Account created. Please confirm your email before logging in.",
        )

    return TokenResponse(
        access_token=session.access_token,
        expires_in=session.expires_in or 3600,
        refresh_token=session.refresh_token,
        user_id=str(user.id),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Sign in and receive a JWT",
)
async def login(body: LoginRequest):
    """Authenticate with email + password via Supabase Auth."""
    try:
        response = supabase.auth.sign_in_with_password(
            {"email": body.email, "password": body.password}
        )
    except Exception as e:
        raise _supabase_error(e, "Login failed.") from e

    session = response.session
    user    = response.user

    if session is None or user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Login failed – no session returned.")

    return TokenResponse(
        access_token=session.access_token,
        expires_in=session.expires_in or 3600,
        refresh_token=session.refresh_token,
        user_id=str(user.id),
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Sign out the current user",
)
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Invalidate the current Supabase session."""
    try:
        supabase.auth.sign_out()
    except Exception as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e)) from e

    return MessageResponse(message="Logged out successfully.")


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh an expired access token",
)
async def refresh_token(refresh_token_str: str):
    """Use a refresh token to get a new access token."""
    try:
        response = supabase.auth.refresh_session(refresh_token_str)
    except Exception as e:
        raise _supabase_error(e, "Could not refresh token.") from e

    session = response.session
    user    = response.user

    if session is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token refresh failed.")

    return TokenResponse(
        access_token=session.access_token,
        expires_in=session.expires_in or 3600,
        refresh_token=session.refresh_token,
        user_id=str(user.id) if user else "",
    )


@router.get(
    "/user",
    response_model=UserResponse,
    summary="Get the currently authenticated user",
)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Returns the profile of the bearer-token owner."""
    token = _extract_token(credentials)
    try:
        response = supabase.auth.get_user(token)
    except Exception as e:
        raise _supabase_error(e, "Could not fetch user.") from e

    user = response.user
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token.")

    return UserResponse(
        id=str(user.id),
        email=user.email or "",
        full_name=user.user_metadata.get("full_name") if user.user_metadata else None,
        created_at=user.created_at,
    )
