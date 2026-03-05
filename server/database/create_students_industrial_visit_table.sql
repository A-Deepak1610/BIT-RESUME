-- =====================================================
-- Create faculty_students_industrial_visit table
-- =====================================================

USE bitresume;

CREATE TABLE IF NOT EXISTS faculty_students_industrial_visit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty VARCHAR(255) NOT NULL,
    sig_number VARCHAR(100),
    task_id VARCHAR(100),
    programme VARCHAR(50),
    industry_name VARCHAR(255) NOT NULL,
    domain_area VARCHAR(255),
    industry_type VARCHAR(100),
    industry_type_other VARCHAR(255),
    industry_location TEXT,
    industry_website VARCHAR(255),
    contact_person_name VARCHAR(255),
    contact_person_designation VARCHAR(255),
    contact_person_email VARCHAR(255),
    contact_person_phone VARCHAR(20),
    visit_start_date DATE,
    visit_end_date DATE,
    year_of_study VARCHAR(50),
    number_of_students INT,
    male_students INT,
    female_students INT,
    purpose_of_visit TEXT,
    faculty1 VARCHAR(255),
    faculty2 VARCHAR(255),
    faculty3 VARCHAR(255),
    source_of_arrangement VARCHAR(100),
    curriculum_mapping TEXT,
    outcome_of_visit TEXT,
    proof_document VARCHAR(500),
    verification_status VARCHAR(50) DEFAULT 'Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Verify table was created
SHOW TABLES LIKE 'faculty_students_industrial_visit';
DESCRIBE faculty_students_industrial_visit;
