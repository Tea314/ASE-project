from scams_backend.models.user import User
from scams_backend.schemas.user.user_signin_schema import (
    UserSignInRequest,
    UserSignInResponse,
)
from sqlalchemy.orm import Session
from scams_backend.services.password.password_service import PasswordService
from scams_backend.services.user.exception import InvalidCredentialsException


class UserSignInService:
    def __init__(self, db_session: Session, signin_request: UserSignInRequest):
        self.db_session: Session = db_session
        self.signin_request: UserSignInRequest = signin_request
        self.user: User = None

    def validate_request(self) -> None:
        self.user = (
            self.db_session.query(User)
            .filter_by(email=self.signin_request.email)
            .first()
        )
        if not self.user:
            raise InvalidCredentialsException()

        if not PasswordService.verify_password(
            self.signin_request.password, self.user.hashed_password
        ):
            raise InvalidCredentialsException()

    def invoke(self) -> UserSignInResponse:
        self.validate_request()
        return UserSignInResponse.model_validate(self.user)
