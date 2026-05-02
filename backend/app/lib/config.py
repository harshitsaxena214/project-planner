import os
from dotenv import load_dotenv

load_dotenv()

CLERK_ISSUER = os.getenv("CLERK_ISSUER")
JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"