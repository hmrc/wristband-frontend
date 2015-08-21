import os

SECRET_KEY = "bad secret"
API_URI = os.environ.get("WRISTBAND_API_URI", "http://localhost:3000/")
