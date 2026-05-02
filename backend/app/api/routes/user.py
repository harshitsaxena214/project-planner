from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.lib.db import supabase
from app.lib.clerk import clerk

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/sync-user")
async def sync_user(user=Depends(get_current_user)):
    user_id = user["user_id"]

    existing = supabase.table("users") \
        .select("*") \
        .eq("clerk_user_id", user_id) \
        .execute()

    if not existing.data:
        clerk_user = clerk.users.get(user_id=user_id)

        supabase.table("users").insert({
            "clerk_user_id": user_id,
            "email": clerk_user.email_addresses[0].email_address if clerk_user.email_addresses else None,
            "name": clerk_user.first_name
        }).execute()

    return {"message": "User synced",
            "user_id": user_id
            }