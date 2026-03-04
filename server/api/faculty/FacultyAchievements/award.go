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

func HandleAwardForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse form fields
	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	specialLab := c.PostForm("specialLab")
	technicalSocietyInvolved := c.PostForm("technicalSocietyInvolved")
	technicalSocietyChapter := c.PostForm("technicalSocietyChapter")
	typeOfRecognition := c.PostForm("typeOfRecognition")
	awardType := c.PostForm("awardType")
	achievementType := c.PostForm("achievementType")
	awardName := c.PostForm("awardName")
	organizationType := c.PostForm("organizationType")
	otherOrganizationName := c.PostForm("otherOrganizationName")
	awardingAgency := c.PostForm("awardingAgency")
	level := c.PostForm("level")
	receivedDate := c.PostForm("receivedDate")
	natureOfRecognition := c.PostForm("natureOfRecognition")
	prizeAmount := c.PostForm("prizeAmount")

	// Handle file uploads
	uploadDir := "./uploads/faculty/awards"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}


	// Photo Proofs
	photoFile, _ := c.FormFile("photoProofs")
	var photoPath string
	if photoFile != nil {
		photoFilename := fmt.Sprintf("%v_%d_photo_%s", facultyID, time.Now().Unix(), photoFile.Filename)
		photoPath = filepath.Join(uploadDir, photoFilename)
		if err := c.SaveUploadedFile(photoFile, photoPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save photo proofs"})
			return
		}
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

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_award (
		faculty_id, task_id, special_labs_involved, special_lab,
		technical_society_involved, technical_society_chapter,
		type_of_recognition, award_type, achievement_type, award_name,
		organization_type, other_organization_name, awarding_agency,
		level, received_date, nature_of_recognition, prize_amount,
		photo_proofs, document_proof
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, nullString(taskID), nullString(specialLabsInvolved), nullString(specialLab),
		nullString(technicalSocietyInvolved), nullString(technicalSocietyChapter),
		nullString(typeOfRecognition), nullString(awardType), nullString(achievementType),
		nullString(awardName), nullString(organizationType), nullString(otherOrganizationName),
		nullString(awardingAgency), nullString(level), nullString(receivedDate),
		nullString(natureOfRecognition), nullString(prizeAmount),
		nullString(photoPath), nullString(documentPath),
	)

	if err != nil {
		log.Println("Error inserting award:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Award record submitted successfully"})
}

func FetchAward(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, task_id, special_labs_involved, special_lab,
	          technical_society_involved, technical_society_chapter,
	          type_of_recognition, award_type, achievement_type, award_name,
	          organization_type, other_organization_name, awarding_agency,
	          level, received_date, nature_of_recognition, prize_amount,
	          photo_proofs, document_proof, status, remarks, created_at
	          FROM faculty_award WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching award:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var records []map[string]interface{}
	for rows.Next() {
		var (
			id                                               int
			taskID, specialLabsInvolved, specialLab          sql.NullString
			techSocietyInvolved, techSocietyChapter          sql.NullString
			typeRecog, awardType, achievementType, awardName sql.NullString
			orgType, otherOrgName, awardingAgency            sql.NullString
			level, receivedDate, natureRecog, prizeAmount    sql.NullString
			photoProofs, documentProof, status, remarks      sql.NullString
			createdAt                                        []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabsInvolved, &specialLab,
			&techSocietyInvolved, &techSocietyChapter,
			&typeRecog, &awardType, &achievementType, &awardName,
			&orgType, &otherOrgName, &awardingAgency,
			&level, &receivedDate, &natureRecog, &prizeAmount,
			&photoProofs, &documentProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning award:", err)
			continue
		}

		records = append(records, map[string]interface{}{
			"id":                         id,
			"task_id":                    taskID.String,
			"special_labs_involved":      specialLabsInvolved.String,
			"special_lab":                specialLab.String,
			"technical_society_involved": techSocietyInvolved.String,
			"technical_society_chapter":  techSocietyChapter.String,
			"type_of_recognition":        typeRecog.String,
			"award_type":                 awardType.String,
			"achievement_type":           achievementType.String,
			"award_name":                 awardName.String,
			"organization_type":          orgType.String,
			"other_organization_name":    otherOrgName.String,
			"awarding_agency":            awardingAgency.String,
			"level":                      level.String,
			"received_date":              receivedDate.String,
			"nature_of_recognition":      natureRecog.String,
			"prize_amount":               prizeAmount.String,
			"photo_proofs":               photoProofs.String,
			"document_proof":             documentProof.String,
			"status":                     status.String,
			"remarks":                    remarks.String,
			"created_at":                 string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"awards": records})
}
