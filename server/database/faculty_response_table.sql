-- Faculty Response table for Consultancy Workflow
-- Run this after hod_assignments table exists

CREATE TABLE IF NOT EXISTS faculty_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consultancy_work_id INT NOT NULL,
    hod_assignment_id   INT NOT NULL,
    faculty_id          INT NOT NULL,
    response            ENUM('accepted', 'rejected') NOT NULL,
    faculty_remarks     TEXT,
    responded_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consultancy_work_id) REFERENCES consultancy_works(id),
    FOREIGN KEY (faculty_id)          REFERENCES login(id)
);
