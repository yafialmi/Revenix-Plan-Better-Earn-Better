from app.models.permission import Permission

class Role:
    def __init__(self, role_id: int):
        self.role_id = role_id
        self.name = "Admin" if role_id == 1 else "User"
        self.permission = self.get_permission_obj()

    def get_permission_obj(self):
        if self.role_id == 1:
            return Permission(id_permission=1234, nama_permission="Admin Permission")
        return Permission(id_permission=1111, nama_permission="User Permission")
