from pydantic import BaseModel

class UpdateStatus(BaseModel):
    status: str