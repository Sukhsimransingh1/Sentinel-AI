import os
import tempfile

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.upload import UploadedFile

from app.services.cloudinary_service import (
    upload_file
)

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

    cloudinary_url = upload_file(
        temp_path
    )

    uploaded_file = UploadedFile(
        user_id=1,
        file_name=file.filename,
        file_url=cloudinary_url,
        file_type=file.content_type
    )

    db.add(uploaded_file)

    db.commit()

    db.refresh(uploaded_file)

    os.remove(temp_path)

    return {
        "message":
        "File uploaded successfully",
        "url":
        cloudinary_url
    }