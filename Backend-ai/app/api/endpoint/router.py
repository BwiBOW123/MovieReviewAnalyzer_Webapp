from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from core.adapters.Movie_repository import PostgresMovieRepository
from core.adapters.Comment import PostgresCommentRepository
from core.adapters.Sentiment import PostgresSentimentRepository
from database import DATABASE
import base64
from typing import List
import json
router = APIRouter()
db = DATABASE()
MovieData = PostgresMovieRepository(db)
CommentData = PostgresCommentRepository(db)
SentimentData = PostgresSentimentRepository(db)
SentimentData = PostgresSentimentRepository(db)


@router.get('/')
def root():
    return {"msg": "Hello"}


@router.get("/movies")
def getMovies():
    movie = MovieData.get_movies()
    return {"data": movie}


@router.get("/movies/{movie_id}")
def getmovie(movie_id: int):
    movie = MovieData.get_movie(movie_id)
    if movie:
        return {"data": movie}
    else:
        raise HTTPException(status_code=404, detail="Movie not found")


@router.get("/Category/{c_name}/{limit}")
def getmovieCategory(c_name: str, limit: int):
    movie = MovieData.get_moviebyCategory(c_name, limit)
    if movie:
        return {"data": movie}
    else:
        raise HTTPException(status_code=404, detail="Movie not found")


@router.get("/Rating/{limit}")
def getmovieRaing(limit: int = 0):

    movie = MovieData.get_moviebyRating(limit)
    if movie:
        return {"data": movie}
    else:
        raise HTTPException(status_code=404, detail="Movie not found")


@router.post("/create_movie")
async def create_movie(
    file: UploadFile = File(...),
    movie_data: UploadFile = File(...),
):
    try:
        # Read and encode the image file
        base64_image = base64.b64encode(file.file.read()).decode("utf-8")

        # Read JSON data from the movie_data file
        movie_data_content = await movie_data.read()
        movie_data_dict = json.loads(movie_data_content)

        # Continue with the rest of the code as before
        m_id = movie_data_dict.get("m_id")
        m_name = movie_data_dict.get("m_name")
        duration = movie_data_dict.get("duration")
        rating = movie_data_dict.get("rating")
        story = movie_data_dict.get("story")
        c_id = movie_data_dict.get("c_id")
        Comment = movie_data_dict.get("Comment")
        data = {
            "m_id": m_id,
            "m_name": m_name,
            "duration": duration,
            "rating": rating,
            "story": story,
            "image": base64_image,
            "c_id": c_id,
            "Comment": Comment
        }
        MovieData.create_movie(data)
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail="File not found")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {str(e)}")

    return {"msg": "Create Success"}


@router.get("/comment/{c_id}")
def getComment(c_id: int):
    cmt = CommentData.get_Comment(c_id)
    return {"data": cmt}


@router.post("/comment")
async def create_comment(cmt_data: UploadFile = File(...),):
    try:
        # Read JSON data from the movie_data file
        movie_data_content = await cmt_data.read()
        movie_data_dict = json.loads(movie_data_content)

        # Continue with the rest of the code as before
        cmt_text = movie_data_dict.get("cmt_text")
        m_id = movie_data_dict.get("m_id")

        data = {
            "cmt_text": cmt_text,
            "m_id": m_id,
        }
        CommentData.create_Comment(data)

    except:
        print("error")
    return {"msg": "Create Success"}


@router.get("/sentiment/{m_id}")
def getsentiment(m_id: int):
    cmt = SentimentData.get_Sentiment(m_id)
    return {"data": cmt}


@router.post("/sentiment")
async def createsentiment(s_data: UploadFile = File(...)):
    try:
        # Read JSON data from the movie_data file
        movie_data_content = await s_data.read()
        movie_data_dict = json.loads(movie_data_content)

        # Continue with the rest of the code as before
        m_id = movie_data_dict.get("m_id")
        positive = movie_data_dict.get("positive")
        negative = movie_data_dict.get("negative")

        data = {
            "m_id": m_id,
            "positive": positive,
            "negative": negative,
        }
        SentimentData.create_Sentiment(data)

    except:
        print("error")
    return {"msg": "Create Success"}


@router.get("/comment/{c_id}")
def getComment(c_id: int):
    cmt = CommentData.get_Comment(c_id)
    return {"data": cmt}


@router.get("/sentiment/{m_id}")
def getsentiment(m_id: int):
    cmt = SentimentData.get_Sentiment(m_id)
    return {"data": cmt}

@router.get("/search/{m_name}")
def getsearch(m_name: str):
    movie = MovieData.get_movies_search(m_name)
    if movie:
        return {"data": movie}
    else:
        raise HTTPException(status_code=404, detail="Movie not found")

@router.get("/search_by_sort/{sort_by}/{way}/{limit}")
def getsearchbysort(sort_by: str, way: int, limit: int):
    movies = MovieData.get_top_movies_by(sort_by, way, limit)
    if movies:
        return {"data": movies}
    else:
        raise HTTPException(status_code=404, detail="Movie not found")