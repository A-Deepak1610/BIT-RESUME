package outsideWorldInteraction

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

func HandleTrainedByIndustryForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse all form fields
	formData := map[string]string{
		"faculty":             c.PostForm("faculty"),
		"taskID":              c.PostForm("taskID"),
		"specialLabsInvolved": c.PostForm("specialLabsInvolved"),
		"specialLab":          c.PostForm("specialLab"),
		"trainingProgramName": c.PostForm("trainingProgramName"),
		"financialAssistance": c.PostForm("financialAssistance"),
		"amountIncurred":      c.PostForm("amountIncurred"),
		"typeOfApproval":      c.PostForm("typeOfApproval"),
		"apexApprovalNo":      c.PostForm("apexApprovalNo"),
		"industryName":        c.PostForm("industryName"),
		"domainArea":          c.PostForm("domainArea"),
		"typeOfIndustry":      c.PostForm("typeOfIndustry"),
		"othersSpecify":       c.PostForm("othersSpecify"),
		"modeOfTraining":      c.PostForm("modeOfTraining"),
		"durationInDays":      c.PostForm("durationInDays"),
		"startDate":           c.PostForm("startDate"),
		"endDate":             c.PostForm("endDate"),
		"industryWebsite":     c.PostForm("industryWebsite"),
		"trainer1Name":        c.PostForm("trainer1Name"),
		"trainer1Designation": c.PostForm("trainer1Designation"),
		"trainer1Email":       c.PostForm("trainer1Email"),
		"trainer1Phone":       c.PostForm("trainer1Phone"),
		"trainer2Applicable":  c.PostForm("trainer2Applicable"),
		"trainer2Name":        c.PostForm("trainer2Name"),
		"trainer2Designation": c.PostForm("trainer2Designation"),
		"trainer2Email":       c.PostForm("trainer2Email"),
		"trainer2Phone":       c.PostForm("trainer2Phone"),
		"outcome":             c.PostForm("outcome"),
	}

	// Handle file upload
	uploadDir := "./uploads/faculty/trained_by_industry"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	file, _ := c.FormFile("proofDocument")
	var proofDocumentPath string
	if file != nil {
		filename := fmt.Sprintf("%v_%d_%s", facultyID, time.Now().Unix(), file.Filename)
		proofDocumentPath = filepath.Join(uploadDir, filename)
		if err := c.SaveUploadedFile(file, proofDocumentPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save proof document"})
			return
		}
	}

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_trained_by_industry (
		faculty, task_id, special_labs_involved, special_lab,
		training_program_name, financial_assistance, amount_incurred,
		type_of_approval, apex_approval_no, industry_name, domain_area,
		type_of_industry, others_specify, mode_of_training,
		duration_in_days, start_date, end_date, industry_website,
		trainer1_name, trainer1_designation, trainer1_email, trainer1_phone,
		trainer2_applicable, trainer2_name, trainer2_designation,
		trainer2_email, trainer2_phone, outcome, proof_document, verification_status
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initiated')`

	_, err := config.DB.Exec(query,
		nullString(formData["faculty"]), nullString(formData["taskID"]), nullString(formData["specialLabsInvolved"]),
		nullString(formData["specialLab"]), nullString(formData["trainingProgramName"]), nullString(formData["financialAssistance"]),
		nullString(formData["amountIncurred"]), nullString(formData["typeOfApproval"]), nullString(formData["apexApprovalNo"]),
		nullString(formData["industryName"]), nullString(formData["domainArea"]), nullString(formData["typeOfIndustry"]),
		nullString(formData["othersSpecify"]), nullString(formData["modeOfTraining"]), nullString(formData["durationInDays"]),
		nullString(formData["startDate"]), nullString(formData["endDate"]), nullString(formData["industryWebsite"]),
		nullString(formData["trainer1Name"]), nullString(formData["trainer1_designation"]), nullString(formData["trainer1Email"]),
		nullString(formData["trainer1Phone"]), nullString(formData["trainer2Applicable"]), nullString(formData["trainer2Name"]),
		nullString(formData["trainer2_designation"]), nullString(formData["trainer2Email"]), nullString(formData["trainer2Phone"]),
		nullString(formData["outcome"]), nullString(proofDocumentPath),
	)

	if err != nil {
		log.Println("Error inserting Trained by Industry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Faculty Trained by Industry submitted successfully"})
}

func FetchTrainedByIndustry(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, faculty, task_id, special_labs_involved, special_lab, 
	          training_program_name, financial_assistance, amount_incurred, type_of_approval, 
			  apex_approval_no, industry_name, domain_area, type_of_industry, others_specify, 
			  mode_of_training, duration_in_days, start_date, end_date, industry_website, 
			  trainer1_name, trainer1_designation, trainer1_email, trainer1_phone, 
			  trainer2_applicable, trainer2_name, trainer2_designation, trainer2_email, 
			  trainer2_phone, outcome, proof_document, verification_status, created_at
	          FROM faculty_trained_by_industry WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching Trained by Industry:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                  int
			faculty, taskID, specialLabsInvolved, specialLab, trainingProgramName               sql.NullString
			financialAssistance, amountIncurred, typeOfApproval, apexApprovalNo, industryName   sql.NullString
			domainArea, typeOfIndustry, othersSpecify, modeOfTraining, durationInDays           sql.NullString
			startDate, endDate, industryWebsite, trainer1Name, trainer1Designation              sql.NullString
			trainer1Email, trainer1Phone, trainer2Applicable, trainer2Name, trainer2Designation sql.NullString
			trainer2Email, trainer2Phone, outcome, proofDocument, verificationStatus            sql.NullString
			createdAt                                                                           []uint8
		)

		if err := rows.Scan(&id, &faculty, &taskID, &specialLabsInvolved, &specialLab,
			&trainingProgramName, &financialAssistance, &amountIncurred, &typeOfApproval,
			&apexApprovalNo, &industryName, &domainArea, &typeOfIndustry, &othersSpecify,
			&modeOfTraining, &durationInDays, &startDate, &endDate, &industryWebsite,
			&trainer1Name, &trainer1Designation, &trainer1Email, &trainer1Phone,
			&trainer2Applicable, &trainer2Name, &trainer2Designation, &trainer2Email,
			&trainer2Phone, &outcome, &proofDocument, &verificationStatus, &createdAt); err != nil {
			log.Println("Error scanning Trained by Industry:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                    id,
			"faculty":               faculty.String,
			"task_id":               taskID.String,
			"special_labs_involved": specialLabsInvolved.String,
			"special_lab":           specialLab.String,
			"training_program_name": trainingProgramName.String,
			"financial_assistance":  financialAssistance.String,
			"amount_incurred":       amountIncurred.String,
			"type_of_approval":      typeOfApproval.String,
			"apex_approval_no":      apexApprovalNo.String,
			"industry_name":         industryName.String,
			"domain_area":           domainArea.String,
			"type_of_industry":      typeOfIndustry.String,
			"others_specify":        othersSpecify.String,
			"mode_of_training":      modeOfTraining.String,
			"duration_in_days":      durationInDays.String,
			"start_date":            startDate.String,
			"end_date":              endDate.String,
			"industry_website":      industryWebsite.String,
			"trainer1_name":         trainer1Name.String,
			"trainer1_designation":  trainer1Designation.String,
			"trainer1_email":        trainer1Email.String,
			"trainer1_phone":        trainer1Phone.String,
			"trainer2_applicable":   trainer2Applicable.String,
			"trainer2_name":         trainer2Name.String,
			"trainer2_designation":  trainer2Designation.String,
			"trainer2_email":        trainer2Email.String,
			"trainer2_phone":        trainer2Phone.String,
			"outcome":               outcome.String,
			"proof_document":        proofDocument.String,
			"verification_status":   verificationStatus.String,
			"created_at":            string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"trainedByIndustries": results})
}
