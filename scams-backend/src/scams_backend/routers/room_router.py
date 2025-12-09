from fastapi import APIRouter, status, Depends, Query
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from scams_backend.dependencies.auth import get_current_user
from typing import Optional

router = APIRouter(tags=["Rooms"])


@router.get("/rooms", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def get_rooms(
    request: Request,
    current_user=Depends(get_current_user),
    building_id: Optional[int] = Query(None, description="Filter by building ID"),
    device_ids: Optional[str] = Query(None, description="Comma-separated device IDs"),
    min_capacity: Optional[int] = Query(None, description="Minimum room capacity"),
    start_time: Optional[str] = Query(
        None, description="Start of time window (ISO format)"
    ),
    end_time: Optional[str] = Query(
        None, description="End of time window (ISO format)"
    ),
) -> JSONResponse:
    pass
