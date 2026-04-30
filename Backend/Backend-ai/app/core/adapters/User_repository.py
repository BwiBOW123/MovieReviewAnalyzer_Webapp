import psycopg2
from typing import List, Optional
from core.ports.User_repository import UserRepository


class PostgresUserRepository(UserRepository):
    def __init__(self, db):
        self.DB = db

    def create_user(self, user_data: dict) -> dict:
        pass

    def get_user(self, user_id: int) -> Optional[dict]:
        pass

    def get_users(self) -> dict:
        select_query = "SELECT * FROM member"
        result = self.DB.execute_select_query(select_query)
        Users = []

        for User in result:
            id, name = User
            Users.append(
                {"id": id, "name": name})

        return Users
