import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from scams_backend.models.building import Building
from scams_backend.models.user import User
from scams_backend.models.room import Room
from scams_backend.models.device import Device
from scams_backend.models.room_device import RoomDevice
from scams_backend.models.schedule import Schedule
from scams_backend.utils.hash import hash_email
from scams_backend.utils.encrypt import encrypt_data
from scams_backend.services.password.password_service import PasswordService
from scams_backend.db.base import Base

# Adjust this to match your actual database URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://your_user:your_password@localhost:5433/postgres",
)

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()


def seed():
    # Buildings
    buildings = [
        Building(name="A1 - Science Building"),
        Building(name="B5 - General Lecture Hall"),
        Building(name="C3 - Practice Building"),
    ]
    session.add_all(buildings)
    session.flush()  # To get IDs

    # Users
    users = [
        User(
            full_name=encrypt_data("Nguyen Thi Alice"),
            role="lecturer",
            email=encrypt_data("lecturer.alice@uni.edu"),
            email_hash=hash_email("lecturer.alice@uni.edu"),
            hashed_password=PasswordService.hash_password("alice123"),
        ),
        User(
            full_name=encrypt_data("Tran Van Bob"),
            role="lecturer",
            email=encrypt_data("lecturer.bob@uni.edu"),
            email_hash=hash_email("lecturer.bob@uni.edu"),
            hashed_password=PasswordService.hash_password("bob456456"),
        ),
        User(
            full_name=encrypt_data("Le Hoang Charlie"),
            role="student",
            email=encrypt_data("student.charlie@uni.edu"),
            email_hash=hash_email("student.charlie@uni.edu"),
            hashed_password=PasswordService.hash_password("charlie789"),
        ),
    ]
    session.add_all(users)
    session.flush()

    # Rooms
    rooms = [
        Room(
            name="Lab 101",
            image_url="https://pub-e5b45195a0b9403bbc59b58841ffffd9.r2.dev/lab.png",
            floor_number=1,
            building_id=buildings[0].id,
            capacity=25,
        ),
        Room(
            name="Lecture Room 501",
            image_url="https://pub-e5b45195a0b9403bbc59b58841ffffd9.r2.dev/lecture.png",
            floor_number=5,
            building_id=buildings[1].id,
            capacity=80,
        ),
        Room(
            name="Seminar Room 203",
            image_url="https://pub-e5b45195a0b9403bbc59b58841ffffd9.r2.dev/seminar.png",
            floor_number=2,
            building_id=buildings[0].id,
            capacity=15,
        ),
    ]
    session.add_all(rooms)
    session.flush()

    # Devices
    devices = [
        Device(name="Projector"),
        Device(name="Smart Interactive Board"),
        Device(name="High-Performance PC"),
        Device(name="50-inch Display"),
    ]
    session.add_all(devices)
    session.flush()

    # Room Devices
    room_devices = [
        RoomDevice(room_id=rooms[0].id, device_id=devices[0].id),
        RoomDevice(room_id=rooms[0].id, device_id=devices[2].id),
        RoomDevice(room_id=rooms[1].id, device_id=devices[0].id),
        RoomDevice(room_id=rooms[1].id, device_id=devices[1].id),
        RoomDevice(room_id=rooms[1].id, device_id=devices[3].id),
    ]
    session.add_all(room_devices)

    # Schedules
    schedules = [
        Schedule(
            room_id=rooms[1].id,
            purpose=encrypt_data("Basic programming lecture"),
            team_members=None,
            date="2025-12-10",
            start_time="08:00:00",
            lecturer_id=users[0].id,
        ),
        Schedule(
            room_id=rooms[0].id,
            purpose=encrypt_data("Computer networking practice"),
            team_members=encrypt_data("Group A, Group B"),
            date="2025-12-10",
            start_time="10:00:00",
            lecturer_id=users[1].id,
        ),
        Schedule(
            room_id=rooms[2].id,
            purpose=encrypt_data("Research team meeting"),
            team_members=encrypt_data("Dr. Nam, Ms. Huong"),
            date="2025-12-11",
            start_time="14:00:00",
            lecturer_id=users[0].id,
        ),
    ]
    session.add_all(schedules)

    session.commit()
    print("Seed data inserted successfully.")


if __name__ == "__main__":
    seed()
