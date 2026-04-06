from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter()

FIREBASE_API_KEY = "AIzaSyARSJMsU8l0CtyDqHiv2GOU1nQmQWgUaz8"

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

    payload = {
        "email": data.email,
        "password": data.password,
        "returnSecureToken": True
    }

    res = requests.post(url, json=payload)

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Email atau password salah")

    result = res.json()

    return {
        "message": "Login berhasil",
        "idToken": result["idToken"],  
        "refreshToken": result["refreshToken"],
        "email": result["email"]
    }