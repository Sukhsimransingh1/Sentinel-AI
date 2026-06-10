import os
import tempfile
import json

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from sqlalchemy.orm import Session
from app.models.incident import Incident

from app.database.database import get_db

from app.models.upload import UploadedFile
from app.models.ai_analysis import AIAnalysis

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"]
)


@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    suffix = os.path.splitext(
        file.filename
    )[1]

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp_file:

        content = await file.read()

        temp_file.write(content)

        temp_path = temp_file.name

    try:

        UPLOAD_DIR = "uploads"

        os.makedirs(
            UPLOAD_DIR,
            exist_ok=True
        )

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(
            file_path,
            "wb"
        ) as buffer:

            buffer.write(
                content
            )

        # Dummy analysis instead of Gemini
        analysis_json = {
            "incident_type": "Unknown",
            "severity": "Medium",
            "summary": "Disaster image analysis complete",
            "recommendation": "Follow emergency guidelines"
        }

        uploaded_file = UploadedFile(
            user_id=1,
            file_name=file.filename,
            file_url=file_path,
            file_type=file.content_type
        )

        db.add(uploaded_file)
        db.commit()
        db.refresh(uploaded_file)

        ai_analysis = AIAnalysis(

            incident_type=
                analysis_json.get(
                    "incident_type",
                    "Unknown"
                ),

            severity=
                analysis_json.get(
                    "severity",
                    "Medium"
                ),

            summary=
                analysis_json.get(
                    "summary",
                    ""
                ),

            recommendation=
                analysis_json.get(
                    "recommendation",
                    ""
                ),

            image_url=
                file_path

        )

        db.add(ai_analysis)
        db.commit()
        incident = Incident(

            incident_type=
                analysis_json.get(
                    "incident_type",
                    "Unknown"
                ),

            severity=
                "High"
                if analysis_json.get(
                    "severity"
                ) == "Catastrophic"
                else "Medium",

            latitude=
                30.7333,

            longitude=
                76.7794,

            description=
                analysis_json.get(
                    "summary",
                    ""
                )

        )

        db.add(
            incident
        )

        db.commit()

        db.refresh(
            incident
        )

        return {

            "message":
                "Analysis Complete",

            "incident_id":
                incident.id,

            "url":
                file_path,

            "incident_type":
                analysis_json.get(
                    "incident_type"
                ),

            "severity":
                analysis_json.get(
                    "severity"
                ),

            "summary":
                analysis_json.get(
                    "summary"
                ),

            "recommendation":
                analysis_json.get(
                    "recommendation"
                )

        }
    finally:

        if os.path.exists(
            temp_path
        ):
            os.remove(
                temp_path
            )
