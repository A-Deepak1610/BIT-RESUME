package facultyAchievements

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

func HandleGuestLectureForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse form fields
	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	specialLab := c.PostForm("specialLab")
	eventType := c.PostForm("eventType")
	topic := c.PostForm("topic")
	modeOfConduct := c.PostForm("modeOfConduct")
	eventLevel := c.PostForm("eventLevel")
	eventName := c.PostForm("eventName")
	fromDate := c.PostForm("fromDate")
	toDate := c.PostForm("toDate")
	numberOfDays := c.PostForm("numberOfDays")
	typeOfOrganization := c.PostForm("typeOfOrganization")
	companyName := c.PostForm("companyName")
	companyAddress := c.PostForm("companyAddress")
	numberOfParticipants := c.PostForm("numberOfParticipants")
	typeOfAudience := c.PostForm("typeOfAudience")

	// Handle file uploads
	uploadDir := "./uploads/faculty/guest_lecture"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Document Proof
	documentFile, _ := c.FormFile("documentProof")
	var documentPath string
	if documentFile != nil {
		documentFilename := fmt.Sprintf("%v_%d_doc_%s", facultyID, time.Now().Unix(), documentFile.Filename)
		documentPath = filepath.Join(uploadDir, documentFilename)
		if err := c.SaveUploadedFile(documentFile, documentPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document proof"})
			return
		}
	}

	// Apex Proof (optional)
	apexFile, _ := c.FormFile("apexProof")
	var apexPath string
	if apexFile != nil {
		apexFilename := fmt.Sprintf("%v_%d_apex_%s", facultyID, time.Now().Unix(), apexFile.Filename)
		apexPath = filepath.Join(uploadDir, apexFilename)
		if err := c.SaveUploadedFile(apexFile, apexPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save apex proof"})
			return
		}
	}

	// Sample Photographs
	photosFile, _ := c.FormFile("photos")
	var photosPath string
	if photosFile != nil {
		photosFilename := fmt.Sprintf("%v_%d_photos_%s", facultyID, time.Now().Unix(), photosFile.Filename)
		photosPath = filepath.Join(uploadDir, photosFilename)
		if err := c.SaveUploadedFile(photosFile, photosPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save sample photographs"})
			return
		}
	}

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_guest_lecture (
		faculty_id, task_id, special_labs_involved, special_lab, event_type, topic,
		mode_of_conduct, event_level, event_name, from_date, to_date, number_of_days,
		type_of_organization, company_name, company_address, number_of_participants, type_of_audience,
		document_proof, apex_proof, sample_photographs
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, nullString(taskID), nullString(specialLabsInvolved), nullString(specialLab),
		nullString(eventType), nullString(topic), nullString(modeOfConduct),
		nullString(eventLevel), nullString(eventName), nullString(fromDate),
		nullString(toDate), nullString(numberOfDays), nullString(typeOfOrganization),
		nullString(companyName), nullString(companyAddress), nullString(numberOfParticipants),
		nullString(typeOfAudience), nullString(documentPath), nullString(apexPath),
		nullString(photosPath),
	)

	if err != nil {
		log.Println("Error inserting guest lecture:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Guest Lecture record submitted successfully"})
}

func FetchGuestLecture(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, task_id, special_labs_involved, special_lab, event_type, topic,
	          mode_of_conduct, event_level, event_name, from_date, to_date, number_of_days,
	          type_of_organization, company_name, company_address, number_of_participants, type_of_audience,
	          document_proof, apex_proof, sample_photographs, status, remarks, created_at
	          FROM faculty_guest_lecture WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching guest lecture:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var records []map[string]interface{}
	for rows.Next() {
		var (
			id                                                      int
			taskID, specialLabs, specialLab, eventType, topic       sql.NullString
			modeOfConduct, eventLevel, eventName                    sql.NullString
			fromDate, toDate, numberOfDays                          sql.NullString
			typeOfOrg, companyName, companyAddress, typeOfAudience  sql.NullString
			documentProof, apexProof, samplePhotos, status, remarks sql.NullString
			numberOfParticipants                                    sql.NullInt64
			createdAt                                               []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &specialLab, &eventType, &topic,
			&modeOfConduct, &eventLevel, &eventName, &fromDate, &toDate, &numberOfDays,
			&typeOfOrg, &companyName, &companyAddress, &numberOfParticipants, &typeOfAudience,
			&documentProof, &apexProof, &samplePhotos, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning guest lecture:", err)
			continue
		}

		records = append(records, map[string]interface{}{
			"id":                     id,
			"task_id":                taskID.String,
			"special_labs_involved":  specialLabs.String,
			"special_lab":            specialLab.String,
			"event_type":             eventType.String,
			"topic":                  topic.String,
			"mode_of_conduct":        modeOfConduct.String,
			"event_level":            eventLevel.String,
			"event_name":             eventName.String,
			"from_date":              fromDate.String,
			"to_date":                toDate.String,
			"number_of_days":         numberOfDays.String,
			"type_of_organization":   typeOfOrg.String,
			"company_name":           companyName.String,
			"company_address":        companyAddress.String,
			"number_of_participants": numberOfParticipants.Int64,
			"type_of_audience":       typeOfAudience.String,
			"document_proof":         documentProof.String,
			"apex_proof":             apexProof.String,
			"sample_photographs":     samplePhotos.String,
			"status":                 status.String,
			"remarks":                remarks.String,
			"created_at":             string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"guestLecture": records})
}
