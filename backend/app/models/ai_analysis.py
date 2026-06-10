from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from app.database.database import Base


class AIAnalysis(Base):

    __tablename__ = "ai_analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    incident_type = Column(
        String
    )

    severity = Column(
        String
    )

    summary = Column(
        Text
    )

    recommendation = Column(
        Text
    )

    image_url = Column(
        String
    )