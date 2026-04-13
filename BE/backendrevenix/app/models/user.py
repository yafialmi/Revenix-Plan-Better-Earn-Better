from app.models.role import Role

class User:
    def __init__(self, user_id: str, email: str, role_id: int = 2):
        self.user_id = user_id
        self.email = email
        self.role_id = role_id
        self.role = Role(role_id=role_id)
