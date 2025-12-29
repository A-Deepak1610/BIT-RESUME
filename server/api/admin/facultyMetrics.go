package admin

import (
	"bitresume/config"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetFacultyList returns a list of all faculty members with their achievement counts
func GetFacultyList(c *gin.Context) {
	query := `
		SELECT 
			l.rollno as faculty_id,
			l.user_name,
			COALESCE(l.department, '') as department,
			COALESCE(l.user_email, '') as email,
			(
				(SELECT COUNT(*) FROM faculty_newsletter_archive WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_e_content WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_events_attended WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_events_organized WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_external_examiner WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_journal_reviewer WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_guest_lecture WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_international_visit WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_award WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_online_course WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_paper_presentation WHERE faculty_id = l.rollno) +
				(SELECT COUNT(*) FROM faculty_resource_person WHERE faculty_id = l.rollno)
			) as total_achievements
		FROM login l
		WHERE l.role = 'faculty'
		ORDER BY l.user_name ASC
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching faculty list:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var facultyList []map[string]interface{}
	for rows.Next() {
		var (
			facultyID, name, department, email string
			totalAchievements                               int
		)
		if err := rows.Scan(&facultyID, &name, &department, &email, &totalAchievements); err != nil {
			log.Println("Error scanning faculty row:", err)
			continue
		}
		facultyList = append(facultyList, map[string]interface{}{
			"faculty_id":         facultyID,
			"name":               name,
			"department":         department,
			"email":              email,
			"total_achievements": totalAchievements,
		})
	}

	c.JSON(http.StatusOK, gin.H{"facultyList": facultyList})
}

// GetFacultyAchievements returns all achievements for a specific faculty member
func GetFacultyAchievements(c *gin.Context) {
	facultyID := c.Param("facultyId")
	if facultyID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Faculty ID is required"})
		return
	}

	achievements := map[string]interface{}{
		"newsletterArchive":   fetchNewslettersByFaculty(facultyID),
		"eContentDeveloped":   fetchEContentByFaculty(facultyID),
		"eventsAttended":      fetchEventsAttendedByFaculty(facultyID),
		"eventsOrganized":     fetchEventsOrganizedByFaculty(facultyID),
		"externalExaminer":    fetchExternalExaminerByFaculty(facultyID),
		"journalReviewer":     fetchJournalReviewerByFaculty(facultyID),
		"guestLectures":       fetchGuestLectureByFaculty(facultyID),
		"internationalVisits": fetchInternationalVisitByFaculty(facultyID),
		"notableAchievements": fetchAwardsByFaculty(facultyID),
		"onlineCourses":       fetchOnlineCoursesByFaculty(facultyID),
		"paperPresentations":  fetchPaperPresentationsByFaculty(facultyID),
		"resourcePerson":      fetchResourcePersonByFaculty(facultyID),
	}

	c.JSON(http.StatusOK, gin.H{"achievements": achievements})
}

// Fetch functions for each category by faculty ID

func fetchNewslettersByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, newsletter_title, edition, publish_date, category, description, document_proof, status, remarks, created_at
			  FROM faculty_newsletter_archive WHERE faculty_id = ? ORDER BY created_at DESC`
	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching newsletters:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                         int
			taskID, title, edition, publishDate, category, description sql.NullString
			docProof, status, remarks                                  sql.NullString
			createdAt                                                  []uint8
		)
		if err := rows.Scan(&id, &taskID, &title, &edition, &publishDate, &category, &description, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning newsletter:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"task_id":        taskID.String,
			"title":          title.String,
			"edition":        edition.String,
			"publishDate":    publishDate.String,
			"category":       category.String,
			"description":    description.String,
			"document_proof": docProof.String,
			"status":         status.String,
			"remarks":        remarks.String,
			"created_at":     string(createdAt),
		})
	}
	return results
}

func fetchEContentByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, module_name, e_content_type, platform, duration, developed_date, 
			  document_proof, status, remarks, created_at
			  FROM faculty_e_content WHERE faculty_id = ? ORDER BY created_at DESC`
	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching e-content:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                   int
			taskID, moduleName, eContentType, platform, duration sql.NullString
			developedDate, docProof, status, remarks             sql.NullString
			createdAt                                            []uint8
		)
		if err := rows.Scan(&id, &taskID, &moduleName, &eContentType, &platform, &duration, &developedDate, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning e-content:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"task_id":        taskID.String,
			"title":          moduleName.String,
			"type":           eContentType.String,
			"platform":       platform.String,
			"duration":       duration.String,
			"developedDate":  developedDate.String,
			"document_proof": docProof.String,
			"status":         status.String,
			"remarks":        remarks.String,
			"created_at":     string(createdAt),
		})
	}
	return results
}

func fetchEventsAttendedByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, category, event_level, event_name, 
			  organiser_name, from_date, to_date, number_of_days, document_proof, status, remarks, created_at
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
			id                                                   int
			taskID, specialLabs, category, eventLevel, eventName sql.NullString
			organiserName, fromDate, toDate, numDays             sql.NullString
			docProof, status, remarks                            sql.NullString
			createdAt                                            []uint8
		)
		if err := rows.Scan(&id, &taskID, &specialLabs, &category, &eventLevel, &eventName, &organiserName, &fromDate, &toDate, &numDays, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning events attended:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"category":              category.String,
			"eventLevel":            eventLevel.String,
			"eventName":             eventName.String,
			"organizer":             organiserName.String,
			"startDate":             fromDate.String,
			"endDate":               toDate.String,
			"number_of_days":        numDays.String,
			"document_proof":        docProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}

func fetchEventsOrganizedByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, event_category, event_type, event_name, 
			  event_level, from_date, to_date, number_of_participants, document_proof, apex_body_approval,
			  sample_photographs, status, remarks, created_at
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
			id                                                       int
			taskID, specialLabs, eventCategory, eventType, eventName sql.NullString
			eventLevel, fromDate, toDate                             sql.NullString
			docProof, apexApproval, samplePhotos, status, remarks    sql.NullString
			numParticipants                                          sql.NullInt64
			createdAt                                                []uint8
		)
		if err := rows.Scan(&id, &taskID, &specialLabs, &eventCategory, &eventType, &eventName, &eventLevel, &fromDate, &toDate, &numParticipants, &docProof, &apexApproval, &samplePhotos, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning events organized:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"eventCategory":         eventCategory.String,
			"eventType":             eventType.String,
			"eventName":             eventName.String,
			"eventLevel":            eventLevel.String,
			"startDate":             fromDate.String,
			"endDate":               toDate.String,
			"participants":          numParticipants.Int64,
			"document_proof":        docProof.String,
			"apex_body_approval":    apexApproval.String,
			"sample_photographs":    samplePhotos.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}

func fetchExternalExaminerByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, type_of_examiner, institution_name, 
			  exam_date, document_proof, status, remarks, created_at
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
			id                                                   int
			taskID, specialLabs, typeOfExaminer, institutionName sql.NullString
			examDate, docProof, status, remarks                  sql.NullString
			createdAt                                            []uint8
		)
		if err := rows.Scan(&id, &taskID, &specialLabs, &typeOfExaminer, &institutionName, &examDate, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning external examiner:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"examType":              typeOfExaminer.String,
			"institution":           institutionName.String,
			"examDate":              examDate.String,
			"document_proof":        docProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}

func fetchJournalReviewerByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, journal_name, issn_isbn, 
			  review_date, document_proof, status, remarks, created_at
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
			id                                         int
			taskID, specialLabs, journalName, issnIsbn sql.NullString
			reviewDate, docProof, status, remarks      sql.NullString
			createdAt                                  []uint8
		)
		if err := rows.Scan(&id, &taskID, &specialLabs, &journalName, &issnIsbn, &reviewDate, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning journal reviewer:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"journalName":           journalName.String,
			"issn_isbn":             issnIsbn.String,
			"reviewDate":            reviewDate.String,
			"document_proof":        docProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}

func fetchGuestLectureByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, event_type, topic, mode_of_conduct, 
			  event_level, event_name, from_date, to_date, type_of_organization, number_of_participants,
			  type_of_audience, document_proof, apex_proof, sample_photographs, status, remarks, created_at
			  FROM faculty_guest_lecture WHERE faculty_id = ? ORDER BY created_at DESC`
	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching guest lecture:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                   int
			taskID, specialLabs, eventType, topic, modeOfConduct sql.NullString
			eventLevel, eventName, fromDate, toDate              sql.NullString
			typeOfOrg, typeOfAudience                            sql.NullString
			docProof, apexProof, samplePhotos, status, remarks   sql.NullString
			numParticipants                                      sql.NullInt64
			createdAt                                            []uint8
		)
		if err := rows.Scan(&id, &taskID, &specialLabs, &eventType, &topic, &modeOfConduct, &eventLevel, &eventName, &fromDate, &toDate, &typeOfOrg, &numParticipants, &typeOfAudience, &docProof, &apexProof, &samplePhotos, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning guest lecture:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"eventType":             eventType.String,
			"topic":                 topic.String,
			"modeOfConduct":         modeOfConduct.String,
			"eventLevel":            eventLevel.String,
			"institution":           eventName.String,
			"date":                  fromDate.String,
			"endDate":               toDate.String,
			"typeOfOrganization":    typeOfOrg.String,
			"attendees":             numParticipants.Int64,
			"audience":              typeOfAudience.String,
			"document_proof":        docProof.String,
			"apex_proof":            apexProof.String,
			"sample_photographs":    samplePhotos.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}

func fetchInternationalVisitByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, country_visited, purpose_of_visit, from_date, to_date, 
			  fund_type, document_proof, status, remarks, created_at
			  FROM faculty_international_visit WHERE faculty_id = ? ORDER BY created_at DESC`
	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching international visit:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                   int
			taskID, country, purpose, fromDate, toDate, fundType sql.NullString
			docProof, status, remarks                            sql.NullString
			createdAt                                            []uint8
		)
		if err := rows.Scan(&id, &taskID, &country, &purpose, &fromDate, &toDate, &fundType, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning international visit:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"task_id":        taskID.String,
			"country":        country.String,
			"purpose":        purpose.String,
			"startDate":      fromDate.String,
			"endDate":        toDate.String,
			"sponsor":        fundType.String,
			"document_proof": docProof.String,
			"status":         status.String,
			"remarks":        remarks.String,
			"created_at":     string(createdAt),
		})
	}
	return results
}

func fetchAwardsByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, type_of_recognition, recognition_received, 
			  awarding_agency, level, academic_year, document_proof, status, remarks, created_at
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
			id                                                              int
			taskID, specialLabs, typeOfRecog, recogReceived, awardingAgency sql.NullString
			level, academicYear, docProof, status, remarks                  sql.NullString
			createdAt                                                       []uint8
		)
		if err := rows.Scan(&id, &taskID, &specialLabs, &typeOfRecog, &recogReceived, &awardingAgency, &level, &academicYear, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning awards:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"category":              typeOfRecog.String,
			"title":                 recogReceived.String,
			"awardedBy":             awardingAgency.String,
			"level":                 level.String,
			"date":                  academicYear.String,
			"document_proof":        docProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}

func fetchOnlineCoursesByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, course_type, course_name, platform, 
			  duration, from_date, to_date, document_proof, status, remarks, created_at
			  FROM faculty_online_course WHERE faculty_id = ? ORDER BY created_at DESC`
	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching online courses:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                              int
			taskID, specialLabs, courseType, courseName, platform, duration sql.NullString
			fromDate, toDate, docProof, status, remarks                     sql.NullString
			createdAt                                                       []uint8
		)
		if err := rows.Scan(&id, &taskID, &specialLabs, &courseType, &courseName, &platform, &duration, &fromDate, &toDate, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning online courses:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"courseType":            courseType.String,
			"courseName":            courseName.String,
			"platform":              platform.String,
			"duration":              duration.String,
			"startDate":             fromDate.String,
			"completionDate":        toDate.String,
			"document_proof":        docProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}

func fetchPaperPresentationsByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, paper_title, conference_name, 
			  organizer, event_level, from_date, to_date, document_proof, status, remarks, created_at
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
			id                                                               int
			taskID, specialLabs, paperTitle, confName, organizer, eventLevel sql.NullString
			fromDate, toDate, docProof, status, remarks                      sql.NullString
			createdAt                                                        []uint8
		)
		if err := rows.Scan(&id, &taskID, &specialLabs, &paperTitle, &confName, &organizer, &eventLevel, &fromDate, &toDate, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning paper presentations:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"title":                 paperTitle.String,
			"conference":            confName.String,
			"organizer":             organizer.String,
			"eventLevel":            eventLevel.String,
			"date":                  fromDate.String,
			"endDate":               toDate.String,
			"document_proof":        docProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}

func fetchResourcePersonByFaculty(facultyID string) []map[string]interface{} {
	query := `SELECT id, task_id, special_labs_involved, resource_person_category, type_of_organisation,
			  other_type_of_organisation, organisation_name_address, from_date, to_date, number_of_days,
			  document_proof, status, remarks, created_at
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
			id                                                                      int
			taskID, specialLabs, rpCategory, typeOfOrg, otherTypeOfOrg, orgNameAddr sql.NullString
			fromDate, toDate, numDays, docProof, status, remarks                    sql.NullString
			createdAt                                                               []uint8
		)
		if err := rows.Scan(&id, &taskID, &specialLabs, &rpCategory, &typeOfOrg, &otherTypeOfOrg, &orgNameAddr, &fromDate, &toDate, &numDays, &docProof, &status, &remarks, &createdAt); err != nil {
			log.Println("Error scanning resource person:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":                    id,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabs.String,
			"topic":                 rpCategory.String,
			"organizer":             typeOfOrg.String,
			"otherOrganizer":        otherTypeOfOrg.String,
			"eventName":             orgNameAddr.String,
			"startDate":             fromDate.String,
			"endDate":               toDate.String,
			"duration":              numDays.String,
			"document_proof":        docProof.String,
			"status":                status.String,
			"remarks":               remarks.String,
			"created_at":            string(createdAt),
		})
	}
	return results
}
