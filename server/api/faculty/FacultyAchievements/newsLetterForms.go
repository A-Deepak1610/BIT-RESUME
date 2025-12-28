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

	// "github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin"
)

// HandleNewsLetterForms handles the submission of newsletter forms
func HandleNewsLetterForms(c *gin.Context) {
	facultyID := c.GetString("rollNo") // Assuming 'rollNo' is the faculty ID set by middleware
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse form fields
	newsletterCategory := c.PostForm("newsletterCategory")
	department := c.PostForm("department")
	academicYear := c.PostForm("academicYear")
	dateOfPublication := c.PostForm("dateOfPublication")
	volumeNumber := c.PostForm("volumeNumber")
	issueNumber := c.PostForm("issueNumber")
	issueMonth := c.PostForm("issueMonth")
	facultyEditorCount := c.PostForm("facultyEditorCount")
	studentEditorCount := c.PostForm("studentEditorCount")

	// Handle File Upload
	file, err := c.FormFile("proofDocument")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Proof document is required"})
		return
	}

	// Create directory if it doesn't exist (safety check)
	uploadDir := "uploads/faculty/newsletters"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	// Generate unique filename to avoid collisions
	filename := fmt.Sprintf("%s_%d_%s", facultyID, time.Now().Unix(), filepath.Base(file.Filename))
	filePath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		log.Println("Error saving file:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Prepare SQL Insert
	query := `
		INSERT INTO faculty_newsletter_archive (
			faculty_id, newsletter_category, department, academic_year, 
			date_of_publication, volume_number, issue_number, issue_month, 
			faculty_editor_count, student_editor_count, proof_document, status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
	`

	// Handle optional fields for SQL (convert empty strings to NULL if strictly needed, 
	// but usually empty strings are fine if not identifying NULL specifically. 
	// However, schema says NULL. Let's send NULL if empty for department/academic_year to be clean.)
	
	var departmentVal, academicYearVal interface{}
	if department == "" {
		departmentVal = nil
	} else {
		departmentVal = department
	}

	if academicYear == "" {
		academicYearVal = nil
	} else {
		academicYearVal = academicYear
	}

	_, err = config.DB.Exec(query,
		facultyID, newsletterCategory, departmentVal, academicYearVal,
		dateOfPublication, volumeNumber, issueNumber, issueMonth,
		facultyEditorCount, studentEditorCount, filePath,
	)

	if err != nil {
		log.Println("Error inserting newsletter:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Newsletter submitted successfully"})
}

// FetchNewsletters retrieves all newsletters for the logged-in faculty
func FetchNewsletters(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	fmt.Println("Faculty ID:", facultyID)
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `
		SELECT 
			id, newsletter_category, department, academic_year, 
			date_of_publication, volume_number, issue_number, issue_month, 
			faculty_editor_count, student_editor_count, proof_document, 
			status, remarks, created_at 
		FROM faculty_newsletter_archive 
		WHERE faculty_id = ? 
		ORDER BY created_at DESC
	`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching newsletters:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var newsletters []map[string]interface{}

	for rows.Next() {
		var (
			id int
			category, date, vol, issue, month, facCount, stuCount, proof, status string
			dept, year, remarks sql.NullString // Handle nullable fields
			createdAt []uint8
		)

		if err := rows.Scan(
			&id, &category, &dept, &year, 
			&date, &vol, &issue, &month, 
			&facCount, &stuCount, &proof, 
			&status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}

		newsletters = append(newsletters, map[string]interface{}{
			"id":                   id,
			"newsletter_category":  category,
			"department":           dept.String,
			"academic_year":        year.String,
			"date_of_publication":  date,
			"volume_number":        vol,
			"issue_number":         issue,
			"issue_month":          month,
			"faculty_editor_count": facCount,
			"student_editor_count": stuCount,
			"proof_document":       proof,
			"status":               status,
			"remarks":              remarks.String,
			"created_at":           string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"newsletters": newsletters})
}