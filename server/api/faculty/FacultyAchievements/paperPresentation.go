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

	// Basic fields
	taskID := c.PostForm("taskID")
	specialLabsInvolved := c.PostForm("specialLabsInvolved")
	specialLab := c.PostForm("specialLab")

	// Other Authors from BIT
	otherAuthorsBIT := c.PostForm("otherAuthorsBIT")
	chooseFirstFaculty := c.PostForm("chooseFirstFaculty")
	firstFaculty := c.PostForm("firstFaculty")
	chooseSecondFaculty := c.PostForm("chooseSecondFaculty")
	secondFaculty := c.PostForm("secondFaculty")
	chooseThirdFaculty := c.PostForm("chooseThirdFaculty")
	thirdFaculty := c.PostForm("thirdFaculty")
	chooseFourthFaculty := c.PostForm("chooseFourthFaculty")
	fourthFaculty := c.PostForm("fourthFaculty")
	chooseFifthFaculty := c.PostForm("chooseFifthFaculty")
	fifthFaculty := c.PostForm("fifthFaculty")

	// External Faculty
	facultyOtherInstitute := c.PostForm("facultyOtherInstitute")
	externalFaculty1 := c.PostForm("externalFaculty1")
	externalFaculty2 := c.PostForm("externalFaculty2")
	externalFaculty3 := c.PostForm("externalFaculty3")

	// Industrial Person
	industrialPersonInvolved := c.PostForm("industrialPersonInvolved")
	industrialPerson1 := c.PostForm("industrialPerson1")
	industrialPerson2 := c.PostForm("industrialPerson2")
	industrialPerson3 := c.PostForm("industrialPerson3")

	// International Collaboration
	internationalCollaboration := c.PostForm("internationalCollaboration")
	instituteName := c.PostForm("instituteName")

	// Conference Details
	conferenceName := c.PostForm("conferenceName")
	eventMode := c.PostForm("eventMode")
	eventLocation := c.PostForm("eventLocation")
	eventOrganizer := c.PostForm("eventOrganizer")
	industryOrganizerName := c.PostForm("industryOrganizerName")
	instituteNameLocation := c.PostForm("instituteNameLocation")
	eventLevel := c.PostForm("eventLevel")
	paperTitle := c.PostForm("paperTitle")
	eventStartDate := c.PostForm("eventStartDate")
	eventEndDate := c.PostForm("eventEndDate")
	eventDurationDays := c.PostForm("eventDurationDays")

	// Publication
	publishedInProceedings := c.PostForm("publishedInProceedings")
	pageFrom := c.PostForm("pageFrom")
	pageTo := c.PostForm("pageTo")

	// Sponsorship
	typeOfSponsorship := c.PostForm("typeOfSponsorship")
	fundingAgencyName := c.PostForm("fundingAgencyName")
	fundingAmount := c.PostForm("fundingAmount")

	// Students
	studentsInvolved := c.PostForm("studentsInvolved")
	firstStudent := c.PostForm("firstStudent")
	firstStudentYear := c.PostForm("firstStudentYear")
	chooseSecondStudent := c.PostForm("chooseSecondStudent")
	secondStudent := c.PostForm("secondStudent")
	secondStudentYear := c.PostForm("secondStudentYear")
	chooseThirdStudent := c.PostForm("chooseThirdStudent")
	thirdStudent := c.PostForm("thirdStudent")
	thirdStudentYear := c.PostForm("thirdStudentYear")
	chooseFourthStudent := c.PostForm("chooseFourthStudent")
	fourthStudent := c.PostForm("fourthStudent")
	fourthStudentYear := c.PostForm("fourthStudentYear")
	chooseFifthStudent := c.PostForm("chooseFifthStudent")
	fifthStudent := c.PostForm("fifthStudent")
	fifthStudentYear := c.PostForm("fifthStudentYear")

	// Other
	registrationAmount := c.PostForm("registrationAmount")
	awardReceived := c.PostForm("awardReceived")

	uploadDir := "./uploads/faculty/paper_presentation"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	// Handle Document Proof
	docFile, _ := c.FormFile("documentProof")
	var docPath string
	if docFile != nil {
		docFilename := fmt.Sprintf("%v_%d_doc_%s", facultyID, time.Now().Unix(), docFile.Filename)
		docPath = filepath.Join(uploadDir, docFilename)
		if err := c.SaveUploadedFile(docFile, docPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save document proof"})
			return
		}
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

	// Handle Award Proof
	awardFile, _ := c.FormFile("awardProof")
	var awardPath string
	if awardFile != nil {
		awardFilename := fmt.Sprintf("%v_%d_award_%s", facultyID, time.Now().Unix(), awardFile.Filename)
		awardPath = filepath.Join(uploadDir, awardFilename)
		if err := c.SaveUploadedFile(awardFile, awardPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save award proof"})
			return
		}
	}

	query := `INSERT INTO faculty_paper_presentation (
		faculty_id, task_id, special_labs_involved, special_lab,
		other_authors_bit, choose_first_faculty, first_faculty,
		choose_second_faculty, second_faculty, choose_third_faculty, third_faculty,
		choose_fourth_faculty, fourth_faculty, choose_fifth_faculty, fifth_faculty,
		faculty_other_institute, external_faculty_1, external_faculty_2, external_faculty_3,
		industrial_person_involved, industrial_person_1, industrial_person_2, industrial_person_3,
		international_collaboration, institute_name,
		conference_name, event_mode, event_location, event_organizer,
		industry_organizer_name, institute_name_location, event_level, paper_title,
		event_start_date, event_end_date, event_duration_days,
		published_in_proceedings, page_from, page_to,
		type_of_sponsorship, apex_proof, funding_agency_name, funding_amount,
		students_involved, first_student, first_student_year,
		choose_second_student, second_student, second_student_year,
		choose_third_student, third_student, third_student_year,
		choose_fourth_student, fourth_student, fourth_student_year,
		choose_fifth_student, fifth_student, fifth_student_year,
		registration_amount, document_proof, award_received, award_proof
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, taskID, specialLabsInvolved, specialLab,
		otherAuthorsBIT, chooseFirstFaculty, firstFaculty,
		chooseSecondFaculty, secondFaculty, chooseThirdFaculty, thirdFaculty,
		chooseFourthFaculty, fourthFaculty, chooseFifthFaculty, fifthFaculty,
		facultyOtherInstitute, externalFaculty1, externalFaculty2, externalFaculty3,
		industrialPersonInvolved, industrialPerson1, industrialPerson2, industrialPerson3,
		internationalCollaboration, instituteName,
		conferenceName, eventMode, eventLocation, eventOrganizer,
		industryOrganizerName, instituteNameLocation, eventLevel, paperTitle,
		eventStartDate, eventEndDate, eventDurationDays,
		publishedInProceedings, pageFrom, pageTo,
		typeOfSponsorship, apexPath, fundingAgencyName, fundingAmount,
		studentsInvolved, firstStudent, firstStudentYear,
		chooseSecondStudent, secondStudent, secondStudentYear,
		chooseThirdStudent, thirdStudent, thirdStudentYear,
		chooseFourthStudent, fourthStudent, fourthStudentYear,
		chooseFifthStudent, fifthStudent, fifthStudentYear,
		registrationAmount, docPath, awardReceived, awardPath,
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

	query := `SELECT id, task_id, special_labs_involved, special_lab,
              other_authors_bit, choose_first_faculty, first_faculty,
              choose_second_faculty, second_faculty, choose_third_faculty, third_faculty,
              choose_fourth_faculty, fourth_faculty, choose_fifth_faculty, fifth_faculty,
              faculty_other_institute, external_faculty_1, external_faculty_2, external_faculty_3,
              industrial_person_involved, industrial_person_1, industrial_person_2, industrial_person_3,
              international_collaboration, institute_name,
              conference_name, event_mode, event_location, event_organizer,
              industry_organizer_name, institute_name_location, event_level, paper_title,
              event_start_date, event_end_date, event_duration_days,
              published_in_proceedings, page_from, page_to,
              type_of_sponsorship, apex_proof, funding_agency_name, funding_amount,
              students_involved, first_student, first_student_year,
              choose_second_student, second_student, second_student_year,
              choose_third_student, third_student, third_student_year,
              choose_fourth_student, fourth_student, fourth_student_year,
              choose_fifth_student, fifth_student, fifth_student_year,
              registration_amount, document_proof, award_received, award_proof,
              status, remarks, created_at 
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
			id                                                                                int
			taskID, specialLabsInvolved, specialLab                                           sql.NullString
			otherAuthorsBIT, chooseFirstFaculty, firstFaculty                                 sql.NullString
			chooseSecondFaculty, secondFaculty, chooseThirdFaculty, thirdFaculty              sql.NullString
			chooseFourthFaculty, fourthFaculty, chooseFifthFaculty, fifthFaculty              sql.NullString
			facultyOtherInstitute, externalFaculty1, externalFaculty2, externalFaculty3       sql.NullString
			industrialPersonInvolved, industrialPerson1, industrialPerson2, industrialPerson3 sql.NullString
			internationalCollaboration, instituteName                                         sql.NullString
			conferenceName, eventMode, eventLocation, eventOrganizer                          sql.NullString
			industryOrganizerName, instituteNameLocation, eventLevel, paperTitle              sql.NullString
			eventStartDate, eventEndDate                                                      sql.NullString
			eventDurationDays                                                                 sql.NullInt64
			publishedInProceedings, pageFrom, pageTo                                          sql.NullString
			typeOfSponsorship, apexProof, fundingAgencyName, fundingAmount                    sql.NullString
			studentsInvolved, firstStudent, firstStudentYear                                  sql.NullString
			chooseSecondStudent, secondStudent, secondStudentYear                             sql.NullString
			chooseThirdStudent, thirdStudent, thirdStudentYear                                sql.NullString
			chooseFourthStudent, fourthStudent, fourthStudentYear                             sql.NullString
			chooseFifthStudent, fifthStudent, fifthStudentYear                                sql.NullString
			registrationAmount, documentProof, awardReceived, awardProof, status, remarks     sql.NullString
			createdAt                                                                         []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabsInvolved, &specialLab,
			&otherAuthorsBIT, &chooseFirstFaculty, &firstFaculty,
			&chooseSecondFaculty, &secondFaculty, &chooseThirdFaculty, &thirdFaculty,
			&chooseFourthFaculty, &fourthFaculty, &chooseFifthFaculty, &fifthFaculty,
			&facultyOtherInstitute, &externalFaculty1, &externalFaculty2, &externalFaculty3,
			&industrialPersonInvolved, &industrialPerson1, &industrialPerson2, &industrialPerson3,
			&internationalCollaboration, &instituteName,
			&conferenceName, &eventMode, &eventLocation, &eventOrganizer,
			&industryOrganizerName, &instituteNameLocation, &eventLevel, &paperTitle,
			&eventStartDate, &eventEndDate, &eventDurationDays,
			&publishedInProceedings, &pageFrom, &pageTo,
			&typeOfSponsorship, &apexProof, &fundingAgencyName, &fundingAmount,
			&studentsInvolved, &firstStudent, &firstStudentYear,
			&chooseSecondStudent, &secondStudent, &secondStudentYear,
			&chooseThirdStudent, &thirdStudent, &thirdStudentYear,
			&chooseFourthStudent, &fourthStudent, &fourthStudentYear,
			&chooseFifthStudent, &fifthStudent, &fifthStudentYear,
			&registrationAmount, &documentProof, &awardReceived, &awardProof,
			&status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning paper presentation:", err)
			continue
		}

		papers = append(papers, map[string]interface{}{
			"id":                          id,
			"task_id":                     taskID.String,
			"special_labs_involved":       specialLabsInvolved.String,
			"special_lab":                 specialLab.String,
			"other_authors_bit":           otherAuthorsBIT.String,
			"choose_first_faculty":        chooseFirstFaculty.String,
			"first_faculty":               firstFaculty.String,
			"choose_second_faculty":       chooseSecondFaculty.String,
			"second_faculty":              secondFaculty.String,
			"choose_third_faculty":        chooseThirdFaculty.String,
			"third_faculty":               thirdFaculty.String,
			"choose_fourth_faculty":       chooseFourthFaculty.String,
			"fourth_faculty":              fourthFaculty.String,
			"choose_fifth_faculty":        chooseFifthFaculty.String,
			"fifth_faculty":               fifthFaculty.String,
			"faculty_other_institute":     facultyOtherInstitute.String,
			"external_faculty_1":          externalFaculty1.String,
			"external_faculty_2":          externalFaculty2.String,
			"external_faculty_3":          externalFaculty3.String,
			"industrial_person_involved":  industrialPersonInvolved.String,
			"industrial_person_1":         industrialPerson1.String,
			"industrial_person_2":         industrialPerson2.String,
			"industrial_person_3":         industrialPerson3.String,
			"international_collaboration": internationalCollaboration.String,
			"institute_name":              instituteName.String,
			"conference_name":             conferenceName.String,
			"event_mode":                  eventMode.String,
			"event_location":              eventLocation.String,
			"event_organizer":             eventOrganizer.String,
			"industry_organizer_name":     industryOrganizerName.String,
			"institute_name_location":     instituteNameLocation.String,
			"event_level":                 eventLevel.String,
			"paper_title":                 paperTitle.String,
			"event_start_date":            eventStartDate.String,
			"event_end_date":              eventEndDate.String,
			"event_duration_days":         eventDurationDays.Int64,
			"published_in_proceedings":    publishedInProceedings.String,
			"page_from":                   pageFrom.String,
			"page_to":                     pageTo.String,
			"type_of_sponsorship":         typeOfSponsorship.String,
			"apex_proof":                  apexProof.String,
			"funding_agency_name":         fundingAgencyName.String,
			"funding_amount":              fundingAmount.String,
			"students_involved":           studentsInvolved.String,
			"first_student":               firstStudent.String,
			"first_student_year":          firstStudentYear.String,
			"choose_second_student":       chooseSecondStudent.String,
			"second_student":              secondStudent.String,
			"second_student_year":         secondStudentYear.String,
			"choose_third_student":        chooseThirdStudent.String,
			"third_student":               thirdStudent.String,
			"third_student_year":          thirdStudentYear.String,
			"choose_fourth_student":       chooseFourthStudent.String,
			"fourth_student":              fourthStudent.String,
			"fourth_student_year":         fourthStudentYear.String,
			"choose_fifth_student":        chooseFifthStudent.String,
			"fifth_student":               fifthStudent.String,
			"fifth_student_year":          fifthStudentYear.String,
			"registration_amount":         registrationAmount.String,
			"document_proof":              documentProof.String,
			"award_received":              awardReceived.String,
			"award_proof":                 awardProof.String,
			"status":                      status.String,
			"remarks":                     remarks.String,
			"created_at":                  string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"paperPresentations": papers})
}
