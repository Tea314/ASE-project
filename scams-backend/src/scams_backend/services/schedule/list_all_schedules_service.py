from sqlalchemy.orm import Session
from scams_backend.models.schedule import Schedule
from scams_backend.schemas.schedule.schedule_schema import (
    ListSchedulesResponse,
    ScheduleDetail,
)
import datetime
from typing import Optional
from scams_backend.models.room import Room

from scams_backend.utils.encrypt import decrypt_data


class ListAllSchedulesService:
    def __init__(
        self,
        date: datetime.date,
        room_id: Optional[int],
        lecturer_id: Optional[int],
        building_id: Optional[int],
        db_session: Session,
    ):
        self.date: datetime.date = date
        self.room_id: Optional[int] = room_id
        self.lecturer_id: Optional[int] = lecturer_id
        self.building_id: Optional[int] = building_id
        self.db_session: Session = db_session
        self.schedules: list[Schedule] = []

    def fetch_schedules(self) -> None:
        stmt = self.db_session.query(Schedule).filter(Schedule.date == self.date)

        if self.room_id is not None:
            stmt = stmt.filter(Schedule.room_id == self.room_id)

        if self.lecturer_id is not None:
            stmt = stmt.filter(Schedule.lecturer_id == self.lecturer_id)

        if self.building_id is not None:
            stmt = stmt.join(Room).filter(Room.building_id == self.building_id)

        stmt = stmt.order_by(Schedule.start_time)
        self.schedules = stmt.all()

    def invoke(self) -> ListSchedulesResponse:
        self.fetch_schedules()
        schedule_details = []
        for schedule in self.schedules:
            room = schedule.room
            building = room.building if room else None
            lecturer = schedule.lecturer
            schedule_details.append(
                ScheduleDetail(
                    id=schedule.id,
                    room_id=schedule.room_id,
                    room_name=room.name if room else "",
                    lecturer_id=schedule.lecturer_id,
                    lecturer_name=decrypt_data(lecturer.full_name) if lecturer else "",
                    building_id=building.id if building else None,
                    building_name=building.name if building else "",
                    date=schedule.date,
                    start_time=schedule.start_time,
                    purpose=decrypt_data(schedule.purpose),
                    team_members=(
                        decrypt_data(schedule.team_members)
                        if schedule.team_members
                        else ""
                    ),
                    created_at=schedule.created_at,
                )
            )
        response = ListSchedulesResponse(schedules=schedule_details)
        return response
