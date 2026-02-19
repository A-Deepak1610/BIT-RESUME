-- =====================================================
-- OWI (Outside World Interaction) Database Tables
-- Run these SQL scripts in your MySQL database
-- =====================================================

-- =====================================================
-- Table 1: Industry Advisor
-- =====================================================
CREATE TABLE IF NOT EXISTS industry_advisor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty VARCHAR(255) NOT NULL,
    sig_number VARCHAR(100),
    special_labs_involved VARCHAR(10),
    special_lab VARCHAR(255),
    industry_name VARCHAR(255) NOT NULL,
    domain_area VARCHAR(255),
    industry_type VARCHAR(100),
    industry_type_other VARCHAR(255),
    expert_name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    email_id VARCHAR(255),
    phone_number VARCHAR(20),
    experience_years VARCHAR(50),
    area_of_expertise TEXT,
    industry_address TEXT,
    industry_website VARCHAR(255),
    frequency_of_interaction VARCHAR(50),
    date_of_meeting DATE,
    expense_incurred DECIMAL(10,2),
    suggestions TEXT,
    collaborative_activities TEXT,
    approval_document VARCHAR(500),
    owi_verification VARCHAR(50) DEFAULT 'Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Table 2: Laboratory by Industry
-- =====================================================
CREATE TABLE IF NOT EXISTS laboratory_by_industry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty VARCHAR(255) NOT NULL,
    sig_number VARCHAR(100),
    task_id VARCHAR(100),
    name_of_laboratory VARCHAR(255) NOT NULL,
    collaborative_industry VARCHAR(255) NOT NULL,
    domain_area_of_industry VARCHAR(255),
    laboratory_area DECIMAL(10,2),
    total_amount_incurred DECIMAL(15,2),
    bit_contribution DECIMAL(15,2),
    financial_support_from_industry DECIMAL(15,2),
    equipment_sponsored TEXT,
    equipment_enhancement TEXT,
    layout_design_enhancement TEXT,
    curriculum_mapping TEXT,
    expected_outcomes TEXT,
    proof_document VARCHAR(500),
    owi_verification VARCHAR(50) DEFAULT 'Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Table 3: Professional Membership
-- =====================================================
CREATE TABLE IF NOT EXISTS professional_membership (
    id INT AUTO_INCREMENT PRIMARY KEY,
    membership_category VARCHAR(100),
    faculty VARCHAR(255) NOT NULL,
    task_id VARCHAR(100),
    special_labs_involved VARCHAR(10),
    special_lab VARCHAR(255),
    name_of_professional_body VARCHAR(255) NOT NULL,
    membership_type VARCHAR(100),
    membership_id VARCHAR(255),
    name_of_grade_level_position VARCHAR(255),
    category VARCHAR(100),
    validity_type VARCHAR(100),
    apex_document_proof VARCHAR(500),
    amount DECIMAL(10,2),
    if_others VARCHAR(255),
    amount_if_others DECIMAL(10,2),
    document_proof VARCHAR(500),
    owi_verification VARCHAR(50) DEFAULT 'Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Table 4: Students Industrial Visit
-- =====================================================
CREATE TABLE IF NOT EXISTS students_industrial_visit (
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
    owi_verification VARCHAR(50) DEFAULT 'Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Table 5: Technical Societies
-- =====================================================
CREATE TABLE IF NOT EXISTS technical_societies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    society VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    faculty VARCHAR(255),
    sig_number VARCHAR(100),
    task_id VARCHAR(100),
    owi_verification VARCHAR(50) DEFAULT 'Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- Table 6: Training to Industry
-- =====================================================
CREATE TABLE IF NOT EXISTS training_to_industry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty VARCHAR(255) NOT NULL,
    sig_number VARCHAR(100),
    special_labs_involved VARCHAR(10),
    special_lab VARCHAR(255),
    event_name VARCHAR(255) NOT NULL,
    event_name_other VARCHAR(255),
    industry_name VARCHAR(255) NOT NULL,
    industry_address TEXT,
    domain_area VARCHAR(255),
    industry_type VARCHAR(100),
    industry_type_other VARCHAR(255),
    mode_of_training VARCHAR(50),
    industry_website VARCHAR(255),
    number_of_persons_trained INT,
    duration_days INT,
    start_date DATE,
    end_date DATE,
    outcome_of_training TEXT,
    honorarium_received DECIMAL(10,2),
    communication_proof VARCHAR(500),
    approval_letter VARCHAR(500),
    geotag_photos VARCHAR(500),
    participants_attendance VARCHAR(500),
    payment_proofs VARCHAR(500),
    consolidated_document VARCHAR(500),
    owi_verification VARCHAR(50) DEFAULT 'Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

