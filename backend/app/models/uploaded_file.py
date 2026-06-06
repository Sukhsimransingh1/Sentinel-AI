from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base

class UploadedFile(Base):

    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    file_name = Column(String)

    file_type = Column(String)

    cloudinary_url = Column(String)

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        backref="files"
    )