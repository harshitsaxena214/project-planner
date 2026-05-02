from app.lib.db import supabase
from app.api.deps import get_current_user
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/project/{project_id}")
async def get_tasks(project_id: int, user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        project = supabase.table("projects") \
            .select("id") \
            .eq("id", project_id) \
            .eq("user_id", user_id) \
            .execute()

        if not project.data:
            raise HTTPException(status_code=404, detail="Project not found")

        res = supabase.table("tasks") \
            .select("*") \
            .eq("project_id", project_id) \
            .execute()

        return {
            "message": "Tasks retrieved",
            "data": res.data
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )

@router.get("/{task_id}")
async def get_task(task_id: int, user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        task = supabase.table("tasks") \
            .select("*") \
            .eq("id", task_id) \
            .execute()

        if not task.data:
            raise HTTPException(status_code=404, detail="Task not found")

        return {
            "message": "Task retrieved",
            "data": task.data[0]
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )

@router.delete("/{task_id}")
async def delete_task(task_id: int, user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        task = supabase.table("tasks") \
            .select("id") \
            .eq("id", task_id) \
            .execute()

        if not task.data:
            raise HTTPException(status_code=404, detail="Task not found")

        supabase.table("tasks") \
            .delete() \
            .eq("id", task_id) \
            .execute()

        return {
            "message": "Task deleted successfully"
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )