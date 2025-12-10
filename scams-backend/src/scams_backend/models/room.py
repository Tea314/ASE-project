from scams_backend.db.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), index=True, nullable=False)
    floor_number = Column(Integer, nullable=False)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    capacity = Column(Integer, nullable=False)
    image_url = Column(String(255), nullable=True)
    building = relationship("Building", back_populates="rooms")
    schedules = relationship("Schedule", back_populates="room")
    room_devices = relationship("RoomDevice", back_populates="room")
