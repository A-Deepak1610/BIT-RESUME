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

func HandleEventsAttendedForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	taskID := c.PostForm("taskID")
	specialLabs := c.PostForm("specialLabsInvolved")
	eventType := c.PostForm("eventType")
	organizerType := c.PostForm("organizerType")
	eventLevel := c.PostForm("eventLevel")
	eventTitle := c.PostForm("eventTitle")
	organizationSector := c.PostForm("organizationSector")
	eventOrganizer := c.PostForm("eventOrganizer")
	eventMode := c.PostForm("eventMode")
	eventDuration := c.PostForm("eventDuration")
	startDate := c.PostForm("startDate")
	endDate := c.PostForm("endDate")
	durationInDays := c.PostForm("durationInDays")
	otherOrganizerName := c.PostForm("otherOrganizerName")
	sponsorshipType := c.PostForm("sponsorshipType")
	outcome := c.PostForm("outcome")
	claimedFor := c.PostForm("claimedFor")

	uploadDir := "./uploads/faculty/events_attended"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Handle Certificate Proof
	certFile, _ := c.FormFile("certificateProof")
	var certPath string
	if certFile != nil {
		certFilename := fmt.Sprintf("%v_%d_%s", facultyID, time.Now().Unix(), certFile.Filename)
		certPath = filepath.Join(uploadDir, certFilename)
		if err := c.SaveUploadedFile(certFile, certPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save certificate"})
			return
		}
	}

	// Handle Geotag Photos
	geotagFile, _ := c.FormFile("geotagPhotos")
	var geotagPath string
	if geotagFile != nil {
		geotagFilename := fmt.Sprintf("%v_%d_geo_%s", facultyID, time.Now().Unix(), geotagFile.Filename)
		geotagPath = filepath.Join(uploadDir, geotagFilename)
		if err := c.SaveUploadedFile(geotagFile, geotagPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save geotag photo"})
			return
		}
	}

	query := `INSERT INTO faculty_events_attended (
		faculty_id, task_id, special_labs_involved, event_type, 
		organizer_type, event_level, event_title, organization_sector, 
		event_organizer, event_mode, event_duration, start_date, 
		end_date, duration_in_days, other_organizer_name, sponsorship_type, 
		outcome, certificate_proof, geotag_photos, claimed_for
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, taskID, specialLabs, eventType,
		organizerType, eventLevel, eventTitle, organizationSector,
		eventOrganizer, eventMode, eventDuration, startDate,
		endDate, durationInDays, otherOrganizerName, sponsorshipType,
		outcome, certPath, geotagPath, claimedFor,
	)

	if err != nil {
		log.Println("Error inserting events attended:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Events Attended submitted successfully"})
}

func FetchEventsAttended(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, task_id, special_labs_involved, event_type, organizer_type, 
              event_level, event_title, organization_sector, event_organizer, 
              event_mode, event_duration, start_date, end_date, duration_in_days, 
              other_organizer_name, sponsorship_type, outcome, certificate_proof, 
              geotag_photos, claimed_for, status, remarks, created_at 
              FROM faculty_events_attended WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var events []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                                                                      int
			taskID, specialLabs, eType, oType, eLevel, eTitle, oSector, eOrg, eMode, eDur, sDate, eDate, oName, sType, outcome, cert, geo, claimed, status, remarks sql.NullString
			durationDays                                                                                                                                            sql.NullInt64
			createdAt                                                                                                                                               []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &eType, &oType, &eLevel, &eTitle, &oSector,
			&eOrg, &eMode, &eDur, &sDate, &eDate, &durationDays, &oName, &sType,
			&outcome, &cert, &geo, &claimed, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning events attended:", err)
			continue
		}

		events = append(events, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"event_type":            eType.String,
			"organizer_type":        oType.String,
			"event_level":           eLevel.String,
			"event_title":           eTitle.String,
			"organization_sector":   oSector.String,
			"event_organizer":       eOrg.String,
			"event_mode":            eMode.String,
			"event_duration":        eDur.String,
			"start_date":            sDate.String,
			"end_date":              eDate.String,
			"duration_in_days":      durationDays.Int64,
			"other_organizer_name":  oName.String,
			"sponsorship_type":      sType.String,
			"outcome":               outcome.String,
			"certificate_proof":     cert.String,
			"geotag_photos":         geo.String,
			"claimed_for":           claimed.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"eventsAttended": events})
}
