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

func HandlePaperPresentationForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	otherAuthorsBIT := c.PostForm("otherAuthorsBIT")
	facultyOtherInstitute := c.PostForm("facultyOtherInstitute")
	industrialPersonInvolved := c.PostForm("industrialPersonInvolved")
	internationalCollaboration := c.PostForm("internationalCollaboration")
	conferenceName := c.PostForm("conferenceName")
	eventMode := c.PostForm("eventMode")
	eventOrganizer := c.PostForm("eventOrganizer")
	otherEventOrganizer := c.PostForm("otherEventOrganizer")
	eventLevel := c.PostForm("eventLevel")
	paperTitle := c.PostForm("paperTitle")
	eventStartDate := c.PostForm("eventStartDate")
	eventEndDate := c.PostForm("eventEndDate")
	eventDurationDays := c.PostForm("eventDurationDays")
	publishedInProceedings := c.PostForm("publishedInProceedings")
	typeOfSponsorship := c.PostForm("typeOfSponsorship")
	otherTypeOfSponsorship := c.PostForm("otherTypeOfSponsorship")
	studentsInvolved := c.PostForm("studentsInvolved")
	registrationAmount := c.PostForm("registrationAmount")
	awardCashPrizeReceiver := c.PostForm("awardCashPrizeReceiver")

	uploadDir := "./uploads/faculty/paper_presentation"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Handle Document Proof
	docFile, _ := c.FormFile("documentProof")
	var docPath string
	if docFile != nil {
		docFilename := fmt.Sprintf("%v_%d_%s", facultyID, time.Now().Unix(), docFile.Filename)
		docPath = filepath.Join(uploadDir, docFilename)
		if err := c.SaveUploadedFile(docFile, docPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document"})
			return
		}
	}

	query := `INSERT INTO faculty_paper_presentation (
		faculty_id, task_id, special_labs_involved, other_authors_bit, 
		faculty_other_institute, industrial_person_involved, international_collaboration,
		conference_name, event_mode, event_organizer, other_event_organizer,
		event_level, paper_title, event_start_date, event_end_date, 
		event_duration_days, published_in_proceedings, type_of_sponsorship,
		other_type_of_sponsorship, students_involved, registration_amount,
		document_proof, award_cash_prize_receiver
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, taskID, specialLabsInvolved, otherAuthorsBIT,
		facultyOtherInstitute, industrialPersonInvolved, internationalCollaboration,
		conferenceName, eventMode, eventOrganizer, otherEventOrganizer,
		eventLevel, paperTitle, eventStartDate, eventEndDate,
		eventDurationDays, publishedInProceedings, typeOfSponsorship,
		otherTypeOfSponsorship, studentsInvolved, registrationAmount,
		docPath, awardCashPrizeReceiver,
	)

	if err != nil {
		log.Println("Error inserting paper presentation:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Paper Presentation submitted successfully"})
}

func FetchPaperPresentation(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, task_id, special_labs_involved, other_authors_bit, 
              faculty_other_institute, industrial_person_involved, international_collaboration,
              conference_name, event_mode, event_organizer, other_event_organizer,
              event_level, paper_title, event_start_date, event_end_date, 
              event_duration_days, published_in_proceedings, type_of_sponsorship,
              other_type_of_sponsorship, students_involved, registration_amount,
              document_proof, award_cash_prize_receiver, status, remarks, created_at 
              FROM faculty_paper_presentation WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var papers []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                                                                                                                                         int
			taskID, specialLabs, otherAuthors, facultyOther, industrial, intlCollab, confName, eMode, eOrg, otherOrg, eLevel, pTitle, sDate, eDate, pubProc, sponsor, otherSponsor, students, regAmt, docProof, award, status, remarks sql.NullString
			durationDays                                                                                                                                                                                                               sql.NullInt64
			createdAt                                                                                                                                                                                                                  []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &otherAuthors, &facultyOther, &industrial, &intlCollab,
			&confName, &eMode, &eOrg, &otherOrg, &eLevel, &pTitle, &sDate, &eDate,
			&durationDays, &pubProc, &sponsor, &otherSponsor, &students, &regAmt,
			&docProof, &award, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning paper presentation:", err)
			continue
		}

		papers = append(papers, map[string]interface{}{
			"id":                          id,
			"task_id":                     taskID.String,
			"special_labs_involved":       specialLabs.String,
			"other_authors_bit":           otherAuthors.String,
			"faculty_other_institute":     facultyOther.String,
			"industrial_person_involved":  industrial.String,
			"international_collaboration": intlCollab.String,
			"conference_name":             confName.String,
			"event_mode":                  eMode.String,
			"event_organizer":             eOrg.String,
			"other_event_organizer":       otherOrg.String,
			"event_level":                 eLevel.String,
			"paper_title":                 pTitle.String,
			"event_start_date":            sDate.String,
			"event_end_date":              eDate.String,
			"event_duration_days":         durationDays.Int64,
			"published_in_proceedings":    pubProc.String,
			"type_of_sponsorship":         sponsor.String,
			"other_type_of_sponsorship":   otherSponsor.String,
			"students_involved":           students.String,
			"registration_amount":         regAmt.String,
			"document_proof":              docProof.String,
			"award_cash_prize_receiver":   award.String,
			"status":                      status.String,
			"remarks":                     remarks.String,
			"created_at":                  string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"paperPresentations": papers})
}
