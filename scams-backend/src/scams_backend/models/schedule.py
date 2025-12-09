from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from scams_backend.db.base import Base


class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    purpose = Column(String(255), nullable=False)
    team_members = Column(String(500), nullable=True)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    lecturer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    room = relationship("Room", back_populates="schedules")
    lecturer = relationship("User", back_populates="schedules")
