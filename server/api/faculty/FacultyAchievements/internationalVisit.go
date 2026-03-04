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

func HandleInternationalVisitForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse form fields
	taskID := c.PostForm("taskID")
	countryVisited := c.PostForm("countryVisited")
	purposeOfVisit := c.PostForm("purposeOfVisit")
	fromDate := c.PostForm("fromDate")
	toDate := c.PostForm("toDate")
	fundType := c.PostForm("fundType")
	fundingAgencyName := c.PostForm("fundingAgencyName")

	// Handle file upload
	uploadDir := "./uploads/faculty/international_visit"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Apex Proof (for Management fund type)
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

	// Document Proof
	documentFile, _ := c.FormFile("documentProof")
	var documentPath string
	if documentFile != nil {
		documentFilename := fmt.Sprintf("%v_%d_%s", facultyID, time.Now().Unix(), documentFile.Filename)
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
	query := `INSERT INTO faculty_international_visit (
		faculty_id, task_id, country_visited, purpose_of_visit,
		from_date, to_date, fund_type, funding_agency_name, apex_proof, document_proof
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, nullString(taskID), nullString(countryVisited),
		nullString(purposeOfVisit), nullString(fromDate), nullString(toDate),
		nullString(fundType), nullString(fundingAgencyName), nullString(apexPath), nullString(documentPath),
	)

	if err != nil {
		log.Println("Error inserting international visit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "International Visit record submitted successfully"})
}

func FetchInternationalVisit(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, task_id, country_visited, purpose_of_visit,
	          from_date, to_date, fund_type, funding_agency_name, apex_proof, document_proof, status, remarks, created_at
	          FROM faculty_international_visit WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching international visit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var records []map[string]interface{}
	for rows.Next() {
		var (
			id                                                               int
			taskID, country, purpose, fundType, fundingAgencyName, apexProof sql.NullString
			documentProof, status, remarks, fromDate, toDate                 sql.NullString
			createdAt                                                        []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &country, &purpose,
			&fromDate, &toDate, &fundType, &fundingAgencyName, &apexProof, &documentProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning international visit:", err)
			continue
		}

		records = append(records, map[string]interface{}{
			"id":                  id,
			"task_id":             taskID.String,
			"country_visited":     country.String,
			"purpose_of_visit":    purpose.String,
			"from_date":           fromDate.String,
			"to_date":             toDate.String,
			"fund_type":           fundType.String,
			"funding_agency_name": fundingAgencyName.String,
			"apex_proof":          apexProof.String,
			"document_proof":      documentProof.String,
			"status":              status.String,
			"remarks":             remarks.String,
			"created_at":          string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"internationalVisit": records})
}
