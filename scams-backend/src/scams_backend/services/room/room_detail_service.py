from sqlalchemy import select
from sqlalchemy.orm import Session
from scams_backend.models.room import Room
from scams_backend.models.building import Building
from scams_backend.models.device import Device
from scams_backend.models.room_device import RoomDevice
from scams_backend.schemas.room.room_schema import RoomDetailResponse
from scams_backend.services.room.exception import RoomNotFoundException


class RoomDetailService:
    def __init__(self, room_id: int, db_session: Session):
        self.room_id = room_id
        self.db_session: Session = db_session
        self.room_detail = None

    def get_room_detail(self) -> None:
        stmt = (
            select(
                Room.id,
                Room.building_id,
                Room.image_url,
                Room.name,
                Room.floor_number,
                Room.capacity,
                Building.name.label("building_name"),
                Device.id.label("device_id"),
                Device.name.label("device_name"),
            )
            .join(Building, Room.building_id == Building.id, isouter=True)
            .join(RoomDevice, Room.id == RoomDevice.room_id, isouter=True)
            .join(Device, RoomDevice.device_id == Device.id, isouter=True)
            .where(Room.id == self.room_id)
        )
        results = self.db_session.execute(stmt).all()

        if not results:
            raise RoomNotFoundException(self.room_id)

        room_info = results[0]

        devices = [
            {"id": row.device_id, "name": row.device_name}
            for row in results
            if row.device_id and row.device_name
        ]

        self.room_detail = {
            "id": room_info.id,
            "name": room_info.name,
            "image_url": room_info.image_url,
            "building_id": room_info.building_id,
            "floor_number": room_info.floor_number,
            "capacity": room_info.capacity,
            "building_name": room_info.building_name,
            "devices": devices,
        }

    def invoke(self) -> RoomDetailResponse:
        self.get_room_detail()

        return RoomDetailResponse.model_validate(self.room_detail)
