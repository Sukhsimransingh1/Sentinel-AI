from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base

class Incident(Base):

    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    incident_type = Column(String)

    severity = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    description = Column(Text)

    status = Column(
        String,
        default="reported"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        backref="incidents"
    )