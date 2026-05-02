from app.lib.db import supabase
from app.api.deps import get_current_user
from fastapi import APIRouter, Depends, HTTPException, Header
from app.models.projectmodel import ProjectModel
from uuid import UUID

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/")
async def create_project(data: ProjectModel, user=Depends(get_current_user),authorization: str = Header(None)):
    try:
        user_id = user["user_id"]

        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        project_data = {
            "name": data.get("name"),
            "description": data.get("description"),
            "user_id": user_id
        }

        res = supabase.table("projects").insert(project_data).execute()

        return {
        "message": "Project created",
        "data": res.data[0],
        "auth": authorization
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_projects(user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]

        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        res = supabase.table("projects").select("*").eq("user_id", user_id).execute()

        return {
        "message": "Projects retrieved",
        "data": res.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{project_id}")
async def get_project(project_id: UUID, user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]

        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        res = supabase.table("projects").select("*").eq("id", str(project_id)).eq("user_id", user_id).execute()

        if not res.data:
            raise HTTPException(status_code=404, detail="Project not found")

        return {
        "message": "Project retrieved",
        "data": res.data[0]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/{project_id}")
async def delete_project(project_id: UUID, user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]

        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        res = supabase.table("projects").delete().eq("id", str(project_id)).eq("user_id", user_id).execute()

        if res.count == 0:
            raise HTTPException(status_code=404, detail="Project not found")

        return {
        "message": "Project deleted",
        "data": res.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    