from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.api.deps import get_current_user
from app.services.aiplanner import generate_tasks
from app.lib.db import supabase
from app.services.code_explainer import analyze_code, AIServiceError
from app.models.aimodel import CodeRequest, CodeResponse
from uuid import UUID

router = APIRouter(prefix="/ai", tags=["ai"])

class AIPlanRequest(BaseModel):
    title: str
    description: Optional[str] = None

@router.post("/plan/{project_id}")
async def generate_project_tasks(
    project_id: UUID,
    data: AIPlanRequest,
    user=Depends(get_current_user)
):
    user_id = user["user_id"]

    project = supabase.table("projects") \
        .select("id") \
        .eq("id", str(project_id)) \
        .eq("user_id", user_id) \
        .execute()

    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        tasks = await generate_tasks(data.title, data.description)
    except Exception as e:
        print("AI generation error:", str(e))
        raise HTTPException(status_code=500, detail="AI generation failed")

    if not tasks:
        raise HTTPException(status_code=500, detail="No tasks generated")

    task_payload = [
        {
            "project_id": str(project_id), 
            "title": task,
            "description": None,
            "status": "todo",
            "priority": "medium",
            "order_index": index,
            "ai_generated": True
        }
        for index, task in enumerate(tasks)
    ]

    res = supabase.table("tasks").insert(task_payload).execute()

    return {
        "message": "Tasks generated successfully",
        "tasks": res.data
    }

@router.post("/explain-code", response_model=CodeResponse)
async def explain_code(
    payload: CodeRequest,
    user=Depends(get_current_user)
):
    try:
        result = await analyze_code(payload.code, payload.language)

        return CodeResponse(
            explanation=result.get("explanation", ""),
            issues=result.get("issues", []),
            improvements=result.get("improvements", [])
        )

    except AIServiceError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    