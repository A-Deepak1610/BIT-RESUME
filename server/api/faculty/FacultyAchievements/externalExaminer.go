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

func HandleExternalExaminerForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse form fields
	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	specialLab := c.PostForm("specialLab")
	collegeName := c.PostForm("collegeName")
	instituteAddress := c.PostForm("instituteAddress")
	purposeOfVisit := c.PostForm("purposeOfVisit")
	nameOfExamination := c.PostForm("nameOfExamination")
	departmentOfQP := c.PostForm("departmentOfQP")
	subjectOfQP := c.PostForm("subjectOfQP")
	numberOfDays := c.PostForm("numberOfDays")
	fromDate := c.PostForm("fromDate")
	toDate := c.PostForm("toDate")

	// Handle file upload
	uploadDir := "./uploads/faculty/external_examiner"
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
	query := `INSERT INTO faculty_external_examiner (
		faculty_id, task_id, special_labs_involved, special_lab, college_name, 
		institute_address, purpose_of_visit, name_of_examination, department_of_qp,
		subject_of_qp, number_of_days, from_date, to_date, document_proof
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, nullString(taskID), nullString(specialLabsInvolved),
		nullString(specialLab), nullString(collegeName), nullString(instituteAddress),
		nullString(purposeOfVisit), nullString(nameOfExamination), nullString(departmentOfQP),
		nullString(subjectOfQP), nullString(numberOfDays),
		nullString(fromDate), nullString(toDate), nullString(documentPath),
	)

	if err != nil {
		log.Println("Error inserting external examiner:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "External Examiner record submitted successfully"})
}

func FetchExternalExaminer(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, task_id, special_labs_involved, special_lab, college_name, 
	          institute_address, purpose_of_visit, name_of_examination, department_of_qp,
	          subject_of_qp, number_of_days, from_date, to_date, document_proof, 
	          status, remarks, created_at
	          FROM faculty_external_examiner WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching external examiner:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var records []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                     int
			taskID, specialLabsInvolved, specialLab, collegeName, address, purpose sql.NullString
			nameOfExamination, departmentOfQP, subjectOfQP                         sql.NullString
			documentProof, status, remarks                                         sql.NullString
			fromDate, toDate                                                       sql.NullString
			numberOfDays                                                           sql.NullInt64
			createdAt                                                              []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabsInvolved, &specialLab, &collegeName,
			&address, &purpose, &nameOfExamination, &departmentOfQP,
			&subjectOfQP, &numberOfDays, &fromDate, &toDate, &documentProof,
			&status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning external examiner:", err)
			continue
		}

		records = append(records, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabsInvolved.String,
			"special_lab":           specialLab.String,
			"college_name":          collegeName.String,
			"institute_address":     address.String,
			"purpose_of_visit":      purpose.String,
			"name_of_examination":   nameOfExamination.String,
			"department_of_qp":      departmentOfQP.String,
			"subject_of_qp":         subjectOfQP.String,
			"number_of_days":        numberOfDays.Int64,
			"from_date":             fromDate.String,
			"to_date":               toDate.String,
			"document_proof":        documentProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"externalExaminer": records})
}
