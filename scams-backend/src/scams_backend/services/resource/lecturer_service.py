from sqlalchemy.orm import Session
from scams_backend.schemas.resource.lecturer import LecturerResponse
from scams_backend.models.user import User
from scams_backend.constants.user import UserRole


class LecturerService:
    def __init__(self, db_session: Session):
        self.db_session: Session = db_session
        self.lecturers = None

    def get_lecturers(self):
        self.lecturers = (
            self.db_session.query(User.id, User.full_name)
            .filter(User.role == UserRole.LECTURER)
            .all()
        )

    def invoke(self):
        self.get_lecturers()
        return [
            LecturerResponse.model_validate(lecturer) for lecturer in self.lecturers
        ]
