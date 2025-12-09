from scams_backend.core.config import settings
from fastapi import APIRouter, status, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from scams_backend.dependencies.auth import get_current_user
import jwt

router = APIRouter(tags=["Resources"])


@router.get("/buildings", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def get_buildings(current_user=Depends(get_current_user)) -> JSONResponse:
    pass


@router.get("/devices", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def get_devices(current_user=Depends(get_current_user)) -> JSONResponse:
    pass


@router.get("/lecturers", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def get_lecturers(current_user=Depends(get_current_user)) -> JSONResponse:
    pass
