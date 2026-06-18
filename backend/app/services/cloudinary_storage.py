import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="YOUR_CLOUD_NAME",
    api_key="YOUR_API_KEY",
    api_secret="YOUR_API_SECRET",
)

async def upload_video(file):
    result = cloudinary.uploader.upload(
        file.file,
        resource_type="video"
    )
    return result["secure_url"]

async def upload_image(file):
    result = cloudinary.uploader.upload(
        file.file,
        resource_type="image"
    )
    return result["secure_url"]
