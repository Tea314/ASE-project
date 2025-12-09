from fastapi import HTTPException


class LecturerDoesNotExistException(HTTPException):
    def __init__(self, lecturer_id: int):
        super().__init__(
            status_code=404, detail=f"Lecturer with ID '{lecturer_id}' does not exist."
        )


class ScheduleTimeConflictException(HTTPException):
    def __init__(self, message: str = "Schedule time conflicts with existing entries."):
        super().__init__(status_code=409, detail=message)


class ScheduleCreationException(HTTPException):
    def __init__(self, message: str = "Failed to create schedule entries."):
        super().__init__(status_code=500, detail=message)
