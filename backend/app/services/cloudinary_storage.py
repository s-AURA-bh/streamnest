import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="dsriwkfs8",
    api_key="913725461457424",
    api_secret="1vfr7pF8Y7qS1-KbNsX4Zp3yfWk",
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
