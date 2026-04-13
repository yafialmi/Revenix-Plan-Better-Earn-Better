from app.models.user import User

class Persetujuan:
    def __init__(self, user: User):
        self.user = user
        self.status = None  # None = pending, True = approved, False = rejected

    def approve(self):
        if self.user.role and self.user.role.permission and self.user.role.permission.has_permission("confirm"):
            self.status = True
            return True, "APPROVED"
        return False, "Akses ditolak: hanya admin yang bisa approve"

    def reject(self):
        if self.user.role and self.user.role.permission and self.user.role.permission.has_permission("decline"):
            self.status = False
            return True, "REJECTED"
        return False, "Akses ditolak: hanya admin yang bisa reject"

    def get_status_str(self):
        if self.status is True:
            return "approved"
        elif self.status is False:
            return "rejected"
        return "pending"
