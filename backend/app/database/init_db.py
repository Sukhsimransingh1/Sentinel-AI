from app.database.database import Base
from app.database.database import engine

from app.models.user import User
from app.models.chat import Chat
from app.models.message import Message
from app.models.incident import Incident
from app.models.uploaded_file import UploadedFile

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")