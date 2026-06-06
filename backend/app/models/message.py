from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base

class Message(Base):

    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)

    chat_id = Column(
        Integer,
        ForeignKey("chats.id")
    )

    role = Column(String)

    message = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    chat = relationship(
        "Chat",
        backref="messages"
    )