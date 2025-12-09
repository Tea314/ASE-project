from pydantic import BaseModel, Field, ConfigDict


class DeviceResponse(BaseModel):
    id: int = Field(..., description="The unique identifier of the device")
    name: str = Field(..., description="The name of the device")

    model_config = ConfigDict(from_attributes=True)
