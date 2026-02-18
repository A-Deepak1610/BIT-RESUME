package outsideworld

import (
	"bitresume/config"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func HandleExternalVipVisitForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse all form fields
	formData := map[string]string{
		"faculty":                c.PostForm("faculty"),
		"taskID":                 c.PostForm("taskID"),
		"specialLabsInvolved":    c.PostForm("specialLabsInvolved"),
		"specialLab":             c.PostForm("specialLab"),
		"guestBelongsToIndustry": c.PostForm("guestBelongsToIndustry"),
		"eventName":              c.PostForm("eventName"),
		"eventType":              c.PostForm("eventType"),
		"category":               c.PostForm("category"),
		"designation":            c.PostForm("designation"),
		"organizationName":       c.PostForm("organizationName"),
		"organizationAddress":    c.PostForm("organizationAddress"),
		"startDate":              c.PostForm("startDate"),
		"endDate":                c.PostForm("endDate"),
		"purposeOfVisit":         c.PostForm("purposeOfVisit"),
		"mobileNumber":           c.PostForm("mobileNumber"),
		"guestEmail":             c.PostForm("guestEmail"),
		"departmentVisit":        c.PostForm("departmentVisit"),
		"topicPresented":         c.PostForm("topicPresented"),
		"isBITAlumni":            c.PostForm("isBITAlumni"),
	}

	// Handle file uploads
	uploadDir := "./uploads/faculty/external_vip_visit"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	saveFile := func(fieldName string) string {
		file, _ := c.FormFile(fieldName)
		if file != nil {
			filename := fmt.Sprintf("%v_%d_%s", facultyID, time.Now().Unix(), file.Filename)
			path := filepath.Join(uploadDir, filename)
			if err := c.SaveUploadedFile(file, path); err == nil {
				return path
			}
		}
		return ""
	}

	formalPhotoPath := saveFile("formalPhoto")
	photoProofPath := saveFile("photoProof")
	approvalLetterPath := saveFile("approvalLetter")

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_external_vip_visit (
		faculty, task_id, special_labs_involved, special_lab,
		guest_belongs_to_industry, event_name, event_type, category,
		designation, organization_name, organization_address,
		start_date, end_date, purpose_of_visit, mobile_number,
		guest_email, department_visit, topic_presented, is_bit_alumni,
		formal_photo, photo_proof, approval_letter, verification_status
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initiated')`

	_, err := config.DB.Exec(query,
		nullString(formData["faculty"]), nullString(formData["taskID"]), nullString(formData["specialLabsInvolved"]),
		nullString(formData["specialLab"]), nullString(formData["guestBelongsToIndustry"]),
		nullString(formData["eventName"]), nullString(formData["eventType"]), nullString(formData["category"]),
		nullString(formData["designation"]), nullString(formData["organizationName"]), nullString(formData["organizationAddress"]),
		nullString(formData["startDate"]), nullString(formData["endDate"]), nullString(formData["purposeOfVisit"]),
		nullString(formData["mobileNumber"]), nullString(formData["guestEmail"]), nullString(formData["departmentVisit"]),
		nullString(formData["topicPresented"]), nullString(formData["isBITAlumni"]),
		nullString(formalPhotoPath), nullString(photoProofPath), nullString(approvalLetterPath),
	)

	if err != nil {
		log.Println("Error inserting External VIP Visit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "External VIP Visit submitted successfully"})
}

func FetchExternalVipVisit(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, faculty, task_id, special_labs_involved, special_lab, 
	          guest_belongs_to_industry, event_name, event_type, category, designation, 
			  organization_name, organization_address, start_date, end_date, purpose_of_visit, 
			  mobile_number, guest_email, department_visit, topic_presented, is_bit_alumni, 
			  formal_photo, photo_proof, approval_letter, verification_status, created_at
	          FROM faculty_external_vip_visit WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching External VIP Visit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                       int
			faculty, taskID, specialLabsInvolved, specialLab, guestBelongsToIndustry                 sql.NullString
			eventName, eventType, category, designation, organizationName, organizationAddress       sql.NullString
			startDate, endDate, purposeOfVisit, mobileNumber, guestEmail, departmentVisit            sql.NullString
			topicPresented, isBITAlumni, formalPhoto, photoProof, approvalLetter, verificationStatus sql.NullString
			createdAt                                                                                []uint8
		)

		if err := rows.Scan(&id, &faculty, &taskID, &specialLabsInvolved, &specialLab,
			&guestBelongsToIndustry, &eventName, &eventType, &category, &designation,
			&organizationName, &organizationAddress, &startDate, &endDate, &purposeOfVisit,
			&mobileNumber, &guestEmail, &departmentVisit, &topicPresented, &isBITAlumni,
			&formalPhoto, &photoProof, &approvalLetter, &verificationStatus, &createdAt); err != nil {
			log.Println("Error scanning External VIP Visit:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                        id,
			"faculty":                   faculty.String,
			"task_id":                   taskID.String,
			"special_labs_involved":     specialLabsInvolved.String,
			"special_lab":               specialLab.String,
			"guest_belongs_to_industry": guestBelongsToIndustry.String,
			"event_name":                eventName.String,
			"event_type":                eventType.String,
			"category":                  category.String,
			"designation":               designation.String,
			"organization_name":         organizationName.String,
			"organization_address":      organizationAddress.String,
			"start_date":                startDate.String,
			"end_date":                  endDate.String,
			"purpose_of_visit":          purposeOfVisit.String,
			"mobile_number":             mobileNumber.String,
			"guest_email":               guestEmail.String,
			"department_visit":          departmentVisit.String,
			"topic_presented":           topicPresented.String,
			"is_bit_alumni":             isBITAlumni.String,
			"formal_photo":              formalPhoto.String,
			"photo_proof":               photoProof.String,
			"approval_letter":           approvalLetter.String,
			"verification_status":       verificationStatus.String,
			"created_at":                string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"externalVipVisits": results})
}
