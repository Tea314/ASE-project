from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from scams_backend.db.base import Base
from sqlalchemy import func


class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    # purpose = Column(String(255), nullable=False)
    # team_members = Column(String(500), nullable=True)
    purpose = Column(String(512), nullable=False)  # encrypted
    team_members = Column(String(1024), nullable=True)  # encrypted

    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    lecturer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(
        DateTime, nullable=False, server_default=func.current_timestamp()
    )

    room = relationship("Room", back_populates="schedules")
    lecturer = relationship("User", back_populates="schedules")
