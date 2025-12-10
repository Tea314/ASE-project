from fastapi import APIRouter, status, Depends, Query
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from scams_backend.dependencies.auth import get_current_user
from typing import Optional
from scams_backend.schemas.room.room_schema import RoomDetailResponse, RoomListResponse
from scams_backend.services.room.room_list_service import RoomListService
from scams_backend.services.room.room_detail_service import RoomDetailService
from scams_backend.services.room.room_schedule_service import RoomScheduleService
from scams_backend.schemas.user.user_claims import UserClaims
from scams_backend.schemas.room.room_schedule_schema import RoomScheduleResponse

router = APIRouter(tags=["Rooms"], prefix="/rooms")


from typing import Optional, List
import datetime


@router.get("/", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def list_rooms(
    request: Request,
    current_user: UserClaims = Depends(get_current_user),
    building_id: Optional[int] = Query(None, description="Filter by building ID"),
    device_ids: Optional[List[int]] = Query(None, description="List of device IDs"),
    min_capacity: Optional[int] = Query(None, description="Minimum room capacity"),
    start_time: Optional[datetime.datetime] = Query(
        None, description="Start of time window (ISO format)"
    ),
    end_time: Optional[datetime.datetime] = Query(
        None, description="End of time window (ISO format)"
    ),
    limit: Optional[int] = Query(100, description="Limit number of results"),
    offset: Optional[int] = Query(0, description="Offset for results"),
) -> RoomListResponse:
    room_list_service = RoomListService(
        building_id=building_id,
        device_ids=device_ids,
        min_capacity=min_capacity,
        start_time=start_time,
        end_time=end_time,
        limit=limit,
        offset=offset,
        db_session=request.state.db,
    )
    room_list = room_list_service.invoke()
    return room_list


@router.get("/{room_id}", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def get_room_detail(
    request: Request,
    room_id: int,
    current_user: UserClaims = Depends(get_current_user),
) -> RoomDetailResponse:
    room_detail_service = RoomDetailService(
        room_id=room_id, db_session=request.state.db
    )
    room_detail = room_detail_service.invoke()
    return room_detail


@router.get(
    "/{room_id}/schedule",
    status_code=status.HTTP_200_OK,
    response_class=JSONResponse,
)
def get_room_schedule(
    room_id: int,
    request: Request,
    current_user=Depends(get_current_user),
    date: Optional[datetime.date] = Query(
        None, description="Date to filter the schedule (YYYY-MM-DD), None for today"
    ),
) -> RoomScheduleResponse:
    room_schedule_service = RoomScheduleService(
        room_id=room_id, date=date, db_session=request.state.db
    )
    room_schedule = room_schedule_service.invoke()
    return room_schedule
