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
// Returns consultancy works assigned to this HOD's department only
func HandleHODGet(c *gin.Context) {
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
	hodIDFloat, ok := claims["id"].(float64)
	if !ok || hodIDFloat == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id in token"})
		return
	}
	hodID := int64(hodIDFloat)

	// Resolve the department assigned to this HOD
	var hodDeptID int64
	err = config.DB.QueryRow(
		`SELECT department_id FROM hod_department WHERE hod_id = ?`, hodID,
	).Scan(&hodDeptID)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusOK, gin.H{"data": []map[string]interface{}{}})
		return
	}
	if err != nil {
		log.Printf("[hod] hod_department lookup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", err)})
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
		WHERE cw.status IN ('pending_hod', 'pending_faculty', 'form_pending', 'completed', 'faculty_rejected')
		  AND ia.department_id = ?
		ORDER BY cw.created_at DESC
	`

	rows, err := config.DB.Query(query, hodDeptID)
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
			"form_data":        nil,
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

		if status == "completed" {
			work["form_data"] = FetchFormDataForWork(id)
		}

		works = append(works, work)
	}

	if works == nil {
		works = []map[string]interface{}{}
	}

	c.JSON(http.StatusOK, gin.H{"data": works})
}

// GET /api/hod/facultyList
// Returns only faculty members mapped to this HOD via hod_faculty_mapping
func HandleHODFacultyList(c *gin.Context) {
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
	hodIDFloat, ok := claims["id"].(float64)
	if !ok || hodIDFloat == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id in token"})
		return
	}
	hodID := int64(hodIDFloat)

	rows, err := config.DB.Query(`
		SELECT l.id, l.user_name
		FROM login l
		JOIN hod_faculty_mapping hfm ON hfm.faculty_id = l.id
		WHERE hfm.hod_id = ?
		ORDER BY l.user_name ASC
	`, hodID)
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

	// Validate faculty is mapped to this HOD
	var mappingCount int
	err = config.DB.QueryRow(
		`SELECT COUNT(*) FROM hod_faculty_mapping WHERE hod_id = ? AND faculty_id = ?`,
		assignedBy, req.FacultyID,
	).Scan(&mappingCount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error checking faculty mapping: %v", err)})
		return
	}
	if mappingCount == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Selected faculty is not assigned under your department"})
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

	// Notify the faculty member via email (async)
	go notifyFacultyOnHODAssign(req.ConsultancyWorkID, req.FacultyID, req.HODRemarks)

	c.JSON(http.StatusCreated, gin.H{"message": "Faculty assigned successfully"})
}

// notifyFacultyOnHODAssign fetches project + faculty email and sends a notification.
func notifyFacultyOnHODAssign(workID, facultyID int64, hodRemarks string) {
	var projectTitle, clientOrg string
	if err := config.DB.QueryRow(
		`SELECT project_title, client_organization FROM consultancy_works WHERE id = ?`, workID,
	).Scan(&projectTitle, &clientOrg); err != nil {
		log.Printf("[email] fetch work for faculty notify failed: %v", err)
		return
	}

	var facultyEmail string
	if err := config.DB.QueryRow(
		`SELECT user_email FROM login WHERE id = ? AND user_email IS NOT NULL AND user_email != ''`, facultyID,
	).Scan(&facultyEmail); err != nil {
		log.Printf("[email] fetch faculty email failed (id=%d): %v", facultyID, err)
		return
	}

	remarks := hodRemarks
	if remarks == "" {
		remarks = "—"
	}

	subject := fmt.Sprintf("Consultancy Work Assigned to You — %s", projectTitle)
	body := utils.ConsultancyAssignedToFacultyEmailBody(projectTitle, clientOrg, remarks)
	if err := utils.SendMail([]string{facultyEmail}, subject, body); err != nil {
		log.Printf("[email] faculty notification failed: %v", err)
	}
}

// POST /api/hod/consultancyReassign
// HOD reassigns a different faculty after previous faculty rejected
func HandleHODReassign(c *gin.Context) {
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

	// Validate faculty is mapped to this HOD
	var mappingCount int
	err = config.DB.QueryRow(
		`SELECT COUNT(*) FROM hod_faculty_mapping WHERE hod_id = ? AND faculty_id = ?`,
		assignedBy, req.FacultyID,
	).Scan(&mappingCount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error checking faculty mapping: %v", err)})
		return
	}
	if mappingCount == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Selected faculty is not assigned under your department"})
		return
	}

	// Validate work status is faculty_rejected
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
	if currentStatus != "faculty_rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Work cannot be reassigned (status: %s)", currentStatus)})
		return
	}

	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to begin transaction"})
		return
	}
	defer tx.Rollback()

	// Clear previous faculty response and hod assignment
	if _, err = tx.Exec(`DELETE FROM faculty_responses WHERE consultancy_work_id = ?`, req.ConsultancyWorkID); err != nil {
		log.Printf("[hod] DELETE faculty_responses (reassign) error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to clear faculty response: %v", err)})
		return
	}
	if _, err = tx.Exec(`DELETE FROM hod_assignments WHERE consultancy_work_id = ?`, req.ConsultancyWorkID); err != nil {
		log.Printf("[hod] DELETE hod_assignments (reassign) error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to clear hod assignment: %v", err)})
		return
	}

	// Insert new hod_assignment
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
		log.Printf("[hod] INSERT hod_assignments (reassign) error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create re-assignment: %v", err)})
		return
	}

	// Set status back to pending_faculty
	_, err = tx.Exec(
		`UPDATE consultancy_works SET status = 'pending_faculty' WHERE id = ?`,
		req.ConsultancyWorkID,
	)
	if err != nil {
		log.Printf("[hod] UPDATE consultancy_works (reassign) error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to update work status: %v", err)})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Faculty reassigned successfully"})
}

// GET /api/hod/myDepartment
// Returns the HOD's assigned department name and id
func HandleHODMyDepartment(c *gin.Context) {
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
	hodIDFloat, ok := claims["id"].(float64)
	if !ok || hodIDFloat == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id in token"})
		return
	}
	hodID := int64(hodIDFloat)

	var deptID int64
	var deptName string
	err = config.DB.QueryRow(`
		SELECT hd.department_id, d.department_name
		FROM hod_department hd
		JOIN departments d ON d.id = hd.department_id
		WHERE hd.hod_id = ?
	`, hodID).Scan(&deptID, &deptName)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusOK, gin.H{"department_id": nil, "department_name": ""})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", err)})
		return
	}
	c.JSON(http.StatusOK, gin.H{"department_id": deptID, "department_name": deptName})
}

// stringOrEmpty safely unwraps a sql.NullString
func stringOrEmpty(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}
