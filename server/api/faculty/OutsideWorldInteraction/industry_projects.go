package outsideworld

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

func HandleIndustryProjectsForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse all form fields
	formData := map[string]string{
		"faculty":             c.PostForm("faculty"),
		"taskID":              c.PostForm("taskID"),
		"specialLabsInvolved": c.PostForm("specialLabsInvolved"),
		"specialLab":          c.PostForm("specialLab"),
		"numberOfFaculty":     c.PostForm("numberOfFaculty"),
		"faculty2":            c.PostForm("faculty2"),
		"faculty2SIG":         c.PostForm("faculty2SIG"),
		"faculty3":            c.PostForm("faculty3"),
		"faculty3SIG":         c.PostForm("faculty3SIG"),
		"faculty4":            c.PostForm("faculty4"),
		"faculty4SIG":         c.PostForm("faculty4SIG"),
		"faculty5":            c.PostForm("faculty5"),
		"faculty5SIG":         c.PostForm("faculty5SIG"),
		"numberOfStudents":    c.PostForm("numberOfStudents"),
		"student1":            c.PostForm("student1"),
		"student2":            c.PostForm("student2"),
		"student3":            c.PostForm("student3"),
		"student4":            c.PostForm("student4"),
		"student5":            c.PostForm("student5"),
		"industryName":        c.PostForm("industryName"),
		"typeOfIndustry":      c.PostForm("typeOfIndustry"),
		"othersSpecify":       c.PostForm("othersSpecify"),
		"industryProject":     c.PostForm("industryProject"),
		"projectTitle":        c.PostForm("projectTitle"),
		"durationMonths":      c.PostForm("durationMonths"),
		"startDate":           c.PostForm("startDate"),
		"endDate":             c.PostForm("endDate"),
		"outcome":             c.PostForm("outcome"),
	}

	// Handle file upload
	uploadDir := "./uploads/faculty/industry_projects"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	file, _ := c.FormFile("industryProjectProof")
	var proofPath string
	if file != nil {
		filename := fmt.Sprintf("%v_%d_%s", facultyID, time.Now().Unix(), file.Filename)
		proofPath = filepath.Join(uploadDir, filename)
		if err := c.SaveUploadedFile(file, proofPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save industry project proof"})
			return
		}
	}

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s
	}

	// Helper function for nullable integers
	nullInt := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s // MySQL will convert string to int
	}

	// Helper function for nullable dates
	nullDate := func(s string) interface{} {
		if s == "" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_industry_projects (
		faculty, task_id, special_labs_involved, special_lab,
		number_of_faculty, faculty2, faculty2_sig, faculty3, faculty3_sig,
		faculty4, faculty4_sig, faculty5, faculty5_sig,
		number_of_students, student1, student2, student3, student4, student5,
		industry_name, type_of_industry, others_specify, industry_project,
		project_title, duration_months, start_date, end_date, outcome,
		industry_project_proof, verification_status
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initiated')`

	_, err := config.DB.Exec(query,
		nullString(formData["faculty"]), nullString(formData["taskID"]), nullString(formData["specialLabsInvolved"]),
		nullString(formData["specialLab"]), nullInt(formData["numberOfFaculty"]),
		nullString(formData["faculty2"]), nullString(formData["faculty2SIG"]),
		nullString(formData["faculty3"]), nullString(formData["faculty3SIG"]),
		nullString(formData["faculty4"]), nullString(formData["faculty4SIG"]),
		nullString(formData["faculty5"]), nullString(formData["faculty5SIG"]),
		nullInt(formData["numberOfStudents"]),
		nullString(formData["student1"]), nullString(formData["student2"]),
		nullString(formData["student3"]), nullString(formData["student4"]),
		nullString(formData["student5"]),
		nullString(formData["industryName"]), nullString(formData["typeOfIndustry"]),
		nullString(formData["othersSpecify"]), nullString(formData["industryProject"]),
		nullString(formData["projectTitle"]), nullInt(formData["durationMonths"]),
		nullDate(formData["startDate"]), nullDate(formData["endDate"]),
		nullString(formData["outcome"]), nullString(proofPath),
	)

	if err != nil {
		log.Println("Error inserting Industry Projects:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Industry Projects submitted successfully"})
}

func FetchIndustryProjects(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, faculty, task_id, special_labs_involved, special_lab, 
	          number_of_faculty, faculty2, faculty2_sig, faculty3, faculty3_sig, 
			  faculty4, faculty4_sig, faculty5, faculty5_sig, number_of_students, 
			  student1, student2, student3, student4, student5, industry_name, 
			  type_of_industry, others_specify, industry_project, project_title, 
			  duration_months, start_date, end_date, outcome, industry_project_proof, 
			  verification_status, created_at
	          FROM faculty_industry_projects WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching Industry Projects:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                    int
			faculty, taskID, specialLabsInvolved, specialLab                                      sql.NullString
			numberOfFaculty, faculty2, faculty2SIG, faculty3, faculty3SIG                         sql.NullString
			faculty4, faculty4SIG, faculty5, faculty5SIG                                          sql.NullString
			numberOfStudents, student1, student2, student3, student4, student5                    sql.NullString
			industryName, typeOfIndustry, othersSpecify, industryProject, projectTitle            sql.NullString
			durationMonths, startDate, endDate, outcome, industryProjectProof, verificationStatus sql.NullString
			createdAt                                                                             []uint8
		)

		if err := rows.Scan(&id, &faculty, &taskID, &specialLabsInvolved, &specialLab,
			&numberOfFaculty, &faculty2, &faculty2SIG, &faculty3, &faculty3SIG,
			&faculty4, &faculty4SIG, &faculty5, &faculty5SIG,
			&numberOfStudents, &student1, &student2, &student3, &student4, &student5,
			&industryName, &typeOfIndustry, &othersSpecify, &industryProject, &projectTitle,
			&durationMonths, &startDate, &endDate, &outcome, &industryProjectProof,
			&verificationStatus, &createdAt); err != nil {
			log.Println("Error scanning Industry Projects:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                     id,
			"faculty":                faculty.String,
			"task_id":                taskID.String,
			"special_labs_involved":  specialLabsInvolved.String,
			"special_lab":            specialLab.String,
			"number_of_faculty":      numberOfFaculty.String,
			"faculty2":               faculty2.String,
			"faculty2_sig":           faculty2SIG.String,
			"faculty3":               faculty3.String,
			"faculty3_sig":           faculty3SIG.String,
			"faculty4":               faculty4.String,
			"faculty4_sig":           faculty4SIG.String,
			"faculty5":               faculty5.String,
			"faculty5_sig":           faculty5SIG.String,
			"number_of_students":     numberOfStudents.String,
			"student1":               student1.String,
			"student2":               student2.String,
			"student3":               student3.String,
			"student4":               student4.String,
			"student5":               student5.String,
			"industry_name":          industryName.String,
			"type_of_industry":       typeOfIndustry.String,
			"others_specify":         othersSpecify.String,
			"industry_project":       industryProject.String,
			"project_title":          projectTitle.String,
			"duration_months":        durationMonths.String,
			"start_date":             startDate.String,
			"end_date":               endDate.String,
			"outcome":                outcome.String,
			"industry_project_proof": industryProjectProof.String,
			"verification_status":    verificationStatus.String,
			"created_at":             string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"industryProjects": results})
}
