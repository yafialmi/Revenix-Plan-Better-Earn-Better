from fastapi import APIRouter, HTTPException, Header
from app.auth_service import verify_token
from firebase_admin import firestore
import uuid
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

def get_input_data(input_id: str, user_uid: str, role: str):
    """Ambil input data dari Firestore dan validasi kepemilikan."""
    doc = db.collection("input_data").document(input_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Input data tidak ditemukan")

    data = doc.to_dict()

    if data["user_id"] != user_uid and role != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak punya akses ke data ini")

    return data

# ── Formula Kalkulasi ─────────────────────────────────────────────────────────

def calculate_leads_needed(target_revenue: float, aov: float, conversion_rate: float) -> float:
    """Hitung jumlah leads yang dibutuhkan."""
    return target_revenue / (aov * conversion_rate)

def calculate_budget(leads: float, cost_per_lead: float) -> float:
    """Hitung total budget promosi."""
    return leads * cost_per_lead

def calculate_revenue(leads: float, conversion_rate: float, aov: float) -> float:
    """Hitung estimasi revenue aktual."""
    return leads * conversion_rate * aov

def forecast_cash_flow(target_revenue: float, total_biaya_op: float) -> float:
    """Hitung forecast cash flow (laba/rugi)."""
    return target_revenue - total_biaya_op

def simulate_scenario(
    target_revenue: float,
    aov: float,
    conversion_rate: float,
    cost_per_lead: float,
    total_biaya_op: float,
    scenario: str
) -> dict:
    """Hitung skenario planning berdasarkan tipe skenario."""
    # Sesuaikan conversion rate berdasarkan skenario
    if scenario == "optimis":
        adjusted_rate = conversion_rate * 1.2
    elif scenario == "pesimis":
        adjusted_rate = conversion_rate * 0.8
    else:  # normal
        adjusted_rate = conversion_rate

    leads = calculate_leads_needed(target_revenue, aov, adjusted_rate)
    budget = calculate_budget(leads, cost_per_lead)
    cash_flow = forecast_cash_flow(target_revenue, total_biaya_op)
    revenue = calculate_revenue(leads, adjusted_rate, aov)

    return {
        "scenario": scenario,
        "conversion_rate_digunakan": round(adjusted_rate, 4),
        "leads_dibutuhkan": round(leads, 2),
        "budget_promosi": round(budget, 2),
        "estimasi_revenue": round(revenue, 2),
        "cash_flow": round(cash_flow, 2),
        "status": "Untung" if cash_flow > 0 else "Rugi"
    }

# ── Routes ───────────────────────────────────────────────────────────────────

@router.post("/{input_id}")
def hitung_perhitungan(
    input_id: str,
    authorization: str = Header(...)
):
    """
    Hitung forecast + 3 skenario planning dari input data.
    Hasil disimpan ke collection 'hasil_perhitungan' di Firestore.
    """
    user = get_verified_user(authorization)

    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Hanya user UMKM yang bisa melakukan perhitungan")

    # Ambil input data
    input_data = get_input_data(input_id, user["uid"], user["role"])

    target_revenue  = input_data["target_revenue"]
    aov             = input_data["aov"]
    conversion_rate = input_data["conversion_rate"]
    cost_per_lead   = input_data["cost_per_lead"]
    total_biaya_op  = input_data["total_biaya_op"]
    periode         = input_data["periode"]

    # ── Hitung Forecast Utama ──────────────────────────────────────────────
    leads    = calculate_leads_needed(target_revenue, aov, conversion_rate)
    budget   = calculate_budget(leads, cost_per_lead)
    revenue  = calculate_revenue(leads, conversion_rate, aov)
    cashflow = forecast_cash_flow(target_revenue, total_biaya_op)

    forecast = {
        "leads_dibutuhkan"  : round(leads, 2),
        "budget_promosi"    : round(budget, 2),
        "estimasi_revenue"  : round(revenue, 2),
        "cash_flow"         : round(cashflow, 2),
        "status"            : "Untung" if cashflow > 0 else "Rugi"
    }

    # ── Hitung 3 Skenario ──────────────────────────────────────────────────
    skenario_optimis = simulate_scenario(
        target_revenue, aov, conversion_rate,
        cost_per_lead, total_biaya_op, "optimis"
    )
    skenario_normal = simulate_scenario(
        target_revenue, aov, conversion_rate,
        cost_per_lead, total_biaya_op, "normal"
    )
    skenario_pesimis = simulate_scenario(
        target_revenue, aov, conversion_rate,
        cost_per_lead, total_biaya_op, "pesimis"
    )

    # ── Simpan ke Firestore ────────────────────────────────────────────────
    hasil_id = str(uuid.uuid4())
    now      = datetime.utcnow().isoformat()

    doc_data = {
        "hasil_id"          : hasil_id,
        "input_id"          : input_id,
        "user_id"           : user["uid"],
        "email"             : user["email"],
        "periode"           : periode,

        # Parameter input (snapshot)
        "parameter"         : {
            "target_revenue"  : target_revenue,
            "aov"             : aov,
            "conversion_rate" : conversion_rate,
            "cost_per_lead"   : cost_per_lead,
            "total_biaya_op"  : total_biaya_op
        },

        # Hasil forecast utama
        "forecast"          : forecast,

        # Hasil 3 skenario
        "skenario"          : {
            "optimis" : skenario_optimis,
            "normal"  : skenario_normal,
            "pesimis" : skenario_pesimis
        },

        # Status persetujuan (untuk admin)
        "status_persetujuan": "pending",
        "catatan_admin"     : None,

        "created_at"        : now,
        "updated_at"        : now
    }

    db.collection("hasil_perhitungan").document(hasil_id).set(doc_data)

    return {
        "message"   : "Perhitungan berhasil disimpan",
        "hasil_id"  : hasil_id,
        "data"      : doc_data
    }


@router.get("/")
def get_semua_hasil(
    authorization: str = Header(...)
):
    """
    Ambil semua hasil perhitungan milik user yang sedang login.
    """
    user = get_verified_user(authorization)

    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Akses ditolak")

    docs = db.collection("hasil_perhitungan")\
             .where("user_id", "==", user["uid"])\
             .stream()

    hasil = [doc.to_dict() for doc in docs]

    if not hasil:
        return {"message": "Belum ada hasil perhitungan", "data": []}

    return {
        "message": "Berhasil mengambil data",
        "total"  : len(hasil),
        "data"   : hasil
    }


@router.get("/{hasil_id}")
def get_hasil_by_id(
    hasil_id: str,
    authorization: str = Header(...)
):
    """
    Ambil satu hasil perhitungan berdasarkan hasil_id.
    """
    user = get_verified_user(authorization)

    doc = db.collection("hasil_perhitungan").document(hasil_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Hasil perhitungan tidak ditemukan")

    data = doc.to_dict()

    if data["user_id"] != user["uid"] and user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak punya akses ke data ini")

    return {
        "message": "Berhasil mengambil data",
        "data"   : data
    }


@router.delete("/{hasil_id}")
def delete_hasil(
    hasil_id: str,
    authorization: str = Header(...)
):
    """
    Hapus hasil perhitungan berdasarkan hasil_id.
    Hanya user pemilik yang bisa hapus.
    """
    user = get_verified_user(authorization)

    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Hanya user UMKM yang bisa hapus data")

    doc_ref = db.collection("hasil_perhitungan").document(hasil_id)
    doc     = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Hasil perhitungan tidak ditemukan")

    data = doc.to_dict()

    if data["user_id"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Anda tidak punya akses ke data ini")

    doc_ref.delete()

    return {
        "message" : "Hasil perhitungan berhasil dihapus",
        "hasil_id": hasil_id
    }