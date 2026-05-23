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

# ── Formula Kalkulasi (sama persis dengan perhitungan_routes) ─────────────────

def calculate_leads_needed(target_revenue: float, aov: float, conversion_rate: float) -> float:
    return target_revenue / (aov * conversion_rate)

def calculate_budget(leads: float, cost_per_lead: float) -> float:
    return leads * cost_per_lead

def calculate_revenue(leads: float, conversion_rate: float, aov: float) -> float:
    return leads * conversion_rate * aov

def forecast_cash_flow(target_revenue: float, total_biaya_op: float) -> float:
    return target_revenue - total_biaya_op

def simulate_scenario(
    target_revenue: float,
    aov: float,
    conversion_rate: float,
    cost_per_lead: float,
    total_biaya_op: float,
    scenario: str
) -> dict:
    if scenario == "optimis":
        adjusted_rate = conversion_rate * 1.2
    elif scenario == "pesimis":
        adjusted_rate = conversion_rate * 0.8
    else:
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

@router.post("/")
def tambah_input(
    data: InputDataRequest,
    authorization: str = Header(...)
):
    """
    User menginput parameter bisnis baru.
    Setelah input disimpan, otomatis langsung dihitung dan
    disimpan ke hasil_perhitungan dengan status 'pending'.
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

    # ── Otomatis hitung setelah input disimpan ────────────────────────────
    target_revenue  = data.target_revenue
    aov             = data.aov
    conversion_rate = data.conversion_rate
    cost_per_lead   = data.cost_per_lead
    total_biaya_op  = data.total_biaya_op

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

    skenario_optimis = simulate_scenario(target_revenue, aov, conversion_rate, cost_per_lead, total_biaya_op, "optimis")
    skenario_normal  = simulate_scenario(target_revenue, aov, conversion_rate, cost_per_lead, total_biaya_op, "normal")
    skenario_pesimis = simulate_scenario(target_revenue, aov, conversion_rate, cost_per_lead, total_biaya_op, "pesimis")

    hasil_id = str(uuid.uuid4())

    hasil_data = {
        "hasil_id"          : hasil_id,
        "input_id"          : input_id,
        "user_id"           : user["uid"],
        "email"             : user["email"],
        "periode"           : data.periode,
        "parameter"         : {
            "target_revenue"  : target_revenue,
            "aov"             : aov,
            "conversion_rate" : conversion_rate,
            "cost_per_lead"   : cost_per_lead,
            "total_biaya_op"  : total_biaya_op
        },
        "forecast"          : forecast,
        "skenario"          : {
            "optimis" : skenario_optimis,
            "normal"  : skenario_normal,
            "pesimis" : skenario_pesimis
        },
        "status_persetujuan": "pending",
        "catatan_admin"     : None,
        "created_at"        : now,
        "updated_at"        : now
    }

    db.collection("hasil_perhitungan").document(hasil_id).set(hasil_data)
    # ─────────────────────────────────────────────────────────────────────

    return {
        "message"  : "Input data berhasil disimpan dan perhitungan otomatis dilakukan",
        "input_id" : input_id,
        "hasil_id" : hasil_id,
        "data"     : doc_data,
        "hasil_perhitungan": hasil_data
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
