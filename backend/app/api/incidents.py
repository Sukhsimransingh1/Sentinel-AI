from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.incident import Incident
from app.models.user import User

from app.schemas.incident import (
    IncidentCreate,
    IncidentResponse
)

from app.core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"]
)
@router.post(
    "/",
    response_model=IncidentResponse
)
def create_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    new_incident = Incident(
        user_id=current_user.id,
        incident_type=incident.incident_type,
        severity=incident.severity,
        latitude=incident.latitude,
        longitude=incident.longitude,
        description=incident.description
    )

    db.add(new_incident)

    db.commit()

    db.refresh(new_incident)

    return new_incident

@router.get(
    "/",
    response_model=list[IncidentResponse]
)
def get_all_incidents(
    db: Session = Depends(get_db)
):

    incidents = db.query(
        Incident
    ).order_by(
        Incident.created_at.desc()
    ).all()

    return incidents
from fastapi import HTTPException


@router.get(
    "/{incident_id}",
    response_model=IncidentResponse
)
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db)
):

    incident = db.query(
        Incident
    ).filter(
        Incident.id == incident_id
    ).first()

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return incident