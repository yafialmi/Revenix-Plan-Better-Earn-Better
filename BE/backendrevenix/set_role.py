import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)

auth.set_custom_user_claims("7vQAbDUNKleqDpnirxmrs4IHyMm2", {"role": "admin"})
auth.set_custom_user_claims("EN2DwR4GpuPVW9A0Ktb8VftJh9Q2", {"role": "user"})

print("Role berhasil diset!")