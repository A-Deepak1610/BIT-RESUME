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

// HODAssignRequest is the body for POST /api/hod/consultancyAssign
type HODAssignRequest struct {
	ConsultancyWorkID int64  `json:"consultancy_work_id" binding:"required"`
	IQACAssignmentID  int64  `json:"iqac_assignment_id" binding:"required"`
	FacultyID         int64  `json:"faculty_id" binding:"required"`
	HODRemarks        string `json:"hod_remarks"`
}

// GET /api/hod/consultancyGet
// Returns all consultancy works that IQAC has assigned (no department filter - single HOD)
func HandleHODGet(c *gin.Context) {
	cookie, err := c.Cookie("BITRESUME")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing auth cookie"})
		return
	}
	_, err = utils.ParseJWT(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	query := `
		SELECT
			cw.id, cw.project_title, cw.client_organization, cw.work_description,
			cw.expected_completion_date, cw.attachment_url, cw.status, cw.submitted_at,
			ia.id, ia.consultancy_work_type, ia.department_id, ia.iqac_remarks, ia.assigned_at,
			d.department_name,
			ha.id, ha.faculty_id, ha.hod_remarks, ha.assigned_at,
			fl.user_name,
			fr.id, fr.response, fr.faculty_remarks, fr.responded_at
		FROM consultancy_works cw
		JOIN iqac_assignments ia ON ia.consultancy_work_id = cw.id
		JOIN departments d ON d.id = ia.department_id
		LEFT JOIN hod_assignments ha ON ha.consultancy_work_id = cw.id
		LEFT JOIN login fl ON fl.id = ha.faculty_id
		LEFT JOIN faculty_responses fr ON fr.consultancy_work_id = cw.id
		WHERE cw.status IN ('pending_hod', 'pending_faculty', 'completed', 'faculty_rejected')
		ORDER BY cw.created_at DESC
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		log.Printf("[hod] query error: %v", err)
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
			deptID         int64
			iqacRemarks    sql.NullString
			iqacAssignedAt string

			deptName string

			haID          sql.NullInt64
			facultyID     sql.NullInt64
			hodRemarks    sql.NullString
			hodAssignedAt sql.NullString

			facultyName sql.NullString

			frID          sql.NullInt64
			frResponse    sql.NullString
			frRemarks     sql.NullString
			frRespondedAt sql.NullString
		)

		if err := rows.Scan(
			&id, &projectTitle, &clientOrg, &workDesc,
			&expDate, &attURL, &status, &submittedAt,
			&iaID, &workType, &deptID, &iqacRemarks, &iqacAssignedAt,
			&deptName,
			&haID, &facultyID, &hodRemarks, &hodAssignedAt,
			&facultyName,
			&frID, &frResponse, &frRemarks, &frRespondedAt,
		); err != nil {
			log.Printf("[hod] scan error: %v", err)
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
				"department_id":         deptID,
				"department_name":       deptName,
				"iqac_remarks":          stringOrEmpty(iqacRemarks),
				"assigned_at":           iqacAssignedAt,
			},
			"hod_assignment":   nil,
			"faculty_response": nil,
		}

		if expDate.Valid {
			work["expected_completion_date"] = expDate.String
		}
		if attURL.Valid {
			work["attachment_url"] = attURL.String
		}

		if haID.Valid {
			work["hod_assignment"] = map[string]interface{}{
				"id":           haID.Int64,
				"faculty_id":   facultyID.Int64,
				"faculty_name": stringOrEmpty(facultyName),
				"hod_remarks":  stringOrEmpty(hodRemarks),
				"assigned_at":  stringOrEmpty(hodAssignedAt),
			}
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

// GET /api/hod/facultyList
// Returns all faculty members (single HOD - no department filter)
func HandleHODFacultyList(c *gin.Context) {
	cookie, err := c.Cookie("BITRESUME")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing auth cookie"})
		return
	}
	_, err = utils.ParseJWT(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	rows, err := config.DB.Query(`
		SELECT id, user_name
		FROM login
		WHERE role = 'faculty'
		ORDER BY user_name ASC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", err)})
		return
	}
	defer rows.Close()

	type FacultyItem struct {
		ID   int64  `json:"id"`
		Name string `json:"name"`
	}
	var list []FacultyItem
	for rows.Next() {
		var f FacultyItem
		if err := rows.Scan(&f.ID, &f.Name); err != nil {
			continue
		}
		list = append(list, f)
	}
	if list == nil {
		list = []FacultyItem{}
	}
	c.JSON(http.StatusOK, gin.H{"data": list})
}

// POST /api/hod/consultancyAssign
// HOD assigns a faculty member to a consultancy work
func HandleHODAssign(c *gin.Context) {
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
	idFloat, ok := claims["id"].(float64)
	if !ok || idFloat == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id in token"})
		return
	}
	assignedBy := int64(idFloat)

	var req HODAssignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate work exists and is pending_hod
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
	if currentStatus != "pending_hod" {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Work is not pending HOD assignment (status: %s)", currentStatus)})
		return
	}

	// Begin transaction
	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to begin transaction"})
		return
	}
	defer tx.Rollback()

	// Insert into hod_assignments
	var remarksVal interface{} = nil
	if req.HODRemarks != "" {
		remarksVal = req.HODRemarks
	}

	_, err = tx.Exec(`
		INSERT INTO hod_assignments
			(consultancy_work_id, iqac_assignment_id, assigned_by, faculty_id, hod_remarks)
		VALUES (?, ?, ?, ?, ?)
	`,
		req.ConsultancyWorkID,
		req.IQACAssignmentID,
		assignedBy,
		req.FacultyID,
		remarksVal,
	)
	if err != nil {
		log.Printf("[hod] INSERT hod_assignments error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create assignment: %v", err)})
		return
	}

	// Update status to pending_faculty
	_, err = tx.Exec(
		`UPDATE consultancy_works SET status = 'pending_faculty' WHERE id = ?`,
		req.ConsultancyWorkID,
	)
	if err != nil {
		log.Printf("[hod] UPDATE consultancy_works error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to update work status: %v", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Faculty assigned successfully"})
}

// stringOrEmpty safely unwraps a sql.NullString
func stringOrEmpty(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}
