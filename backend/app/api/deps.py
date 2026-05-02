from fastapi import Request, HTTPException
import httpx
from jose import jwt
from app.lib.config import JWKS_URL
from app.lib.db import supabase
from app.lib.clerk import clerk

jwks_cache = None

async def get_jwks():
    global jwks_cache
    if not jwks_cache:
        async with httpx.AsyncClient() as client:
            jwks_cache = (await client.get(JWKS_URL)).json()
    return jwks_cache


async def get_current_user(request: Request):
    auth = request.headers.get("Authorization")

    if not auth:
        raise HTTPException(401, "No token")

    token = auth.split(" ")[1]

    jwks = await get_jwks()

    try:
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except Exception:
        raise HTTPException(401, "Invalid token")

    user_id = payload["sub"]

    existing = supabase.table("users") \
        .select("*") \
        .eq("clerk_user_id", user_id) \
        .execute()

    if not existing.data:
        user = clerk.users.get(user_id=user_id)

        email = None
        if user.email_addresses:
            email = user.email_addresses[0].email_address

        name = user.first_name

        supabase.table("users").insert({
            "clerk_user_id": user_id,
            "email": email,
            "name": name
        }).execute()

    return {"user_id": user_id}