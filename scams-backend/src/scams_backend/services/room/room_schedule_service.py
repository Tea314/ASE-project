from sqlalchemy.orm import Session
import datetime
from typing import Optional
from scams_backend.models.schedule import Schedule
from scams_backend.schemas.room.room_schedule_schema import RoomScheduleResponse


class RoomScheduleService:
    def __init__(
        self, room_id: int, date: Optional[datetime.date], db_session: Session
    ):
        self.room_id: int = room_id
        self.date: datetime.date = date or datetime.date.today()
        self.db_session: Session = db_session
        self.scheduled_slots: list[Schedule] = []

    def fetch_scheduled_slots(self) -> None:
        stmt = (
            self.db_session.query(Schedule)
            .filter(
                Schedule.room_id == self.room_id,
                Schedule.date == self.date,
            )
            .order_by(Schedule.start_time)
        )
        self.scheduled_slots = stmt.all()

    def invoke(self) -> RoomScheduleResponse:
        self.fetch_scheduled_slots()
        booked_times = [slot.start_time for slot in self.scheduled_slots]

        room_schedule_response = RoomScheduleResponse(
            room_id=self.room_id,
            date=self.date,
            scheduled_slots=booked_times,
        )
        return room_schedule_response
