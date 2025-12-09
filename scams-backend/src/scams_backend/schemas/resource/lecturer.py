from pydantic import BaseModel, Field, ConfigDict


class LecturerResponse(BaseModel):
    id: int = Field(..., description="The unique identifier of the lecturer")
    full_name: str = Field(..., description="The full name of the lecturer")

    model_config = ConfigDict(from_attributes=True)
