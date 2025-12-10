from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from scams_backend.dependencies.auth import get_current_user
from scams_backend.schemas.resource.building import BuildingListResponse
from scams_backend.schemas.resource.device import DeviceListResponse
from scams_backend.schemas.resource.lecturer import LecturerListResponse
from scams_backend.services.resource.building_service import BuildingService
from scams_backend.services.resource.device_service import DeviceService
from scams_backend.services.resource.lecturer_service import LecturerService

router = APIRouter(tags=["Resources"])


@router.get("/buildings", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def get_buildings(
    request: Request, current_user=Depends(get_current_user)
) -> BuildingListResponse:
    building_service = BuildingService(db_session=request.state.db)
    building_response: BuildingListResponse = building_service.invoke()
    return building_response


@router.get("/devices", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def get_devices(
    request: Request, current_user=Depends(get_current_user)
) -> DeviceListResponse:
    device_service = DeviceService(db_session=request.state.db)
    device_response: DeviceListResponse = device_service.invoke()
    return device_response


@router.get("/lecturers", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def get_lecturers(
    request: Request, current_user=Depends(get_current_user)
) -> LecturerListResponse:
    lecturer_service = LecturerService(db_session=request.state.db)
    lecturer_response: LecturerListResponse = lecturer_service.invoke()
    return lecturer_response
