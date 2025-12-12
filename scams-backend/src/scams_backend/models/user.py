from scams_backend.db.base import Base
from sqlalchemy import Column, Integer, String
from scams_backend.constants.user import UserRole
from sqlalchemy.orm import relationship
from scams_backend.utils.encrypt import encrypt_data, decrypt_data
from scams_backend.utils.hash import hash_email


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role = Column(String(50), nullable=False, default=UserRole.STUDENT)
    # full_name = Column(String(100), nullable=False)
    # email = Column(String(320), unique=True, index=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)
    full_name = Column(String(512), nullable=False)  # encrypted
    email = Column(String(512), index=True, nullable=False)  # encrypted
    email_hash = Column(
        String(64), unique=True, index=True, nullable=False
    )  # hashed for lookup

    schedules = relationship("Schedule", back_populates="lecturer")
