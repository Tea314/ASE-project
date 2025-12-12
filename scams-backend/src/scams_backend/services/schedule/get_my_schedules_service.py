from sqlalchemy.orm import Session
from scams_backend.models.schedule import Schedule
from scams_backend.schemas.schedule.schedule_schema import (
    PersonalListSchedulesResponse,
    ScheduleDetail,
)
from scams_backend.constants.user import UserRole
from scams_backend.services.user.exception import PermissionException
from scams_backend.models.user import User
from scams_backend.utils.encrypt import decrypt_data


class GetMySchedulesService:
    def __init__(self, user_id: int, limit: int, offset: int, db_session: Session):
        self.user_id: int = user_id
        self.limit: int = limit
        self.offset: int = offset
        self.db_session: Session = db_session
        self.schedules = []

    def verify_lecturer_exists(self) -> None:
        lecturer = self.db_session.query(User).filter_by(id=self.user_id).first()
        if not lecturer or lecturer.role != UserRole.LECTURER:
            raise PermissionException(
                "Lecturer does not exist or does not have lecturer role."
            )

    def fetch_schedules(self) -> None:
        stmt = (
            self.db_session.query(Schedule)
            .filter(Schedule.lecturer_id == self.user_id)
            .order_by(Schedule.created_at.desc())
            .limit(self.limit)
            .offset(self.offset)
        )
        self.schedules = stmt.all()

    def invoke(self) -> PersonalListSchedulesResponse:
        self.verify_lecturer_exists()
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
        response = PersonalListSchedulesResponse(
            lecturer_id=self.user_id, schedules=schedule_details
        )
        return response
