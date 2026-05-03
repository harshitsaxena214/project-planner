from app.lib.db import supabase
from app.api.deps import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from app.models.taskmodel import UpdateStatus
from uuid import UUID

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/project/{project_id}")
async def get_tasks(project_id: UUID, user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        project = supabase.table("projects") \
            .select("id") \
            .eq("id", str(project_id)) \
            .eq("user_id", user_id) \
            .execute()

        if not project.data:
            raise HTTPException(status_code=404, detail="Project not found")

        res = supabase.table("tasks") \
            .select("*") \
            .eq("project_id", str(project_id)) \
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
async def get_task(task_id: UUID, user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        task = supabase.table("tasks") \
            .select("*") \
            .eq("id", str(task_id)) \
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

@router.patch("/{task_id}/status")
async def update_task_status(task_id: UUID, body: UpdateStatus, user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        allowed_status = ["todo", "in_progress", "done"]
        if body.status not in allowed_status:
            raise HTTPException(status_code=400, detail="Invalid status")

        task = supabase.table("tasks") \
            .select("id, project_id") \
            .eq("id", str(task_id)) \
            .execute()

        if not task.data:
            raise HTTPException(status_code=404, detail="Task not found")

        project_id = task.data[0]["project_id"]

        project = supabase.table("projects") \
            .select("id") \
            .eq("id", str(project_id)) \
            .eq("user_id", user_id) \
            .execute()

        if not project.data:
            raise HTTPException(status_code=403, detail="Not authorized")

        supabase.table("tasks") \
            .update({"status": body.status}) \
            .eq("id", str(task_id)) \
            .execute()

        return {
            "message": "Task status updated",
            "status": body.status
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )


@router.delete("/{task_id}")
async def delete_task(task_id: UUID, user=Depends(get_current_user)):
    try:
        user_id = user["user_id"]
        if not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized")

        task = supabase.table("tasks") \
            .select("id") \
            .eq("id", str(task_id)) \
            .execute()

        if not task.data:
            raise HTTPException(status_code=404, detail="Task not found")

        supabase.table("tasks") \
            .delete() \
            .eq("id", str(task_id)) \
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