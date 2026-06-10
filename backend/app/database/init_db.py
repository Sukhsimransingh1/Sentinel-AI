from app.database.database import Base
from app.database.database import engine

import app.models

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")