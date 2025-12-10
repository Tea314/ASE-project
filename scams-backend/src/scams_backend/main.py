from scams_backend.core import config

from fastapi import FastAPI
from scams_backend.web_app import initialize_app

app = FastAPI(title="Smart Campus System API", root_path="/api/v1")

app = initialize_app(app)
