-- =====================================================
-- Table: faculty_consultancy
-- Stores all data submitted via ConsultancyForm.jsx
-- Drop and re-create if migrating from old schema.
-- =====================================================

CREATE TABLE IF NOT EXISTS faculty_consultancy (

    -- ─── Identity ────────────────────────────────────
    id                              INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id                      VARCHAR(255),           -- JWT rollNo of the submitting faculty

    -- ─── Step 1 · Faculty Info ────────────────────────
    faculty                         VARCHAR(255) NOT NULL,
    task_id                         VARCHAR(100),
    consultancy_claiming_department VARCHAR(255),
    special_labs_involved           VARCHAR(10),            -- Yes | No
    special_lab                     VARCHAR(255),

    number_of_additional_faculty    TINYINT UNSIGNED DEFAULT 0,

    faculty2                        VARCHAR(255),
    faculty2_sig                    VARCHAR(100),
    faculty2_requirements           TEXT,

    faculty3                        VARCHAR(255),
    faculty3_sig                    VARCHAR(100),
    faculty3_requirements           TEXT,

    faculty4                        VARCHAR(255),
    faculty4_sig                    VARCHAR(100),
    faculty4_requirements           TEXT,

    faculty5                        VARCHAR(255),
    faculty5_sig                    VARCHAR(100),
    faculty5_requirements           TEXT,

    -- ─── Step 2 · Project Details ────────────────────
    consultancy_project_title       VARCHAR(500) NOT NULL,
    consultancy_category            VARCHAR(100),           -- Service Based | Product based
    type_of_consultant              VARCHAR(100),           -- Industry | Institute
    sector_of_consultant            VARCHAR(100),           -- Private | Government
    scope_of_work                   VARCHAR(255),
    core_sector                     VARCHAR(100),
    organization_name               VARCHAR(255),
    organization_address            TEXT,

    -- ─── Step 3 · Timeline & Origin ──────────────────
    duration_unit                   VARCHAR(20),            -- Year | Month | Day
    duration_value                  SMALLINT UNSIGNED,
    from_date                       DATE,
    to_date                         DATE,

    is_mou_result                   VARCHAR(10),            -- Yes | No
    mou_name                        VARCHAR(255),
    is_irp_result                   VARCHAR(10),            -- Yes | No
    irp_visits                      TEXT,
    is_fesem_related                VARCHAR(10),            -- Yes | No
    is_roi_related                  VARCHAR(10),            -- Yes | No

    -- ─── Step 4 · Financials ─────────────────────────
    consultancy_amount              DECIMAL(15, 2),
    included_with_gst               VARCHAR(10),            -- Yes | No
    amount_after_gst                DECIMAL(15, 2),
    date_of_payment                 DATE,
    ownership_rights_desc           TEXT,
    consultant_agreement_desc       TEXT,

    -- ─── Step 5 · Resource Utilization ───────────────
    college_resources_utilized      VARCHAR(10),            -- Yes | No
    list_resources                  TEXT,

    college_transport_utilized      VARCHAR(10),            -- Yes | No
    transport_area_visited          VARCHAR(255),
    distance_travelled              DECIMAL(10, 2),
    default_petrol_cost             DECIMAL(10, 2),
    transport_cost                  DECIMAL(10, 2),

    college_consumables_utilized    VARCHAR(10),            -- Yes | No
    list_consumables                TEXT,
    consumables_charge              DECIMAL(10, 2),

    -- ─── Step 6 · Share Distribution ─────────────────
    share_percentage_split          VARCHAR(20),            -- 60-40 | 70-30
    faculty_share_amount_before     DECIMAL(15, 2),
    institute_share_amount_before   DECIMAL(15, 2),
    net_faculty_share               DECIMAL(15, 2),
    net_institute_share             DECIMAL(15, 2),
    based_on_faculty_count          TINYINT UNSIGNED,

    -- ─── Step 7 · Documents (stored file paths) ──────
    consolidated_document           VARCHAR(500) NOT NULL,  -- required
    consultancy_agreement           VARCHAR(500),
    communication_proof             VARCHAR(500),
    audit_documents                 VARCHAR(500),
    work_logs_proof                 VARCHAR(500),
    invoice_receipt                 VARCHAR(500),
    transaction_proof               VARCHAR(500),
    geotag_photos                   VARCHAR(500),
    consultancy_report_proof        VARCHAR(500),
    visiting_card                   VARCHAR(500),
    partnership_deed                VARCHAR(500),
    noc_business_premises           VARCHAR(500),
    nda_mutual                      VARCHAR(500),
    rent_agreement                  VARCHAR(500),

    -- ─── Verification ────────────────────────────────
    verification_status             VARCHAR(50) NOT NULL DEFAULT 'Initiated',
                                                            -- Initiated | Approved | Rejected

    -- ─── Audit ───────────────────────────────────────
    created_at                      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    -- ─── Indexes ─────────────────────────────────────
    INDEX idx_faculty_id            (faculty_id),
    INDEX idx_verification_status   (verification_status),
    INDEX idx_created_at            (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
