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

	// Basic Info
	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	specialLab := c.PostForm("specialLab")

	// Event Details
	eventType := c.PostForm("eventType")
	otherEventType := c.PostForm("otherEventType")
	psDomain := c.PostForm("psDomain")
	psDomainLevel := c.PostForm("psDomainLevel")
	topicName := c.PostForm("topicName")

	// Organizer Details
	organizerType := c.PostForm("organizerType")
	industryNameText := c.PostForm("industryNameText")
	industryAddress := c.PostForm("industryAddress")
	industryNameSelect := c.PostForm("industryNameSelect")
	instituteName := c.PostForm("instituteName")
	otherOrganizerName := c.PostForm("otherOrganizerName")

	// Event Info
	eventLevel := c.PostForm("eventLevel")
	eventTitle := c.PostForm("eventTitle")
	organizationSector := c.PostForm("organizationSector")
	eventOrganizer := c.PostForm("eventOrganizer")
	eventMode := c.PostForm("eventMode")
	eventLocation := c.PostForm("eventLocation")
	eventDuration := c.PostForm("eventDuration")
	startDate := c.PostForm("startDate")
	endDate := c.PostForm("endDate")
	durationInDays := c.PostForm("durationInDays")

	// Sponsorship
	sponsorshipType := c.PostForm("sponsorshipType")
	fundingAgencyName := c.PostForm("fundingAgencyName")
	amount := c.PostForm("amount")

	// Outcome
	outcome := c.PostForm("outcome")
	otherOutcome := c.PostForm("otherOutcome")

	uploadDir := "./uploads/faculty/events_attended"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Handle Apex Proof
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

	// Handle Certificate Proof
	certFile, _ := c.FormFile("certificateProof")
	var certPath string
	if certFile != nil {
		certFilename := fmt.Sprintf("%v_%d_cert_%s", facultyID, time.Now().Unix(), certFile.Filename)
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
		faculty_id, task_id, special_labs_involved, special_lab,
		event_type, other_event_type, ps_domain, ps_domain_level, topic_name,
		organizer_type, industry_name_text, industry_address, industry_name_select, institute_name, other_organizer_name,
		event_level, event_title, organization_sector, event_organizer, event_mode, event_location,
		event_duration, start_date, end_date, duration_in_days,
		sponsorship_type, funding_agency_name, amount,
		outcome, other_outcome,
		apex_proof, certificate_proof, geotag_photos
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, taskID, specialLabsInvolved, specialLab,
		eventType, otherEventType, psDomain, psDomainLevel, topicName,
		organizerType, industryNameText, industryAddress, industryNameSelect, instituteName, otherOrganizerName,
		eventLevel, eventTitle, organizationSector, eventOrganizer, eventMode, eventLocation,
		eventDuration, startDate, endDate, durationInDays,
		sponsorshipType, fundingAgencyName, amount,
		outcome, otherOutcome,
		apexPath, certPath, geotagPath,
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

	query := `SELECT id, task_id, special_labs_involved, special_lab,
		event_type, other_event_type, ps_domain, ps_domain_level, topic_name,
		organizer_type, industry_name_text, industry_address, industry_name_select, institute_name, other_organizer_name,
		event_level, event_title, organization_sector, event_organizer, event_mode, event_location,
		event_duration, start_date, end_date, duration_in_days,
		sponsorship_type, funding_agency_name, amount,
		outcome, other_outcome,
		apex_proof, certificate_proof, geotag_photos,
		verification_status, remarks, created_at
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
			id                                                                                                      int
			taskID, specialLabs, specialLab                                                                         sql.NullString
			eventType, otherEventType, psDomain, psDomainLevel, topicName                                           sql.NullString
			organizerType, industryNameText, industryAddress, industryNameSelect, instituteName, otherOrganizerName sql.NullString
			eventLevel, eventTitle, organizationSector, eventOrganizer, eventMode, eventLocation                    sql.NullString
			eventDuration, startDate, endDate                                                                       sql.NullString
			durationInDays                                                                                          sql.NullInt64
			sponsorshipType, fundingAgencyName                                                                      sql.NullString
			amount                                                                                                  sql.NullFloat64
			outcome, otherOutcome                                                                                   sql.NullString
			apexProof, certProof, geotagPhotos                                                                      sql.NullString
			status, remarks                                                                                         sql.NullString
			createdAt                                                                                               []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &specialLab,
			&eventType, &otherEventType, &psDomain, &psDomainLevel, &topicName,
			&organizerType, &industryNameText, &industryAddress, &industryNameSelect, &instituteName, &otherOrganizerName,
			&eventLevel, &eventTitle, &organizationSector, &eventOrganizer, &eventMode, &eventLocation,
			&eventDuration, &startDate, &endDate, &durationInDays,
			&sponsorshipType, &fundingAgencyName, &amount,
			&outcome, &otherOutcome,
			&apexProof, &certProof, &geotagPhotos,
			&status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning events attended:", err)
			continue
		}

		events = append(events, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"special_lab":           specialLab.String,
			"event_type":            eventType.String,
			"other_event_type":      otherEventType.String,
			"ps_domain":             psDomain.String,
			"ps_domain_level":       psDomainLevel.String,
			"topic_name":            topicName.String,
			"organizer_type":        organizerType.String,
			"industry_name_text":    industryNameText.String,
			"industry_address":      industryAddress.String,
			"industry_name_select":  industryNameSelect.String,
			"institute_name":        instituteName.String,
			"other_organizer_name":  otherOrganizerName.String,
			"event_level":           eventLevel.String,
			"event_title":           eventTitle.String,
			"organization_sector":   organizationSector.String,
			"event_organizer":       eventOrganizer.String,
			"event_mode":            eventMode.String,
			"event_location":        eventLocation.String,
			"event_duration":        eventDuration.String,
			"start_date":            startDate.String,
			"end_date":              endDate.String,
			"duration_in_days":      durationInDays.Int64,
			"sponsorship_type":      sponsorshipType.String,
			"funding_agency_name":   fundingAgencyName.String,
			"amount":                amount.Float64,
			"outcome":               outcome.String,
			"other_outcome":         otherOutcome.String,
			"apex_proof":            apexProof.String,
			"certificate_proof":     certProof.String,
			"geotag_photos":         geotagPhotos.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"eventsAttended": events})
}
