import os

WTF_CSRF_ENABLED = False
PASSWORD_RESET_MESSAGE = os.environ.get("PASSWORD_RESET_MESSAGE", None)
