USE simple_survey_form_db;

CREATE TABLE IF NOT EXISTS survey_responses_vii (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    year VARCHAR(9) NOT NULL,
    program ENUM('Regular', 'Irregular', 'Special Program', 'Evening Program') NOT NULL,
    answer VARCHAR(255) NOT NULL,
    remarks TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);