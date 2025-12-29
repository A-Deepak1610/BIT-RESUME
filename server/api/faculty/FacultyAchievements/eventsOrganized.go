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

func HandleEventsOrganizedForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse all form fields from the multi-step form
	formData := map[string]string{
		// Step 1: Basic Info
		"faculty_name":           c.PostForm("facultyName"),
		"task_id":                c.PostForm("taskId"),
		"role":                   c.PostForm("role"),
		"claimed_department":     c.PostForm("claimedDepartment"),
		"special_labs_involved":  c.PostForm("specialLabsInvolved"),
		"special_lab_name":       c.PostForm("specialLabName"),
		"is_iic":                 c.PostForm("isIIC"),
		"iic_upload_type":        c.PostForm("iicUploadType"),
		"is_dept_association":    c.PostForm("isDeptAssociation"),
		"is_rnd":                 c.PostForm("isRnd"),
		"is_tech_society":        c.PostForm("isTechSociety"),
		"tech_society_name":      c.PostForm("techSocietyName"),
		"is_mou_outcome":         c.PostForm("isMouOutcome"),
		"mou_id":                 c.PostForm("mouId"),
		"is_irp_outcome":         c.PostForm("isIrpOutcome"),
		"irp_id":                 c.PostForm("irpId"),
		"is_coe":                 c.PostForm("isCoe"),
		"coe_id":                 c.PostForm("coeId"),
		"is_industry_lab":        c.PostForm("isIndustryLab"),
		"industry_lab_id":        c.PostForm("industryLabId"),
		
		// Step 2: Committee Members
		"internal_faculty1_status": c.PostForm("internalFaculty1Status"),
		"internal_faculty1_name":   c.PostForm("internalFaculty1Name"),
		"internal_faculty1_role":   c.PostForm("internalFaculty1Role"),
		"internal_faculty2_status": c.PostForm("internalFaculty2Status"),
		"internal_faculty2_name":   c.PostForm("internalFaculty2Name"),
		"internal_faculty2_role":   c.PostForm("internalFaculty2Role"),
		"internal_faculty3_status": c.PostForm("internalFaculty3Status"),
		"internal_faculty3_name":   c.PostForm("internalFaculty3Name"),
		"internal_faculty3_role":   c.PostForm("internalFaculty3Role"),
		"internal_faculty4_status": c.PostForm("internalFaculty4Status"),
		"internal_faculty4_name":   c.PostForm("internalFaculty4Name"),
		"internal_faculty4_role":   c.PostForm("internalFaculty4Role"),
		"student_member1_status":   c.PostForm("studentMember1Status"),
		"student_member1_name":     c.PostForm("studentMember1Name"),
		"student_member2_status":   c.PostForm("studentMember2Status"),
		"student_member2_name":     c.PostForm("studentMember2Name"),
		"student_member3_status":   c.PostForm("studentMember3Status"),
		"student_member3_name":     c.PostForm("studentMember3Name"),
		"student_member4_status":   c.PostForm("studentMember4Status"),
		"student_member4_name":     c.PostForm("studentMember4Name"),
		"student_member5_status":   c.PostForm("studentMember5Status"),
		"student_member5_name":     c.PostForm("studentMember5Name"),
		
		// Step 3: Event Details
		"event_name":              c.PostForm("eventName"),
		"program_type":            c.PostForm("programType"),
		"event_type":              c.PostForm("eventType"),
		"event_category":          c.PostForm("eventCategory"),
		"event_organizer":         c.PostForm("eventOrganizer"),
		"event_description":       c.PostForm("eventDescription"),
		"event_mode":              c.PostForm("eventMode"),
		"event_level":             c.PostForm("eventLevel"),
		"event_duration":          c.PostForm("eventDuration"),
		"start_date":              c.PostForm("startDate"),
		"end_date":                c.PostForm("endDate"),
		"jointly_organized_with":  c.PostForm("jointlyOrganizedWith"),
		
		// Step 4: Participants
		"internal_students_count": c.PostForm("internalStudentsCount"),
		"internal_faculty_count":  c.PostForm("internalFacultyCount"),
		"external_students_count": c.PostForm("externalStudentsCount"),
		"external_faculty_count":  c.PostForm("externalFacultyCount"),
		
		// Step 5: Guests
		"has_invited_guest": c.PostForm("hasInvitedGuest"),
		"is_alumni":         c.PostForm("isAlumni"),
		"guest1_type":       c.PostForm("guest1Type"),
		"guest1_name":       c.PostForm("guest1Name"),
		"guest1_designation": c.PostForm("guest1Designation"),
		"guest1_org":        c.PostForm("guest1Org"),
		"guest1_email":      c.PostForm("guest1Email"),
		"guest1_contact":    c.PostForm("guest1Contact"),
		"guest2_type":       c.PostForm("guest2Type"),
		"guest2_name":       c.PostForm("guest2Name"),
		"guest2_designation": c.PostForm("guest2Designation"),
		"guest2_org":        c.PostForm("guest2Org"),
		"guest2_email":      c.PostForm("guest2Email"),
		"guest2_contact":    c.PostForm("guest2Contact"),
		"guest3_type":       c.PostForm("guest3Type"),
		"guest3_name":       c.PostForm("guest3Name"),
		"guest3_designation": c.PostForm("guest3Designation"),
		"guest3_org":        c.PostForm("guest3Org"),
		"guest3_email":      c.PostForm("guest3Email"),
		"guest3_contact":    c.PostForm("guest3Contact"),
		"guest4_type":       c.PostForm("guest4Type"),
		"guest4_name":       c.PostForm("guest4Name"),
		"guest4_designation": c.PostForm("guest4Designation"),
		"guest4_org":        c.PostForm("guest4Org"),
		"guest4_email":      c.PostForm("guest4Email"),
		"guest4_contact":    c.PostForm("guest4Contact"),
		"guest5_type":       c.PostForm("guest5Type"),
		"guest5_name":       c.PostForm("guest5Name"),
		"guest5_designation": c.PostForm("guest5Designation"),
		"guest5_org":        c.PostForm("guest5Org"),
		"guest5_email":      c.PostForm("guest5Email"),
		"guest5_contact":    c.PostForm("guest5Contact"),
		
		// Step 6: Financial
		"registration_amount":         c.PostForm("registrationAmount"),
		"sponsored_amount":            c.PostForm("sponsoredAmount"),
		"management_amount":           c.PostForm("managementAmount"),
		"funding_agency_sponsorship":  c.PostForm("fundingAgencySponsorship"),
		"total_revenue":               c.PostForm("totalRevenue"),
	}

	// Handle proof file upload
	uploadDir := "./uploads/faculty/events_organized"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	proofFile, _ := c.FormFile("proofFile")
	var proofPath string
	if proofFile != nil {
		proofFilename := fmt.Sprintf("%v_%d_%s", facultyID, time.Now().Unix(), proofFile.Filename)
		proofPath = filepath.Join(uploadDir, proofFilename)
		if err := c.SaveUploadedFile(proofFile, proofPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save proof file"})
			return
		}
	}

	// Helper function to get nullable string
	nullString := func(s string) interface{} {
		if s == "" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_events_organized (
		faculty_id, faculty_name, task_id, role, claimed_department,
		special_labs_involved, special_lab_name, is_iic, iic_upload_type,
		is_dept_association, is_rnd, is_tech_society, tech_society_name,
		is_mou_outcome, mou_id, is_irp_outcome, irp_id, is_coe, coe_id,
		is_industry_lab, industry_lab_id,
		internal_faculty1_status, internal_faculty1_name, internal_faculty1_role,
		internal_faculty2_status, internal_faculty2_name, internal_faculty2_role,
		internal_faculty3_status, internal_faculty3_name, internal_faculty3_role,
		internal_faculty4_status, internal_faculty4_name, internal_faculty4_role,
		student_member1_status, student_member1_name,
		student_member2_status, student_member2_name,
		student_member3_status, student_member3_name,
		student_member4_status, student_member4_name,
		student_member5_status, student_member5_name,
		event_name, program_type, event_type, event_category,
		event_organizer, event_description, event_mode, event_level,
		event_duration, start_date, end_date, jointly_organized_with,
		internal_students_count, internal_faculty_count,
		external_students_count, external_faculty_count,
		has_invited_guest, is_alumni,
		guest1_type, guest1_name, guest1_designation, guest1_org, guest1_email, guest1_contact,
		guest2_type, guest2_name, guest2_designation, guest2_org, guest2_email, guest2_contact,
		guest3_type, guest3_name, guest3_designation, guest3_org, guest3_email, guest3_contact,
		guest4_type, guest4_name, guest4_designation, guest4_org, guest4_email, guest4_contact,
		guest5_type, guest5_name, guest5_designation, guest5_org, guest5_email, guest5_contact,
		registration_amount, sponsored_amount, management_amount,
		funding_agency_sponsorship, total_revenue, proof_file
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID, nullString(formData["faculty_name"]), nullString(formData["task_id"]), nullString(formData["role"]), nullString(formData["claimed_department"]),
		nullString(formData["special_labs_involved"]), nullString(formData["special_lab_name"]), nullString(formData["is_iic"]), nullString(formData["iic_upload_type"]),
		nullString(formData["is_dept_association"]), nullString(formData["is_rnd"]), nullString(formData["is_tech_society"]), nullString(formData["tech_society_name"]),
		nullString(formData["is_mou_outcome"]), nullString(formData["mou_id"]), nullString(formData["is_irp_outcome"]), nullString(formData["irp_id"]), nullString(formData["is_coe"]), nullString(formData["coe_id"]),
		nullString(formData["is_industry_lab"]), nullString(formData["industry_lab_id"]),
		nullString(formData["internal_faculty1_status"]), nullString(formData["internal_faculty1_name"]), nullString(formData["internal_faculty1_role"]),
		nullString(formData["internal_faculty2_status"]), nullString(formData["internal_faculty2_name"]), nullString(formData["internal_faculty2_role"]),
		nullString(formData["internal_faculty3_status"]), nullString(formData["internal_faculty3_name"]), nullString(formData["internal_faculty3_role"]),
		nullString(formData["internal_faculty4_status"]), nullString(formData["internal_faculty4_name"]), nullString(formData["internal_faculty4_role"]),
		nullString(formData["student_member1_status"]), nullString(formData["student_member1_name"]),
		nullString(formData["student_member2_status"]), nullString(formData["student_member2_name"]),
		nullString(formData["student_member3_status"]), nullString(formData["student_member3_name"]),
		nullString(formData["student_member4_status"]), nullString(formData["student_member4_name"]),
		nullString(formData["student_member5_status"]), nullString(formData["student_member5_name"]),
		nullString(formData["event_name"]), nullString(formData["program_type"]), nullString(formData["event_type"]), nullString(formData["event_category"]),
		nullString(formData["event_organizer"]), nullString(formData["event_description"]), nullString(formData["event_mode"]), nullString(formData["event_level"]),
		nullString(formData["event_duration"]), nullString(formData["start_date"]), nullString(formData["end_date"]), nullString(formData["jointly_organized_with"]),
		nullString(formData["internal_students_count"]), nullString(formData["internal_faculty_count"]),
		nullString(formData["external_students_count"]), nullString(formData["external_faculty_count"]),
		nullString(formData["has_invited_guest"]), nullString(formData["is_alumni"]),
		nullString(formData["guest1_type"]), nullString(formData["guest1_name"]), nullString(formData["guest1_designation"]), nullString(formData["guest1_org"]), nullString(formData["guest1_email"]), nullString(formData["guest1_contact"]),
		nullString(formData["guest2_type"]), nullString(formData["guest2_name"]), nullString(formData["guest2_designation"]), nullString(formData["guest2_org"]), nullString(formData["guest2_email"]), nullString(formData["guest2_contact"]),
		nullString(formData["guest3_type"]), nullString(formData["guest3_name"]), nullString(formData["guest3_designation"]), nullString(formData["guest3_org"]), nullString(formData["guest3_email"]), nullString(formData["guest3_contact"]),
		nullString(formData["guest4_type"]), nullString(formData["guest4_name"]), nullString(formData["guest4_designation"]), nullString(formData["guest4_org"]), nullString(formData["guest4_email"]), nullString(formData["guest4_contact"]),
		nullString(formData["guest5_type"]), nullString(formData["guest5_name"]), nullString(formData["guest5_designation"]), nullString(formData["guest5_org"]), nullString(formData["guest5_email"]), nullString(formData["guest5_contact"]),
		nullString(formData["registration_amount"]), nullString(formData["sponsored_amount"]), nullString(formData["management_amount"]),
		nullString(formData["funding_agency_sponsorship"]), nullString(formData["total_revenue"]), nullString(proofPath),
	)

	if err != nil {
		log.Println("Error inserting events organized:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Events Organized submitted successfully"})
}

func FetchEventsOrganized(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, event_name, program_type, event_type, event_level, event_mode,
	          start_date, end_date, event_duration, internal_students_count, 
	          internal_faculty_count, external_students_count, external_faculty_count,
	          total_revenue, proof_file, status, remarks, created_at
	          FROM faculty_events_organized WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching events organized:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var events []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                       int
			eventName, programType, eventType, eventLevel, eventMode, proofFile, status, remarks    sql.NullString
			startDate, endDate                                                                       sql.NullString
			eventDuration, internalStudents, internalFaculty, externalStudents, externalFaculty     sql.NullInt64
			totalRevenue                                                                             sql.NullFloat64
			createdAt                                                                                []uint8
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

		events = append(events, map[string]interface{}{
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

	c.JSON(http.StatusOK, gin.H{"eventsOrganized": events})
}
