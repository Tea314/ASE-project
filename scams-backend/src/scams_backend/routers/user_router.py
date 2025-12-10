from scams_backend.core.config import settings
from fastapi import APIRouter, status, Response, Depends
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
from scams_backend.schemas.user.user_claims import UserClaims
from scams_backend.services.user.user_signup_service import UserSignUpService
from scams_backend.services.user.user_signin_service import UserSignInService
from scams_backend.dependencies.auth import get_current_user
import jwt

router = APIRouter(tags=["User"])


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


@router.post("/signout", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def signout() -> Response:
    response: Response = JSONResponse(content={"message": "Successfully signed out"})
    response.delete_cookie(key="access_token")
    return response


@router.get("/", status_code=status.HTTP_200_OK, response_class=JSONResponse)
async def get_user_claims(current_user=Depends(get_current_user)) -> UserClaims:
    return current_user
