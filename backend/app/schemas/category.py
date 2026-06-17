from pydantic import BaseModel


class CategoryRead(BaseModel):
    id: int
    name: str
    slug: str

    model_config = {"from_attributes": True}
