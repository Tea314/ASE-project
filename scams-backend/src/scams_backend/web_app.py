from fastapi import FastAPI
from scams_backend.routers import health_router
from scams_backend.routers import user_router
from scams_backend.middlewares.db_middleware import DBMiddleware


def initialize_routers(app: FastAPI) -> FastAPI:
    app.include_router(health_router.router)
    app.include_router(user_router.router)
    return app


def initialize_middlewares(app: FastAPI) -> FastAPI:
    app.add_middleware(DBMiddleware)
    return app


def initialize_app(app: FastAPI = None) -> FastAPI:
    app = initialize_routers(app)
    app = initialize_middlewares(app)
    return app
