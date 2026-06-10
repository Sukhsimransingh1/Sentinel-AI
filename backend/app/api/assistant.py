from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.chat import Chat

from app.services.assistant_service import (
    get_emergency_response,
)

router = APIRouter(
    prefix="/assistant",
    tags=["Emergency Assistant"],
)


@router.post("/")
async def ask_assistant(

    question: str = Form(""),

    image: UploadFile | None = File(None),

    db: Session = Depends(get_db),

):

    answer = await get_emergency_response(

    question=question,

    image=image,

    db=db,

)

    chat = Chat(

        user_id=1,

        question=question,

        answer=answer,

        image_path=(
            image.filename
            if image
            else None
        ),

    )

    db.add(chat)

    db.commit()

    db.refresh(chat)

    return {

        "answer": answer,

    }


@router.get("/history")
def get_history(

    db: Session = Depends(get_db),

):

    chats = (

        db.query(Chat)

        .order_by(

            Chat.created_at.desc()

        )

        .limit(20)

        .all()

    )

    return chats