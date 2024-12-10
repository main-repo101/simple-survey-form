CREATE DATABASE IF NOT EXISTS simple_survey_form_db;

USE simple_survey_form_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);

INSERT IGNORE INTO users (username, password_hash, role)
VALUES
    ('admin123', '$2a$12$J0zVFxx3zlEHfbCoEVCSg.9lXi.pW.punnbZ38VOzd7GVTyaRxZEe', 'admin'),
    ('user321', '$2a$12$fuW5En./EKFpFx/.8O.jXOBAQy./A59BLeC9cyD0XyTBptEZ6Qma2', 'user');
