from typing import Optional
from core.ports.Comment import CommentRepo
import base64


class PostgresCommentRepository(CommentRepo):
    def __init__(self, db):
        self.DB = db

    def create_Comment(self, Comment_data: dict):
        m_id = Comment_data.get("m_id")
        cmt_text = Comment_data.get("cmt_text")
        try:
            insert_query = f"INSERT INTO Comment(cmt_text, m_id, create_at)  VALUES('{cmt_text}', {m_id},CURRENT_TIMESTAMP) LIMIT 4;"
            self.DB.execute_insert_query(insert_query)
        except:
            print(f"Error creating movie")

    def get_Comment(self, c_id: int) -> Optional[dict]:
        select_query = f"SELECT cmt_id, cmt_text, create_at FROM Comment WHERE m_id = {c_id} ORDER BY create_at ASC;"
        result = self.DB.execute_select_query(select_query)
        comment = []
        for cmt in result:
            cmt_id, cmt_text, create_at = cmt
            comment.append({
                "cmt_id": cmt_id,
                "cmt_text": cmt_text,
                "create_at": create_at
            })
        return comment
