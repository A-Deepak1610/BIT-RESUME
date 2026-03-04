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
	specialLab := c.PostForm("specialLab")
	modeOfCourse := c.PostForm("modeOfCourse")
	courseType := c.PostForm("courseType")
	otherCourseType := c.PostForm("otherCourseType")
	courseName := c.PostForm("courseName")
	typeOfOrganizer := c.PostForm("typeOfOrganizer")
	organizationName := c.PostForm("organizationName")
	organizationAddress := c.PostForm("organizationAddress")
	levelOfEvent := c.PostForm("levelOfEvent")
	duration := c.PostForm("duration")
	numberOfHours := c.PostForm("numberOfHours")
	numberOfWeeks := c.PostForm("numberOfWeeks")
	numberOfDays := c.PostForm("numberOfDays")
	startDate := c.PostForm("startDate")
	endDate := c.PostForm("endDate")
	courseCategory := c.PostForm("courseCategory")
	dateOfExamination := c.PostForm("dateOfExamination")
	gradeObtained := c.PostForm("gradeObtained")
	isApprovedFDP := c.PostForm("isApprovedFDP")
	typeOfSponsorship := c.PostForm("typeOfSponsorship")
	fundingAgencyName := c.PostForm("fundingAgencyName")
	claimedFor := c.PostForm("claimedFor")

	// Handle file uploads
	uploadDir := "./uploads/faculty/online_courses"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Helper function for file upload
	saveFile := func(fieldName string) string {
		file, _ := c.FormFile(fieldName)
		if file != nil {
			filename := fmt.Sprintf("%v_%d_%s_%s", facultyID, time.Now().Unix(), fieldName, file.Filename)
			filePath := filepath.Join(uploadDir, filename)
			if err := c.SaveUploadedFile(file, filePath); err != nil {
				log.Printf("Failed to save %s: %v", fieldName, err)
				return ""
			}
			return filePath
		}
		return ""
	}

	markSheetProofPath := saveFile("markSheetProof")
	fdpProofPath := saveFile("fdpProof")
	apexProofPath := saveFile("apexProof")
	certificateProofPath := saveFile("certificateProof")

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_online_courses (
		faculty_id, task_id, special_labs_involved, special_lab, mode_of_course,
		course_type, other_course_type, course_name, type_of_organizer,
		organization_name, organization_address, level_of_event,
		duration, number_of_hours, number_of_weeks, number_of_days,
		start_date, end_date, course_category, date_of_examination, grade_obtained,
		is_approved_fdp, type_of_sponsorship, funding_agency_name, claimed_for,
		mark_sheet_proof, fdp_proof, apex_proof, certificate_proof
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, nullString(taskID), nullString(specialLabsInvolved), nullString(specialLab),
		nullString(modeOfCourse), nullString(courseType), nullString(otherCourseType),
		nullString(courseName), nullString(typeOfOrganizer),
		nullString(organizationName), nullString(organizationAddress), nullString(levelOfEvent),
		nullString(duration), nullString(numberOfHours), nullString(numberOfWeeks), nullString(numberOfDays),
		nullString(startDate), nullString(endDate), nullString(courseCategory),
		nullString(dateOfExamination), nullString(gradeObtained),
		nullString(isApprovedFDP), nullString(typeOfSponsorship), nullString(fundingAgencyName),
		nullString(claimedFor), nullString(markSheetProofPath), nullString(fdpProofPath),
		nullString(apexProofPath), nullString(certificateProofPath),
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

	query := `SELECT id, task_id, special_labs_involved, special_lab, mode_of_course,
	          course_type, other_course_type, course_name, type_of_organizer,
	          organization_name, organization_address, level_of_event,
	          duration, number_of_hours, number_of_weeks, number_of_days,
	          start_date, end_date, course_category, date_of_examination, grade_obtained,
	          is_approved_fdp, type_of_sponsorship, funding_agency_name, claimed_for,
	          mark_sheet_proof, fdp_proof, apex_proof, certificate_proof,
	          status, remarks, created_at
	          FROM faculty_online_courses WHERE faculty_id = ? ORDER BY created_at DESC`

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
			id                                                                   int
			taskID, specialLabsInvolved, specialLab, modeOfCourse                sql.NullString
			courseType, otherCourseType, courseName, typeOfOrganizer             sql.NullString
			orgName, orgAddress, levelOfEvent                                    sql.NullString
			duration, numberOfHours, numberOfWeeks, numberOfDays                 sql.NullString
			startDate, endDate, courseCategory, dateOfExamination, gradeObtained sql.NullString
			isApprovedFDP, typeOfSponsorship, fundingAgencyName, claimedFor      sql.NullString
			markSheetProof, fdpProof, apexProof, certificateProof                sql.NullString
			status, remarks                                                      sql.NullString
			createdAt                                                            []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabsInvolved, &specialLab, &modeOfCourse,
			&courseType, &otherCourseType, &courseName, &typeOfOrganizer,
			&orgName, &orgAddress, &levelOfEvent,
			&duration, &numberOfHours, &numberOfWeeks, &numberOfDays,
			&startDate, &endDate, &courseCategory, &dateOfExamination, &gradeObtained,
			&isApprovedFDP, &typeOfSponsorship, &fundingAgencyName, &claimedFor,
			&markSheetProof, &fdpProof, &apexProof, &certificateProof,
			&status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning online course:", err)
			continue
		}

		records = append(records, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabsInvolved.String,
			"special_lab":           specialLab.String,
			"mode_of_course":        modeOfCourse.String,
			"course_type":           courseType.String,
			"other_course_type":     otherCourseType.String,
			"course_name":           courseName.String,
			"type_of_organizer":     typeOfOrganizer.String,
			"organization_name":     orgName.String,
			"organization_address":  orgAddress.String,
			"level_of_event":        levelOfEvent.String,
			"duration":              duration.String,
			"number_of_hours":       numberOfHours.String,
			"number_of_weeks":       numberOfWeeks.String,
			"number_of_days":        numberOfDays.String,
			"start_date":            startDate.String,
			"end_date":              endDate.String,
			"course_category":       courseCategory.String,
			"date_of_examination":   dateOfExamination.String,
			"grade_obtained":        gradeObtained.String,
			"is_approved_fdp":       isApprovedFDP.String,
			"type_of_sponsorship":   typeOfSponsorship.String,
			"funding_agency_name":   fundingAgencyName.String,
			"claimed_for":           claimedFor.String,
			"mark_sheet_proof":      markSheetProof.String,
			"fdp_proof":             fdpProof.String,
			"apex_proof":            apexProof.String,
			"certificate_proof":     certificateProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"onlineCourses": records})
}
