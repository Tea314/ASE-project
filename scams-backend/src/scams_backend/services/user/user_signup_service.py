from scams_backend.models.user import User
from scams_backend.schemas.user.user_signup_schema import (
    UserSignUpRequest,
    UserSignUpResponse,
)
from sqlalchemy.orm import Session
from scams_backend.services.password.password_service import PasswordService
from scams_backend.services.user.exception import UserAlreadyExistsException
from scams_backend.utils.encrypt import encrypt_data, decrypt_data
from scams_backend.utils.hash import hash_email


class UserSignUpService:
    def __init__(self, db_session: Session, signup_request: UserSignUpRequest):
        self.db_session: Session = db_session
        self.signup_request: UserSignUpRequest = signup_request
        self.user: User = None

    def validate_request(self) -> None:
        existing_user = (
            self.db_session.query(User)
            .filter_by(email_hash=hash_email(self.signup_request.email))
            .first()
        )
        if existing_user:
            raise UserAlreadyExistsException(self.signup_request.email)

    def create_user(self) -> None:
        hashed_password = PasswordService.hash_password(self.signup_request.password)
        self.user = User(
            email=encrypt_data(self.signup_request.email),
            email_hash=hash_email(self.signup_request.email),
            hashed_password=hashed_password,
            role=self.signup_request.role,
            full_name=encrypt_data(self.signup_request.full_name),
        )
        self.db_session.add(self.user)
        self.db_session.commit()
        self.db_session.refresh(self.user)

    def invoke(self) -> UserSignUpResponse:
        self.validate_request()
        self.create_user()
        return UserSignUpResponse(
            email=decrypt_data(self.user.email),
            role=self.user.role,
            full_name=decrypt_data(self.user.full_name),
        )
