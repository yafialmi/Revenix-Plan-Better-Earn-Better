class Permission:
    def __init__(self, id_permission: int, nama_permission: str):
        self.id_permission = id_permission
        self.nama_permission = nama_permission
        self.actions = self.get_actions()

    def get_actions(self):
        if self.id_permission == 1234:
            return ["confirm", "decline", "create", "read", "update", "delete"]
        elif self.id_permission == 1111:
            return ["create", "read"]
        return []

    def has_permission(self, action: str) -> bool:
        return action in self.actions
