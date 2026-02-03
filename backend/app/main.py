"""PEP Backend API - FastAPI Application."""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.supabase import get_supabase
from app.core.security import get_current_user

# Initialize FastAPI app
app = FastAPI(
    title="PEP API",
    description="Project Enhancement Platform - RFI Management API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:4200",  # Angular dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict:
    """Root endpoint - health check."""
    return {
        "status": "healthy",
        "service": "PEP API",
        "version": "0.1.0",
    }


@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint for Cloud Run."""
    return {"status": "ok"}


@app.get("/api/me")
async def get_me(user: dict = Depends(get_current_user)) -> dict:
    """
    Get current authenticated user (minimal).

    Requires: JWT + profile not deleted + org active (get_current_user).
    Returns: id, email, created_at from JWT only.
    For full user info (display_name, role, org_name, org_type, status) and
    login-flow status codes (ONBOARDING_INCOMPLETE, etc.), use GET /api/v1/auth/me.
    """
    return {
        "id": user.get("id"),
        "email": user.get("email"),
        "created_at": user.get("created_at"),
    }


@app.get("/api/db-check")
async def db_check() -> dict:
    """Check Supabase database connection."""
    try:
        supabase = get_supabase()
        # Simple query to verify connection
        result = supabase.table("profiles").select("id").limit(1).execute()
        return {
            "status": "connected",
            "message": "Successfully connected to Supabase",
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }


# Include routers
from app.api.routes import users, onboarding, invitations, members, auth
from app.api.routes.admin import applications as admin_applications
from app.api.routes.admin import organizations as admin_organizations

app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(onboarding.router, prefix="/api/v1/auth", tags=["Onboarding"])
app.include_router(invitations.router, prefix="/api/invitations", tags=["Invitations"])
app.include_router(
    members.router,
    prefix="/api/organizations",
    tags=["Members"],
)
app.include_router(
    admin_applications.router,
    prefix="/api/admin/applications",
    tags=["Admin - Applications"],
)
app.include_router(
    admin_organizations.router,
    prefix="/api/admin/organizations",
    tags=["Admin - Organizations"],
)

# TODO: Add more routers
# from app.api.routes import projects, rfi, chat, slides, webhooks
# app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
# app.include_router(rfi.router, prefix="/api/rfi", tags=["RFI"])
# app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
# app.include_router(slides.router, prefix="/api/slides", tags=["Slides"])
# app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])
