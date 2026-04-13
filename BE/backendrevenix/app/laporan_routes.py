from fastapi import APIRouter, HTTPException, Header, Query
from app.auth_service import verify_token
from firebase_admin import firestore
from typing import Optional

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

@router.get("/")
def get_laporan(
    authorization: str = Header(...),
    periode: Optional[int] = Query(None, description="Filter berdasarkan tahun, contoh: 2025")
):
    """
    Ambil semua laporan hasil perhitungan milik user.
    Bisa difilter berdasarkan periode (tahun).
    Return:
    - total_perencanaan      : jumlah laporan
    - rata_rata_target_revenue : rata-rata target revenue semua periode
    - total_estimasi_laba    : total cash flow semua periode
    - detail_laporan         : list semua hasil perhitungan
    """
    user = get_verified_user(authorization)

    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Akses ditolak")

    # ── Ambil semua hasil_perhitungan milik user ──────────────────────────
    hasil_docs = list(
        db.collection("hasil_perhitungan")
          .where("user_id", "==", user["uid"])
          .stream()
    )

    detail_laporan = []
    for doc in hasil_docs:
        data = doc.to_dict()

        # Filter by periode jika ada
        if periode is not None and data.get("periode") != periode:
            continue

        detail_laporan.append(data)

    # Sort by created_at terbaru
    detail_laporan.sort(key=lambda x: x.get("created_at", ""), reverse=True)

    # ── Hitung Summary ────────────────────────────────────────────────────
    total_perencanaan       = len(detail_laporan)
    total_target_revenue    = 0.0
    total_estimasi_laba     = 0.0

    for data in detail_laporan:
        parameter = data.get("parameter", {})
        forecast  = data.get("forecast", {})
        total_target_revenue += parameter.get("target_revenue", 0)
        total_estimasi_laba  += forecast.get("cash_flow", 0)

    rata_rata_target_revenue = (
        round(total_target_revenue / total_perencanaan, 2)
        if total_perencanaan > 0 else 0
    )

    return {
        "message": "Berhasil mengambil data laporan",
        "filter" : {
            "periode": periode if periode else "semua"
        },
        "summary": {
            "total_perencanaan"       : total_perencanaan,
            "rata_rata_target_revenue": rata_rata_target_revenue,
            "total_estimasi_laba"     : round(total_estimasi_laba, 2)
        },
        "detail_laporan": detail_laporan
    }


@router.get("/{hasil_id}")
def get_laporan_detail(
    hasil_id: str,
    authorization: str = Header(...)
):
    """
    Ambil detail laporan berdasarkan hasil_id.
    Menampilkan parameter, forecast, dan 3 skenario lengkap.
    """
    user = get_verified_user(authorization)

    doc = db.collection("hasil_perhitungan").document(hasil_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")

    data = doc.to_dict()

    if data["user_id"] != user["uid"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak punya akses ke data ini")

    return {
        "message": "Berhasil mengambil detail laporan",
        "data"   : data
    }