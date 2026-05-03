from pydantic import BaseModel
from typing import List

class CodeRequest(BaseModel):
    code: str
    language: str

class CodeResponse(BaseModel):
    explanation: str
    issues: List[str]
    improvements: List[str]    
