from pydantic import BaseModel, Field, ConfigDict
import datetime


class CreateScheduleRequest(BaseModel):
    room_id: int = Field(..., description="The unique identifier of the room")
    date: datetime.date = Field(
        ...,
        description="The date for which the schedule is being created in YYYY-MM-DD format",
    )
    start_time: datetime.time = Field(
        ..., description="The start time of the scheduled slot in HH:MM:SS format"
    )
    end_time: datetime.time = Field(
        ..., description="The end time of the scheduled slot in HH:MM:SS format"
    )
    purpose: str = Field(..., description="The purpose of the scheduled slot")
    team_members: str = Field(
        ...,
        description="A comma-separated string of team member names involved in the schedule",
    )

    model_config = ConfigDict(from_attributes=True)


class ScheduleDetail(BaseModel):
    id: int = Field(..., description="The unique identifier of the schedule")
    room_id: int = Field(..., description="The unique identifier of the room")
    room_name: str = Field(..., description="The name of the room")
    lecturer_id: int = Field(..., description="The unique identifier of the lecturer")
    lecturer_name: str = Field(..., description="The full name of the lecturer")
    building_id: int = Field(..., description="The unique identifier of the building")
    building_name: str = Field(..., description="The name of the building")
    date: datetime.date = Field(..., description="The date of the schedule")
    start_time: datetime.time = Field(
        ..., description="The start time of the scheduled slot"
    )
    purpose: str = Field(..., description="The purpose of the scheduled slot")
    team_members: str = Field(
        ...,
        description="A comma-separated string of team member names involved in the schedule",
    )
    created_at: datetime.datetime = Field(
        ..., description="The datetime when the schedule was created"
    )

    model_config = ConfigDict(from_attributes=True)


class CreateScheduleResponse(BaseModel):
    schedule: list[ScheduleDetail] = Field(
        ..., description="The details of the created schedule"
    )

    model_config = ConfigDict(from_attributes=True)


class ListSchedulesResponse(BaseModel):
    schedules: list[ScheduleDetail] = Field(
        ..., description="A list of schedule details"
    )

    model_config = ConfigDict(from_attributes=True)


class PersonalListSchedulesResponse(BaseModel):
    lecturer_id: int = Field(..., description="The unique identifier of the lecturer")
    schedules: list[ScheduleDetail] = Field(
        ..., description="A list of personal schedule details"
    )

    model_config = ConfigDict(from_attributes=True)
