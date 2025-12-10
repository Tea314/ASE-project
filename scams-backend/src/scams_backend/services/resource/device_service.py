from sqlalchemy.orm import Session
from scams_backend.schemas.resource.device import DeviceDetail, DeviceListResponse
from scams_backend.models.device import Device


class DeviceService:
    def __init__(self, db_session: Session):
        self.db_session: Session = db_session
        self.devices = []

    def get_devices(self):
        self.devices = self.db_session.query(Device.id, Device.name).all()

    def invoke(self):
        self.get_devices()
        return DeviceListResponse(
            devices=[DeviceDetail.model_validate(device) for device in self.devices]
        )
