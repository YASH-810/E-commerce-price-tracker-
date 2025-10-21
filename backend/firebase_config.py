import firebase_admin
from firebase_admin import credentials, firestore

# Path to your Firebase service account JSON
cred = credentials.Certificate("serviceAccountKey.json")

# Initialize Firebase app
firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()
