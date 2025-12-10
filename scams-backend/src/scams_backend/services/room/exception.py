from fastapi import HTTPException


class RoomNotFoundException(HTTPException):
    def __init__(self, room_id: int):
        super().__init__(status_code=404, detail=f"Room with ID {room_id} not found.")
