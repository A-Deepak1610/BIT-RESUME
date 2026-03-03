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

type IQACAssignRequest struct {
	ConsultancyWorkID   int64  `json:"consultancy_work_id" binding:"required"`
	ConsultancyWorkType string `json:"consultancy_work_type"`
	DepartmentID        int    `json:"department_id" binding:"required"`
	IQACRemarks         string `json:"iqac_remarks"`
}

// GET /api/iqac/consultancyGet
// Returns all consultancy_works with their iqac_assignment, hod_assignment, and faculty_response if present
func HandleIQACGet(c *gin.Context) {
	query := `
		SELECT
			cw.id,
			cw.project_title,
			cw.client_organization,
			cw.work_description,
			cw.expected_completion_date,
			cw.attachment_url,
			cw.status,
			cw.submitted_at,
			ia.id,
			ia.consultancy_work_type,
			ia.department_id,
			d.department_name,
			ia.iqac_remarks,
			ia.assigned_at,
			ha.id, ha.faculty_id, ha.hod_remarks, ha.assigned_at,
			fl.user_name,
			fr.id, fr.response, fr.faculty_remarks, fr.responded_at
		FROM consultancy_works cw
		LEFT JOIN iqac_assignments ia ON ia.consultancy_work_id = cw.id
		LEFT JOIN departments d ON d.id = ia.department_id
		LEFT JOIN hod_assignments ha ON ha.consultancy_work_id = cw.id
		LEFT JOIN login fl ON fl.id = ha.faculty_id
		LEFT JOIN faculty_responses fr ON fr.consultancy_work_id = cw.id
		ORDER BY cw.created_at DESC
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		log.Printf("[iqac] GET error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to fetch works: %v", err)})
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

			iaID       sql.NullInt64
			workType   sql.NullString
			deptID     sql.NullInt64
			deptName   sql.NullString
			remarks    sql.NullString
			assignedAt sql.NullString

			haID          sql.NullInt64
			haFacultyID   sql.NullInt64
			hodRemarks    sql.NullString
			hodAssignedAt sql.NullString
			facultyName   sql.NullString

			frID          sql.NullInt64
			frResponse    sql.NullString
			frRemarks     sql.NullString
			frRespondedAt sql.NullString
		)

		if err := rows.Scan(
			&id, &projectTitle, &clientOrg, &workDesc,
			&expDate, &attURL, &status, &submittedAt,
			&iaID, &workType, &deptID, &deptName, &remarks, &assignedAt,
			&haID, &haFacultyID, &hodRemarks, &hodAssignedAt, &facultyName,
			&frID, &frResponse, &frRemarks, &frRespondedAt,
		); err != nil {
			log.Printf("[iqac] scan error: %v", err)
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
			"iqac_assignment":          nil,
			"hod_assignment":           nil,
			"faculty_response":         nil,
		}

		if expDate.Valid {
			work["expected_completion_date"] = expDate.String
		}
		if attURL.Valid {
			work["attachment_url"] = attURL.String
		}

		if iaID.Valid {
			assignment := map[string]interface{}{
				"id":                    iaID.Int64,
				"consultancy_work_type": "",
				"department_id":         deptID.Int64,
				"department_name":       "",
				"iqac_remarks":          "",
				"assigned_at":           "",
			}
			if workType.Valid {
				assignment["consultancy_work_type"] = workType.String
			}
			if deptName.Valid {
				assignment["department_name"] = deptName.String
			}
			if remarks.Valid {
				assignment["iqac_remarks"] = remarks.String
			}
			if assignedAt.Valid {
				assignment["assigned_at"] = assignedAt.String
			}
			work["iqac_assignment"] = assignment
		}

		if haID.Valid {
			work["hod_assignment"] = map[string]interface{}{
				"id":           haID.Int64,
				"faculty_id":   haFacultyID.Int64,
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

// POST /api/iqac/consultancyAssign
// IQAC assigns a consultancy work to a department
func HandleIQACAssign(c *gin.Context) {
	// Parse JWT cookie directly
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
	assignedByFloat, ok := claims["id"].(float64)
	if !ok || assignedByFloat == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id in token"})
		return
	}
	assignedBy := int64(assignedByFloat)

	var req IQACAssignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check the work exists and is pending_iqac
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
	if currentStatus != "pending_iqac" {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Work is already processed (status: %s)", currentStatus)})
		return
	}

	// Begin transaction
	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to begin transaction"})
		return
	}
	defer tx.Rollback()

	// Insert into iqac_assignments
	insertQuery := `
		INSERT INTO iqac_assignments
			(consultancy_work_id, assigned_by, consultancy_work_type, department_id, iqac_remarks)
		VALUES (?, ?, ?, ?, ?)
	`
	var workTypeVal interface{} = nil
	if req.ConsultancyWorkType != "" {
		workTypeVal = req.ConsultancyWorkType
	}
	var remarksVal interface{} = nil
	if req.IQACRemarks != "" {
		remarksVal = req.IQACRemarks
	}

	_, err = tx.Exec(insertQuery,
		req.ConsultancyWorkID,
		assignedBy,
		workTypeVal,
		req.DepartmentID,
		remarksVal,
	)
	if err != nil {
		log.Printf("[iqac] INSERT iqac_assignments error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create assignment: %v", err)})
		return
	}

	// Update consultancy_works status to pending_hod
	_, err = tx.Exec(
		`UPDATE consultancy_works SET status = 'pending_hod' WHERE id = ?`,
		req.ConsultancyWorkID,
	)
	if err != nil {
		log.Printf("[iqac] UPDATE consultancy_works error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to update work status: %v", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Department assigned successfully"})
}
