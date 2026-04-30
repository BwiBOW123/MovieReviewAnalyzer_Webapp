from pydantic import BaseModel


class Movie(BaseModel):
    id: int
    moviename: str
    category: str
    image: bytes
