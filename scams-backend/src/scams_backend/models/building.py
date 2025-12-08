from scams_backend.db.base import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Building(Base):
    __tablename__ = "buildings"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), index=True, nullable=False)

    rooms = relationship("Room", back_populates="building")
