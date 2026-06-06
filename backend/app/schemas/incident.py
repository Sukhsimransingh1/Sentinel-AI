from pydantic import BaseModel
from datetime import datetime


class IncidentCreate(BaseModel):
    incident_type: str
    severity: str
    latitude: float
    longitude: float
    description: str


class IncidentResponse(BaseModel):
    id: int
    incident_type: str
    severity: str
    latitude: float
    longitude: float
    description: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True