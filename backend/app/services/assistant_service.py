import os
import tempfile

from sqlalchemy.orm import Session

from app.models.chat import Chat
from app.rag.rag_service import retrieve_context

# Dummy function instead of Gemini
def get_dummy_response(question, image=None):
    return """🚨 Immediate Actions
1. Stay calm and assess the situation
2. Move to a safe location if needed

⚠️ Safety Precautions
- Follow local emergency guidelines
- Stay informed through official channels

❌ Things NOT to Do
- Don't panic
- Don't ignore evacuation orders

🏥 First Aid (if applicable)
- Check for injuries
- Provide basic first aid if trained

🚗 Evacuation Guidance
- Follow evacuation routes
- Bring emergency kit
"""

async def get_emergency_response(
    question: str,
    image=None,
    db: Session | None = None,
):
    return get_dummy_response(question, image)
