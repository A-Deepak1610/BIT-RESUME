package certificatetypes

import (
	"bitresume/config"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func ReceiveEventsData(c *gin.Context) {
	rollno := c.PostForm("rollno")
	eventName := c.PostForm("event_name")
	eventCode := c.PostForm("event_code")
	participationType := c.PostForm("participation_type")
	teamCode := c.PostForm("team_code")
	didYouWin := c.PostForm("did_you_win")

	// Retrieve the uploaded certificate file
	certificateFile, err := c.FormFile("certificate_pdf")
	if err != nil {
		c.JSON(400, gin.H{"error": "Certificate PDF is required"})
		return
	}

	// Define save path
	saveDir := "uploads/certificates/events"
	savePath := filepath.Join(saveDir, certificateFile.Filename)

	// Ensure the folder exists
	if err := os.MkdirAll(saveDir, os.ModePerm); err != nil {
		c.JSON(500, gin.H{"error": "Failed to create directory for saving certificate"})
		return
	}

	// Save the uploaded file
	if err := c.SaveUploadedFile(certificateFile, savePath); err != nil {
		c.JSON(500, gin.H{"error": "Failed to save certificate file"})
		return
	}

	// Insert into the database
	query := `
		INSERT INTO certificates_events (
			rollno,
			event_name,
			event_code,
			participation_type,
			team_code,
			certificate_pdf,
			did_you_win,
			faculty_name,
			faculty_id,
			stats,
			faculty_remarks,
			submission_date
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE)
	`

	_, err = config.DB.Exec(query,
		rollno,
		eventName,
		eventCode,
		participationType,
		teamCode,
		savePath,
		didYouWin,
		"",     // faculty_name (to be filled later)
		"",     // faculty_id
		"Pending", // status
		"",     // faculty_remarks
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to insert certificate data into database"})
		return
	}

	c.JSON(200, gin.H{"message": "Certificate uploaded successfully"})
}
