from fastapi import APIRouter, HTTPException, Header
from app.auth_service import verify_token
from app.models.persetujuan import Persetujuan
from app.models.user import User
from app.models.role import Role
from firebase_admin import firestore
from datetime import datetime

router = APIRouter()
db = firestore.client()

# ── Helper ───────────────────────────────────────────────────────────────────

def get_verified_user(authorization: str):
    """Verifikasi token dan kembalikan data user."""
    token = authorization.replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Token tidak valid atau sudah expired")
    return user

# ── Routes ───────────────────────────────────────────────────────────────────

@router.post("/approve/{hasil_id}")
def approve_api(
    hasil_id: str,
    authorization: str = Header(...)
):
    """
    Admin melakukan approve terhadap hasil perhitungan.
    Hanya role 'admin' yang bisa akses endpoint ini.
    """
    user = get_verified_user(authorization)

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Hanya admin yang bisa melakukan approve")

    # Ambil data user dari Firestore
    user_docs = list(db.collection("user").where("UID", "==", user["uid"]).stream())
    if not user_docs:
        raise HTTPException(status_code=404, detail="User tidak ditemukan di Firestore")

    user_data_db = user_docs[0].to_dict()
    role_id      = user_data_db.get("role_id", 2)

    # Cek dokumen hasil_perhitungan
    hasil_ref = db.collection("hasil_perhitungan").document(hasil_id)
    hasil_doc = hasil_ref.get()

    if not hasil_doc.exists:
        raise HTTPException(status_code=404, detail="Hasil perhitungan tidak ditemukan")

    hasil_data     = hasil_doc.to_dict()
    current_status = hasil_data.get("status_persetujuan", "pending")

    if current_status != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Dokumen sudah diproses dengan status: {current_status}"
        )

    # Proses approve via model Persetujuan
    current_user      = User(user_id=user["uid"], email=user["email"], role_id=role_id)
    current_user.role = Role(role_id=role_id)

    p                = Persetujuan(user=current_user)
    success, message = p.approve()

    if not success:
        raise HTTPException(status_code=403, detail=message)

    # Update Firestore
    hasil_ref.update({
        "status_persetujuan": p.get_status_str(),
        "catatan_admin"     : message,
        "updated_at"        : datetime.utcnow().isoformat()
    })

    return {
        "status"          : "success",
        "role"            : current_user.role.name,
        "approval_status" : p.get_status_str(),
        "hasil_id"        : hasil_id,
        "message"         : message
    }


@router.post("/reject/{hasil_id}")
def reject_api(
    hasil_id: str,
    authorization: str = Header(...)
):
    """
    Admin melakukan reject terhadap hasil perhitungan.
    Hanya role 'admin' yang bisa akses endpoint ini.
    """
    user = get_verified_user(authorization)

    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Hanya admin yang bisa melakukan reject")

    # Ambil data user dari Firestore
    user_docs = list(db.collection("user").where("UID", "==", user["uid"]).stream())
    if not user_docs:
        raise HTTPException(status_code=404, detail="User tidak ditemukan di Firestore")

    user_data_db = user_docs[0].to_dict()
    role_id      = user_data_db.get("role_id", 2)

    # Cek dokumen hasil_perhitungan
    hasil_ref = db.collection("hasil_perhitungan").document(hasil_id)
    hasil_doc = hasil_ref.get()

    if not hasil_doc.exists:
        raise HTTPException(status_code=404, detail="Hasil perhitungan tidak ditemukan")

    hasil_data     = hasil_doc.to_dict()
    current_status = hasil_data.get("status_persetujuan", "pending")

    if current_status != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Dokumen sudah diproses dengan status: {current_status}"
        )

    # Proses reject via model Persetujuan
    current_user      = User(user_id=user["uid"], email=user["email"], role_id=role_id)
    current_user.role = Role(role_id=role_id)

    p                = Persetujuan(user=current_user)
    success, message = p.reject()

    if not success:
        raise HTTPException(status_code=403, detail=message)

    # Update Firestore
    hasil_ref.update({
        "status_persetujuan": p.get_status_str(),
        "catatan_admin"     : message,
        "updated_at"        : datetime.utcnow().isoformat()
    })

    return {
        "status"          : "success",
        "role"            : current_user.role.name,
        "approval_status" : p.get_status_str(),
        "hasil_id"        : hasil_id,
        "message"         : message
    }


@router.get("/status/{hasil_id}")
def get_status_persetujuan(
    hasil_id: str,
    authorization: str = Header(...)
):
    """
    User/Admin melihat status persetujuan hasil perhitungan.
    """
    user = get_verified_user(authorization)

    doc = db.collection("hasil_perhitungan").document(hasil_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Hasil perhitungan tidak ditemukan")

    data = doc.to_dict()

    if data["user_id"] != user["uid"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak punya akses ke data ini")

    return {
        "hasil_id"          : hasil_id,
        "status_persetujuan": data.get("status_persetujuan", "pending"),
        "catatan_admin"     : data.get("catatan_admin", None),
        "updated_at"        : data.get("updated_at")
    }