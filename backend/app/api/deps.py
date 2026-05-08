from fastapi import Request, HTTPException
import httpx
from jose import jwt
from app.lib.config import JWKS_URL

jwks_cache = None


async def get_jwks():
    global jwks_cache
    if not jwks_cache:
        async with httpx.AsyncClient() as client:
            response = await client.get(JWKS_URL)
            jwks_cache = response.json()
    return jwks_cache


def get_public_key(token: str, jwks: dict):
    try:
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")

        for key in jwks["keys"]:
            if key["kid"] == kid:
                return key

        raise Exception("Public key not found")

    except Exception as e:
        print("KEY ERROR:", e)
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_current_user(request: Request):
    auth = request.headers.get("Authorization")

    if not auth:
        raise HTTPException(status_code=401, detail="No token provided")

    parts = auth.split()
    if len(parts) != 2 or parts[0] != "Bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    token = parts[1]

    jwks = await get_jwks()

    try:
        key = get_public_key(token, jwks)

        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )

    except Exception as e:
        print("JWT ERROR:", e)
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"user_id": payload.get("sub")}