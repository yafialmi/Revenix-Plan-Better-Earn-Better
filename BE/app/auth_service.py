from firebase_admin import auth

def verify_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)

        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "role": decoded_token.get("role")
        }

    except:
        return None