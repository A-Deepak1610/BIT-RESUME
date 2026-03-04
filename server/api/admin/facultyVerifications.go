package admin

import (
	"bitresume/config"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetAllFacultySubmissions fetches all faculty submissions for admin verification
func GetAllFacultySubmissions(c *gin.Context) {
	var allSubmissions []map[string]interface{}
	// Fetch Newsletters
	newsletters := fetchNewslettersAdmin()
	allSubmissions = append(allSubmissions, newsletters...)

	// Fetch E-Content
	eContent := fetchEContentAdmin()
	allSubmissions = append(allSubmissions, eContent...)

	// Fetch Events Attended
	eventsAttended := fetchEventsAttendedAdmin()
	allSubmissions = append(allSubmissions, eventsAttended...)

	// Fetch Events Organized
	eventsOrganized := fetchEventsOrganizedAdmin()
	allSubmissions = append(allSubmissions, eventsOrganized...)

	// Fetch External Examiner
	externalExaminer := fetchExternalExaminerAdmin()
	allSubmissions = append(allSubmissions, externalExaminer...)

	// Fetch Journal Reviewer
	journalReviewer := fetchJournalReviewerAdmin()
	allSubmissions = append(allSubmissions, journalReviewer...)

	// Fetch Guest Lectures
	guestLectures := fetchGuestLectureAdmin()
	allSubmissions = append(allSubmissions, guestLectures...)

	// Fetch International Visits
	internationalVisits := fetchInternationalVisitAdmin()
	allSubmissions = append(allSubmissions, internationalVisits...)

	// Fetch Awards
	awards := fetchAwardsAdmin()
	allSubmissions = append(allSubmissions, awards...)

	// Fetch Online Courses
	onlineCourses := fetchOnlineCoursesAdmin()
	allSubmissions = append(allSubmissions, onlineCourses...)

	// Fetch Paper Presentations
	paperPresentations := fetchPaperPresentationsAdmin()
	allSubmissions = append(allSubmissions, paperPresentations...)

	// Fetch Resource Person
	resourcePerson := fetchResourcePersonAdmin()
	allSubmissions = append(allSubmissions, resourcePerson...)

	c.JSON(http.StatusOK, gin.H{"submissions": allSubmissions})
}

// UpdateFacultySubmissionStatus updates the status and remarks of a faculty submission
func UpdateFacultySubmissionStatus(c *gin.Context) {
	var request struct {
		ID      int    `json:"id"`
		Type    string `json:"type"`
		Status  string `json:"status"`
		Remarks string `json:"remarks"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var tableName string
	switch request.Type {
	case "newsletter":
		tableName = "faculty_newsletter_archive"
	case "econtent":
		tableName = "faculty_e_content"
	case "eventsAttended":
		tableName = "faculty_events_attended"
	case "eventsOrganized":
		tableName = "faculty_events_organized"
	case "examiner":
		tableName = "faculty_external_examiner"
	case "reviewer":
		tableName = "faculty_journal_reviewer"
	case "guestLecture":
		tableName = "faculty_guest_lecture"
	case "internationalVisit":
		tableName = "faculty_international_visit"
	case "awards":
		tableName = "faculty_award"
	case "onlineCourse":
		tableName = "faculty_online_course"
	case "papers":
		tableName = "faculty_paper_presentation"
	case "resourcePerson":
		tableName = "faculty_resource_person"
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid submission type"})
		return
	}

	query := "UPDATE " + tableName + " SET status = ?, remarks = ? WHERE id = ?"
	_, err := config.DB.Exec(query, request.Status, request.Remarks, request.ID)
	if err != nil {
		log.Println("Error updating status:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated successfully"})
}

// Helper functions to fetch data from each table

func fetchNewslettersAdmin() []map[string]interface{} {
	query := `
		SELECT n.id, n.faculty_id, n.newsletter_category, n.department, n.academic_year, 
			n.date_of_publication, n.volume_number, n.issue_number, n.issue_month, 
			n.faculty_editor_count, n.student_editor_count, n.proof_document, 
			n.status, n.remarks, n.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_newsletter_archive n
		LEFT JOIN login u ON n.faculty_id = u.rollno
		ORDER BY n.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching newsletters:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                           int
			facultyID, category, date, vol, issue, month, facCount, stuCount, proof, status, facultyName string
			dept, year, remarks                                                                          sql.NullString
			createdAt                                                                                    []uint8
		)
		if err := rows.Scan(&id, &facultyID, &category, &dept, &year, &date, &vol, &issue, &month, &facCount, &stuCount, &proof, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning newsletter:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID,
			"facultyName":    facultyName,
			"department":     dept.String,
			"type":           "newsletter",
			"typeDisplay":    "Newsletter",
			"title":          category + " - Vol " + vol + ", Issue " + issue,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status),
			"details": map[string]interface{}{
				"newsletter_category":  category,
				"academic_year":        year.String,
				"date_of_publication":  date,
				"volume_number":        vol,
				"issue_number":         issue,
				"issue_month":          month,
				"faculty_editor_count": facCount,
				"student_editor_count": stuCount,
			},
			"attachments": []map[string]interface{}{
				{"name": "Proof Document", "url": proof},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchEContentAdmin() []map[string]interface{} {
	query := `
		SELECT e.id, e.faculty_id, e.task_id, e.special_labs_involved, e.e_content_type, 
			e.topic_name, e.publisher_name, e.publisher_address, e.contact_no, 
			e.url_of_content, e.claimed_for, e.date_of_publication, 
			e.proof_document, e.status, e.remarks, e.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_e_content e
		LEFT JOIN login u ON e.faculty_id = u.rollno
		ORDER BY e.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching e-content:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                                                                  int
			facultyID, taskID, specialLabs, contentType, topicName, publisherName, publisherAddr, contact, url, claimedFor, pubDate, proof, status, facultyName string
			remarks                                                                                                                                             sql.NullString
			createdAt                                                                                                                                           []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &specialLabs, &contentType, &topicName, &publisherName, &publisherAddr, &contact, &url, &claimedFor, &pubDate, &proof, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning e-content:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID,
			"facultyName":    facultyName,
			"department":     "",
			"type":           "econtent",
			"typeDisplay":    "E-Content",
			"title":          topicName,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status),
			"details": map[string]interface{}{
				"task_id":             taskID,
				"special_labs":        specialLabs,
				"e_content_type":      contentType,
				"publisher_name":      publisherName,
				"publisher_address":   publisherAddr,
				"contact_no":          contact,
				"url_of_content":      url,
				"claimed_for":         claimedFor,
				"date_of_publication": pubDate,
			},
			"attachments": []map[string]interface{}{
				{"name": "Proof Document", "url": proof},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchEventsAttendedAdmin() []map[string]interface{} {
	query := `
		SELECT e.id, e.faculty_id, e.task_id, e.special_labs_involved, e.event_type, 
			e.organizer_type, e.event_level, e.event_title, e.organization_sector, 
			e.event_organizer, e.event_mode, e.event_duration, e.start_date, 
			e.end_date, e.duration_in_days, e.other_organizer_name, e.sponsorship_type, 
			e.outcome, e.certificate_proof, e.geotag_photos, e.claimed_for, 
			e.status, e.remarks, e.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_events_attended e
		LEFT JOIN login u ON e.faculty_id = u.rollno
		ORDER BY e.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching events attended:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                                                                                                                                                      int
			facultyID, taskID, specialLabs, eventType, orgType, eventLevel, eventTitle, orgSector, eventOrg, eventMode, eventDuration, startDate, endDate, otherOrg, sponsorship, outcome, certProof, geotagPhotos, claimedFor, status, facultyName sql.NullString
			durationDays                                                                                                                                                                                                                            sql.NullInt64
			remarks                                                                                                                                                                                                                                 sql.NullString
			createdAt                                                                                                                                                                                                                               []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &specialLabs, &eventType, &orgType, &eventLevel, &eventTitle, &orgSector, &eventOrg, &eventMode, &eventDuration, &startDate, &endDate, &durationDays, &otherOrg, &sponsorship, &outcome, &certProof, &geotagPhotos, &claimedFor, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning events attended:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "eventsAttended",
			"typeDisplay":    "Event Attended",
			"title":          eventTitle.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
				"task_id":             taskID.String,
				"special_labs":        specialLabs.String,
				"event_type":          eventType.String,
				"organizer_type":      orgType.String,
				"event_level":         eventLevel.String,
				"organization_sector": orgSector.String,
				"event_organizer":     eventOrg.String,
				"other_organizer":     otherOrg.String,
				"event_mode":          eventMode.String,
				"event_duration":      eventDuration.String,
				"start_date":          startDate.String,
				"end_date":            endDate.String,
				"duration_days":       durationDays.Int64,
				"sponsorship_type":    sponsorship.String,
				"outcome":             outcome.String,
				"claimed_for":         claimedFor.String,
			},
			"attachments": []map[string]interface{}{
				{"name": "Certificate", "url": certProof.String},
				{"name": "Geotag Photos", "url": geotagPhotos.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchEventsOrganizedAdmin() []map[string]interface{} {
	query := `
		SELECT e.id, e.faculty_id, e.event_name, e.program_type, e.event_type, 
			e.event_level, e.event_mode, e.start_date, e.end_date, e.event_duration,
			e.internal_students_count, e.internal_faculty_count, 
			e.external_students_count, e.external_faculty_count,
			e.total_revenue, e.proof_file, e.status, e.remarks, e.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_events_organized e
		LEFT JOIN login u ON e.faculty_id = u.rollno
		ORDER BY e.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching events organized:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                  int
			facultyID, eventName, programType, eventType, eventLevel, eventMode                 sql.NullString
			startDate, endDate, proofFile, status, facultyName                                  sql.NullString
			eventDuration, internalStudents, internalFaculty, externalStudents, externalFaculty sql.NullInt64
			totalRevenue                                                                        sql.NullFloat64
			remarks                                                                             sql.NullString
			createdAt                                                                           []uint8
		)
		if err := rows.Scan(&id, &facultyID, &eventName, &programType, &eventType, &eventLevel, &eventMode, &startDate, &endDate, &eventDuration, &internalStudents, &internalFaculty, &externalStudents, &externalFaculty, &totalRevenue, &proofFile, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning events organized:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "eventsOrganized",
			"typeDisplay":    "Event Organized",
			"title":          eventName.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
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
			},
			"attachments": []map[string]interface{}{
				{"name": "Proof File", "url": proofFile.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchExternalExaminerAdmin() []map[string]interface{} {
	query := `
		SELECT e.id, e.faculty_id, e.task_id, e.special_labs_involved, e.college_name, 
			e.institute_address, e.purpose_of_visit, e.number_of_days, 
			e.from_date, e.to_date, e.document_proof, 
			e.status, e.remarks, e.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_external_examiner e
		LEFT JOIN login u ON e.faculty_id = u.rollno
		ORDER BY e.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching external examiner:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                           int
			facultyID, taskID, specialLabs, collegeName, address, purpose, docProof, status, facultyName sql.NullString
			fromDate, toDate                                                                             sql.NullString
			numberOfDays                                                                                 sql.NullInt64
			remarks                                                                                      sql.NullString
			createdAt                                                                                    []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &specialLabs, &collegeName, &address, &purpose, &numberOfDays, &fromDate, &toDate, &docProof, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning external examiner:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "examiner",
			"typeDisplay":    "External Examiner",
			"title":          purpose.String + " at " + collegeName.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
				"task_id":           taskID.String,
				"special_labs":      specialLabs.String,
				"college_name":      collegeName.String,
				"institute_address": address.String,
				"purpose_of_visit":  purpose.String,
				"number_of_days":    numberOfDays.Int64,
				"from_date":         fromDate.String,
				"to_date":           toDate.String,
			},
			"attachments": []map[string]interface{}{
				{"name": "Document Proof", "url": docProof.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchJournalReviewerAdmin() []map[string]interface{} {
	query := `
		SELECT j.id, j.faculty_id, j.task_id, j.special_labs_involved, j.journal_name, 
			j.journal_indexing, j.other_journal_indexing, j.issn_no, j.publisher_name,
			j.impact_factor, j.journal_homepage_url, j.recognition_type, j.other_recognition_type,
			j.number_of_papers_reviewed, j.review_date, j.document_proof, 
			j.status, j.remarks, j.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_journal_reviewer j
		LEFT JOIN login u ON j.faculty_id = u.rollno
		ORDER BY j.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching journal reviewer:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                          int
			facultyID, taskID, specialLabs, journalName, journalIndexing, otherIndexing sql.NullString
			issnNo, publisherName, impactFactor, journalURL                             sql.NullString
			recognitionType, otherRecognition, docProof, status, facultyName            sql.NullString
			reviewDate                                                                  sql.NullString
			numberOfPapers                                                              sql.NullInt64
			remarks                                                                     sql.NullString
			createdAt                                                                   []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &specialLabs, &journalName, &journalIndexing, &otherIndexing, &issnNo, &publisherName, &impactFactor, &journalURL, &recognitionType, &otherRecognition, &numberOfPapers, &reviewDate, &docProof, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning journal reviewer:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "reviewer",
			"typeDisplay":    "Journal Reviewer",
			"title":          journalName.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
				"task_id":                   taskID.String,
				"special_labs":              specialLabs.String,
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
			},
			"attachments": []map[string]interface{}{
				{"name": "Document Proof", "url": docProof.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchGuestLectureAdmin() []map[string]interface{} {
	query := `
		SELECT g.id, g.faculty_id, g.task_id, g.special_labs_involved, g.event_type, 
			g.topic, g.mode_of_conduct, g.event_level, g.event_name, 
			g.from_date, g.to_date, g.type_of_organization, g.number_of_participants,
			g.type_of_audience, g.document_proof, g.apex_proof, g.sample_photographs,
			g.status, g.remarks, g.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_guest_lecture g
		LEFT JOIN login u ON g.faculty_id = u.rollno
		ORDER BY g.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching guest lectures:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                     int
			facultyID, taskID, specialLabs, eventType, topic, modeOfConduct, eventLevel, eventName sql.NullString
			fromDate, toDate, typeOfOrg, numberOfParticipants, typeOfAudience                      sql.NullString
			docProof, apexProof, samplePhotos, status, facultyName                                 sql.NullString
			remarks                                                                                sql.NullString
			createdAt                                                                              []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &specialLabs, &eventType, &topic, &modeOfConduct, &eventLevel, &eventName, &fromDate, &toDate, &typeOfOrg, &numberOfParticipants, &typeOfAudience, &docProof, &apexProof, &samplePhotos, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning guest lecture:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "guestLecture",
			"typeDisplay":    "Guest Lecture",
			"title":          topic.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
				"task_id":                taskID.String,
				"special_labs":           specialLabs.String,
				"event_type":             eventType.String,
				"topic":                  topic.String,
				"mode_of_conduct":        modeOfConduct.String,
				"event_level":            eventLevel.String,
				"event_name":             eventName.String,
				"from_date":              fromDate.String,
				"to_date":                toDate.String,
				"type_of_organization":   typeOfOrg.String,
				"number_of_participants": numberOfParticipants.String,
				"type_of_audience":       typeOfAudience.String,
			},
			"attachments": []map[string]interface{}{
				{"name": "Document Proof", "url": docProof.String},
				{"name": "Apex Proof", "url": apexProof.String},
				{"name": "Sample Photographs", "url": samplePhotos.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchInternationalVisitAdmin() []map[string]interface{} {
	query := `
		SELECT i.id, i.faculty_id, i.task_id, i.country_visited, i.purpose_of_visit,
			i.from_date, i.to_date, i.fund_type, i.document_proof, 
			i.status, i.remarks, i.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_international_visit i
		LEFT JOIN login u ON i.faculty_id = u.rollno
		ORDER BY i.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching international visits:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                           int
			facultyID, taskID, country, purpose, fundType, docProof, status, facultyName sql.NullString
			fromDate, toDate                                                             sql.NullString
			remarks                                                                      sql.NullString
			createdAt                                                                    []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &country, &purpose, &fromDate, &toDate, &fundType, &docProof, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning international visit:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "internationalVisit",
			"typeDisplay":    "International Visit",
			"title":          purpose.String + " - " + country.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
				"task_id":          taskID.String,
				"country_visited":  country.String,
				"purpose_of_visit": purpose.String,
				"from_date":        fromDate.String,
				"to_date":          toDate.String,
				"fund_type":        fundType.String,
			},
			"attachments": []map[string]interface{}{
				{"name": "Document Proof", "url": docProof.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchAwardsAdmin() []map[string]interface{} {
	query := `
		SELECT a.id, a.faculty_id, a.task_id, a.special_labs_involved, a.technical_society,
			a.type_of_recognition, a.other_type_of_recognition, a.award_name,
			a.organization_type, a.other_organization_type, a.awarding_agency,
			a.level, a.received_date, a.nature_of_recognition, a.other_nature_of_recognition,
			a.photo_proofs, a.document_proof, a.status, a.remarks, a.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_award a
		LEFT JOIN login u ON a.faculty_id = u.rollno
		ORDER BY a.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching awards:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                            int
			facultyID, taskID, specialLabs, technicalSociety, typeOfRecog, otherTypeOfRecog, awardName    sql.NullString
			orgType, otherOrgType, awardingAgency, level, receivedDate, natureOfRecog, otherNatureOfRecog sql.NullString
			photoProofs, docProof, status, facultyName                                                    sql.NullString
			remarks                                                                                       sql.NullString
			createdAt                                                                                     []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &specialLabs, &technicalSociety, &typeOfRecog, &otherTypeOfRecog, &awardName, &orgType, &otherOrgType, &awardingAgency, &level, &receivedDate, &natureOfRecog, &otherNatureOfRecog, &photoProofs, &docProof, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning award:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "awards",
			"typeDisplay":    "Award",
			"title":          awardName.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
				"task_id":                     taskID.String,
				"special_labs":                specialLabs.String,
				"technical_society":           technicalSociety.String,
				"type_of_recognition":         typeOfRecog.String,
				"other_type_of_recognition":   otherTypeOfRecog.String,
				"award_name":                  awardName.String,
				"organization_type":           orgType.String,
				"other_organization_type":     otherOrgType.String,
				"awarding_agency":             awardingAgency.String,
				"level":                       level.String,
				"received_date":               receivedDate.String,
				"nature_of_recognition":       natureOfRecog.String,
				"other_nature_of_recognition": otherNatureOfRecog.String,
			},
			"attachments": []map[string]interface{}{
				{"name": "Photo Proofs", "url": photoProofs.String},
				{"name": "Document Proof", "url": docProof.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchOnlineCoursesAdmin() []map[string]interface{} {
	query := `
		SELECT o.id, o.faculty_id, o.task_id, o.special_labs_involved, o.mode_of_course,
			o.course_type, o.other_course_type, o.course_name, o.type_of_organizer,
			o.other_type_of_organizer, o.organization_name, o.organization_address,
			o.level_of_event, o.duration, o.other_duration, o.start_date, o.end_date,
			o.course_category, o.other_course_category, o.grade_obtained,
			o.type_of_sponsorship, o.other_type_of_sponsorship, o.claimed_for,
			o.other_claimed_for, o.document_proof, o.status, o.remarks, o.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_online_courses o
		LEFT JOIN login u ON o.faculty_id = u.rollno
		ORDER BY o.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching online courses:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                    int
			facultyID, taskID, specialLabs, modeOfCourse, courseType, otherCourseType, courseName                 sql.NullString
			typeOfOrganizer, otherTypeOfOrganizer, orgName, orgAddress, levelOfEvent                              sql.NullString
			duration, otherDuration, startDate, endDate, courseCategory, otherCourseCategory, gradeObtained       sql.NullString
			typeOfSponsorship, otherTypeOfSponsorship, claimedFor, otherClaimedFor, docProof, status, facultyName sql.NullString
			remarks                                                                                               sql.NullString
			createdAt                                                                                             []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &specialLabs, &modeOfCourse, &courseType, &otherCourseType, &courseName, &typeOfOrganizer, &otherTypeOfOrganizer, &orgName, &orgAddress, &levelOfEvent, &duration, &otherDuration, &startDate, &endDate, &courseCategory, &otherCourseCategory, &gradeObtained, &typeOfSponsorship, &otherTypeOfSponsorship, &claimedFor, &otherClaimedFor, &docProof, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning online course:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "onlineCourse",
			"typeDisplay":    "Online Course",
			"title":          courseName.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
				"task_id":                   taskID.String,
				"special_labs":              specialLabs.String,
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
			},
			"attachments": []map[string]interface{}{
				{"name": "Document Proof", "url": docProof.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchPaperPresentationsAdmin() []map[string]interface{} {
	query := `
		SELECT p.id, p.faculty_id, p.task_id, p.special_labs_involved, p.other_authors_bit, 
			p.faculty_other_institute, p.industrial_person_involved, p.international_collaboration,
			p.conference_name, p.event_mode, p.event_organizer, p.other_event_organizer,
			p.event_level, p.paper_title, p.event_start_date, p.event_end_date, 
			p.event_duration_days, p.published_in_proceedings, p.type_of_sponsorship,
			p.other_type_of_sponsorship, p.students_involved, p.registration_amount,
			p.document_proof, p.award_cash_prize_receiver, p.status, p.remarks, p.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_paper_presentation p
		LEFT JOIN login u ON p.faculty_id = u.rollno
		ORDER BY p.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching paper presentations:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                           int
			facultyID, taskID, specialLabs, otherAuthors, facultyOtherInst, industrialPerson, intlCollab sql.NullString
			confName, eventMode, eventOrg, otherEventOrg, eventLevel, paperTitle                         sql.NullString
			startDate, endDate, pubProceedings, sponsorship, otherSponsorship                            sql.NullString
			studentsInvolved, docProof, awardPrize, status, facultyName                                  sql.NullString
			durationDays                                                                                 sql.NullInt64
			regAmount                                                                                    sql.NullFloat64
			remarks                                                                                      sql.NullString
			createdAt                                                                                    []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &specialLabs, &otherAuthors, &facultyOtherInst, &industrialPerson, &intlCollab, &confName, &eventMode, &eventOrg, &otherEventOrg, &eventLevel, &paperTitle, &startDate, &endDate, &durationDays, &pubProceedings, &sponsorship, &otherSponsorship, &studentsInvolved, &regAmount, &docProof, &awardPrize, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning paper presentation:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "papers",
			"typeDisplay":    "Paper Presentation",
			"title":          paperTitle.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
				"task_id":                     taskID.String,
				"special_labs":                specialLabs.String,
				"other_authors_bit":           otherAuthors.String,
				"faculty_other_institute":     facultyOtherInst.String,
				"industrial_person":           industrialPerson.String,
				"international_collaboration": intlCollab.String,
				"conference_name":             confName.String,
				"event_mode":                  eventMode.String,
				"event_organizer":             eventOrg.String,
				"other_event_organizer":       otherEventOrg.String,
				"event_level":                 eventLevel.String,
				"start_date":                  startDate.String,
				"end_date":                    endDate.String,
				"duration_days":               durationDays.Int64,
				"published_in_proceedings":    pubProceedings.String,
				"sponsorship":                 sponsorship.String,
				"other_sponsorship":           otherSponsorship.String,
				"students_involved":           studentsInvolved.String,
				"registration_amount":         regAmount.Float64,
				"award_prize":                 awardPrize.String,
			},
			"attachments": []map[string]interface{}{
				{"name": "Document Proof", "url": docProof.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

func fetchResourcePersonAdmin() []map[string]interface{} {
	query := `
		SELECT r.id, r.faculty_id, r.task_id, r.special_labs_involved, r.resource_person_category, 
			r.type_of_organisation, r.other_type_of_organisation, r.organisation_name_and_address,
			r.number_of_days, r.from_date, r.to_date, r.document_proof, 
			r.status, r.remarks, r.created_at,
			COALESCE(u.user_name, 'Unknown') as faculty_name
		FROM faculty_resource_person r
		LEFT JOIN login u ON r.faculty_id = u.rollno
		ORDER BY r.created_at DESC
	`
	rows, err := config.DB.Query(query)
	if err != nil {
		log.Println("Error fetching resource person:", err)
		return []map[string]interface{}{}
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                                                       int
			facultyID, taskID, specialLabs, rpCategory, orgType, otherOrgType, orgNameAddr, numDays, fromDate, toDate, docProof, status, facultyName sql.NullString
			remarks                                                                                                                                  sql.NullString
			createdAt                                                                                                                                []uint8
		)
		if err := rows.Scan(&id, &facultyID, &taskID, &specialLabs, &rpCategory, &orgType, &otherOrgType, &orgNameAddr, &numDays, &fromDate, &toDate, &docProof, &status, &remarks, &createdAt, &facultyName); err != nil {
			log.Println("Error scanning resource person:", err)
			continue
		}
		results = append(results, map[string]interface{}{
			"id":             id,
			"facultyId":      facultyID.String,
			"facultyName":    facultyName.String,
			"department":     "",
			"type":           "resourcePerson",
			"typeDisplay":    "Resource Person",
			"title":          rpCategory.String + " - " + orgType.String,
			"submissionDate": string(createdAt),
			"status":         mapStatus(status.String),
			"details": map[string]interface{}{
				"task_id":                    taskID.String,
				"special_labs":               specialLabs.String,
				"resource_person_category":   rpCategory.String,
				"type_of_organisation":       orgType.String,
				"other_type_of_organisation": otherOrgType.String,
				"organisation_name_address":  orgNameAddr.String,
				"from_date":                  fromDate.String,
				"to_date":                    toDate.String,
				"number_of_days":             numDays.String,
			},
			"attachments": []map[string]interface{}{
				{"name": "Document Proof", "url": docProof.String},
			},
			"remarks": remarks.String,
		})
	}
	return results
}

// Helper function to map status from database to frontend format
func mapStatus(status string) string {
	switch status {
	case "pending":
		return "Awaiting"
	case "verified":
		return "Verified"
	case "rejected":
		return "Rejected"
	default:
		return "Awaiting"
	}
}
