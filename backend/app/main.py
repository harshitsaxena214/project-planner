from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.deps import get_current_user
from app.lib.db import supabase
from app.api.routes.projects import router as projects_router
from app.api.routes.ai import router as ai_router
from app.api.routes.tasks import router as tasks_router
from app.api.routes.user import router as user_router
from app.api.webhooks.clerk import router as webhook_router
import os

app = FastAPI()

origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "App is listening"}

app.include_router(user_router)
app.include_router(webhook_router)
app.include_router(projects_router)
app.include_router(ai_router)
app.include_router(tasks_router)

@app.get("/me")
async def get_me(user=Depends(get_current_user)):
    return {
        "status": "Clerk auth working",
        "user_id": user.get("user_id"),
        "email": user.get("email"),
        "full_payload": user
    }