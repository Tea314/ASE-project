from pydantic import BaseModel, Field, ConfigDict
import datetime


class RoomScheduleResponse(BaseModel):
    room_id: int = Field(..., description="The unique identifier of the room")
    date: datetime.date = Field(
        ..., description="The date of the schedule in YYYY-MM-DD format"
    )
    scheduled_slots: list[datetime.time] = Field(
        ..., description="List of scheduled time slots for the room"
    )
    model_config = ConfigDict(from_attributes=True)
