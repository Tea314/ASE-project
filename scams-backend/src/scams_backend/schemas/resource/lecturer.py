from pydantic import BaseModel, Field, ConfigDict


class LecturerDetail(BaseModel):
    id: int = Field(..., description="The unique identifier of the lecturer")
    full_name: str = Field(..., description="The full name of the lecturer")

    model_config = ConfigDict(from_attributes=True)


class LecturerListResponse(BaseModel):
    lecturers: list[LecturerDetail] = Field(..., description="List of lecturers")

    model_config = ConfigDict(from_attributes=True)
