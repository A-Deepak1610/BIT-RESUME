package outsideworld

import (
	"bitresume/config"
	"bitresume/models"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// UploadFile handles file upload and returns the file path
func UploadFile(c *gin.Context, formKey string) (string, error) {
	file, err := c.FormFile(formKey)
	if err != nil {
		return "", nil // No file uploaded, that's okay
	}

	// Create uploads directory if it doesn't exist
	uploadDir := "./uploads/owi"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return "", err
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("%d_%s%s", timestamp, formKey, ext)
	filepath := filepath.Join(uploadDir, filename)

	// Save file
	if err := c.SaveUploadedFile(file, filepath); err != nil {
		return "", err
	}

	return filepath, nil
}

// UploadMultipleFiles handles multiple file uploads and returns comma-separated file paths
func UploadMultipleFiles(c *gin.Context, formKey string) (string, error) {
	form, err := c.MultipartForm()
	if err != nil {
<<<<<<< Updated upstream
		return "", nil // No multipart form, that's okay
=======
		return "", nil // No files uploaded, that's okay
>>>>>>> Stashed changes
	}

	files := form.File[formKey]
	if len(files) == 0 {
<<<<<<< Updated upstream
		return "", nil // No files uploaded
=======
		return "", nil
>>>>>>> Stashed changes
	}

	// Create uploads directory if it doesn't exist
	uploadDir := "./uploads/owi"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return "", err
	}

	var filePaths []string
	for i, file := range files {
		// Generate unique filename
		ext := filepath.Ext(file.Filename)
<<<<<<< Updated upstream
		timestamp := time.Now().UnixNano()
=======
		timestamp := time.Now().UnixNano() / 1000000 // milliseconds for uniqueness
>>>>>>> Stashed changes
		filename := fmt.Sprintf("%d_%s_%d%s", timestamp, formKey, i, ext)
		filePath := filepath.Join(uploadDir, filename)

		// Save file
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			log.Printf("Error saving file %s: %v", file.Filename, err)
			continue
		}
<<<<<<< Updated upstream
		filePaths = append(filePaths, filePath)
	}

=======

		filePaths = append(filePaths, filePath)
	}

	if len(filePaths) == 0 {
		return "", nil
	}

	// Return comma-separated paths
>>>>>>> Stashed changes
	return strings.Join(filePaths, ","), nil
}

// nullString helper for handling nullable strings
func nullString(s string) interface{} {
	if s == "" {
		return nil
	}
	return s
}

// =====================================================
// Industry Advisor Handlers
// =====================================================

func HandleIndustryAdvisorPost(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	approvalDoc, _ := UploadMultipleFiles(c, "approvalDocument")

<<<<<<< Updated upstream
	query := `INSERT INTO industry_advisor (faculty, sig_number, special_labs_involved, special_lab, industry_name, domain_area, industry_type, industry_type_other, expert_name, designation, email_id, phone_number, experience_years, area_of_expertise, industry_address, industry_website, frequency_of_interaction, date_of_meeting, expense_incurred, suggestions, collaborative_activities, approval_document, owi_verification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
=======
	query := `INSERT INTO faculty_industry_advisor (faculty, sig_number, special_labs_involved, special_lab, industry_name, domain_area, industry_type, industry_type_other, expert_name, designation, email_id, phone_number, experience_years, area_of_expertise, industry_address, industry_website, frequency_of_interaction, date_of_meeting, expense_incurred, suggestions, collaborative_activities, approval_document, owi_verification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
>>>>>>> Stashed changes

	_, err := config.DB.Exec(query,
		facultyID,
		nullString(c.PostForm("sigNumber")),
		nullString(c.PostForm("specialLabsInvolved")),
		nullString(c.PostForm("specialLab")),
		c.PostForm("industryName"),
		nullString(c.PostForm("domainArea")),
		nullString(c.PostForm("industryType")),
		nullString(c.PostForm("industryTypeOther")),
		c.PostForm("expertName"),
		c.PostForm("designation"),
		c.PostForm("emailId"),
		c.PostForm("phoneNumber"),
		nullString(c.PostForm("experienceYears")),
		nullString(c.PostForm("areaOfExpertise")),
		nullString(c.PostForm("industryAddress")),
		nullString(c.PostForm("industryWebsite")),
		nullString(c.PostForm("frequencyOfInteraction")),
		nullString(c.PostForm("dateOfMeeting")),
		nullString(c.PostForm("expenseIncurred")),
		nullString(c.PostForm("suggestions")),
		nullString(c.PostForm("collaborativeActivities")),
		approvalDoc,
		nullString(c.PostForm("owiVerification")),
	)

	if err != nil {
		log.Println("Error inserting industry advisor:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert record: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Industry Advisor record created successfully"})
}

func HandleIndustryAdvisorGet(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

<<<<<<< Updated upstream
	query := `SELECT id, COALESCE(faculty, ''), COALESCE(sig_number, ''), COALESCE(special_labs_involved, ''), COALESCE(special_lab, ''), COALESCE(industry_name, ''), COALESCE(domain_area, ''), COALESCE(industry_type, ''), COALESCE(industry_type_other, ''), COALESCE(expert_name, ''), COALESCE(designation, ''), COALESCE(email_id, ''), COALESCE(phone_number, ''), COALESCE(experience_years, ''), COALESCE(area_of_expertise, ''), COALESCE(industry_address, ''), COALESCE(industry_website, ''), COALESCE(frequency_of_interaction, ''), COALESCE(date_of_meeting, ''), COALESCE(expense_incurred, 0), COALESCE(suggestions, ''), COALESCE(collaborative_activities, ''), COALESCE(approval_document, ''), COALESCE(owi_verification, ''), COALESCE(created_at, NOW()), COALESCE(updated_at, NOW()) FROM industry_advisor WHERE faculty = ? ORDER BY created_at DESC`
=======
	query := `SELECT * FROM faculty_industry_advisor WHERE faculty = ? ORDER BY created_at DESC`
>>>>>>> Stashed changes

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching industry advisor:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch records"})
		return
	}
	defer rows.Close()

	var results []models.IndustryAdvisor
	for rows.Next() {
		var item models.IndustryAdvisor
		err := rows.Scan(
			&item.ID, &item.Faculty, &item.SigNumber, &item.SpecialLabsInvolved,
			&item.SpecialLab, &item.IndustryName, &item.DomainArea, &item.IndustryType,
			&item.IndustryTypeOther, &item.ExpertName, &item.Designation, &item.EmailID,
			&item.PhoneNumber, &item.ExperienceYears, &item.AreaOfExpertise,
			&item.IndustryAddress, &item.IndustryWebsite, &item.FrequencyOfInteraction,
			&item.DateOfMeeting, &item.ExpenseIncurred, &item.Suggestions,
			&item.CollaborativeActivities, &item.ApprovalDocument, &item.OWIVerification,
			&item.CreatedAt, &item.UpdatedAt,
		)
		if err != nil {
			log.Println("Error scanning industry advisor:", err)
			continue
		}
		results = append(results, item)
	}

	if results == nil {
		results = []models.IndustryAdvisor{}
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}

func HandleIndustryAdvisorUpdate(c *gin.Context) {
	id := c.Param("id")
	approvalDoc, _ := UploadMultipleFiles(c, "approvalDocument")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	if approvalDoc != "" {
		query := `UPDATE faculty_industry_advisor SET faculty=?, sig_number=?, special_labs_involved=?, special_lab=?, industry_name=?, domain_area=?, industry_type=?, industry_type_other=?, expert_name=?, designation=?, email_id=?, phone_number=?, experience_years=?, area_of_expertise=?, industry_address=?, industry_website=?, frequency_of_interaction=?, date_of_meeting=?, expense_incurred=?, suggestions=?, collaborative_activities=?, approval_document=?, owi_verification=? WHERE id=? AND faculty=?`
		_, err := config.DB.Exec(query,
			facultyID,
			nullString(c.PostForm("sigNumber")),
			nullString(c.PostForm("specialLabsInvolved")),
			nullString(c.PostForm("specialLab")),
			c.PostForm("industryName"),
			nullString(c.PostForm("domainArea")),
			nullString(c.PostForm("industryType")),
			nullString(c.PostForm("industryTypeOther")),
			c.PostForm("expertName"),
			c.PostForm("designation"),
			c.PostForm("emailId"),
			c.PostForm("phoneNumber"),
			nullString(c.PostForm("experienceYears")),
			nullString(c.PostForm("areaOfExpertise")),
			nullString(c.PostForm("industryAddress")),
			nullString(c.PostForm("industryWebsite")),
			nullString(c.PostForm("frequencyOfInteraction")),
			nullString(c.PostForm("dateOfMeeting")),
			nullString(c.PostForm("expenseIncurred")),
			nullString(c.PostForm("suggestions")),
			nullString(c.PostForm("collaborativeActivities")),
			approvalDoc,
			nullString(c.PostForm("owiVerification")),
			id,
			facultyID,
		)
		if err != nil {
			log.Println("Error updating industry advisor:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	} else {
		query := `UPDATE faculty_industry_advisor SET faculty=?, sig_number=?, special_labs_involved=?, special_lab=?, industry_name=?, domain_area=?, industry_type=?, industry_type_other=?, expert_name=?, designation=?, email_id=?, phone_number=?, experience_years=?, area_of_expertise=?, industry_address=?, industry_website=?, frequency_of_interaction=?, date_of_meeting=?, expense_incurred=?, suggestions=?, collaborative_activities=?, owi_verification=? WHERE id=? AND faculty=?`
		_, err := config.DB.Exec(query,
			facultyID,
			nullString(c.PostForm("sigNumber")),
			nullString(c.PostForm("specialLabsInvolved")),
			nullString(c.PostForm("specialLab")),
			c.PostForm("industryName"),
			nullString(c.PostForm("domainArea")),
			nullString(c.PostForm("industryType")),
			nullString(c.PostForm("industryTypeOther")),
			c.PostForm("expertName"),
			c.PostForm("designation"),
			c.PostForm("emailId"),
			c.PostForm("phoneNumber"),
			nullString(c.PostForm("experienceYears")),
			nullString(c.PostForm("areaOfExpertise")),
			nullString(c.PostForm("industryAddress")),
			nullString(c.PostForm("industryWebsite")),
			nullString(c.PostForm("frequencyOfInteraction")),
			nullString(c.PostForm("dateOfMeeting")),
			nullString(c.PostForm("expenseIncurred")),
			nullString(c.PostForm("suggestions")),
			nullString(c.PostForm("collaborativeActivities")),
			nullString(c.PostForm("owiVerification")),
			id,
			facultyID,
		)
		if err != nil {
			log.Println("Error updating industry advisor:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Industry Advisor record updated successfully"})
}

func HandleIndustryAdvisorDelete(c *gin.Context) {
	id := c.Param("id")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `DELETE FROM faculty_industry_advisor WHERE id=? AND faculty=?`
	_, err := config.DB.Exec(query, id, facultyID)
	if err != nil {
		log.Println("Error deleting industry advisor:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Industry Advisor record deleted successfully"})
}

// =====================================================
// Laboratory By Industry Handlers
// =====================================================

func HandleLaboratoryByIndustryPost(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	proofDoc, _ := UploadMultipleFiles(c, "proofDocument")

	query := `INSERT INTO laboratory_by_industry (faculty, sig_number, task_id, name_of_laboratory, collaborative_industry, domain_area_of_industry, laboratory_area, total_amount_incurred, bit_contribution, financial_support_from_industry, equipment_sponsored, equipment_enhancement, layout_design_enhancement, curriculum_mapping, expected_outcomes, proof_document, owi_verification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID,
		nullString(c.PostForm("sigNumber")),
		nullString(c.PostForm("taskId")),
		c.PostForm("nameOfLaboratory"),
		c.PostForm("collaborativeIndustry"),
		nullString(c.PostForm("domainAreaOfIndustry")),
		nullString(c.PostForm("laboratoryArea")),
		nullString(c.PostForm("totalAmountIncurred")),
		nullString(c.PostForm("bitContribution")),
		nullString(c.PostForm("financialSupportFromIndustry")),
		nullString(c.PostForm("equipmentSponsored")),
		nullString(c.PostForm("equipmentEnhancement")),
		nullString(c.PostForm("layoutDesignEnhancement")),
		nullString(c.PostForm("curriculumMapping")),
		nullString(c.PostForm("expectedOutcomes")),
		proofDoc,
		nullString(c.PostForm("owiVerification")),
	)

	if err != nil {
		log.Println("Error inserting laboratory by industry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert record: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Laboratory by Industry record created successfully"})
}

func HandleLaboratoryByIndustryGet(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `SELECT id, COALESCE(faculty, ''), COALESCE(sig_number, ''), COALESCE(task_id, ''), COALESCE(name_of_laboratory, ''), COALESCE(collaborative_industry, ''), COALESCE(domain_area_of_industry, ''), COALESCE(laboratory_area, 0), COALESCE(total_amount_incurred, 0), COALESCE(bit_contribution, 0), COALESCE(financial_support_from_industry, 0), COALESCE(equipment_sponsored, ''), COALESCE(equipment_enhancement, ''), COALESCE(layout_design_enhancement, ''), COALESCE(curriculum_mapping, ''), COALESCE(expected_outcomes, ''), COALESCE(proof_document, ''), COALESCE(owi_verification, ''), COALESCE(created_at, NOW()), COALESCE(updated_at, NOW()) FROM laboratory_by_industry WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching laboratory by industry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch records"})
		return
	}
	defer rows.Close()

	var results []models.LaboratoryByIndustry
	for rows.Next() {
		var item models.LaboratoryByIndustry
		err := rows.Scan(
			&item.ID, &item.Faculty, &item.SigNumber, &item.TaskID, &item.NameOfLaboratory,
			&item.CollaborativeIndustry, &item.DomainAreaOfIndustry, &item.LaboratoryArea,
			&item.TotalAmountIncurred, &item.BitContribution, &item.FinancialSupportFromIndustry,
			&item.EquipmentSponsored, &item.EquipmentEnhancement, &item.LayoutDesignEnhancement,
			&item.CurriculumMapping, &item.ExpectedOutcomes, &item.ProofDocument,
			&item.OWIVerification, &item.CreatedAt, &item.UpdatedAt,
		)
		if err != nil {
			log.Println("Error scanning laboratory by industry:", err)
			continue
		}
		results = append(results, item)
	}

	if results == nil {
		results = []models.LaboratoryByIndustry{}
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}

// =====================================================
// Professional Membership Handlers
// =====================================================

func HandleProfessionalMembershipPost(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	apexDoc, _ := UploadFile(c, "apexDocumentProof")
	docProof, _ := UploadFile(c, "documentProof")

	query := `INSERT INTO professional_membership (membership_category, faculty, task_id, special_labs_involved, special_lab, name_of_professional_body, membership_type, membership_id, name_of_grade_level_position, category, validity_type, apex_document_proof, amount, if_others, amount_if_others, document_proof, owi_verification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		nullString(c.PostForm("membershipCategory")),
		facultyID,
		nullString(c.PostForm("taskId")),
		nullString(c.PostForm("specialLabsInvolved")),
		nullString(c.PostForm("specialLab")),
		c.PostForm("nameOfProfessionalBody"),
		nullString(c.PostForm("membershipType")),
		nullString(c.PostForm("membershipId")),
		nullString(c.PostForm("nameOfGradeLevelPosition")),
		nullString(c.PostForm("category")),
		nullString(c.PostForm("validityType")),
		apexDoc,
		nullString(c.PostForm("amount")),
		nullString(c.PostForm("ifOthers")),
		nullString(c.PostForm("amountIfOthers")),
		docProof,
		nullString(c.PostForm("owiVerification")),
	)

	if err != nil {
		log.Println("Error inserting professional membership:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert record: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Professional Membership record created successfully"})
}

func HandleProfessionalMembershipGet(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `SELECT * FROM professional_membership WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching professional membership:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch records"})
		return
	}
	defer rows.Close()

	var results []models.ProfessionalMembership
	for rows.Next() {
		var item models.ProfessionalMembership
		err := rows.Scan(
			&item.ID, &item.MembershipCategory, &item.Faculty, &item.TaskID,
			&item.SpecialLabsInvolved, &item.SpecialLab, &item.NameOfProfessionalBody,
			&item.MembershipType, &item.MembershipID, &item.NameOfGradeLevelPosition,
			&item.Category, &item.ValidityType, &item.ApexDocumentProof, &item.Amount,
			&item.IfOthers, &item.AmountIfOthers, &item.DocumentProof, &item.OWIVerification,
			&item.CreatedAt, &item.UpdatedAt,
		)
		if err != nil {
			log.Println("Error scanning professional membership:", err)
			continue
		}
		results = append(results, item)
	}

	if results == nil {
		results = []models.ProfessionalMembership{}
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}

// =====================================================
// Students Industrial Visit Handlers
// =====================================================

func HandleStudentsIndustrialVisitPost(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	proofDoc, _ := UploadFile(c, "proofDocument")
	log.Println("proofDoc value:", proofDoc)
	if proofDoc == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Proof document file missing or not uploaded. Please check form and file input name."})
		return
	}

	query := `INSERT INTO students_industrial_visit (faculty, sig_number, task_id, programme, industry_name, domain_area, industry_type, industry_type_other, industry_location, industry_website, contact_person_name, contact_person_designation, contact_person_email, contact_person_phone, visit_start_date, visit_end_date, year_of_study, number_of_students, male_students, female_students, purpose_of_visit, faculty1, faculty2, faculty3, source_of_arrangement, curriculum_mapping, outcome_of_visit, proof_document, owi_verification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID,
		nullString(c.PostForm("sigNumber")),
		nullString(c.PostForm("taskId")),
		nullString(c.PostForm("programme")),
		c.PostForm("industryName"),
		nullString(c.PostForm("domainArea")),
		nullString(c.PostForm("industryType")),
		nullString(c.PostForm("industryTypeOther")),
		nullString(c.PostForm("industryLocation")),
		nullString(c.PostForm("industryWebsite")),
		c.PostForm("contactPersonName"),
		c.PostForm("contactPersonDesignation"),
		c.PostForm("contactPersonEmail"),
		c.PostForm("contactPersonPhone"),
		nullString(c.PostForm("visitStartDate")),
		nullString(c.PostForm("visitEndDate")),
		nullString(c.PostForm("yearOfStudy")),
		nullString(c.PostForm("numberOfStudents")),
		nullString(c.PostForm("maleStudents")),
		nullString(c.PostForm("femaleStudents")),
		c.PostForm("purposeOfVisit"),
		nullString(c.PostForm("faculty1")),
		nullString(c.PostForm("faculty2")),
		nullString(c.PostForm("faculty3")),
		nullString(c.PostForm("sourceOfArrangement")),
		nullString(c.PostForm("curriculumMapping")),
		c.PostForm("outcomeOfVisit"),
		proofDoc,
		nullString(c.PostForm("owiVerification")),
	)

	if err != nil {
		log.Println("Error inserting students industrial visit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert record: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Students Industrial Visit record created successfully"})
}

func HandleStudentsIndustrialVisitGet(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `SELECT * FROM students_industrial_visit WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching students industrial visit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch records"})
		return
	}
	defer rows.Close()

	var results []models.StudentsIndustrialVisit
	for rows.Next() {
		var item models.StudentsIndustrialVisit
		err := rows.Scan(
			&item.ID, &item.Faculty, &item.SigNumber, &item.TaskID, &item.Programme,
			&item.IndustryName, &item.DomainArea, &item.IndustryType, &item.IndustryTypeOther,
			&item.IndustryLocation, &item.IndustryWebsite, &item.ContactPersonName,
			&item.ContactPersonDesignation, &item.ContactPersonEmail, &item.ContactPersonPhone,
			&item.VisitStartDate, &item.VisitEndDate, &item.YearOfStudy, &item.NumberOfStudents,
			&item.MaleStudents, &item.FemaleStudents, &item.PurposeOfVisit, &item.Faculty1,
			&item.Faculty2, &item.Faculty3, &item.SourceOfArrangement, &item.CurriculumMapping,
			&item.OutcomeOfVisit, &item.ProofDocument, &item.OWIVerification,
		)
		if err != nil {
			log.Println("Error scanning students industrial visit:", err)
			continue
		}
		results = append(results, item)
	}

	if results == nil {
		results = []models.StudentsIndustrialVisit{}
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}

// =====================================================
// Technical Societies Handlers
// =====================================================

func HandleTechnicalSocietiesPost(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `INSERT INTO technical_societies (name, society, status, faculty, sig_number, task_id, owi_verification) VALUES (?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		c.PostForm("name"),
		c.PostForm("society"),
		nullString(c.PostForm("status")),
		facultyID,
		nullString(c.PostForm("sigNumber")),
		nullString(c.PostForm("taskId")),
		nullString(c.PostForm("owiVerification")),
	)

	if err != nil {
		log.Println("Error inserting technical societies:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert record: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Technical Societies record created successfully"})
}

func HandleTechnicalSocietiesGet(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `SELECT * FROM technical_societies WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching technical societies:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch records"})
		return
	}
	defer rows.Close()

	var results []models.TechnicalSocieties
	for rows.Next() {
		var item models.TechnicalSocieties
		err := rows.Scan(
			&item.ID, &item.Name, &item.Society, &item.Status, &item.Faculty,
			&item.SigNumber, &item.TaskID, &item.OWIVerification,
			&item.CreatedAt, &item.UpdatedAt,
		)
		if err != nil {
			log.Println("Error scanning technical societies:", err)
			continue
		}
		results = append(results, item)
	}

	if results == nil {
		results = []models.TechnicalSocieties{}
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}

// =====================================================
// Training To Industry Handlers
// =====================================================

func HandleTrainingToIndustryPost(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	commProof, _ := UploadFile(c, "communicationProof")
	approvalLetter, _ := UploadFile(c, "approvalLetter")
	geotagPhotos, _ := UploadFile(c, "geotagPhotos")
	participantsAtt, _ := UploadFile(c, "participantsAttendance")
	paymentProofs, _ := UploadFile(c, "paymentProofs")
	consolidatedDoc, _ := UploadFile(c, "consolidatedDocument")

	query := `INSERT INTO training_to_industry (faculty, sig_number, special_labs_involved, special_lab, event_name, event_name_other, industry_name, industry_address, domain_area, industry_type, industry_type_other, mode_of_training, industry_website, number_of_persons_trained, duration_days, start_date, end_date, outcome_of_training, honorarium_received, communication_proof, approval_letter, geotag_photos, participants_attendance, payment_proofs, consolidated_document, owi_verification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		facultyID,
		nullString(c.PostForm("sigNumber")),
		nullString(c.PostForm("specialLabsInvolved")),
		nullString(c.PostForm("specialLab")),
		c.PostForm("eventName"),
		nullString(c.PostForm("eventNameOther")),
		c.PostForm("industryName"),
		nullString(c.PostForm("industryAddress")),
		nullString(c.PostForm("domainArea")),
		nullString(c.PostForm("industryType")),
		nullString(c.PostForm("industryTypeOther")),
		nullString(c.PostForm("modeOfTraining")),
		nullString(c.PostForm("industryWebsite")),
		nullString(c.PostForm("numberOfPersonsTrained")),
		nullString(c.PostForm("durationDays")),
		nullString(c.PostForm("startDate")),
		nullString(c.PostForm("endDate")),
		c.PostForm("outcomeOfTraining"),
		nullString(c.PostForm("honorariumReceived")),
		commProof,
		approvalLetter,
		geotagPhotos,
		participantsAtt,
		paymentProofs,
		consolidatedDoc,
		nullString(c.PostForm("owiVerification")),
	)

	if err != nil {
		log.Println("Error inserting training to industry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert record: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Training to Industry record created successfully"})
}

func HandleTrainingToIndustryGet(c *gin.Context) {
	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `SELECT * FROM training_to_industry WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching training to industry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch records"})
		return
	}
	defer rows.Close()

	var results []models.TrainingToIndustry
	for rows.Next() {
		var item models.TrainingToIndustry
		err := rows.Scan(
			&item.ID, &item.Faculty, &item.SigNumber, &item.SpecialLabsInvolved, &item.SpecialLab,
			&item.EventName, &item.EventNameOther, &item.IndustryName, &item.IndustryAddress,
			&item.DomainArea, &item.IndustryType, &item.IndustryTypeOther, &item.ModeOfTraining,
			&item.IndustryWebsite, &item.NumberOfPersonsTrained, &item.DurationDays,
			&item.StartDate, &item.EndDate, &item.OutcomeOfTraining, &item.HonorariumReceived,
			&item.CommunicationProof, &item.ApprovalLetter, &item.GeotagPhotos,
			&item.ParticipantsAttendance, &item.PaymentProofs, &item.ConsolidatedDocument,
			&item.OWIVerification, &item.CreatedAt, &item.UpdatedAt,
		)
		if err != nil {
			log.Println("Error scanning training to industry:", err)
			continue
		}
		results = append(results, item)
	}

	if results == nil {
		results = []models.TrainingToIndustry{}
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}

// =====================================================
// Laboratory By Industry - Update & Delete
// =====================================================

func HandleLaboratoryByIndustryUpdate(c *gin.Context) {
	id := c.Param("id")
	proofDoc, _ := UploadFile(c, "proofDocument")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	if proofDoc != "" {
		query := `UPDATE laboratory_by_industry SET faculty=?, sig_number=?, task_id=?, name_of_laboratory=?, collaborative_industry=?, domain_area_of_industry=?, laboratory_area=?, total_amount_incurred=?, bit_contribution=?, financial_support_from_industry=?, equipment_sponsored=?, equipment_enhancement=?, layout_design_enhancement=?, curriculum_mapping=?, expected_outcomes=?, proof_document=?, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			facultyID,
			nullString(c.PostForm("sigNumber")),
			nullString(c.PostForm("taskId")),
			c.PostForm("nameOfLaboratory"),
			c.PostForm("collaborativeIndustry"),
			nullString(c.PostForm("domainAreaOfIndustry")),
			nullString(c.PostForm("laboratoryArea")),
			nullString(c.PostForm("totalAmountIncurred")),
			nullString(c.PostForm("bitContribution")),
			nullString(c.PostForm("financialSupportFromIndustry")),
			nullString(c.PostForm("equipmentSponsored")),
			nullString(c.PostForm("equipmentEnhancement")),
			nullString(c.PostForm("layoutDesignEnhancement")),
			nullString(c.PostForm("curriculumMapping")),
			nullString(c.PostForm("expectedOutcomes")),
			proofDoc,
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating laboratory by industry:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	} else {
		query := `UPDATE laboratory_by_industry SET faculty=?, sig_number=?, task_id=?, name_of_laboratory=?, collaborative_industry=?, domain_area_of_industry=?, laboratory_area=?, total_amount_incurred=?, bit_contribution=?, financial_support_from_industry=?, equipment_sponsored=?, equipment_enhancement=?, layout_design_enhancement=?, curriculum_mapping=?, expected_outcomes=?, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			facultyID,
			nullString(c.PostForm("sigNumber")),
			nullString(c.PostForm("taskId")),
			c.PostForm("nameOfLaboratory"),
			c.PostForm("collaborativeIndustry"),
			nullString(c.PostForm("domainAreaOfIndustry")),
			nullString(c.PostForm("laboratoryArea")),
			nullString(c.PostForm("totalAmountIncurred")),
			nullString(c.PostForm("bitContribution")),
			nullString(c.PostForm("financialSupportFromIndustry")),
			nullString(c.PostForm("equipmentSponsored")),
			nullString(c.PostForm("equipmentEnhancement")),
			nullString(c.PostForm("layoutDesignEnhancement")),
			nullString(c.PostForm("curriculumMapping")),
			nullString(c.PostForm("expectedOutcomes")),
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating laboratory by industry:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Laboratory by Industry record updated successfully"})
}

func HandleLaboratoryByIndustryDelete(c *gin.Context) {
	id := c.Param("id")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `DELETE FROM laboratory_by_industry WHERE id=? AND faculty=?`
	_, err := config.DB.Exec(query, id, facultyID)
	if err != nil {
		log.Println("Error deleting laboratory by industry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Laboratory by Industry record deleted successfully"})
}

// =====================================================
// Professional Membership - Update & Delete
// =====================================================

func HandleProfessionalMembershipUpdate(c *gin.Context) {
	id := c.Param("id")
	apexDoc, _ := UploadFile(c, "apexDocumentProof")
	docProof, _ := UploadFile(c, "documentProof")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	if apexDoc != "" && docProof != "" {
		query := `UPDATE professional_membership SET membership_category=?, faculty=?, task_id=?, special_labs_involved=?, special_lab=?, name_of_professional_body=?, membership_type=?, membership_id=?, name_of_grade_level_position=?, category=?, validity_type=?, apex_document_proof=?, amount=?, if_others=?, amount_if_others=?, document_proof=?, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			nullString(c.PostForm("membershipCategory")),
			facultyID,
			nullString(c.PostForm("taskId")),
			nullString(c.PostForm("specialLabsInvolved")),
			nullString(c.PostForm("specialLab")),
			c.PostForm("nameOfProfessionalBody"),
			nullString(c.PostForm("membershipType")),
			nullString(c.PostForm("membershipId")),
			nullString(c.PostForm("nameOfGradeLevelPosition")),
			nullString(c.PostForm("category")),
			nullString(c.PostForm("validityType")),
			apexDoc,
			nullString(c.PostForm("amount")),
			nullString(c.PostForm("ifOthers")),
			nullString(c.PostForm("amountIfOthers")),
			docProof,
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating professional membership:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	} else if apexDoc != "" {
		query := `UPDATE professional_membership SET membership_category=?, faculty=?, task_id=?, special_labs_involved=?, special_lab=?, name_of_professional_body=?, membership_type=?, membership_id=?, name_of_grade_level_position=?, category=?, validity_type=?, apex_document_proof=?, amount=?, if_others=?, amount_if_others=?, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			nullString(c.PostForm("membershipCategory")),
			facultyID,
			nullString(c.PostForm("taskId")),
			nullString(c.PostForm("specialLabsInvolved")),
			nullString(c.PostForm("specialLab")),
			c.PostForm("nameOfProfessionalBody"),
			nullString(c.PostForm("membershipType")),
			nullString(c.PostForm("membershipId")),
			nullString(c.PostForm("nameOfGradeLevelPosition")),
			nullString(c.PostForm("category")),
			nullString(c.PostForm("validityType")),
			apexDoc,
			nullString(c.PostForm("amount")),
			nullString(c.PostForm("ifOthers")),
			nullString(c.PostForm("amountIfOthers")),
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating professional membership:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	} else if docProof != "" {
		query := `UPDATE professional_membership SET membership_category=?, faculty=?, task_id=?, special_labs_involved=?, special_lab=?, name_of_professional_body=?, membership_type=?, membership_id=?, name_of_grade_level_position=?, category=?, validity_type=?, amount=?, if_others=?, amount_if_others=?, document_proof=?, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			nullString(c.PostForm("membershipCategory")),
			facultyID,
			nullString(c.PostForm("taskId")),
			nullString(c.PostForm("specialLabsInvolved")),
			nullString(c.PostForm("specialLab")),
			c.PostForm("nameOfProfessionalBody"),
			nullString(c.PostForm("membershipType")),
			nullString(c.PostForm("membershipId")),
			nullString(c.PostForm("nameOfGradeLevelPosition")),
			nullString(c.PostForm("category")),
			nullString(c.PostForm("validityType")),
			nullString(c.PostForm("amount")),
			nullString(c.PostForm("ifOthers")),
			nullString(c.PostForm("amountIfOthers")),
			docProof,
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating professional membership:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	} else {
		query := `UPDATE professional_membership SET membership_category=?, faculty=?, task_id=?, special_labs_involved=?, special_lab=?, name_of_professional_body=?, membership_type=?, membership_id=?, name_of_grade_level_position=?, category=?, validity_type=?, amount=?, if_others=?, amount_if_others=?, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			nullString(c.PostForm("membershipCategory")),
			facultyID,
			nullString(c.PostForm("taskId")),
			nullString(c.PostForm("specialLabsInvolved")),
			nullString(c.PostForm("specialLab")),
			c.PostForm("nameOfProfessionalBody"),
			nullString(c.PostForm("membershipType")),
			nullString(c.PostForm("membershipId")),
			nullString(c.PostForm("nameOfGradeLevelPosition")),
			nullString(c.PostForm("category")),
			nullString(c.PostForm("validityType")),
			nullString(c.PostForm("amount")),
			nullString(c.PostForm("ifOthers")),
			nullString(c.PostForm("amountIfOthers")),
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating professional membership:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Professional Membership record updated successfully"})
}

func HandleProfessionalMembershipDelete(c *gin.Context) {
	id := c.Param("id")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `DELETE FROM professional_membership WHERE id=? AND faculty=?`
	_, err := config.DB.Exec(query, id, facultyID)
	if err != nil {
		log.Println("Error deleting professional membership:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Professional Membership record deleted successfully"})
}

// =====================================================
// Students Industrial Visit - Update & Delete
// =====================================================

func HandleStudentsIndustrialVisitUpdate(c *gin.Context) {
	id := c.Param("id")
	proofDoc, _ := UploadFile(c, "proofDocument")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	if proofDoc != "" {
		query := `UPDATE students_industrial_visit SET faculty=?, sig_number=?, task_id=?, programme=?, industry_name=?, domain_area=?, industry_type=?, industry_type_other=?, industry_location=?, industry_website=?, contact_person_name=?, contact_person_designation=?, contact_person_email=?, contact_person_phone=?, visit_start_date=?, visit_end_date=?, year_of_study=?, number_of_students=?, male_students=?, female_students=?, purpose_of_visit=?, faculty1=?, faculty2=?, faculty3=?, source_of_arrangement=?, curriculum_mapping=?, outcome_of_visit=?, proof_document=?, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			facultyID,
			nullString(c.PostForm("sigNumber")),
			nullString(c.PostForm("taskId")),
			nullString(c.PostForm("programme")),
			c.PostForm("industryName"),
			nullString(c.PostForm("domainArea")),
			nullString(c.PostForm("industryType")),
			nullString(c.PostForm("industryTypeOther")),
			nullString(c.PostForm("industryLocation")),
			nullString(c.PostForm("industryWebsite")),
			c.PostForm("contactPersonName"),
			c.PostForm("contactPersonDesignation"),
			c.PostForm("contactPersonEmail"),
			c.PostForm("contactPersonPhone"),
			nullString(c.PostForm("visitStartDate")),
			nullString(c.PostForm("visitEndDate")),
			nullString(c.PostForm("yearOfStudy")),
			nullString(c.PostForm("numberOfStudents")),
			nullString(c.PostForm("maleStudents")),
			nullString(c.PostForm("femaleStudents")),
			c.PostForm("purposeOfVisit"),
			nullString(c.PostForm("faculty1")),
			nullString(c.PostForm("faculty2")),
			nullString(c.PostForm("faculty3")),
			nullString(c.PostForm("sourceOfArrangement")),
			nullString(c.PostForm("curriculumMapping")),
			c.PostForm("outcomeOfVisit"),
			proofDoc,
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating students industrial visit:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	} else {
		query := `UPDATE students_industrial_visit SET faculty=?, sig_number=?, task_id=?, programme=?, industry_name=?, domain_area=?, industry_type=?, industry_type_other=?, industry_location=?, industry_website=?, contact_person_name=?, contact_person_designation=?, contact_person_email=?, contact_person_phone=?, visit_start_date=?, visit_end_date=?, year_of_study=?, number_of_students=?, male_students=?, female_students=?, purpose_of_visit=?, faculty1=?, faculty2=?, faculty3=?, source_of_arrangement=?, curriculum_mapping=?, outcome_of_visit=?, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			facultyID,
			nullString(c.PostForm("sigNumber")),
			nullString(c.PostForm("taskId")),
			nullString(c.PostForm("programme")),
			c.PostForm("industryName"),
			nullString(c.PostForm("domainArea")),
			nullString(c.PostForm("industryType")),
			nullString(c.PostForm("industryTypeOther")),
			nullString(c.PostForm("industryLocation")),
			nullString(c.PostForm("industryWebsite")),
			c.PostForm("contactPersonName"),
			c.PostForm("contactPersonDesignation"),
			c.PostForm("contactPersonEmail"),
			c.PostForm("contactPersonPhone"),
			nullString(c.PostForm("visitStartDate")),
			nullString(c.PostForm("visitEndDate")),
			nullString(c.PostForm("yearOfStudy")),
			nullString(c.PostForm("numberOfStudents")),
			nullString(c.PostForm("maleStudents")),
			nullString(c.PostForm("femaleStudents")),
			c.PostForm("purposeOfVisit"),
			nullString(c.PostForm("faculty1")),
			nullString(c.PostForm("faculty2")),
			nullString(c.PostForm("faculty3")),
			nullString(c.PostForm("sourceOfArrangement")),
			nullString(c.PostForm("curriculumMapping")),
			c.PostForm("outcomeOfVisit"),
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating students industrial visit:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Students Industrial Visit record updated successfully"})
}

func HandleStudentsIndustrialVisitDelete(c *gin.Context) {
	id := c.Param("id")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `DELETE FROM students_industrial_visit WHERE id=? AND faculty=?`
	_, err := config.DB.Exec(query, id, facultyID)
	if err != nil {
		log.Println("Error deleting students industrial visit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Students Industrial Visit record deleted successfully"})
}

// =====================================================
// Technical Societies - Update & Delete
// =====================================================

func HandleTechnicalSocietiesUpdate(c *gin.Context) {
	id := c.Param("id")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `UPDATE technical_societies SET name=?, society=?, status=?, faculty=?, sig_number=?, task_id=?, owi_verification=? WHERE id=?`
	_, err := config.DB.Exec(query,
		c.PostForm("name"),
		c.PostForm("society"),
		nullString(c.PostForm("status")),
		facultyID,
		nullString(c.PostForm("sigNumber")),
		nullString(c.PostForm("taskId")),
		nullString(c.PostForm("owiVerification")),
		id,
	)
	if err != nil {
		log.Println("Error updating technical societies:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Technical Societies record updated successfully"})
}

func HandleTechnicalSocietiesDelete(c *gin.Context) {
	id := c.Param("id")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `DELETE FROM technical_societies WHERE id=? AND faculty=?`
	_, err := config.DB.Exec(query, id, facultyID)
	if err != nil {
		log.Println("Error deleting technical societies:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Technical Societies record deleted successfully"})
}

// =====================================================
// Training To Industry - Update & Delete
// =====================================================

func HandleTrainingToIndustryUpdate(c *gin.Context) {
	id := c.Param("id")
	commProof, _ := UploadFile(c, "communicationProof")
	approvalLetter, _ := UploadFile(c, "approvalLetter")
	geotagPhotos, _ := UploadFile(c, "geotagPhotos")
	participantsAtt, _ := UploadFile(c, "participantsAttendance")
	paymentProofs, _ := UploadFile(c, "paymentProofs")
	consolidatedDoc, _ := UploadFile(c, "consolidatedDocument")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	// Build dynamic query based on which files are uploaded
	if commProof != "" && approvalLetter != "" && geotagPhotos != "" && participantsAtt != "" && paymentProofs != "" && consolidatedDoc != "" {
		query := `UPDATE training_to_industry SET faculty=?, sig_number=?, special_labs_involved=?, special_lab=?, event_name=?, event_name_other=?, industry_name=?, industry_address=?, domain_area=?, industry_type=?, industry_type_other=?, mode_of_training=?, industry_website=?, number_of_persons_trained=?, duration_days=?, start_date=?, end_date=?, outcome_of_training=?, honorarium_received=?, communication_proof=?, approval_letter=?, geotag_photos=?, participants_attendance=?, payment_proofs=?, consolidated_document=?, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			facultyID,
			nullString(c.PostForm("sigNumber")),
			nullString(c.PostForm("specialLabsInvolved")),
			nullString(c.PostForm("specialLab")),
			c.PostForm("eventName"),
			nullString(c.PostForm("eventNameOther")),
			c.PostForm("industryName"),
			nullString(c.PostForm("industryAddress")),
			nullString(c.PostForm("domainArea")),
			nullString(c.PostForm("industryType")),
			nullString(c.PostForm("industryTypeOther")),
			nullString(c.PostForm("modeOfTraining")),
			nullString(c.PostForm("industryWebsite")),
			nullString(c.PostForm("numberOfPersonsTrained")),
			nullString(c.PostForm("durationDays")),
			nullString(c.PostForm("startDate")),
			nullString(c.PostForm("endDate")),
			c.PostForm("outcomeOfTraining"),
			nullString(c.PostForm("honorariumReceived")),
			commProof,
			approvalLetter,
			geotagPhotos,
			participantsAtt,
			paymentProofs,
			consolidatedDoc,
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating training to industry:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	} else {
		// Update without file fields - set them to NULL
		query := `UPDATE training_to_industry SET faculty=?, sig_number=?, special_labs_involved=?, special_lab=?, event_name=?, event_name_other=?, industry_name=?, industry_address=?, domain_area=?, industry_type=?, industry_type_other=?, mode_of_training=?, industry_website=?, number_of_persons_trained=?, duration_days=?, start_date=?, end_date=?, outcome_of_training=?, honorarium_received=?, communication_proof=NULL, approval_letter=NULL, geotag_photos=NULL, participants_attendance=NULL, payment_proofs=NULL, consolidated_document=NULL, owi_verification=? WHERE id=?`
		_, err := config.DB.Exec(query,
			facultyID,
			nullString(c.PostForm("sigNumber")),
			nullString(c.PostForm("specialLabsInvolved")),
			nullString(c.PostForm("specialLab")),
			c.PostForm("eventName"),
			nullString(c.PostForm("eventNameOther")),
			c.PostForm("industryName"),
			nullString(c.PostForm("industryAddress")),
			nullString(c.PostForm("domainArea")),
			nullString(c.PostForm("industryType")),
			nullString(c.PostForm("industryTypeOther")),
			nullString(c.PostForm("modeOfTraining")),
			nullString(c.PostForm("industryWebsite")),
			nullString(c.PostForm("numberOfPersonsTrained")),
			nullString(c.PostForm("durationDays")),
			nullString(c.PostForm("startDate")),
			nullString(c.PostForm("endDate")),
			c.PostForm("outcomeOfTraining"),
			nullString(c.PostForm("honorariumReceived")),
			nullString(c.PostForm("owiVerification")),
			id,
		)
		if err != nil {
			log.Println("Error updating training to industry:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Training to Industry record updated successfully"})
}

func HandleTrainingToIndustryDelete(c *gin.Context) {
	id := c.Param("id")

	// Get faculty ID from auth context
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized - Please login again"})
		return
	}

	query := `DELETE FROM training_to_industry WHERE id=? AND faculty=?`
	_, err := config.DB.Exec(query, id, facultyID)
	if err != nil {
		log.Println("Error deleting training to industry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Training to Industry record deleted successfully"})
}
