from sqlalchemy.orm import Session
from scams_backend.models.schedule import Schedule
from scams_backend.schemas.schedule.schedule_schema import (
    CreateScheduleRequest,
    CreateScheduleResponse,
    ScheduleDetail,
)
from scams_backend.models.user import User
from scams_backend.constants.user import UserRole
from scams_backend.models.room import Room
from scams_backend.services.user.exception import PermissionException
from scams_backend.services.schedule.exception import (
    ScheduleTimeConflictException,
    ScheduleCreationException,
)

from datetime import datetime
from scams_backend.utils.encrypt import encrypt_data, decrypt_data


class CreateScheduleService:
    def __init__(
        self,
        create_schedule_request: CreateScheduleRequest,
        user_id: int,
        db_session: Session,
    ):
        self.create_schedule_request: CreateScheduleRequest = create_schedule_request
        self.user_id: int = user_id
        self.db_session: Session = db_session
        self.schedules: list[Schedule] = []

    def verify_lecturer_exists(self) -> None:
        lecturer = self.db_session.query(User).filter_by(id=self.user_id).first()
        if not lecturer or lecturer.role != UserRole.LECTURER:
            raise PermissionException(
                "Lecturer does not exist or does not have lecturer role."
            )

    def verify_room_exists(self) -> None:
        room = (
            self.db_session.query(Room)
            .filter(Room.id == self.create_schedule_request.room_id)
            .first()
        )
        if not room:
            raise ScheduleCreationException("Room does not exist.")

    def verify_time_conflict(self) -> None:
        start_hour = self.create_schedule_request.start_time.hour
        end_hour = self.create_schedule_request.end_time.hour
        for hour in range(start_hour, end_hour):
            conflict = (
                self.db_session.query(Schedule)
                .filter(
                    Schedule.room_id == self.create_schedule_request.room_id,
                    Schedule.date == self.create_schedule_request.date,
                    Schedule.start_time
                    == datetime.strptime(f"{hour:02d}:00", "%H:%M").time(),
                )
                .first()
            )
            if conflict:
                raise ScheduleTimeConflictException(
                    f"Time slot {hour}:00 already booked for this room."
                )

    def create_schedule_entries(self) -> None:
        try:
            start_hour = self.create_schedule_request.start_time.hour
            end_hour = self.create_schedule_request.end_time.hour
            self.schedules = []
            for hour in range(start_hour, end_hour):
                schedule = Schedule(
                    room_id=self.create_schedule_request.room_id,
                    lecturer_id=self.user_id,
                    date=self.create_schedule_request.date,
                    start_time=datetime.strptime(f"{hour:02d}:00", "%H:%M").time(),
                    purpose=encrypt_data(self.create_schedule_request.purpose),
                    team_members=(
                        encrypt_data(self.create_schedule_request.team_members)
                        if self.create_schedule_request.team_members
                        else encrypt_data("")
                    ),
                )
                self.db_session.add(schedule)
                self.schedules.append(schedule)
            self.db_session.commit()
            for schedule in self.schedules:
                self.db_session.refresh(schedule)
        except Exception as e:
            self.db_session.rollback()
            raise ScheduleCreationException(
                f"An error occurred while creating schedule entries: {str(e)}"
            )

    def invoke(self) -> CreateScheduleResponse:
        self.verify_lecturer_exists()
        self.verify_time_conflict()
        self.create_schedule_entries()

        schedule_details = []
        for schedule in self.schedules:
            # Use relationships to get related info
            room = schedule.room
            lecturer = schedule.lecturer
            building = room.building if room else None

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
        return CreateScheduleResponse(schedule=schedule_details)
