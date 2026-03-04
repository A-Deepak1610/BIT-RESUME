package consultancy

import (
	"bitresume/config"
	"bitresume/utils"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ---- Request structs ----

type FormMemberRow struct {
	SNo            int    `json:"s_no"`
	Name           string `json:"name"`
	Designation    string `json:"designation"`
	Department     string `json:"department"`
	FinancialSplit string `json:"financial_split"`
	Amount         string `json:"amount"`
}

type FormEquipmentRow struct {
	Item                            string `json:"item"`
	CalibrationDoneReadilyAvailable bool   `json:"calibration_done_readily_available"`
	RequiresMaintenance             bool   `json:"requires_maintenance"`
}

type FormActivityRow struct {
	ProposedActivity string `json:"proposed_activity"`
	Description      string `json:"description"`
	Availability     string `json:"availability"`
	StartDate        string `json:"start_date"`
	EndDate          string `json:"end_date"`
	Responsible      string `json:"responsible"`
}

type FormTravelPlanRow struct {
	ProposedActivity           string  `json:"proposed_activity"`
	RequiredOnDutyDate         string  `json:"required_on_duty_date"`
	TravelRequired             string  `json:"travel_required"`
	RequestedTravelAllowance   float64 `json:"requested_travel_allowance"`
	RequestedDearnessAllowance float64 `json:"requested_dearness_allowance"`
	ResponsiblePersons         string  `json:"responsible_persons"`
}

type FormAdditionalResourceRow struct {
	ProposedActivity          string `json:"proposed_activity"`
	Description               string `json:"description"`
	AvailabilityOfConsumables string `json:"availability_of_consumables"`
	ResponsiblePersons        string `json:"responsible_persons"`
}

type FacultyFormSubmitRequest struct {
	ConsultancyWorkID     int64                       `json:"consultancy_work_id" binding:"required"`
	FormType              string                      `json:"form_type" binding:"required"` // drone | industrial_project | project_declaration
	OWIRefNo              string                      `json:"owi_ref_no"`
	DurationFrom          string                      `json:"duration_from"`
	DurationTo            string                      `json:"duration_to"`
	QuotationFileURL      string                      `json:"quotation_file_url"`
	TotalAmountWithGST    float64                     `json:"total_amount_with_gst"`
	TotalAmountWithoutGST float64                     `json:"total_amount_without_gst"`
	FinancialSplit        string                      `json:"financial_split"`
	Members               []FormMemberRow             `json:"members"`
	Equipment             []FormEquipmentRow          `json:"equipment"`
	Activities            []FormActivityRow           `json:"activities"`
	TravelPlans           []FormTravelPlanRow         `json:"travel_plans"`
	AdditionalResources   []FormAdditionalResourceRow `json:"additional_resources"`
}

// ---- Helpers ----

func nsStr(s string) interface{} {
	if s == "" {
		return nil
	}
	return s
}

func nsFloat(f float64) interface{} {
	if f == 0 {
		return nil
	}
	return f
}

// ---- Handler ----

// POST /api/faculty/consultancyFormSubmit
// Faculty submits the IQAC-assigned form (drone / industrial_project / project_declaration)
// and transitions the work status from form_pending → completed
func HandleFacultyFormSubmit(c *gin.Context) {
	cookie, err := c.Cookie("BITRESUME")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing auth cookie"})
		return
	}
	claims, err := utils.ParseJWT(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}
	userIDFloat, ok := claims["id"].(float64)
	if !ok || userIDFloat == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user id in token"})
		return
	}
	facultyID := int64(userIDFloat)

	var req FacultyFormSubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate form type
	validFormTypes := map[string]bool{
		"drone":               true,
		"industrial_project":  true,
		"project_declaration": true,
	}
	if !validFormTypes[req.FormType] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form_type. Must be drone, industrial_project, or project_declaration"})
		return
	}

	// Validate work exists and is form_pending
	var currentStatus string
	err = config.DB.QueryRow(
		`SELECT status FROM consultancy_works WHERE id = ?`, req.ConsultancyWorkID,
	).Scan(&currentStatus)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Consultancy work not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("DB error: %v", err)})
		return
	}
	if currentStatus != "form_pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Work is not awaiting form submission (status: %s)", currentStatus)})
		return
	}

	// Confirm faculty is assigned to this work
	var count int
	err = config.DB.QueryRow(
		`SELECT COUNT(*) FROM hod_assignments WHERE consultancy_work_id = ? AND faculty_id = ?`,
		req.ConsultancyWorkID, facultyID,
	).Scan(&count)
	if err != nil || count == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not assigned to this work"})
		return
	}

	// Fetch faculty name for submitted_by
	var submittedBy string
	_ = config.DB.QueryRow(`SELECT user_name FROM login WHERE id = ?`, facultyID).Scan(&submittedBy)

	// Begin transaction
	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to begin transaction"})
		return
	}
	defer tx.Rollback()

	switch req.FormType {
	case "drone":
		err = insertDroneForm(tx, req, submittedBy)
	case "industrial_project":
		err = insertIndustrialForm(tx, req, submittedBy)
	case "project_declaration":
		err = insertDeclarationForm(tx, req, submittedBy)
	}
	if err != nil {
		log.Printf("[form_submit] insert error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to save form: %v", err)})
		return
	}

	// Mark work as completed
	if _, err = tx.Exec(`UPDATE consultancy_works SET status = 'completed' WHERE id = ?`, req.ConsultancyWorkID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update work status"})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Form submitted successfully"})
}

// ---- Insert helpers ----

func insertDroneForm(tx *sql.Tx, req FacultyFormSubmitRequest, submittedBy string) error {
	res, err := tx.Exec(`
		INSERT INTO consultancy_drone_forms
			(consultancy_work_id, owi_ref_no, project_duration_from, project_duration_to,
			 quotation_file_url, total_amount_with_gst, total_amount_without_gst,
			 financial_split, submitted_by)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		req.ConsultancyWorkID, req.OWIRefNo,
		nsStr(req.DurationFrom), nsStr(req.DurationTo),
		nsStr(req.QuotationFileURL),
		nsFloat(req.TotalAmountWithGST), nsFloat(req.TotalAmountWithoutGST),
		nsStr(req.FinancialSplit), submittedBy,
	)
	if err != nil {
		return fmt.Errorf("insert drone form: %w", err)
	}
	formID, _ := res.LastInsertId()

	for i, m := range req.Members {
		amt, _ := strconv.ParseFloat(m.Amount, 64)
		if _, err := tx.Exec(`
			INSERT INTO consultancy_drone_members
				(form_id, s_no, name, designation, department, financial_split, amount)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			formID, i+1, m.Name, m.Designation, m.Department, m.FinancialSplit, amt,
		); err != nil {
			return fmt.Errorf("insert drone member: %w", err)
		}
	}

	for _, eq := range req.Equipment {
		if _, err := tx.Exec(`
			INSERT INTO consultancy_drone_equipment
				(form_id, item, calibration_done_readily_available, requires_maintenance)
			VALUES (?, ?, ?, ?)`,
			formID, eq.Item, eq.CalibrationDoneReadilyAvailable, eq.RequiresMaintenance,
		); err != nil {
			return fmt.Errorf("insert drone equipment: %w", err)
		}
	}

	for _, act := range req.Activities {
		if _, err := tx.Exec(`
			INSERT INTO consultancy_drone_activities
				(form_id, proposed_activity, description, availability, start_date, end_date, responsible)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			formID, act.ProposedActivity, act.Description, act.Availability,
			nsStr(act.StartDate), nsStr(act.EndDate), act.Responsible,
		); err != nil {
			return fmt.Errorf("insert drone activity: %w", err)
		}
	}
	return nil
}

func insertIndustrialForm(tx *sql.Tx, req FacultyFormSubmitRequest, submittedBy string) error {
	res, err := tx.Exec(`
		INSERT INTO consultancy_industrial_forms
			(consultancy_work_id, owi_ref_no, training_duration_from, training_duration_to,
			 quotation_file_url, total_amount_with_gst, total_amount_without_gst,
			 financial_split, submitted_by)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		req.ConsultancyWorkID, req.OWIRefNo,
		nsStr(req.DurationFrom), nsStr(req.DurationTo),
		nsStr(req.QuotationFileURL),
		nsFloat(req.TotalAmountWithGST), nsFloat(req.TotalAmountWithoutGST),
		nsStr(req.FinancialSplit), submittedBy,
	)
	if err != nil {
		return fmt.Errorf("insert industrial form: %w", err)
	}
	formID, _ := res.LastInsertId()

	for i, m := range req.Members {
		amt, _ := strconv.ParseFloat(m.Amount, 64)
		if _, err := tx.Exec(`
			INSERT INTO consultancy_industrial_members
				(form_id, s_no, name, designation, department, financial_split, amount)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			formID, i+1, m.Name, m.Designation, m.Department, m.FinancialSplit, amt,
		); err != nil {
			return fmt.Errorf("insert industrial member: %w", err)
		}
	}

	for _, tp := range req.TravelPlans {
		if _, err := tx.Exec(`
			INSERT INTO consultancy_industrial_travel_plans
				(form_id, proposed_activity, required_on_duty_date, travel_required,
				 requested_travel_allowance, requested_dearness_allowance, responsible_persons)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			formID, tp.ProposedActivity, nsStr(tp.RequiredOnDutyDate), tp.TravelRequired,
			tp.RequestedTravelAllowance, tp.RequestedDearnessAllowance, tp.ResponsiblePersons,
		); err != nil {
			return fmt.Errorf("insert travel plan: %w", err)
		}
	}

	for _, ar := range req.AdditionalResources {
		if _, err := tx.Exec(`
			INSERT INTO consultancy_industrial_additional_resources
				(form_id, proposed_activity, description, availability_of_consumables, responsible_persons)
			VALUES (?, ?, ?, ?, ?)`,
			formID, ar.ProposedActivity, ar.Description, ar.AvailabilityOfConsumables, ar.ResponsiblePersons,
		); err != nil {
			return fmt.Errorf("insert additional resource: %w", err)
		}
	}
	return nil
}

func insertDeclarationForm(tx *sql.Tx, req FacultyFormSubmitRequest, submittedBy string) error {
	res, err := tx.Exec(`
		INSERT INTO consultancy_declaration_forms
			(consultancy_work_id, owi_ref_no, project_duration_from, project_duration_to,
			 quotation_report_file_url, total_amount_with_gst, total_amount_without_gst,
			 financial_split, submitted_by)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		req.ConsultancyWorkID, req.OWIRefNo,
		nsStr(req.DurationFrom), nsStr(req.DurationTo),
		nsStr(req.QuotationFileURL),
		nsFloat(req.TotalAmountWithGST), nsFloat(req.TotalAmountWithoutGST),
		nsStr(req.FinancialSplit), submittedBy,
	)
	if err != nil {
		return fmt.Errorf("insert declaration form: %w", err)
	}
	formID, _ := res.LastInsertId()

	for i, m := range req.Members {
		amt, _ := strconv.ParseFloat(m.Amount, 64)
		if _, err := tx.Exec(`
			INSERT INTO consultancy_declaration_members
				(form_id, s_no, name, designation, department, financial_split, amount)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			formID, i+1, m.Name, m.Designation, m.Department, m.FinancialSplit, amt,
		); err != nil {
			return fmt.Errorf("insert declaration member: %w", err)
		}
	}

	for _, eq := range req.Equipment {
		if _, err := tx.Exec(`
			INSERT INTO consultancy_declaration_equipment
				(form_id, item, calibration_done_readily_available, requires_maintenance)
			VALUES (?, ?, ?, ?)`,
			formID, eq.Item, eq.CalibrationDoneReadilyAvailable, eq.RequiresMaintenance,
		); err != nil {
			return fmt.Errorf("insert declaration equipment: %w", err)
		}
	}

	for _, act := range req.Activities {
		if _, err := tx.Exec(`
			INSERT INTO consultancy_declaration_activities
				(form_id, proposed_activity, description, availability, start_date, end_date, responsible)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			formID, act.ProposedActivity, act.Description, act.Availability,
			nsStr(act.StartDate), nsStr(act.EndDate), act.Responsible,
		); err != nil {
			return fmt.Errorf("insert declaration activity: %w", err)
		}
	}
	return nil
}
