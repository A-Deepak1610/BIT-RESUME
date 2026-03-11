-- =====================================================
-- Migration: Link faculty_consultancy to the
-- principal-submitted consultancy_works workflow.
--
-- Run once against your MySQL database.
-- =====================================================

-- 1. Add consultancy_work_id so every OWI entry can be
--    traced back to the principal's workflow record.
ALTER TABLE faculty_consultancy
    ADD COLUMN IF NOT EXISTS consultancy_work_id INT NULL
        COMMENT 'FK to consultancy_works.id — set when submitted via workflow'
        AFTER faculty_id;

-- 2. Add rent_agreement file path (new document in multi-step form).
ALTER TABLE faculty_consultancy
    ADD COLUMN IF NOT EXISTS rent_agreement VARCHAR(500) NULL
        AFTER non_disclosure_agreement;

-- 3. Index for fast lookup of all consultancy entries per workflow.
ALTER TABLE faculty_consultancy
    ADD INDEX IF NOT EXISTS idx_fc_work_id (consultancy_work_id);

-- =====================================================
-- NOTE: consultancy_works.status values used by this
-- workflow (no schema change needed — VARCHAR column):
--   pending_iqac            → principal submitted
--   pending_hod             → IQAC assigned to dept
--   pending_faculty         → HOD assigned to faculty
--   form_pending            → faculty accepted; filling drone/project form
--   consultancy_form_pending→ drone/project form done; filling consultancy form  ← NEW
--   completed               → consultancy form submitted; visible to IQAC OWI
--   faculty_rejected        → faculty rejected
-- =====================================================
