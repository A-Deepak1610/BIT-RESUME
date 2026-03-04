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

func HandleJournalReviewerForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse form fields
	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	specialLab := c.PostForm("specialLab")
	journalName := c.PostForm("journalName")
	journalIndexing := c.PostForm("journalIndexing")
	otherJournalIndexing := c.PostForm("otherJournalIndexing")
	issnNo := c.PostForm("issnNo")
	publisherName := c.PostForm("publisherName")
	impactFactor := c.PostForm("impactFactor")
	journalHomepageURL := c.PostForm("journalHomepageURL")
	recognitionType := c.PostForm("recognitionType")
	otherRecognitionType := c.PostForm("otherRecognitionType")
	numberOfPapersReviewed := c.PostForm("numberOfPapersReviewed")
	reviewDate := c.PostForm("date")

	// Handle file upload
	uploadDir := "./uploads/faculty/journal_reviewer"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

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
	query := `INSERT INTO faculty_journal_reviewer (
		faculty_id, task_id, special_labs_involved, special_lab, journal_name, 
		journal_indexing, other_journal_indexing, issn_no, publisher_name,
		impact_factor, journal_homepage_url, recognition_type, other_recognition_type,
		number_of_papers_reviewed, review_date, document_proof
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, nullString(taskID), nullString(specialLabsInvolved),
		nullString(specialLab), nullString(journalName), nullString(journalIndexing),
		nullString(otherJournalIndexing), nullString(issnNo), nullString(publisherName),
		nullString(impactFactor), nullString(journalHomepageURL), nullString(recognitionType),
		nullString(otherRecognitionType), nullString(numberOfPapersReviewed),
		nullString(reviewDate), nullString(documentPath),
	)

	if err != nil {
		log.Println("Error inserting journal reviewer:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Journal Reviewer record submitted successfully"})
}

func FetchJournalReviewer(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, task_id, special_labs_involved, special_lab, journal_name, 
	          journal_indexing, other_journal_indexing, issn_no, publisher_name,
	          impact_factor, journal_homepage_url, recognition_type, other_recognition_type,
	          number_of_papers_reviewed, review_date, document_proof, status, remarks, created_at
	          FROM faculty_journal_reviewer WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching journal reviewer:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var records []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                   int
			taskID, specialLabsInvolved, specialLab, journalName, journalIndexing, otherIndexing sql.NullString
			issnNo, publisherName, impactFactor, journalURL                                      sql.NullString
			recognitionType, otherRecognition, documentProof, status, remarks                    sql.NullString
			reviewDate                                                                           sql.NullString
			numberOfPapers                                                                       sql.NullInt64
			createdAt                                                                            []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabsInvolved, &specialLab, &journalName,
			&journalIndexing, &otherIndexing, &issnNo, &publisherName,
			&impactFactor, &journalURL, &recognitionType, &otherRecognition,
			&numberOfPapers, &reviewDate, &documentProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning journal reviewer:", err)
			continue
		}

		records = append(records, map[string]interface{}{
			"id":                        id,
			"task_id":                   taskID.String,
			"special_labs_involved":     specialLabsInvolved.String,
			"special_lab":               specialLab.String,
			"journal_name":              journalName.String,
			"journal_indexing":          journalIndexing.String,
			"other_journal_indexing":    otherIndexing.String,
			"issn_no":                   issnNo.String,
			"publisher_name":            publisherName.String,
			"impact_factor":             impactFactor.String,
			"journal_homepage_url":      journalURL.String,
			"recognition_type":          recognitionType.String,
			"other_recognition_type":    otherRecognition.String,
			"number_of_papers_reviewed": numberOfPapers.Int64,
			"review_date":               reviewDate.String,
			"document_proof":            documentProof.String,
			"status":                    status.String,
			"remarks":                   remarks.String,
			"created_at":                string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"journalReviewer": records})
}
