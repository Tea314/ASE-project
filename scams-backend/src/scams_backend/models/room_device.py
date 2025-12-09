from scams_backend.db.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class RoomDevice(Base):
    __tablename__ = "room_devices"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)

    room = relationship("Room", back_populates="room_devices")
    device = relationship("Device", back_populates="room_devices")
