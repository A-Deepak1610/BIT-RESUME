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

func HandleOnlineCourseForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse form fields
	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	modeOfCourse := c.PostForm("modeOfCourse")
	courseType := c.PostForm("courseType")
	otherCourseType := c.PostForm("otherCourseType")
	courseName := c.PostForm("courseName")
	typeOfOrganizer := c.PostForm("typeOfOrganizer")
	otherTypeOfOrganizer := c.PostForm("otherTypeOfOrganizer")
	organizationName := c.PostForm("organizationName")
	organizationAddress := c.PostForm("organizationAddress")
	levelOfEvent := c.PostForm("levelOfEvent")
	duration := c.PostForm("duration")
	otherDuration := c.PostForm("otherDuration")
	startDate := c.PostForm("startDate")
	endDate := c.PostForm("endDate")
	courseCategory := c.PostForm("courseCategory")
	otherCourseCategory := c.PostForm("otherCourseCategory")
	gradeObtained := c.PostForm("gradeObtained")
	typeOfSponsorship := c.PostForm("typeOfSponsorship")
	otherTypeOfSponsorship := c.PostForm("otherTypeOfSponsorship")
	claimedFor := c.PostForm("claimedFor")
	otherClaimedFor := c.PostForm("otherClaimedFor")

	// Handle file upload
	uploadDir := "./uploads/faculty/online_courses"
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
	query := `INSERT INTO faculty_online_course (
		faculty_id, task_id, special_labs_involved, mode_of_course,
		course_type, other_course_type, course_name, type_of_organizer,
		other_type_of_organizer, organization_name, organization_address,
		level_of_event, duration, other_duration, start_date, end_date,
		course_category, other_course_category, grade_obtained,
		type_of_sponsorship, other_type_of_sponsorship, claimed_for,
		other_claimed_for, document_proof
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, nullString(taskID), nullString(specialLabsInvolved),
		nullString(modeOfCourse), nullString(courseType), nullString(otherCourseType),
		nullString(courseName), nullString(typeOfOrganizer), nullString(otherTypeOfOrganizer),
		nullString(organizationName), nullString(organizationAddress), nullString(levelOfEvent),
		nullString(duration), nullString(otherDuration), nullString(startDate),
		nullString(endDate), nullString(courseCategory), nullString(otherCourseCategory),
		nullString(gradeObtained), nullString(typeOfSponsorship), nullString(otherTypeOfSponsorship),
		nullString(claimedFor), nullString(otherClaimedFor), nullString(documentPath),
	)

	if err != nil {
		log.Println("Error inserting online course:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Online Course record submitted successfully"})
}

func FetchOnlineCourse(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, task_id, special_labs_involved, mode_of_course,
	          course_type, other_course_type, course_name, type_of_organizer,
	          other_type_of_organizer, organization_name, organization_address,
	          level_of_event, duration, other_duration, start_date, end_date,
	          course_category, other_course_category, grade_obtained,
	          type_of_sponsorship, other_type_of_sponsorship, claimed_for,
	          other_claimed_for, document_proof, status, remarks, created_at
	          FROM faculty_online_course WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching online course:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var records []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                     int
			taskID, specialLabs, modeOfCourse, courseType, otherCourseType        sql.NullString
			courseName, typeOfOrganizer, otherTypeOfOrganizer                     sql.NullString
			orgName, orgAddress, levelOfEvent, duration, otherDuration            sql.NullString
			startDate, endDate, courseCategory, otherCourseCategory               sql.NullString
			gradeObtained, typeOfSponsorship, otherTypeOfSponsorship             sql.NullString
			claimedFor, otherClaimedFor, documentProof, status, remarks          sql.NullString
			createdAt                                                              []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &modeOfCourse,
			&courseType, &otherCourseType, &courseName, &typeOfOrganizer,
			&otherTypeOfOrganizer, &orgName, &orgAddress,
			&levelOfEvent, &duration, &otherDuration, &startDate, &endDate,
			&courseCategory, &otherCourseCategory, &gradeObtained,
			&typeOfSponsorship, &otherTypeOfSponsorship, &claimedFor,
			&otherClaimedFor, &documentProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning online course:", err)
			continue
		}

		records = append(records, map[string]interface{}{
			"id":                          id,
			"task_id":                     taskID.String,
			"special_labs_involved":       specialLabs.String,
			"mode_of_course":              modeOfCourse.String,
			"course_type":                 courseType.String,
			"other_course_type":           otherCourseType.String,
			"course_name":                 courseName.String,
			"type_of_organizer":           typeOfOrganizer.String,
			"other_type_of_organizer":     otherTypeOfOrganizer.String,
			"organization_name":           orgName.String,
			"organization_address":        orgAddress.String,
			"level_of_event":              levelOfEvent.String,
			"duration":                    duration.String,
			"other_duration":              otherDuration.String,
			"start_date":                  startDate.String,
			"end_date":                    endDate.String,
			"course_category":             courseCategory.String,
			"other_course_category":       otherCourseCategory.String,
			"grade_obtained":              gradeObtained.String,
			"type_of_sponsorship":         typeOfSponsorship.String,
			"other_type_of_sponsorship":   otherTypeOfSponsorship.String,
			"claimed_for":                 claimedFor.String,
			"other_claimed_for":           otherClaimedFor.String,
			"document_proof":              documentProof.String,
			"status":                      status.String,
			"remarks":                     remarks.String,
			"created_at":                  string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"onlineCourses": records})
}
