INSERT INTO buildings (name) VALUES
('A1 - Science Building'),
('B5 - General Lecture Hall'),
('C3 - Practice Building');

INSERT INTO users (full_name, role, email, hashed_password) VALUES
('Nguyen Thi Alice', 'lecturer', 'lecturer.alice@uni.edu', '$2b$12$0AYtubC2M3Hu1puzHC9xFOqOzGJPca0QfHkI.ALpDlbUKVolhbogy'), -- alice123
('Tran Van Bob', 'lecturer', 'lecturer.bob@uni.edu', '$2b$12$fgdvKxRzWP.6lPRmfh.FceK4Zc1SqCT7Fmq1M1AhknmhiLV4aDRP2'), -- bob456
('Le Hoang Charlie', 'student', 'student.charlie@uni.edu', '$2b$12$V8KD6ER7kSkntmhCLpopCenqYg/DoxPPMeC670k9/qbsaF7tSgk8W'); -- charlie789

INSERT INTO rooms (name, floor_number, building_id, capacity) VALUES
('Lab 101', 1, 1, 25),
('Lecture Room 501', 5, 2, 80),
('Seminar Room 203', 2, 1, 15);

INSERT INTO devices (name) VALUES
('Projector'),
('Smart Interactive Board'),
('High-Performance PC'),
('50-inch Display');

INSERT INTO room_devices (room_id, device_id) VALUES
(1, 1),
(1, 3),
(2, 1),
(2, 2),
(2, 4);

INSERT INTO schedules (room_id, purpose, team_members, date, start_time, lecturer_id) VALUES
(2, 'Basic programming lecture', NULL, '2025-12-10', '08:00:00', 1),
(1, 'Computer networking practice', 'Group A, Group B', '2025-12-10', '10:00:00', 2),
(3, 'Research team meeting', 'Dr. Nam, Ms. Huong', '2025-12-11', '14:00:00', 1);
