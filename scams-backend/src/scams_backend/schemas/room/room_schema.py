from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class DeviceInRoomDetailResponse(BaseModel):
    id: int = Field(..., description="The unique identifier of the device")
    name: str = Field(..., description="The name of the device")

    model_config = ConfigDict(from_attributes=True)


class RoomDetailResponse(BaseModel):
    id: int = Field(..., description="The unique identifier of the room")
    name: str = Field(..., description="The name of the room")
    image_url: Optional[str] = Field(None, description="The URL of the room's image")
    floor_number: int = Field(..., description="The floor number of the room")
    building_id: int = Field(..., description="The unique identifier of the building")
    building_name: str = Field(..., description="The building name of the room")
    capacity: int = Field(..., description="The capacity of the room")
    devices: list[DeviceInRoomDetailResponse] = Field(
        ..., description="The list of devices available in the room"
    )
    model_config = ConfigDict(from_attributes=True)


class RoomListResponse(BaseModel):
    rooms: list[RoomDetailResponse] = Field(..., description="The list of rooms")
    model_config = ConfigDict(from_attributes=True)
