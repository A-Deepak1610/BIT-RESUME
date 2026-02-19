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

// HandleEContentForm handles the submission of e-content forms
func HandleEContentForm(c *gin.Context) {
	facultyID := c.GetString("rollNo") // Assuming 'rollNo' is the faculty ID set by middleware
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse form fields
	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	eContentType := c.PostForm("eContentType") // Assuming frontend sends this
	topicName := c.PostForm("topicName")
	publisherName := c.PostForm("publisherName")
	publisherAddress := c.PostForm("publisherAddress")
	contactNo := c.PostForm("contactNo")
	urlOfContent := c.PostForm("urlOfContent")
	claimedFor := c.PostForm("claimedFor")
	otherClaimedFor := c.PostForm("otherClaimedFor")
	dateOfPublication := c.PostForm("dateOfPublication")

	// Logic to handle 'Other' in claimedFor
	finalClaimedFor := claimedFor
	if claimedFor == "Other" && otherClaimedFor != "" {
		finalClaimedFor = otherClaimedFor
	}

	// Handle File Upload
	file, err := c.FormFile("documentProof")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Proof document is required"})
		return
	}

	// Create directory if it doesn't exist
	uploadDir := "uploads/faculty/e_content"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	// Generate unique filename
	filename := fmt.Sprintf("%s_%d_%s", facultyID, time.Now().Unix(), filepath.Base(file.Filename))
	filePath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		log.Println("Error saving file:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Prepare SQL Insert
	query := `
		INSERT INTO faculty_e_content (
			faculty_id, task_id, special_labs_involved, e_content_type, 
			topic_name, publisher_name, publisher_address, contact_no, 
			url_of_content, claimed_for, date_of_publication, 
			proof_document, status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
	`

	_, err = config.DB.Exec(query,
		facultyID, taskID, specialLabsInvolved, eContentType,
		topicName, publisherName, publisherAddress, contactNo,
		urlOfContent, finalClaimedFor, dateOfPublication,
		filePath,
	)

	if err != nil {
		log.Println("Error inserting e-content:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "E-Content submitted successfully"})
}

// FetchEContent retrieves all e-content records for the logged-in faculty
func FetchEContent(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `
		SELECT 
			id, task_id, special_labs_involved, e_content_type, 
			topic_name, publisher_name, publisher_address, contact_no, 
			url_of_content, claimed_for, date_of_publication, 
			proof_document, status, remarks, created_at
		FROM faculty_e_content
		WHERE faculty_id = ? 
		ORDER BY created_at DESC
	`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching e-content:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var eContents []map[string]interface{}

	for rows.Next() {
		var (
			id int
			taskID, specialLabs, eType, topic, pubName, pubAddr, contact, url, claimed, date, proof, status sql.NullString
			remarks sql.NullString
			createdAt []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &eType, 
			&topic, &pubName, &pubAddr, &contact, 
			&url, &claimed, &date, 
			&proof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}

		eContents = append(eContents, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"e_content_type":        eType.String,
			"topic_name":            topic.String,
			"publisher_name":        pubName.String,
			"publisher_address":     pubAddr.String,
			"contact_no":            contact.String,
			"url_of_content":        url.String,
			"claimed_for":           claimed.String,
			"date_of_publication":   date.String,
			"proof_document":        proof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"eContent": eContents})
}
