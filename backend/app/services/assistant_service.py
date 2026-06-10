import os
import tempfile

from PIL import Image
from dotenv import load_dotenv

import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.rag.rag_service import retrieve_context

load_dotenv()

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


async def get_emergency_response(

    question: str,

    image=None,

    db: Session | None = None,

):

    if not question or not question.strip():

        question = (
            "Analyze this image in detail. "
            "Identify the disaster, estimate its severity, "
            "explain the risks and provide emergency guidance."
        )

  
    history = ""

    if db:

        chats = (

            db.query(Chat)

            .filter(
                Chat.user_id == 1
            )

            .order_by(
                Chat.id.desc()
            )

            .limit(5)

            .all()

        )

        chats.reverse()

        for chat in chats:

            history += f"""

User:
{chat.question}

Assistant:
{chat.answer}

"""

    

    DISASTER_KEYWORDS = [
            "earthquake",
            "flood",
            "fire",
            "wildfire",
            "cyclone",
            "tsunami",
            "landslide",
            "burn",
            "snake",
            "chemical",
            "heatwave",
            "cpr",
            "first aid",
            "emergency",
        ]

    if any(
            keyword in question.lower()
            for keyword in DISASTER_KEYWORDS
        ):
            rag_context = retrieve_context(
                question,
                top_k=3
            )
    else:
            rag_context = ""

            
    

    system_prompt = f"""
You are Sentinel AI.

You are an expert Disaster Management and Emergency Response AI.

Always prioritize saving human lives.

Never give generic introductions.

Never say:
"I am Sentinel AI..."

Instead immediately answer the user's problem.

Use the retrieved disaster knowledge as your PRIMARY source.

If necessary, supplement it with your own knowledge.

Always structure your answer like:

🚨 Immediate Actions

⚠️ Safety Precautions

❌ Things NOT to Do

🏥 First Aid (if applicable)

🚗 Evacuation Guidance

-------------------------------------

Retrieved Disaster Knowledge:

{rag_context}

-------------------------------------

Conversation History:

{history}

-------------------------------------

Current User Query:

{question}

"""

  

    if image is None:

        try:

            response = model.generate_content(

                system_prompt

            )

            return response.text

        except ResourceExhausted:

            return (
                "Gemini API quota exceeded. "
                "Please wait a minute and try again."
            )

        except Exception as e:

            return f"Error: {str(e)}"

   
    suffix = os.path.splitext(

        image.filename

    )[1]

    temp_path = None

    try:

        with tempfile.NamedTemporaryFile(

            delete=False,

            suffix=suffix

        ) as temp:

            content = await image.read()

            temp.write(content)

            temp_path = temp.name

        with Image.open(

            temp_path

        ) as img:

            response = model.generate_content(

                [

                    system_prompt,

                    img.copy()

                ]

            )

        return response.text

    except ResourceExhausted:

        return (
            "Gemini API quota exceeded. "
            "Please wait a minute and try again."
        )

    except Exception as e:

        return f"Error: {str(e)}"

    finally:

        if temp_path and os.path.exists(

            temp_path

        ):

            try:

                os.remove(

                    temp_path

                )

            except:

                pass