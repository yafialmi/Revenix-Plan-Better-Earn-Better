from fastapi import FastAPI
import app.firebase
from app.auth_routes import router as auth_router
from app.input_routes import router as input_router
from app.perhitungan_routes import router as perhitungan_router
from app.persetujuan_routes import router as persetujuan_router
from app.dashboard_routes import router as dashboard_router
from app.laporan_routes import router as laporan_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [    
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # or ["*"] for development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API jalan"}

app.include_router(auth_router, prefix="/auth")
app.include_router(input_router, prefix="/input")
app.include_router(perhitungan_router, prefix="/perhitungan")
app.include_router(persetujuan_router, prefix="/persetujuan")
app.include_router(dashboard_router, prefix="/dashboard")
app.include_router(laporan_router, prefix="/laporan")