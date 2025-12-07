from fastapi import FastAPI

def initialize_app(app: FastAPI = None) -> FastAPI:
    return app