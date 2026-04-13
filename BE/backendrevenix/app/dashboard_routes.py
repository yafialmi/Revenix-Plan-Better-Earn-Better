from fastapi import APIRouter, HTTPException, Header
from app.auth_service import verify_token
from firebase_admin import firestore

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

@router.get("/summary")
def get_dashboard_summary(
    authorization: str = Header(...)
):
    """
    Ambil ringkasan data untuk halaman dashboard/home user.
    Return:
    - total_perencanaan     : jumlah input data yang dibuat user
    - total_target_revenue  : total dari semua target revenue
    - estimasi_pengeluaran  : total budget promosi dari semua perhitungan
    - estimasi_laba_rugi    : total cash flow dari semua perhitungan
    - perencanaan_terbaru   : 3 perencanaan terbaru
    - perhitungan_terbaru   : 3 hasil perhitungan terbaru
    """
    user = get_verified_user(authorization)

    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Akses ditolak")

    # ── Ambil semua input_data milik user ─────────────────────────────────
    input_docs = list(
        db.collection("input_data")
          .where("user_id", "==", user["uid"])
          .stream()
    )

    total_perencanaan   = len(input_docs)
    total_target_revenue = 0.0

    perencanaan_list = []
    for doc in input_docs:
        data = doc.to_dict()
        total_target_revenue += data.get("target_revenue", 0)
        perencanaan_list.append(data)

    # Sort by created_at, ambil 3 terbaru
    perencanaan_list.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    perencanaan_terbaru = perencanaan_list[:3]

    # ── Ambil semua hasil_perhitungan milik user ──────────────────────────
    hasil_docs = list(
        db.collection("hasil_perhitungan")
          .where("user_id", "==", user["uid"])
          .stream()
    )

    estimasi_pengeluaran = 0.0
    estimasi_laba_rugi   = 0.0

    perhitungan_list = []
    for doc in hasil_docs:
        data = doc.to_dict()
        forecast = data.get("forecast", {})
        estimasi_pengeluaran += forecast.get("budget_promosi", 0)
        estimasi_laba_rugi   += forecast.get("cash_flow", 0)
        perhitungan_list.append(data)

    # Sort by created_at, ambil 3 terbaru
    perhitungan_list.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    perhitungan_terbaru = perhitungan_list[:3]

    return {
        "message": "Berhasil mengambil data dashboard",
        "user"   : {
            "uid"  : user["uid"],
            "email": user["email"]
        },
        "summary": {
            "total_perencanaan"    : total_perencanaan,
            "total_target_revenue" : round(total_target_revenue, 2),
            "estimasi_pengeluaran" : round(estimasi_pengeluaran, 2),
            "estimasi_laba_rugi"   : round(estimasi_laba_rugi, 2)
        },
        "perencanaan_terbaru" : perencanaan_terbaru,
        "perhitungan_terbaru" : perhitungan_terbaru
    }