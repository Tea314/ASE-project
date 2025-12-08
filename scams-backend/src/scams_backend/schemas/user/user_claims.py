from pydantic import BaseModel, Field, ConfigDict, EmailStr
from scams_backend.constants.user import UserRole


class UserClaims(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    role: UserRole = Field(..., description="The role of the user")
    model_config = ConfigDict(from_attributes=True)
