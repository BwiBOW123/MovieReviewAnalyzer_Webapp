from datetime import datetime, timezone


MOCK_IMAGE = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lcWv"
    "9wAAAABJRU5ErkJggg=="
)


MOVIES = [
    {
        "id": 1,
        "m_name": "The Midnight Archive",
        "duration": 128,
        "rating": 8.7,
        "story": "A film restorer discovers that old reels contain memories from people who vanished decades ago.",
        "Tag": ["Mystery", "Sci-Fi"],
        "director": "Maya Chen",
        "writers": ["Jon Patel", "Maya Chen"],
        "actor": ["Ari Stone", "Lena Voss", "Niko Reed"],
        "yearRelease": 2024,
        "sentiment": 91,
        "Image": MOCK_IMAGE,
    },
    {
        "id": 2,
        "m_name": "Harbor Lights",
        "duration": 112,
        "rating": 7.9,
        "story": "Two estranged siblings return to their coastal hometown and reopen their father's cinema.",
        "Tag": ["Drama"],
        "director": "Elena Morris",
        "writers": ["Sam Rivera"],
        "actor": ["Mina Hart", "Cole Bennett"],
        "yearRelease": 2023,
        "sentiment": 84,
        "Image": MOCK_IMAGE,
    },
    {
        "id": 3,
        "m_name": "Orbit Cafe",
        "duration": 96,
        "rating": 8.2,
        "story": "A cook on a lunar station tries to keep morale alive while supplies and patience run low.",
        "Tag": ["Comedy", "Sci-Fi"],
        "director": "Theo Grant",
        "writers": ["Iris Novak", "Theo Grant"],
        "actor": ["June Park", "Marco Hale"],
        "yearRelease": 2025,
        "sentiment": 76,
        "Image": MOCK_IMAGE,
    },
    {
        "id": 4,
        "m_name": "Red Line Chase",
        "duration": 105,
        "rating": 7.4,
        "story": "A transit detective tracks a coded ransom note across one night on the city train system.",
        "Tag": ["Action", "Thriller"],
        "director": "Rafael Knox",
        "writers": ["Dana Blake"],
        "actor": ["Tess Morgan", "Ivan Cross"],
        "yearRelease": 2022,
        "sentiment": 63,
        "Image": MOCK_IMAGE,
    },
    {
        "id": 5,
        "m_name": "Paper Moons",
        "duration": 121,
        "rating": 8.9,
        "story": "A young illustrator creates a fantasy world that starts answering back.",
        "Tag": ["Fantasy", "Drama"],
        "director": "Nora Ellis",
        "writers": ["Nora Ellis", "Kai Lin"],
        "actor": ["Ada Wells", "Felix Moon"],
        "yearRelease": 2024,
        "sentiment": 94,
        "Image": MOCK_IMAGE,
    },
]


COMMENTS = {
    1: [
        {"cmt_id": 1, "cmt_text": "Smart mystery with a great final reveal.", "create_at": "2026-04-29T10:15:00Z"},
        {"cmt_id": 2, "cmt_text": "The atmosphere and sound design were excellent.", "create_at": "2026-04-29T11:40:00Z"},
    ],
    2: [{"cmt_id": 3, "cmt_text": "Quiet, emotional, and beautifully acted.", "create_at": "2026-04-28T09:30:00Z"}],
    3: [{"cmt_id": 4, "cmt_text": "Funny without losing the science fiction angle.", "create_at": "2026-04-27T15:20:00Z"}],
    4: [{"cmt_id": 5, "cmt_text": "Good pace, but the ending felt rushed.", "create_at": "2026-04-26T18:10:00Z"}],
    5: [{"cmt_id": 6, "cmt_text": "Beautiful visuals and a strong emotional core.", "create_at": "2026-04-25T20:45:00Z"}],
}


SENTIMENT = {
    1: {"m_id": 1, "positive": 46, "negative": 5},
    2: {"m_id": 2, "positive": 32, "negative": 6},
    3: {"m_id": 3, "positive": 25, "negative": 8},
    4: {"m_id": 4, "positive": 19, "negative": 11},
    5: {"m_id": 5, "positive": 58, "negative": 4},
}


def movie_list():
    return [movie.copy() for movie in MOVIES]


def find_movie(movie_id: int):
    return [movie.copy() for movie in MOVIES if movie["id"] == movie_id]


def movies_by_category(category: str, limit: int):
    category_lower = category.lower()
    filtered = [movie.copy() for movie in MOVIES if category_lower in [tag.lower() for tag in movie["Tag"]]]
    if not filtered:
        filtered = movie_list()
    return sorted(filtered, key=lambda movie: movie["sentiment"], reverse=True)[:limit]


def movies_by_rating(limit: int):
    return sorted(movie_list(), key=lambda movie: movie["rating"], reverse=True)[:limit]


def search_movies(name: str, limit: int = 4):
    name_lower = name.lower()
    return [[movie] for movie in MOVIES if name_lower in movie["m_name"].lower()][:limit]


def sorted_movies(sort_by: str, way: int, limit: int):
    reverse = way == 1
    key = "sentiment" if sort_by == "sentiment" else "rating" if sort_by == "rating" else "id"
    return [[movie] for movie in sorted(movie_list(), key=lambda item: item[key], reverse=reverse)[:limit]]


def get_comments(movie_id: int):
    return list(COMMENTS.get(movie_id, []))


def add_comment(movie_id: int, text: str):
    comment = {
        "cmt_id": sum(len(items) for items in COMMENTS.values()) + 1,
        "cmt_text": text,
        "create_at": datetime.now(timezone.utc).isoformat(),
    }
    COMMENTS.setdefault(movie_id, []).insert(0, comment)
    sentiment = SENTIMENT.setdefault(movie_id, {"m_id": movie_id, "positive": 0, "negative": 0})
    if any(word in text.lower() for word in ["bad", "slow", "weak", "boring", "rushed"]):
        sentiment["negative"] += 1
    else:
        sentiment["positive"] += 1
    return comment


def get_sentiment(movie_id: int):
    return [SENTIMENT.get(movie_id, {"m_id": movie_id, "positive": 0, "negative": 0})]
