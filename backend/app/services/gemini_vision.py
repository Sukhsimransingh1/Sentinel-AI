import os
import json

from PIL import Image
from dotenv import load_dotenv

import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def analyze_disaster_image(
    image_path: str
):

    image = Image.open(
        image_path
    )

    prompt = """
Analyze this disaster image.

Return JSON only.

{
  "incident_type":"",
  "severity":"",
  "summary":"",
  "risks":[],
  "recommendation":""
}
"""

    response = model.generate_content(
        [prompt, image]
    )

    return response.text