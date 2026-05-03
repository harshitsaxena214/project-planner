from fastapi import APIRouter, Request, HTTPException
from svix.webhooks import Webhook
import os
import json
from app.lib.db import supabase

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

CLERK_WEBHOOK_SECRET = os.getenv("CLERK_WEBHOOK_SECRET")


@router.post("/clerk")
async def clerk_webhook(request: Request):
    payload = await request.body()
    headers = request.headers

    svix_id = headers.get("svix-id")
    svix_timestamp = headers.get("svix-timestamp")
    svix_signature = headers.get("svix-signature")

    if not svix_id or not svix_timestamp or not svix_signature:
        raise HTTPException(status_code=400, detail="Missing headers")

    try:
        wh = Webhook(CLERK_WEBHOOK_SECRET)
        event = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    data = json.loads(payload)

    if data["type"] == "user.created":
        user = data["data"]

        supabase.table("users").insert({
            "clerk_user_id": user["id"],
            "email": user["email_addresses"][0]["email_address"] if user["email_addresses"] else None,
            "name": user.get("first_name")
        }).execute()

    return {"status": "ok"}