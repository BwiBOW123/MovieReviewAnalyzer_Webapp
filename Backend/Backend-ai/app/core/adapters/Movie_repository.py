import psycopg2
from typing import List, Optional
from core.ports.Movie_repository import MovieRepository
import base64


class PostgresMovieRepository(MovieRepository):
    def __init__(self, db):
        self.DB = db

    def get_moviebyRating(self, limit: int) -> dict:
        select_query = f"SELECT * FROM Movie ORDER BY rating DESC Limit {limit};"
        result = self.DB.execute_select_query(select_query)

        movies_with_images = []

        for movie in result:
            m_id, m_name, duration, rating, story, director, writers, actor, yearRelease, Image = movie
            if Image is not None:
                image_base64 = base64.b64encode(Image).decode('utf-8')
            else:
                image_base64 = None

            select_query = f"SELECT c_id FROM Movie_Category WHERE m_id ={m_id};"
            category_ids = self.DB.execute_select_query(select_query)
            categories = [category[0] for category in category_ids]
            Alltag = []
            for data in categories:
                select_query = f"SELECT c_name FROM Category WHERE c_id = {data};"
                Tag: str = self.DB.execute_select_query(select_query)
                Alltag.append(Tag)
            tags = [tag[0][0] for tag in Alltag]
            movies_with_images.append({
                "id": m_id,
                "m_name": m_name,
                "duration": duration,
                "rating": rating,
                "story": story,
                "Tag": tags,
                "director": director,
                "writers": writers,
                "actor": actor,
                "yearRelease": yearRelease,
                "Image": image_base64
            })

        return movies_with_images

    def get_moviebyCategory(self, c_name: str, limit: int) -> dict:
        query = f"SELECT Movie.m_id FROM Movie JOIN Sentiment ON Movie.m_id = Sentiment.m_id JOIN Movie_Category ON Movie.m_id = Movie_Category.m_id JOIN Category ON Movie_Category.c_id = Category.c_id WHERE Category.c_name = '{c_name}' ORDER BY Sentiment.percentage LIMIT {limit};"
        result_Id = self.DB.execute_select_query(query)
        movies = []
        for row in result_Id:
            movie_id = row[0]
            movie_info = self.get_movie(movie_id)
            movies.append(movie_info)
        return movies

    def create_movie(self, movie_data: dict):
        m_id = movie_data.get("m_id")
        m_name = movie_data.get("m_name")
        duration = movie_data.get("duration")
        rating = movie_data.get("rating")
        story = movie_data.get("story")
        image_data = movie_data.get("image")

        c_id = movie_data.get("c_id")
        Comment = movie_data.get("Comment")
        try:

            # สร้างคำสั่ง SQL เพื่อเพิ่มข้อมูล
            insert_query = f"INSERT INTO Movie (m_id,m_name, duration, rating, story, Image) VALUES ({m_id}, '{m_name}', {duration},{rating},'{story}','{image_data}');"
            # ทำการ execute คำสั่ง SQL
            self.DB.execute_insert_query(insert_query)

            for numCategory in c_id:
                # สร้างคำสั่ง SQL เพื่อเพิ่มข้อมูล
                insert_query = f"INSERT INTO Movie_Category (m_id, c_id) VALUES ({m_id},{numCategory});"
                # ทำการ execute คำสั่ง SQL
                self.DB.execute_insert_query(insert_query)

            for numComment in Comment:
                # สร้างคำสั่ง SQL เพื่อเพิ่มข้อมูล
                insert_query = f"INSERT INTO Comment(cmt_text, m_id, create_at) VALUES('{numComment}', {m_id}, CURRENT_TIMESTAMP );"
                self.DB.execute_insert_query(insert_query)
        except Exception as e:
            # ให้ทำการรับรองการผิดพลาดและประมวลผลข้อผิดพลาดต่อไป
            print(f"Error creating movie: {e}")

    def get_movie(self, movie_id: int) -> Optional[dict]:
        select_query = f"SELECT * FROM Movie WHERE m_id = {movie_id};"
        result = self.DB.execute_select_query(select_query)

        movies_with_images = []

        for movie in result:
            m_id, m_name, duration, rating, story, director, writers, actor, yearRelease, Image = movie
            if Image is not None:
                image_base64 = base64.b64encode(Image).decode('utf-8')
            else:
                image_base64 = None

            select_query = f"SELECT percentage FROM Sentiment WHERE m_id ={m_id};"
            sentiment = self.DB.execute_select_query(select_query)
            
            select_query = f"SELECT c_id FROM Movie_Category WHERE m_id ={m_id};"
            category_ids = self.DB.execute_select_query(select_query)
            categories = [category[0] for category in category_ids]
            Alltag = []
            for data in categories:
                select_query = f"SELECT c_name FROM Category WHERE c_id = {data};"
                Tag: str = self.DB.execute_select_query(select_query)
                Alltag.append(Tag)
            tags = [tag[0][0] for tag in Alltag]
            movies_with_images.append({
                "id": m_id,
                "m_name": m_name,
                "duration": duration,
                "rating": rating,
                "story": story,
                "Tag": tags,
                "director": director,
                "writers": writers,
                "actor": actor,
                "yearRelease": yearRelease,
                "sentiment": sentiment[0][0],
                "Image": image_base64
            })

        return movies_with_images

    def get_movies(self):
        select_query = "SELECT * FROM Movie;"
        result = self.DB.execute_select_query(select_query)

        movies_with_images = []

        for movie in result:
            m_id, m_name, duration, rating, story, director, writers, actor, yearRelease, Image = movie
            if Image is not None:
                image_base64 = base64.b64encode(Image).decode('utf-8')
            else:
                image_base64 = None

            select_query = f"SELECT percentage FROM Sentiment WHERE m_id ={m_id};"
            sentiment = self.DB.execute_select_query(select_query)
            select_query = f"SELECT c_id FROM Category WHERE m_id ={m_id};"
            category_ids = self.DB.execute_select_query(select_query)
            categories = [category[0] for category in category_ids]
            Alltag = []
            for data in categories:
                select_query = f"SELECT c_name FROM Category WHERE c_id = {data};"
                Tag: str = self.DB.execute_select_query(select_query)
                Alltag.append(Tag)
            tags = [tag[0][0] for tag in Alltag]
            movies_with_images.append({
                "id": m_id,
                "m_name": m_name,
                "duration": duration,
                "rating": rating,
                "story": story,
                "Tag": tags,
                "director": director,
                "writers": writers,
                "actor": actor,
                "yearRelease": yearRelease,
                "sentiment": sentiment[0][0],
                "Image": image_base64
            })

        return movies_with_images

    def get_movies_search(self, m_name: str) -> Optional[dict]:
        limit = 4
        select_query = f"SELECT Movie.m_id FROM Movie WHERE Movie.m_name LIKE '%{m_name}%' LIMIT {limit};"
        result_Id = self.DB.execute_select_query(select_query)
        movies = []
        for row in result_Id:
            movie_id = row[0]
            movie_info = self.get_movie(movie_id)
            movies.append(movie_info)

        return movies

    def get_top_movies_by(self,sort_by: str, way: int, limit: int):
        if way == 0:
            desc = ' '
        else:
            desc = ' DESC '

        if sort_by == 'rating':
            query = f"SELECT Movie.m_id FROM Movie ORDER BY rating{desc}LIMIT {limit};"
        elif sort_by == 'sentiment':
            query = f"SELECT m_id FROM Sentiment ORDER BY percentage{desc}LIMIT {limit};"
        else:
            query = f"SELECT Movie.m_id FROM Movie LIMIT {limit}"

        result_Id = self.DB.execute_select_query(query)
        movies = []
        for row in result_Id:
            movie_id = row[0]
            movie_info = self.get_movie(movie_id)
            movies.append(movie_info)

        return movies
