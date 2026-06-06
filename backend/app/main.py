from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.incidents import router as incidents_router
from app.api.uploads import (
    router as upload_router
)
app = FastAPI(
    title="Sentinel AI API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(incidents_router)
app.include_router(
    upload_router
)

@app.get("/")
def root():
    return {
        "message": "Sentinel AI Backend Running"
    }