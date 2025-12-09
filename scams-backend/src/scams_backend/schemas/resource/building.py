from pydantic import BaseModel, Field, ConfigDict


class BuildingResponse(BaseModel):
    id: int = Field(..., description="The unique identifier of the building")
    name: str = Field(..., description="The name of the building")

    model_config = ConfigDict(from_attributes=True)
