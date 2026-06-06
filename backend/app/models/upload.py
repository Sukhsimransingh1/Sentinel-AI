from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func

from app.database.database import Base


class UploadedFile(Base):

    __tablename__ = "uploaded_files"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    file_name = Column(
        String,
        nullable=False
    )

    file_url = Column(
        String,
        nullable=False
    )

    file_type = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

