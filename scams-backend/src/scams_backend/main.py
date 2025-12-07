from fastapi import FastAPI
from web_app import initialize_app

app = FastAPI(title="Smart Campus System API")

app = initialize_app(app)