package consultancy

import (
	"bitresume/config"
	"bitresume/utils"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FacultyRespondRequest struct {
	ConsultancyWorkID int64  `json:"consultancy_work_id" binding:"required"`
	HODAssignmentID   int64  `json:"hod_assignment_id" binding:"required"`
	Response          string `json:"response" binding:"required"` // "accepted" or "rejected"
	FacultyRemarks    string `json:"faculty_remarks"`
}

// GET /api/faculty/consultancyGet
// Returns all consultancy works assigned to the logged-in faculty via hod_assignments
func HandleFacultyGet(c *gin.Context) {
	cookie, err := c.Cookie("BITRESUME")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing auth cookie"})
		return
	}
	claims, err := utils.ParseJWT(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}
	userIDFloat, ok := claims["id"].(float64)
	if !ok || userIDFloat == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id in token"})
		return
	}
	facultyID := int64(userIDFloat)

	query := `
		SELECT
			cw.id, cw.project_title, cw.client_organization, cw.work_description,
			cw.expected_completion_date, cw.attachment_url, cw.status, cw.submitted_at,
			ia.id, ia.consultancy_work_type, ia.iqac_remarks, ia.assigned_at,
			d.department_name,
			ha.id, ha.hod_remarks, ha.assigned_at,
			fr.id, fr.response, fr.faculty_remarks, fr.responded_at
		FROM consultancy_works cw
		JOIN hod_assignments ha  ON ha.consultancy_work_id = cw.id AND ha.faculty_id = ?
		JOIN iqac_assignments ia ON ia.consultancy_work_id = cw.id
		JOIN departments d       ON d.id = ia.department_id
		LEFT JOIN faculty_responses fr ON fr.consultancy_work_id = cw.id AND fr.faculty_id = ?
		ORDER BY cw.created_at DESC
	`

	rows, err := config.DB.Query(query, facultyID, facultyID)
	if err != nil {
		log.Printf("[faculty] query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB query error: %v", err)})
		return
	}
	defer rows.Close()

	var works []map[string]interface{}

	for rows.Next() {
		var (
			id           int64
			projectTitle string
			clientOrg    string
			workDesc     string
			expDate      sql.NullString
			attURL       sql.NullString
			status       string
			submittedAt  string

			iaID           int64
			workType       sql.NullString
			iqacRemarks    sql.NullString
			iqacAssignedAt string

			deptName string

			haID          int64
			hodRemarks    sql.NullString
			hodAssignedAt string

			frID          sql.NullInt64
			frResponse    sql.NullString
			frRemarks     sql.NullString
			frRespondedAt sql.NullString
		)

		if err := rows.Scan(
			&id, &projectTitle, &clientOrg, &workDesc,
			&expDate, &attURL, &status, &submittedAt,
			&iaID, &workType, &iqacRemarks, &iqacAssignedAt,
			&deptName,
			&haID, &hodRemarks, &hodAssignedAt,
			&frID, &frResponse, &frRemarks, &frRespondedAt,
		); err != nil {
			log.Printf("[faculty] scan error: %v", err)
			continue
		}

		work := map[string]interface{}{
			"id":                       id,
			"project_title":            projectTitle,
			"client_organization":      clientOrg,
			"work_description":         workDesc,
			"expected_completion_date": "",
			"attachment_url":           "",
			"status":                   status,
			"submitted_at":             submittedAt,
			"iqac_assignment": map[string]interface{}{
				"id":                    iaID,
				"consultancy_work_type": stringOrEmpty(workType),
				"department_name":       deptName,
				"iqac_remarks":          stringOrEmpty(iqacRemarks),
				"assigned_at":           iqacAssignedAt,
			},
			"hod_assignment": map[string]interface{}{
				"id":          haID,
				"hod_remarks": stringOrEmpty(hodRemarks),
				"assigned_at": hodAssignedAt,
			},
			"faculty_response": nil,
		}

		if expDate.Valid {
			work["expected_completion_date"] = expDate.String
		}
		if attURL.Valid {
			work["attachment_url"] = attURL.String
		}

		if frID.Valid {
			work["faculty_response"] = map[string]interface{}{
				"id":              frID.Int64,
				"response":        stringOrEmpty(frResponse),
				"faculty_remarks": stringOrEmpty(frRemarks),
				"responded_at":    stringOrEmpty(frRespondedAt),
			}
		}

		works = append(works, work)
	}

	if works == nil {
		works = []map[string]interface{}{}
	}

	c.JSON(http.StatusOK, gin.H{"data": works})
}

// POST /api/faculty/consultancyRespond
// Faculty accepts or rejects a consultancy work assigned by HOD
func HandleFacultyRespond(c *gin.Context) {
	cookie, err := c.Cookie("BITRESUME")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing auth cookie"})
		return
	}
	claims, err := utils.ParseJWT(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}
	userIDFloat, ok := claims["id"].(float64)
	if !ok || userIDFloat == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id in token"})
		return
	}
	facultyID := int64(userIDFloat)

	var req FacultyRespondRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Response != "accepted" && req.Response != "rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Response must be 'accepted' or 'rejected'"})
		return
	}

	// Validate work exists and is pending_faculty
	var currentStatus string
	err = config.DB.QueryRow(
		`SELECT status FROM consultancy_works WHERE id = ?`, req.ConsultancyWorkID,
	).Scan(&currentStatus)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Consultancy work not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", err)})
		return
	}
	if currentStatus != "pending_faculty" {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Work is not pending faculty response (status: %s)", currentStatus)})
		return
	}

	// Check that this faculty is indeed assigned to this work
	var assignedFaculty int64
	err = config.DB.QueryRow(
		`SELECT faculty_id FROM hod_assignments WHERE id = ? AND consultancy_work_id = ?`,
		req.HODAssignmentID, req.ConsultancyWorkID,
	).Scan(&assignedFaculty)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not assigned to this work"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", err)})
		return
	}
	if assignedFaculty != facultyID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not assigned to this work"})
		return
	}

	// Begin transaction
	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to begin transaction"})
		return
	}
	defer tx.Rollback()

	// Insert into faculty_responses
	var remarksVal interface{} = nil
	if req.FacultyRemarks != "" {
		remarksVal = req.FacultyRemarks
	}

	_, err = tx.Exec(`
		INSERT INTO faculty_responses
			(consultancy_work_id, hod_assignment_id, faculty_id, response, faculty_remarks)
		VALUES (?, ?, ?, ?, ?)
	`,
		req.ConsultancyWorkID,
		req.HODAssignmentID,
		facultyID,
		req.Response,
		remarksVal,
	)
	if err != nil {
		log.Printf("[faculty] INSERT faculty_responses error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to save response: %v", err)})
		return
	}

	// Update consultancy_works status
	// accepted → form_pending (faculty must now fill the IQAC-assigned form)
	// rejected → faculty_rejected
	newStatus := "form_pending"
	if req.Response == "rejected" {
		newStatus = "faculty_rejected"
	}

	_, err = tx.Exec(
		`UPDATE consultancy_works SET status = ? WHERE id = ?`,
		newStatus, req.ConsultancyWorkID,
	)
	if err != nil {
		log.Printf("[faculty] UPDATE consultancy_works error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to update work status: %v", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": fmt.Sprintf("Response '%s' submitted successfully", req.Response)})
}
