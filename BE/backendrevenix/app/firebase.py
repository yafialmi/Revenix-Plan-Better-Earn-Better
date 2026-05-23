import firebase_admin
from firebase_admin import credentials
import os
import json

firebase_key_json = os.getenv("FIREBASE_KEY")

if not firebase_key_json:
    raise RuntimeError("Environment variable FIREBASE_KEY tidak ditemukan!")

firebase_config = json.loads(firebase_key_json)
cred = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(cred)
