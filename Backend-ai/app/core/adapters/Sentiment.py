from typing import Optional
from core.ports.Comment import CommentRepo
import base64


class PostgresSentimentRepository(CommentRepo):
    def __init__(self, db):
        self.DB = db

    def create_Sentiment(self, Comment_data: dict):
        m_id = Comment_data.get("m_id")
        positive = Comment_data.get("positive")
        negative = Comment_data.get("negative")
        try:
            insert_query = f"INSERT INTO Sentiment (m_id, positive, negative)  VALUES({m_id}, {positive}, {negative})"
            self.DB.execute_insert_query(insert_query)
        except:
            print(f"Error creating movie")

    def get_Sentiment(self, c_id: int) -> Optional[dict]:
        select_query = f"SELECT m_id, positive, negative FROM Sentiment WHERE m_id = {c_id};"
        result = self.DB.execute_select_query(select_query)
        comment = []
        for cmt in result:
            m_id, positive, negative = cmt
            comment.append({
                "m_id": m_id,
                "positive":  positive,
                "negative": negative
            })
        return comment
