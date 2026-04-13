from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.auth_service import verify_token
from firebase_admin import firestore
import uuid
from datetime import datetime

router = APIRouter()
db = firestore.client()


class InputDataRequest(BaseModel):
    periode: int                
    target_revenue: float       
    aov: float                  
    cost_per_lead: float        
    conversion_rate: float      
    total_biaya_op: float       

class InputDataUpdateRequest(BaseModel):
    periode: int | None = None
    target_revenue: float | None = None
    aov: float | None = None
    cost_per_lead: float | None = None
    conversion_rate: float | None = None
    total_biaya_op: float | None = None

# ── Helper ───────────────────────────────────────────────────────────────────

def get_verified_user(authorization: str):
    """Verifikasi token dan kembalikan data user."""
    token = authorization.replace("Bearer ", "")
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Token tidak valid atau sudah expired")
    return user

# ── Routes ───────────────────────────────────────────────────────────────────

@router.post("/")
def tambah_input(
    data: InputDataRequest,
    authorization: str = Header(...)
):
    """
    User menginput parameter bisnis baru.
    Hanya role 'user' yang bisa akses endpoint ini.
    """
    user = get_verified_user(authorization)

    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Hanya user UMKM yang bisa input data")

    if data.conversion_rate <= 0 or data.conversion_rate > 100:
        raise HTTPException(status_code=400, detail="Conversion rate harus antara 0 dan 100")
    if data.aov <= 0:
        raise HTTPException(status_code=400, detail="AOV harus lebih dari 0")
    if data.target_revenue <= 0:
        raise HTTPException(status_code=400, detail="Target revenue harus lebih dari 0")

    input_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    doc_data = {
        "input_id": input_id,
        "user_id": user["uid"],
        "email": user["email"],
        "periode": data.periode,
        "target_revenue": data.target_revenue,
        "aov": data.aov,
        "cost_per_lead": data.cost_per_lead,
        "conversion_rate": data.conversion_rate,
        "total_biaya_op": data.total_biaya_op,
        "created_at": now,
        "updated_at": now
    }

    db.collection("input_data").document(input_id).set(doc_data)

    return {
        "message": "Input data berhasil disimpan",
        "input_id": input_id,
        "data": doc_data
    }


@router.get("/")
def get_semua_input(
    authorization: str = Header(...)
):
    """
    Ambil semua input data milik user yang sedang login.
    """
    user = get_verified_user(authorization)

    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Akses ditolak")

    docs = db.collection("input_data")\
             .where("user_id", "==", user["uid"])\
             .stream()

    hasil = []
    for doc in docs:
        hasil.append(doc.to_dict())

    if not hasil:
        return {"message": "Belum ada data input", "data": []}

    return {
        "message": "Berhasil mengambil data",
        "total": len(hasil),
        "data": hasil
    }


@router.get("/{input_id}")
def get_input_by_id(
    input_id: str,
    authorization: str = Header(...)
):
    """
    Ambil satu input data berdasarkan input_id.
    User hanya bisa lihat data miliknya sendiri.
    """
    user = get_verified_user(authorization)

    doc = db.collection("input_data").document(input_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    data = doc.to_dict()

    if data["user_id"] != user["uid"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak punya akses ke data ini")

    return {
        "message": "Berhasil mengambil data",
        "data": data
    }


@router.put("/{input_id}")
def update_input(
    input_id: str,
    data: InputDataUpdateRequest,
    authorization: str = Header(...)
):
    """
    Update input data berdasarkan input_id.
    User hanya bisa update data miliknya sendiri.
    """
    user = get_verified_user(authorization)

    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Hanya user UMKM yang bisa update data")

    doc_ref = db.collection("input_data").document(input_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    existing = doc.to_dict()

    if existing["user_id"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Anda tidak punya akses ke data ini")

    update_fields = {k: v for k, v in data.dict().items() if v is not None}

    if not update_fields:
        raise HTTPException(status_code=400, detail="Tidak ada field yang diupdate")

    if "conversion_rate" in update_fields:
        if update_fields["conversion_rate"] <= 0 or update_fields["conversion_rate"] > 100:
            raise HTTPException(status_code=400, detail="Conversion rate harus antara 0 dan 100")
    if "aov" in update_fields and update_fields["aov"] <= 0:
        raise HTTPException(status_code=400, detail="AOV harus lebih dari 0")
    if "target_revenue" in update_fields and update_fields["target_revenue"] <= 0:
        raise HTTPException(status_code=400, detail="Target revenue harus lebih dari 0")

    update_fields["updated_at"] = datetime.utcnow().isoformat()

    doc_ref.update(update_fields)

    return {
        "message": "Data berhasil diupdate",
        "input_id": input_id,
        "updated_fields": update_fields
    }


@router.delete("/{input_id}")
def delete_input(
    input_id: str,
    authorization: str = Header(...)
):
    """
    Hapus input data berdasarkan input_id.
    User hanya bisa hapus data miliknya sendiri.
    """
    user = get_verified_user(authorization)

    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Hanya user UMKM yang bisa hapus data")

    doc_ref = db.collection("input_data").document(input_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    existing = doc.to_dict()

    if existing["user_id"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Anda tidak punya akses ke data ini")

    doc_ref.delete()

    return {
        "message": "Data berhasil dihapus",
        "input_id": input_id
    }