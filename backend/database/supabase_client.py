"""
database/supabase_client.py
──────────────────────────────────────────────────────────────────────────────
Singleton Supabase client.  All other modules import `supabase` from here so
the client is initialised exactly once at startup.

Credentials are read exclusively from environment variables – never hardcoded.
"""

import os
from functools import lru_cache

from dotenv import load_dotenv
from supabase import Client, create_client

# Load .env (no-op when running in a real deployment that injects env vars)
load_dotenv()


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    """Return a cached Supabase client instance."""
    url: str | None = os.getenv("SUPABASE_URL")
    key: str | None = os.getenv("SUPABASE_ANON_KEY")

    if not url or not key:
        raise EnvironmentError(
            "SUPABASE_URL and SUPABASE_ANON_KEY must be set in the environment. "
            "Copy .env.example to .env and fill in your project values."
        )

    return create_client(url, key)


@lru_cache(maxsize=1)
def get_service_client() -> Client:
    """
    Return a Supabase client initialised with the service-role key.
    Use this only for privileged server-side operations (e.g., storage uploads,
    admin reads).  Do NOT expose this key to the frontend.
    """
    url: str | None = os.getenv("SUPABASE_URL")
    service_key: str | None = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not service_key:
        raise EnvironmentError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
        )

    return create_client(url, service_key)


# Convenience aliases used throughout the codebase
supabase: Client = get_supabase_client()
service_supabase: Client = get_service_client()
