from fastapi import APIRouter, status, Depends, Query
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from scams_backend.dependencies.auth import get_current_user
from typing import Optional
import datetime
from scams_backend.schemas.schedule.schedule_schema import (
    CreateScheduleRequest,
    CreateScheduleResponse,
    ListSchedulesResponse,
    PersonalListSchedulesResponse,
)
from scams_backend.schemas.user.user_claims import UserClaims
from scams_backend.services.schedule.create_schedule_service import (
    CreateScheduleService,
)
from scams_backend.services.schedule.list_all_schedules_service import (
    ListAllSchedulesService,
)
from scams_backend.services.schedule.get_my_schedules_service import (
    GetMySchedulesService,
)

router = APIRouter(tags=["Schedules"], prefix="/schedules")


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new schedule",
)
async def create_schedule(
    request: Request,
    schedule_data: CreateScheduleRequest,
    current_user: UserClaims = Depends(get_current_user),
) -> CreateScheduleResponse:
    create_schedule_service = CreateScheduleService(
        create_schedule_request=schedule_data,
        user_id=current_user.id,
        db_session=request.state.db,
    )
    create_schedule_response: CreateScheduleResponse = create_schedule_service.invoke()
    return create_schedule_response


@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    summary="Get my schedules",
    description="Fetch schedules for the current lecturer user. Sorted by latest created first.",
)
async def get_my_schedules(
    request: Request,
    current_user: UserClaims = Depends(get_current_user),
    limit: Optional[int] = Query(
        10, description="Number of schedules to retrieve", ge=1
    ),
    offset: Optional[int] = Query(0, description="Number of schedules to skip", ge=0),
) -> PersonalListSchedulesResponse:
    get_my_schedules_service = GetMySchedulesService(
        lecturer_id=current_user.id,
        limit=limit,
        offset=offset,
        db_session=request.state.db,
    )
    personal_schedules = get_my_schedules_service.invoke()
    return personal_schedules


@router.get(
    "/",
    status_code=status.HTTP_200_OK,
    summary="Get all schedules",
    description="Fetch all schedules with optional filters. If no date is provided, fetch today's schedules.",
)
async def get_all_schedules(
    request: Request,
    current_user: UserClaims = Depends(get_current_user),
    date: Optional[datetime.date] = Query(
        datetime.datetime.today().date(),
        description="The date to filter schedules (YYYY-MM-DD format), if not provided, fetch today's schedules",
    ),
    room_id: Optional[int] = Query(None, description="The room ID to filter schedules"),
    lecturer_id: Optional[int] = Query(
        None, description="The lecturer ID to filter schedules"
    ),
    building_id: Optional[int] = Query(
        None, description="The building ID to filter schedules"
    ),
) -> ListSchedulesResponse:
    list_all_schedules_service = ListAllSchedulesService(
        date=date,
        room_id=room_id,
        lecturer_id=lecturer_id,
        building_id=building_id,
        db_session=request.state.db,
    )
    schedules = list_all_schedules_service.invoke()
    return schedules
