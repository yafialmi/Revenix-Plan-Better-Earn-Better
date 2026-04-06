from fastapi import FastAPI
import app.firebase
from app.auth_routes import router as auth_router
from app.input_routes import router as input_router
from app.perhitungan_routes import router as perhitungan_router

app = FastAPI()

@app.get("/")
def root():
    return {"message": "API jalan"}

app.include_router(auth_router, prefix="/auth")
app.include_router(input_router, prefix="/input")
app.include_router(perhitungan_router, prefix="/perhitungan")