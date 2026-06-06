import os

import cloudinary
import cloudinary.uploader

from dotenv import load_dotenv

load_dotenv()

print("Cloud Name =", os.getenv("CLOUDINARY_CLOUD_NAME"))
print("API Key =", os.getenv("CLOUDINARY_API_KEY"))
print("Secret Exists =", bool(os.getenv("CLOUDINARY_API_SECRET")))

cloudinary.config(
    cloud_name=os.getenv(
        "CLOUDINARY_CLOUD_NAME"
    ),
    api_key=os.getenv(
        "CLOUDINARY_API_KEY"
    ),
    api_secret=os.getenv(
        "CLOUDINARY_API_SECRET"
    )
)


def upload_file(
    file_path: str
):

    result = (
        cloudinary.uploader.upload(
            file_path,
            resource_type="auto"
        )
    )

    return result["secure_url"]

