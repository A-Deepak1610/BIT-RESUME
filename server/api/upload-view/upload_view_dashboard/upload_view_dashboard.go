package dashboard

import (
	"bitresume/config"
	"bitresume/models/uploadview"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UploadViewDashboard(c *gin.Context) {
	rollno := c.GetString("rollNo")
	query := `
SELECT *
FROM (
    SELECT
        p.id,
        p.title_idea AS title,
        p.summary AS description,
        'Project' AS type,
        p.complexity,
        CASE
            WHEN p.approval_status = 'Pending' THEN 'Pending'
            WHEN p.approval_status = 'Approved' THEN 'Verified'
            WHEN p.approval_status = 'Rejected' THEN 'Rejected'
        END AS status,
        p.created_at AS uploaded_on,
        NULL AS subtype,
        p.rollno,
        COALESCE(pe.faculty_remarks, '') as faculty_remarks
    FROM projects p 
    LEFT JOIN project_evaluation pe ON pe.project_id = p.id
    WHERE p.rollno = ?

    UNION ALL

    SELECT
        i.id,
        i.company_name AS title,
        i.domain AS description,
        'Internship' AS type,
        NULL AS complexity,
        CASE
            WHEN i.status = 'Pending' THEN 'Pending'
            WHEN i.status = 'Approved' THEN 'Verified'
            WHEN i.status = 'Rejected' THEN 'Rejected'
            ELSE i.status
        END AS status,
        i.submitted_on AS uploaded_on,
        NULL AS subtype,
        i.rollno,
        COALESCE(i.faculty_remarks, '') as faculty_remarks
    FROM internships i
    WHERE i.rollno = ?

    UNION ALL

    SELECT
        pp.id,
        pp.paper_title AS title,
        pp.conference_title AS description,
        'Paper Presentation' AS type,
        NULL AS complexity,
        CASE
            WHEN pp.approval_status = 'Pending' THEN 'Pending'
            WHEN pp.approval_status = 'Approved' THEN 'Verified'
            WHEN pp.approval_status = 'Not Approved' THEN 'Rejected'
            ELSE pp.approval_status
        END AS status,
        pp.submitted_on AS uploaded_on,
        NULL AS subtype,
        pp.rollno,
        COALESCE(pp.faculty_remarks, '') as faculty_remarks
    FROM paperpresentation pp
    WHERE pp.rollno = ?

    UNION ALL

    SELECT
        pat.id,
        pat.title AS title,
        pat.summary AS description,
        'Patent' AS type,
        NULL AS complexity,
        CASE
            WHEN pat.patent_status = 'Pending' THEN 'Pending'
            WHEN pat.patent_status = 'Approved' THEN 'Verified'
            WHEN pat.patent_status = 'Rejected' THEN 'Rejected'
            ELSE pat.patent_status
        END AS status,
        pat.submission_date AS uploaded_on,
        NULL AS subtype,
        pat.rollno,
        COALESCE(pat.faculty_remarks, '') as faculty_remarks
    FROM patents pat
    WHERE pat.rollno = ?

    UNION ALL

    SELECT
        ct.id,
        coc.title AS title,
        coc.platform AS description,
        'Certificate' AS type,
        NULL AS complexity,
        CASE
            WHEN ct.status = 'Pending' THEN 'Pending'
            WHEN ct.status = 'Verified' THEN 'Verified'
            WHEN ct.status = 'Rejected' THEN 'Rejected'
            ELSE ct.status
        END AS status,
        ct.created_at AS uploaded_on,
        ct.certificate_type AS subtype,
        ct.rollno,
        COALESCE(coc.faculty_remarks, '') as faculty_remarks
    FROM certificates_type ct
    JOIN certificate_onlinecourses coc ON ct.id = coc.certiificate_id
    WHERE ct.rollno = ?

    UNION ALL

    SELECT
        ct.id,
        ce.event_name AS title,
        ce.summary AS description,
        'Certificate' AS type,
        NULL AS complexity,
        CASE
           WHEN ct.status = 'Pending' THEN 'Pending'
            WHEN ct.status = 'Verified' THEN 'Verified'
            WHEN ct.status = 'Rejected' THEN 'Rejected'
            ELSE ct.status
        END AS status,
        ce.submission_date AS uploaded_on,
        ct.certificate_type AS subtype,
        ct.rollno,
        COALESCE(ce.faculty_remarks, '') as faculty_remarks
    FROM certificates_type ct
    JOIN certificates_events ce ON ct.id = ce.certificate_id
    WHERE ct.rollno = ?

    UNION ALL

    SELECT
        ct.id,
        cv.activity_type AS title,
        cv.summary AS description,
        'Certificate' AS type,
        NULL AS complexity,
        CASE
            WHEN ct.status = 'Pending' THEN 'Pending'
            WHEN ct.status = 'Verified' THEN 'Verified'
            WHEN ct.status = 'Rejected' THEN 'Rejected'
            ELSE ct.status
        END AS status,
        cv.submission_date AS uploaded_on,
        ct.certificate_type AS subtype,
        ct.rollno,
        COALESCE(cv.faculty_reamrks, '') as faculty_remarks
    FROM certificates_type ct
    JOIN certificates_voluntree cv ON ct.id = cv.certificate_id
    WHERE ct.rollno = ?
) AS all_data
ORDER BY 
    CASE status
        WHEN 'Pending' THEN 1
        WHEN 'Verified' THEN 2
        WHEN 'Rejected' THEN 3
        ELSE 4
    END,
    uploaded_on DESC;

	`

	rows, err := config.DB.Query(query, rollno, rollno, rollno, rollno, rollno, rollno, rollno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var uploads []uploadview.UploadView

	for rows.Next() {
		var u uploadview.UploadView
		err := rows.Scan(
			&u.ID,
			&u.Title,
			&u.Description,
			&u.Type,
			&u.Complexity,
			&u.Status,
			&u.UploadedOn,
			&u.Subtype,
			&u.RollNo,
			&u.FacultyRemarks,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		uploads = append(uploads, u)
	}

	c.JSON(http.StatusOK, uploads)
}
