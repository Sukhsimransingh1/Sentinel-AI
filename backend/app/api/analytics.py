from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends

from app.database.database import get_db
from app.models.incident import Incident

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/")
def get_analytics(
    db: Session = Depends(get_db)
):

    incidents = db.query(
        Incident
    ).all()

    total_incidents = len(
        incidents
    )

    high_severity = len(
        [
            i
            for i in incidents
            if i.severity == "High"
        ]
    )

    reported = len(
        [
            i
            for i in incidents
            if i.status == "reported"
        ]
    )

    return {

        "total_incidents":
            total_incidents,

        "high_severity":
            high_severity,

        "reported":
            reported

    }