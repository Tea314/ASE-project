from pydantic import BaseModel, ConfigDict, EmailStr, Field
from scams_backend.constants.user import UserRole


class UserSignUpRequest(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    password: str = Field(..., min_length=8, description="The user's password")
    full_name: str = Field(..., description="The full name of the user")
    role: UserRole = Field(..., description="The role of the user")
    model_config = ConfigDict(from_attributes=True)


class UserSignUpResponse(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    role: UserRole = Field(..., description="The role of the user")
    full_name: str = Field(..., description="The full name of the user")
    model_config = ConfigDict(from_attributes=True)
