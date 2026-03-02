package outsideworld

import (
	"bitresume/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST API: Add Students Industrial Visit
func PostStudentsIndustrialVisit(c *gin.Context) {
	var data struct {
		Faculty                  string `form:"faculty"`
		SigNumber                string `form:"sig_number"`
		TaskID                   string `form:"task_id"`
		Programme                string `form:"programme"`
		IndustryName             string `form:"industry_name"`
		DomainArea               string `form:"domain_area"`
		IndustryType             string `form:"industry_type"`
		IndustryTypeOther        string `form:"industry_type_other"`
		IndustryLocation         string `form:"industry_location"`
		IndustryWebsite          string `form:"industry_website"`
		ContactPersonName        string `form:"contact_person_name"`
		ContactPersonDesignation string `form:"contact_person_designation"`
		ContactPersonEmail       string `form:"contact_person_email"`
		ContactPersonPhone       string `form:"contact_person_phone"`
		VisitStartDate           string `form:"visit_start_date"`
		VisitEndDate             string `form:"visit_end_date"`
		YearOfStudy              string `form:"year_of_study"`
		NumberOfStudents         string `form:"number_of_students"`
		MaleStudents             string `form:"male_students"`
		FemaleStudents           string `form:"female_students"`
		PurposeOfVisit           string `form:"purpose_of_visit"`
		Faculty1                 string `form:"faculty1"`
		Faculty2                 string `form:"faculty2"`
		Faculty3                 string `form:"faculty3"`
		SourceOfArrangement      string `form:"source_of_arrangement"`
		CurriculumMapping        string `form:"curriculum_mapping"`
		OutcomeOfVisit           string `form:"outcome_of_visit"`
		ProofDocument            string `form:"proof_document"`
		OWIVerification          string `form:"owi_verification"`
	}
	c.Bind(&data)

	query := `INSERT INTO students_industrial_visit (
		faculty, sig_number, task_id, programme, industry_name, domain_area, industry_type, industry_type_other, industry_location, industry_website, contact_person_name, contact_person_designation, contact_person_email, contact_person_phone, visit_start_date, visit_end_date, year_of_study, number_of_students, male_students, female_students, purpose_of_visit, faculty1, faculty2, faculty3, source_of_arrangement, curriculum_mapping, outcome_of_visit, proof_document, owi_verification
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := config.DB.Exec(query,
		data.Faculty, data.SigNumber, data.TaskID, data.Programme, data.IndustryName, data.DomainArea, data.IndustryType, data.IndustryTypeOther, data.IndustryLocation, data.IndustryWebsite, data.ContactPersonName, data.ContactPersonDesignation, data.ContactPersonEmail, data.ContactPersonPhone, data.VisitStartDate, data.VisitEndDate, data.YearOfStudy, data.NumberOfStudents, data.MaleStudents, data.FemaleStudents, data.PurposeOfVisit, data.Faculty1, data.Faculty2, data.Faculty3, data.SourceOfArrangement, data.CurriculumMapping, data.OutcomeOfVisit, data.ProofDocument, data.OWIVerification,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert record: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Record inserted successfully"})
}

// GET API: Fetch All Students Industrial Visit
func GetStudentsIndustrialVisit(c *gin.Context) {
	rows, err := config.DB.Query("SELECT id, faculty, industry_name, visit_start_date, visit_end_date FROM students_industrial_visit ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch records: " + err.Error()})
		return
	}
	defer rows.Close()

	var visits []map[string]interface{}
	for rows.Next() {
		var id int
		var faculty, industry_name, visit_start_date, visit_end_date string
		err := rows.Scan(&id, &faculty, &industry_name, &visit_start_date, &visit_end_date)
		if err != nil {
			continue
		}
		visits = append(visits, map[string]interface{}{
			"id":               id,
			"faculty":          faculty,
			"industry_name":    industry_name,
			"visit_start_date": visit_start_date,
			"visit_end_date":   visit_end_date,
		})
	}
	c.JSON(http.StatusOK, gin.H{"data": visits})
}

// GET API: Fetch Details by ID
func GetStudentsIndustrialVisitDetail(c *gin.Context) {
	id := c.Param("id")
	row := config.DB.QueryRow("SELECT * FROM students_industrial_visit WHERE id = ?", id)
	var data struct {
		ID                       int
		Faculty                  string
		SigNumber                string
		TaskID                   string
		Programme                string
		IndustryName             string
		DomainArea               string
		IndustryType             string
		IndustryTypeOther        string
		IndustryLocation         string
		IndustryWebsite          string
		ContactPersonName        string
		ContactPersonDesignation string
		ContactPersonEmail       string
		ContactPersonPhone       string
		VisitStartDate           string
		VisitEndDate             string
		YearOfStudy              string
		NumberOfStudents         string
		MaleStudents             string
		FemaleStudents           string
		PurposeOfVisit           string
		Faculty1                 string
		Faculty2                 string
		Faculty3                 string
		SourceOfArrangement      string
		CurriculumMapping        string
		OutcomeOfVisit           string
		ProofDocument            string
		OWIVerification          string
		CreatedAt                string
		UpdatedAt                string
	}
	row.Scan(&data.ID, &data.Faculty, &data.SigNumber, &data.TaskID, &data.Programme, &data.IndustryName, &data.DomainArea, &data.IndustryType, &data.IndustryTypeOther, &data.IndustryLocation, &data.IndustryWebsite, &data.ContactPersonName, &data.ContactPersonDesignation, &data.ContactPersonEmail, &data.ContactPersonPhone, &data.VisitStartDate, &data.VisitEndDate, &data.YearOfStudy, &data.NumberOfStudents, &data.MaleStudents, &data.FemaleStudents, &data.PurposeOfVisit, &data.Faculty1, &data.Faculty2, &data.Faculty3, &data.SourceOfArrangement, &data.CurriculumMapping, &data.OutcomeOfVisit, &data.ProofDocument, &data.OWIVerification, &data.CreatedAt, &data.UpdatedAt)
	c.JSON(http.StatusOK, gin.H{"data": data})
}
