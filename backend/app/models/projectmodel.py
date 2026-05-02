from pydantic import BaseModel
from typing import Optional

class ProjectModel(BaseModel):
    name: str
    description: Optional[str] = None