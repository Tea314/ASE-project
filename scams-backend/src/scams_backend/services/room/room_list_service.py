from sqlalchemy import select
from sqlalchemy.orm import Session
from scams_backend.models.room import Room
from scams_backend.models.building import Building
from scams_backend.models.device import Device
from scams_backend.models.schedule import Schedule
from scams_backend.models.room_device import RoomDevice
from scams_backend.schemas.room.room_schema import RoomDetailResponse
from scams_backend.schemas.room.room_schema import RoomListResponse
from scams_backend.services.room.room_detail_service import RoomDetailService
from typing import Optional
from datetime import datetime
from sqlalchemy import func


class RoomListService:
    def __init__(
        self,
        building_id: Optional[int],
        device_ids: Optional[list[int]],
        min_capacity: Optional[int],
        start_time: Optional[datetime],
        end_time: Optional[datetime],
        limit: Optional[int],
        offset: Optional[int],
        db_session: Session,
    ):
        self.building_id: Optional[int] = building_id
        self.device_ids: Optional[list[int]] = device_ids
        self.min_capacity: Optional[int] = min_capacity
        self.start_time: Optional[datetime] = start_time
        self.end_time: Optional[datetime] = end_time
        self.db_session: Session = db_session
        self.room_ids: list[int] = []
        self.rooms: list[RoomDetailResponse] = []
        self.limit: Optional[int] = limit
        self.offset: Optional[int] = offset

    def get_filtered_rooms(self) -> None:
        stmt = select(Room.id)

        if self.building_id is not None:
            stmt = stmt.where(Room.building_id == self.building_id)

        if self.min_capacity is not None:
            stmt = stmt.where(Room.capacity >= self.min_capacity)

        if self.device_ids:
            subq = (
                select(RoomDevice.room_id)
                .where(RoomDevice.device_id.in_(self.device_ids))
                .group_by(RoomDevice.room_id)
                .having(func.count(RoomDevice.device_id) == len(self.device_ids))
            )
            stmt = stmt.where(Room.id.in_(subq))

        if self.start_time and self.end_time:
            overlap_subq = select(Schedule.room_id).where(
                Schedule.date == self.start_time.date(),
                Schedule.start_time < self.end_time.time(),
                Schedule.start_time >= self.start_time.time(),
            )
            stmt = stmt.where(~Room.id.in_(overlap_subq))

        if self.limit:
            stmt = stmt.limit(self.limit)
        if self.offset:
            stmt = stmt.offset(self.offset)
        result = self.db_session.execute(stmt).scalars().all()
        self.room_ids = result

    def get_room_details(self) -> None:
        for room_id in self.room_ids:
            room_detail_service = RoomDetailService(
                room_id=room_id, db_session=self.db_session
            )
            room_detail = room_detail_service.invoke()
            self.rooms.append(room_detail)

    def invoke(self) -> RoomListResponse:
        self.get_filtered_rooms()
        self.get_room_details()
        return RoomListResponse(rooms=self.rooms)
