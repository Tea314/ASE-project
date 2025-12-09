from scams_backend.db.base import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), index=True, nullable=False)

    room_devices = relationship("RoomDevice", back_populates="device")
