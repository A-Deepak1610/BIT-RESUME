package admin

import (
	"bitresume/config"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// FacultyListItem represents a faculty member in the list
type FacultyListItem struct {
	FacultyID         string `json:"faculty_id"`
	Name              string `json:"name"`
	Email             string `json:"email"`
	TotalAchievements int    `json:"total_achievements"`
}

// GetFacultyList returns list of all faculty members with their achievement counts
func GetFacultyList(c *gin.Context) {
	query := `
		SELECT 
			rollno as faculty_id,
			COALESCE(user_name, '') as name
		FROM login
		WHERE role = 'faculty'
		ORDER BY user_name
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching faculty list:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var facultyList []FacultyListItem
	for rows.Next() {
		var faculty FacultyListItem
		if err := rows.Scan(
			&faculty.FacultyID,
			&faculty.Name,
		); err != nil {
			log.Println("Error scanning faculty:", err)
			continue
		}
		faculty.Email = faculty.FacultyID + "@bit.edu.in"
		faculty.TotalAchievements = countFacultyAchievements(faculty.FacultyID)
		facultyList = append(facultyList, faculty)
	}

	c.JSON(http.StatusOK, gin.H{"faculty": facultyList})
}

// countFacultyAchievements counts total achievements for a faculty member
func countFacultyAchievements(facultyID string) int {
	total := 0
	tables := []string{
		"faculty_newsletter_archive",
		"faculty_e_content",
		"faculty_events_attended",
		"faculty_events_organized",
		"faculty_external_examiner",
		"faculty_journal_reviewer",
		"faculty_guest_lecture",
		"faculty_international_visit",
		"faculty_award",
		"faculty_online_course",
		"faculty_paper_presentation",
		"faculty_resource_person",
	}
	for _, table := range tables {
		var count int
		query := "SELECT COUNT(*) FROM " + table + " WHERE faculty_id = ?"
		err := config.DB.QueryRow(query, facultyID).Scan(&count)
		if err != nil {
			continue
		}
		total += count
	}
	return total
}

// GetFacultyAchievements returns all achievements for a specific faculty
func GetFacultyAchievements(c *gin.Context) {
	facultyID := c.Param("facultyId")
	if facultyID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Faculty ID is required"})
		return
	}

	achievements := map[string]interface{}{
		"newsletterArchive":   fetchFacultyNewsletters(facultyID),
		"eContentDeveloped":   fetchFacultyEContent(facultyID),
		"eventsAttended":      fetchFacultyEventsAttended(facultyID),
		"eventsOrganized":     fetchFacultyEventsOrganized(facultyID),
		"externalExaminer":    fetchFacultyExternalExaminer(facultyID),
		"journalReviewer":     fetchFacultyJournalReviewer(facultyID),
		"guestLectures":       fetchFacultyGuestLectures(facultyID),
		"internationalVisits": fetchFacultyInternationalVisits(facultyID),
		"notableAchievements": fetchFacultyAwards(facultyID),
		"onlineCourses":       fetchFacultyOnlineCourses(facultyID),
		"paperPresentations":  fetchFacultyPaperPresentations(facultyID),
		"resourcePerson":      fetchFacultyResourcePerson(facultyID),
	}

	c.JSON(http.StatusOK, gin.H{"achievements": achievements})
}

// ============ FULL DATA FETCH FUNCTIONS ============

func fetchFacultyNewsletters(facultyID string) []map[string]interface{} {
	query := `
		SELECT id, newsletter_category, department, academic_year, 
			date_of_publication, volume_number, issue_number, issue_month, 
			faculty_editor_count, student_editor_count, proof_document, 
			status, remarks, created_at 
		FROM faculty_newsletter_archive 
		WHERE faculty_id = ? 
		ORDER BY created_at DESC
	`
	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching newsletters:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                          int
			category, dept, year, date, vol, issue, month, facCount, stuCount, proof, status, remarks sql.NullString
			createdAt                                                                                                   []uint8
		)
		if err := rows.Scan(&id, &category, &dept, &year, &date, &vol, &issue, &month, &facCount, &stuCount, &proof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning newsletter:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                   id,
			"newsletter_category":  category.String,
			"department":           dept.String,
			"academic_year":        year.String,
			"date_of_publication":  date.String,
			"volume_number":        vol.String,
			"issue_number":         issue.String,
			"issue_month":          month.String,
			"faculty_editor_count": facCount.String,
			"student_editor_count": stuCount.String,
			"proof_document":       proof.String,
			"status":               status.String,
			"remarks":              remarks.String,
			"created_at":           string(createdAt),
		})
	}
	return results
}

func fetchFacultyEContent(facultyID string) []map[string]interface{} {
	query := `
		SELECT id, e_content_type, topic_name, publisher_name, 
			url_of_content, date_of_publication, status, remarks, created_at
		FROM faculty_e_content 
		WHERE faculty_id = ?
		ORDER BY created_at DESC
	`
	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching e-content:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                            int
			contentType, topic, publisher, url, pubDate, status, remarks sql.NullString
			createdAt                                                                     []uint8
		)
		if err := rows.Scan(&id, &contentType, &topic, &publisher, &url, &pubDate, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning e-content:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                  id,
			"e_content_type":      contentType.String,
			"topic_name":          topic.String,
			"publisher_name":      publisher.String,
			"url_of_content":      url.String,
			"date_of_publication": pubDate.String,
			"status":              status.String,
			"remarks":             remarks.String,
			"created_at":          string(createdAt),
		})
	}
	return results
}

func fetchFacultyEventsAttended(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, event_type, organizer_type, 
              event_level, event_title, organization_sector, event_organizer, 
              event_mode, event_duration, start_date, end_date, duration_in_days, 
              other_organizer_name, sponsorship_type, outcome, certificate_proof, 
              geotag_photos, claimed_for, status, remarks, created_at 
              FROM faculty_events_attended WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching events attended:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                                                                        int
			taskID, specialLabs, eType, oType, eLevel, eTitle, oSector, eOrg, eMode, eDur, sDate, eDate, oName, sType, outcome, cert, geo, claimed, status, remarks sql.NullString
			durationDays                                                                                                                                              sql.NullInt64
			createdAt                                                                                                                                                 []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &eType, &oType, &eLevel, &eTitle, &oSector,
			&eOrg, &eMode, &eDur, &sDate, &eDate, &durationDays, &oName, &sType,
			&outcome, &cert, &geo, &claimed, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning events attended:", err)
			continue
		}

		results = append(results, map[string]interface{}{
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
	return results
}

func fetchFacultyEventsOrganized(facultyID string) []map[string]interface{} {
	query := `SELECT id, event_name, program_type, event_type, event_level, event_mode,
	          start_date, end_date, event_duration, internal_students_count, 
	          internal_faculty_count, external_students_count, external_faculty_count,
	          total_revenue, proof_file, status, remarks, created_at
	          FROM faculty_events_organized WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching events organized:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                      int
			eventName, programType, eventType, eventLevel, eventMode, proofFile, status, remarks sql.NullString
			startDate, endDate                                                                      sql.NullString
			eventDuration, internalStudents, internalFaculty, externalStudents, externalFaculty   sql.NullInt64
			totalRevenue                                                                            sql.NullFloat64
			createdAt                                                                               []uint8
		)

		if err := rows.Scan(
			&id, &eventName, &programType, &eventType, &eventLevel, &eventMode,
			&startDate, &endDate, &eventDuration, &internalStudents,
			&internalFaculty, &externalStudents, &externalFaculty,
			&totalRevenue, &proofFile, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning events organized:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                      id,
			"event_name":              eventName.String,
			"program_type":            programType.String,
			"event_type":              eventType.String,
			"event_level":             eventLevel.String,
			"event_mode":              eventMode.String,
			"start_date":              startDate.String,
			"end_date":                endDate.String,
			"event_duration":          eventDuration.Int64,
			"internal_students_count": internalStudents.Int64,
			"internal_faculty_count":  internalFaculty.Int64,
			"external_students_count": externalStudents.Int64,
			"external_faculty_count":  externalFaculty.Int64,
			"total_revenue":           totalRevenue.Float64,
			"proof_file":              proofFile.String,
			"status":                  status.String,
			"remarks":                 remarks.String,
			"created_at":              string(createdAt),
		})
	}
	return results
}

func fetchFacultyExternalExaminer(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, college_name, 
	          institute_address, purpose_of_visit, number_of_days, 
	          from_date, to_date, document_proof, status, remarks, created_at
	          FROM faculty_external_examiner WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching external examiner:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                 int
			taskID, specialLabs, collegeName, address, purpose, documentProof, status, remarks sql.NullString
			fromDate, toDate                                                                                   sql.NullString
			numberOfDays                                                                                       sql.NullInt64
			createdAt                                                                                          []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &collegeName,
			&address, &purpose, &numberOfDays,
			&fromDate, &toDate, &documentProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning external examiner:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"college_name":          collegeName.String,
			"institute_address":     address.String,
			"purpose_of_visit":      purpose.String,
			"number_of_days":        numberOfDays.Int64,
			"from_date":             fromDate.String,
			"to_date":               toDate.String,
			"document_proof":        documentProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}

func fetchFacultyJournalReviewer(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, journal_name, 
	          journal_indexing, other_journal_indexing, issn_no, publisher_name,
	          impact_factor, journal_homepage_url, recognition_type, other_recognition_type,
	          number_of_papers_reviewed, review_date, document_proof, status, remarks, created_at
	          FROM faculty_journal_reviewer WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching journal reviewer:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                  int
			taskID, specialLabs, journalName, journalIndexing, otherIndexing   sql.NullString
			issnNo, publisherName, impactFactor, journalURL                                     sql.NullString
			recognitionType, otherRecognition, documentProof, status, remarks sql.NullString
			reviewDate                                                                          sql.NullString
			numberOfPapers                                                                      sql.NullInt64
			createdAt                                                                           []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &journalName,
			&journalIndexing, &otherIndexing, &issnNo, &publisherName,
			&impactFactor, &journalURL, &recognitionType, &otherRecognition,
			&numberOfPapers, &reviewDate, &documentProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning journal reviewer:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                        id,
			"task_id":                   taskID.String,
			"special_labs_involved":     specialLabs.String,
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
	return results
}

func fetchFacultyGuestLectures(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, event_type, topic,
	          mode_of_conduct, event_level, event_name, from_date, to_date,
	          type_of_organization, number_of_participants, type_of_audience,
	          document_proof, apex_proof, sample_photographs, status, remarks, created_at
	          FROM faculty_guest_lecture WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching guest lectures:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                          int
			taskID, specialLabs, eventType, topic                          sql.NullString
			modeOfConduct, eventLevel, eventName                                        sql.NullString
			fromDate, toDate                                                            sql.NullString
			typeOfOrg, typeOfAudience                                                   sql.NullString
			documentProof, apexProof, samplePhotos, status, remarks sql.NullString
			numberOfParticipants                                                        sql.NullInt64
			createdAt                                                                   []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &eventType, &topic,
			&modeOfConduct, &eventLevel, &eventName, &fromDate, &toDate,
			&typeOfOrg, &numberOfParticipants, &typeOfAudience,
			&documentProof, &apexProof, &samplePhotos, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning guest lecture:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                     id,
			"task_id":                taskID.String,
			"special_labs_involved":  specialLabs.String,
			"event_type":             eventType.String,
			"topic":                  topic.String,
			"mode_of_conduct":        modeOfConduct.String,
			"event_level":            eventLevel.String,
			"event_name":             eventName.String,
			"from_date":              fromDate.String,
			"to_date":                toDate.String,
			"type_of_organization":   typeOfOrg.String,
			"number_of_participants": numberOfParticipants.Int64,
			"type_of_audience":       typeOfAudience.String,
			"document_proof":         documentProof.String,
			"apex_proof":             apexProof.String,
			"sample_photographs":     samplePhotos.String,
			"status":                 status.String,
			"remarks":                remarks.String,
			"created_at":             string(createdAt),
		})
	}
	return results
}

func fetchFacultyInternationalVisits(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, country_visited, purpose_of_visit,
	          from_date, to_date, fund_type, document_proof, status, remarks, created_at
	          FROM faculty_international_visit WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching international visits:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                              int
			taskID, country, purpose, fundType, documentProof, status, remarks sql.NullString
			fromDate, toDate                                                                sql.NullString
			createdAt                                                                       []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &country, &purpose,
			&fromDate, &toDate, &fundType, &documentProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning international visit:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":               id,
			"task_id":          taskID.String,
			"country_visited":  country.String,
			"purpose_of_visit": purpose.String,
			"from_date":        fromDate.String,
			"to_date":          toDate.String,
			"fund_type":        fundType.String,
			"document_proof":   documentProof.String,
			"status":           status.String,
			"remarks":          remarks.String,
			"created_at":       string(createdAt),
		})
	}
	return results
}

func fetchFacultyAwards(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, technical_society,
	          type_of_recognition, other_type_of_recognition, award_name,
	          organization_type, other_organization_type, awarding_agency,
	          level, received_date, nature_of_recognition, other_nature_of_recognition,
	          photo_proofs, document_proof, status, remarks, created_at
	          FROM faculty_award WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching awards:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                          int
			taskID, specialLabs, techSociety, typeRecog, otherTypeRecog sql.NullString
			awardName, orgType, otherOrgType, awardingAgency                            sql.NullString
			level, receivedDate, natureRecog, otherNatureRecog                          sql.NullString
			photoProofs, documentProof, status, remarks                 sql.NullString
			createdAt                                                                   []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &techSociety,
			&typeRecog, &otherTypeRecog, &awardName,
			&orgType, &otherOrgType, &awardingAgency,
			&level, &receivedDate, &natureRecog, &otherNatureRecog,
			&photoProofs, &documentProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning award:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                          id,
			"task_id":                     taskID.String,
			"special_labs_involved":       specialLabs.String,
			"technical_society":           techSociety.String,
			"type_of_recognition":         typeRecog.String,
			"other_type_of_recognition":   otherTypeRecog.String,
			"award_name":                  awardName.String,
			"organization_type":           orgType.String,
			"other_organization_type":     otherOrgType.String,
			"awarding_agency":             awardingAgency.String,
			"level":                       level.String,
			"received_date":               receivedDate.String,
			"nature_of_recognition":       natureRecog.String,
			"other_nature_of_recognition": otherNatureRecog.String,
			"photo_proofs":                photoProofs.String,
			"document_proof":              documentProof.String,
			"status":                      status.String,
			"remarks":                     remarks.String,
			"created_at":                  string(createdAt),
		})
	}
	return results
}

func fetchFacultyOnlineCourses(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, mode_of_course,
	          course_type, other_course_type, course_name, type_of_organizer,
	          other_type_of_organizer, organization_name, organization_address,
	          level_of_event, duration, other_duration, start_date, end_date,
	          course_category, other_course_category, grade_obtained,
	          type_of_sponsorship, other_type_of_sponsorship, claimed_for,
	          other_claimed_for, document_proof, status, remarks, created_at
	          FROM faculty_online_courses WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching online courses:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                              int
			taskID, specialLabs, modeOfCourse, courseType, otherCourseType sql.NullString
			courseName, typeOfOrganizer, otherTypeOfOrganizer                               sql.NullString
			orgName, orgAddress, levelOfEvent, duration, otherDuration                      sql.NullString
			startDate, endDate, courseCategory, otherCourseCategory                         sql.NullString
			gradeObtained, typeOfSponsorship, otherTypeOfSponsorship                        sql.NullString
			claimedFor, otherClaimedFor, documentProof, status, remarks    sql.NullString
			createdAt                                                                       []uint8
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

		results = append(results, map[string]interface{}{
			"id":                        id,
			"task_id":                   taskID.String,
			"special_labs_involved":     specialLabs.String,
			"mode_of_course":            modeOfCourse.String,
			"course_type":               courseType.String,
			"other_course_type":         otherCourseType.String,
			"course_name":               courseName.String,
			"type_of_organizer":         typeOfOrganizer.String,
			"other_type_of_organizer":   otherTypeOfOrganizer.String,
			"organization_name":         orgName.String,
			"organization_address":      orgAddress.String,
			"level_of_event":            levelOfEvent.String,
			"duration":                  duration.String,
			"other_duration":            otherDuration.String,
			"start_date":                startDate.String,
			"end_date":                  endDate.String,
			"course_category":           courseCategory.String,
			"other_course_category":     otherCourseCategory.String,
			"grade_obtained":            gradeObtained.String,
			"type_of_sponsorship":       typeOfSponsorship.String,
			"other_type_of_sponsorship": otherTypeOfSponsorship.String,
			"claimed_for":               claimedFor.String,
			"other_claimed_for":         otherClaimedFor.String,
			"document_proof":            documentProof.String,
			"status":                    status.String,
			"remarks":                   remarks.String,
			"created_at":                string(createdAt),
		})
	}
	return results
}

func fetchFacultyPaperPresentations(facultyID string) []map[string]interface{} {
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
		log.Println("Error fetching paper presentations:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                    int
			taskID, specialLabs, otherAuthors, facultyOther, industrial, intlCollab                  sql.NullString
			confName, eMode, eOrg, otherOrg, eLevel, pTitle, sDate, eDate                                         sql.NullString
			pubProc, sponsor, otherSponsor, students, regAmt, docProof, award, status, remarks sql.NullString
			durationDays                                                                                          sql.NullInt64
			createdAt                                                                                             []uint8
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

		results = append(results, map[string]interface{}{
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
	return results
}

func fetchFacultyResourcePerson(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, resource_person_category, 
              type_of_organisation, other_type_of_organisation, organisation_name_and_address,
              number_of_days, from_date, to_date, document_proof, status, remarks, created_at 
              FROM faculty_resource_person WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching resource person:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                               int
			taskID, specialLabs, rpCategory, typeOrg, otherTypeOrg, orgNameAddr, numDays, fDate, tDate, docProof, status, remarks sql.NullString
			createdAt                                                                                                        []uint8
		)

		if err := rows.Scan(
			&id, &taskID, &specialLabs, &rpCategory, &typeOrg, &otherTypeOrg, &orgNameAddr,
			&numDays, &fDate, &tDate, &docProof, &status, &remarks, &createdAt,
		); err != nil {
			log.Println("Error scanning resource person:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                            id,
			"task_id":                       taskID.String,
			"special_labs_involved":         specialLabs.String,
			"resource_person_category":      rpCategory.String,
			"type_of_organisation":          typeOrg.String,
			"other_type_of_organisation":    otherTypeOrg.String,
			"organisation_name_and_address": orgNameAddr.String,
			"number_of_days":                numDays.String,
			"from_date":                     fDate.String,
			"to_date":                       tDate.String,
			"document_proof":                docProof.String,
			"status":                        status.String,
			"remarks":                       remarks.String,
			"created_at":                    string(createdAt),
		})
	}
	return results
}
