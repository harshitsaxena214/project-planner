from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.deps import get_current_user
from app.lib.db import supabase
from app.api.routes.projects import router as projects_router
from app.api.routes.ai import router as ai_router

app = FastAPI()

origins = [
    "http://localhost:3000",  # Next.js frontend
]

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

app.include_router(projects_router)
app.include_router(ai_router)

@app.get("/me")
async def get_me(user=Depends(get_current_user)):
    return {
        "status": "Clerk auth working",
        "user_id": user.get("user_id"),
        "email": user.get("email"),
        "full_payload": user
    }



@app.post("/test-db")
async def test_db():
    res = supabase.table("projects").insert({
        "user_id": "test_user",
        "title": "Test Project"
    }).execute()

    return res.data