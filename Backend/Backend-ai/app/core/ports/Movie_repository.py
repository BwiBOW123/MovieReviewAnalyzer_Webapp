
from typing import List, Optional


class MovieRepository():
    def __init__(self, db):
        pass

    def create_movie(self, Movie: dict) -> dict:
        pass

    def get_movie(self, movie_id: int) -> Optional[dict]:
        pass

    def get_movies(self):
        pass

    def get_moviebyCategory(self, c_name: str) -> Optional[dict]:
        pass

    def get_moviebyRating(self) -> Optional[dict]:
        pass

    def get_movies_search(self, m_name: str) -> Optional[dict]:
        pass

    def get_movies_sort_by(self, sort_by: str, way: int, limit: int) -> Optional[dict]:
        pass