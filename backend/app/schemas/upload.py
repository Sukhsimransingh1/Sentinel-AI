from pydantic import BaseModel
from datetime import datetime


class UploadResponse(
    BaseModel
):
    id: int
    file_name: str
    file_url: str
    file_type: str
    created_at: datetime

    class Config:
        from_attributes = True

