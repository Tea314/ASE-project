from pydantic import BaseModel, Field, ConfigDict


class LecturerResponse(BaseModel):
    id: int = Field(..., description="The unique identifier of the lecturer")
    name: str = Field(..., description="The name of the lecturer")
    department: str = Field(..., description="The department of the lecturer")

    model_config = ConfigDict(from_attributes=True)
