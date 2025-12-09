from scams_backend.db.base import Base
from sqlalchemy import Column, Integer, String
from scams_backend.constants.user import UserRole
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role = Column(String(50), nullable=False, default=UserRole.STUDENT)
    email = Column(String(320), unique=True, index=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)

    schedules = relationship("Schedule", back_populates="lecturer")
