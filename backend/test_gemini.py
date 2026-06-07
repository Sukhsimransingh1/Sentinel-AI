from app.services.gemini_vision import (
    analyze_disaster_image
)

result = analyze_disaster_image(
    "uploads/test.jpg"
)

print(result)