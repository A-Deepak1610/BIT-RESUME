package consultancy

import (
	"bitresume/config"
	"bitresume/utils"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateConsultancyRequest struct {
	ProjectTitle           string `json:"project_title" binding:"required"`
	ClientOrganization     string `json:"client_organization" binding:"required"`
	WorkDescription        string `json:"work_description"`
	ExpectedCompletionDate string `json:"expected_completion_date"`
	AttachmentURL          string `json:"attachment_url"`
}

// POST /api/principal/consultancyPost
func HandleConsultancyPost(c *gin.Context) {
	// Parse JWT cookie directly — no role restriction
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
	userEmail, _ := claims["email"].(string)
	if userEmail == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user identity"})
		return
	}
	// JWT numbers are decoded as float64 by golang-jwt
	userIDFloat, ok := claims["id"].(float64)
	if !ok || userIDFloat == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id in token"})
		return
	}
	userID := int64(userIDFloat)

	var req CreateConsultancyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var completionDate *string
	if req.ExpectedCompletionDate != "" {
		completionDate = &req.ExpectedCompletionDate
	}

	var attachmentURL *string
	if req.AttachmentURL != "" {
		attachmentURL = &req.AttachmentURL
	}

	query := `
		INSERT INTO consultancy_works 
			(project_title, client_organization, work_description, 
			 expected_completion_date, attachment_url, status, submitted_by)
		VALUES (?, ?, ?, ?, ?, 'pending_iqac', ?)
	`

	result, err := config.DB.Exec(query,
		req.ProjectTitle,
		req.ClientOrganization,
		req.WorkDescription,
		completionDate,
		attachmentURL,
		userID,
	)
	if err != nil {
		log.Printf("[consultancy] INSERT error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to submit consultancy work: %v", err)})
		return
	}

	insertedID, _ := result.LastInsertId()

	// Fetch and return the created record
	var work struct {
		ID                     int64  `json:"id"`
		ProjectTitle           string `json:"project_title"`
		ClientOrganization     string `json:"client_organization"`
		WorkDescription        string `json:"work_description"`
		ExpectedCompletionDate string `json:"expected_completion_date"`
		AttachmentURL          string `json:"attachment_url"`
		Status                 string `json:"status"`
		SubmittedAt            string `json:"submitted_at"`
	}

	var expDate, attURL sql.NullString

	fetchQuery := `
		SELECT id, project_title, client_organization, work_description,
		       expected_completion_date, attachment_url, status, submitted_at
		FROM consultancy_works WHERE id = ?
	`
	err = config.DB.QueryRow(fetchQuery, insertedID).Scan(
		&work.ID, &work.ProjectTitle, &work.ClientOrganization,
		&work.WorkDescription, &expDate, &attURL,
		&work.Status, &work.SubmittedAt,
	)
	if err != nil {
		log.Printf("[consultancy] SELECT after INSERT error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Record saved but fetch failed: %v", err)})
		return
	}

	if expDate.Valid {
		work.ExpectedCompletionDate = expDate.String
	}
	if attURL.Valid {
		work.AttachmentURL = attURL.String
	}

	// Notify all IQAC users via email (async — never blocks the response)
	go notifyIQACOnSubmit(work.ProjectTitle, work.ClientOrganization, work.SubmittedAt)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Consultancy work submitted successfully",
		"data":    work,
	})
}

// notifyIQACOnSubmit fetches the single IQAC user's email and sends a notification.
func notifyIQACOnSubmit(projectTitle, clientOrg, submittedAt string) {
	var iqacEmail string
	err := config.DB.QueryRow(
		`SELECT user_email FROM login WHERE role = 'IQAC' AND user_email IS NOT NULL AND user_email != '' LIMIT 1`,
	).Scan(&iqacEmail)
	if err == sql.ErrNoRows {
		log.Println("[email] no IQAC user found, skipping notification")
		return
	}
	if err != nil {
		log.Printf("[email] failed to query IQAC email: %v", err)
		return
	}

	displayDate := submittedAt
	if t, err := time.Parse("2006-01-02 15:04:05", submittedAt); err == nil {
		displayDate = t.Format("02 Jan 2006, 03:04 PM")
	}

	subject := fmt.Sprintf("New Consultancy Work Submitted — %s", projectTitle)
	body := utils.ConsultancySubmittedEmailBody(projectTitle, clientOrg, displayDate)
	if err := utils.SendMail([]string{iqacEmail}, subject, body); err != nil {
		log.Printf("[email] IQAC notification failed: %v", err)
	}
}

// GET /api/principal/consultancyGet
func HandleConsultancyGet(c *gin.Context) {

	query := `
		SELECT
			cw.id, cw.project_title, cw.client_organization, cw.work_description,
			cw.expected_completion_date, cw.attachment_url, cw.status, cw.submitted_at,
			ia.id, ia.consultancy_work_type, ia.department_id, d.department_name, ia.iqac_remarks, ia.assigned_at,
			ha.id, ha.faculty_id, ha.hod_remarks, ha.assigned_at,
			fl.user_name,
			fr.id, fr.response, fr.faculty_remarks, fr.responded_at
		FROM consultancy_works cw
		LEFT JOIN iqac_assignments ia ON ia.consultancy_work_id = cw.id
		LEFT JOIN departments d ON d.id = ia.department_id
		LEFT JOIN hod_assignments ha ON ha.consultancy_work_id = cw.id
		LEFT JOIN login fl ON fl.id = ha.faculty_id
		LEFT JOIN faculty_responses fr ON fr.consultancy_work_id = cw.id
		WHERE cw.status != 'faculty_rejected'
		ORDER BY cw.created_at DESC
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch consultancy works"})
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

			iaID         sql.NullInt64
			workType     sql.NullString
			deptID       sql.NullInt64
			deptName     sql.NullString
			remarks      sql.NullString
			iaAssignedAt sql.NullString

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
			&iaID, &workType, &deptID, &deptName, &remarks, &iaAssignedAt,
			&haID, &haFacultyID, &hodRemarks, &hodAssignedAt, &facultyName,
			&frID, &frResponse, &frRemarks, &frRespondedAt,
		); err != nil {
			log.Printf("[principal] scan error: %v", err)
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
			"form_data":                nil,
		}

		if expDate.Valid {
			work["expected_completion_date"] = expDate.String
		}
		if attURL.Valid {
			work["attachment_url"] = attURL.String
		}

		if iaID.Valid {
			work["iqac_assignment"] = map[string]interface{}{
				"id": iaID.Int64,
				"consultancy_work_type": func() string {
					if workType.Valid {
						return workType.String
					}
					return ""
				}(),
				"department_id": func() int64 {
					if deptID.Valid {
						return deptID.Int64
					}
					return 0
				}(),
				"department_name": func() string {
					if deptName.Valid {
						return deptName.String
					}
					return ""
				}(),
				"iqac_remarks": func() string {
					if remarks.Valid {
						return remarks.String
					}
					return ""
				}(),
				"assigned_at": func() string {
					if iaAssignedAt.Valid {
						return iaAssignedAt.String
					}
					return ""
				}(),
			}
		}

		if haID.Valid {
			work["hod_assignment"] = map[string]interface{}{
				"id": haID.Int64,
				"faculty_id": func() int64 {
					if haFacultyID.Valid {
						return haFacultyID.Int64
					}
					return 0
				}(),
				"faculty_name": func() string {
					if facultyName.Valid {
						return facultyName.String
					}
					return ""
				}(),
				"hod_remarks": func() string {
					if hodRemarks.Valid {
						return hodRemarks.String
					}
					return ""
				}(),
				"assigned_at": func() string {
					if hodAssignedAt.Valid {
						return hodAssignedAt.String
					}
					return ""
				}(),
			}
		}

		if frID.Valid {
			work["faculty_response"] = map[string]interface{}{
				"id": frID.Int64,
				"response": func() string {
					if frResponse.Valid {
						return frResponse.String
					}
					return ""
				}(),
				"faculty_remarks": func() string {
					if frRemarks.Valid {
						return frRemarks.String
					}
					return ""
				}(),
				"responded_at": func() string {
					if frRespondedAt.Valid {
						return frRespondedAt.String
					}
					return ""
				}(),
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
