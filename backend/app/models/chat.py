from sqlalchemy import Column, Integer, Text, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Chat(Base):

    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)

    question = Column(Text)

    answer = Column(Text)

    image_path = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        server_default=func.now()
    )