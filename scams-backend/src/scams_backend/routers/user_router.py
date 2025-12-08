from scams_backend.core.config import settings
from fastapi import APIRouter, status, Response
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from scams_backend.schemas.user.user_signin_schema import (
    UserSignInRequest,
    UserSignInResponse,
)
from scams_backend.schemas.user.user_signup_schema import (
    UserSignUpRequest,
    UserSignUpResponse,
)
from scams_backend.services.user.user_signup_service import UserSignUpService
from scams_backend.services.user.user_signin_service import UserSignInService
import jwt

router = APIRouter(prefix="/user", tags=["User"])


@router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    response_class=JSONResponse,
)
async def signup(
    request: Request, signup_request: UserSignUpRequest
) -> UserSignUpResponse:
    service = UserSignUpService(
        db_session=request.state.db, signup_request=signup_request
    )
    signup_response: UserSignUpResponse = service.invoke()
    return signup_response


@router.post(
    "/signin",
    status_code=status.HTTP_200_OK,
    response_class=JSONResponse,
)
async def signin(request: Request, signin_request: UserSignInRequest) -> Response:
    service = UserSignInService(
        db_session=request.state.db, signin_request=signin_request
    )
    signin_response: UserSignInResponse = service.invoke()
    token = jwt.encode(
        signin_response.model_dump(), settings.SECRET_KEY, algorithm="HS256"
    )
    response: Response = JSONResponse(content=signin_response.model_dump())
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=3600,
        secure=False,  # for local development
        samesite="lax",
    )
    return response
