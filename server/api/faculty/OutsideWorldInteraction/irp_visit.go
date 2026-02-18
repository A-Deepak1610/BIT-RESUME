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

func HandleIrpVisitForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse all form fields
	formData := map[string]string{
		"faculty":              c.PostForm("faculty"),
		"sigNumber":            c.PostForm("sigNumber"),
		"taskID":               c.PostForm("taskID"),
		"specialLabsInvolved":  c.PostForm("specialLabsInvolved"),
		"specialLab":           c.PostForm("specialLab"),
		"numberOfFaculty":      c.PostForm("numberOfFaculty"),
		"claimedForFaculty":    c.PostForm("claimedForFaculty"),
		"claimedForDepartment": c.PostForm("claimedForDepartment"),
		"typeOfApproval":       c.PostForm("typeOfApproval"),
		"isIrpVisitPartOfMou":  c.PostForm("isIrpVisitPartOfMou"),
		"mouName":              c.PostForm("mouName"),
		"mouPointsDiscussed":   c.PostForm("mouPointsDiscussed"),
		"fromDate":             c.PostForm("fromDate"),
		"toDate":               c.PostForm("toDate"),
		"modeOfInteraction":    c.PostForm("modeOfInteraction"),
		"purposeOfVisit":       c.PostForm("purposeOfVisit"),
		"amountIncurred":       c.PostForm("amountIncurred"),
		"numberOfIndustry":     c.PostForm("numberOfIndustry"),
	}

	// Handle file uploads
	uploadDir := "./uploads/faculty/irp_visit"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, os.ModePerm)
	}

	saveFile := func(fieldName string) string {
		file, _ := c.FormFile(fieldName)
		if file != nil {
			filename := fmt.Sprintf("%v_%d_%s", facultyID, time.Now().Unix(), file.Filename)
			path := filepath.Join(uploadDir, filename)
			if err := c.SaveUploadedFile(file, path); err == nil {
				return path
			}
		}
		return ""
	}

	apexProofPath := saveFile("apexProof")
	irpFormSignedPath := saveFile("irpFormSigned")
	consolidatedDocumentPath := saveFile("consolidatedDocument")

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_irp_visit (
		faculty, sig_number, task_id, special_labs_involved, special_lab,
		number_of_faculty, claimed_for_faculty, claimed_for_department,
		type_of_approval, is_irp_visit_part_of_mou, mou_name,
		mou_points_discussed, from_date, to_date, mode_of_interaction,
		purpose_of_visit, amount_incurred, number_of_industry,
		apex_proof, irp_form_signed, consolidated_document, verification_status
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initiated')`

	_, err := config.DB.Exec(query,
		nullString(formData["faculty"]), nullString(formData["sigNumber"]), nullString(formData["taskID"]),
		nullString(formData["specialLabsInvolved"]), nullString(formData["specialLab"]),
		nullString(formData["numberOfFaculty"]), nullString(formData["claimedForFaculty"]), nullString(formData["claimedForDepartment"]),
		nullString(formData["typeOfApproval"]), nullString(formData["isIrpVisitPartOfMou"]), nullString(formData["mouName"]),
		nullString(formData["mouPointsDiscussed"]), nullString(formData["fromDate"]), nullString(formData["toDate"]),
		nullString(formData["modeOfInteraction"]), nullString(formData["purposeOfVisit"]), nullString(formData["amountIncurred"]),
		nullString(formData["numberOfIndustry"]), nullString(apexProofPath), nullString(irpFormSignedPath), nullString(consolidatedDocumentPath),
	)

	if err != nil {
		log.Println("Error inserting IRP Visit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "IRP Visit submitted successfully"})
}

func FetchIrpVisit(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, faculty, sig_number, task_id, special_labs_involved, special_lab, 
	          number_of_faculty, claimed_for_faculty, claimed_for_department, type_of_approval, 
			  is_irp_visit_part_of_mou, mou_name, mou_points_discussed, from_date, to_date, 
			  mode_of_interaction, purpose_of_visit, amount_incurred, number_of_industry, 
			  apex_proof, irp_form_signed, consolidated_document, verification_status, created_at
	          FROM faculty_irp_visit WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching IRP Visit:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                       int
			faculty, sigNumber, taskID, specialLabsInvolved, specialLab              sql.NullString
			numberOfFaculty, claimedForFaculty, claimedForDepartment, typeOfApproval sql.NullString
			isIrpVisitPartOfMou, mouName, mouPointsDiscussed, fromDate, toDate       sql.NullString
			modeOfInteraction, purposeOfVisit, amountIncurred, numberOfIndustry      sql.NullString
			apexProof, irpFormSigned, consolidatedDocument, verificationStatus       sql.NullString
			createdAt                                                                []uint8
		)

		if err := rows.Scan(&id, &faculty, &sigNumber, &taskID, &specialLabsInvolved, &specialLab,
			&numberOfFaculty, &claimedForFaculty, &claimedForDepartment, &typeOfApproval,
			&isIrpVisitPartOfMou, &mouName, &mouPointsDiscussed, &fromDate, &toDate,
			&modeOfInteraction, &purposeOfVisit, &amountIncurred, &numberOfIndustry,
			&apexProof, &irpFormSigned, &consolidatedDocument, &verificationStatus, &createdAt); err != nil {
			log.Println("Error scanning IRP Visit:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                       id,
			"faculty":                  faculty.String,
			"sig_number":               sigNumber.String,
			"task_id":                  taskID.String,
			"special_labs_involved":    specialLabsInvolved.String,
			"special_lab":              specialLab.String,
			"number_of_faculty":        numberOfFaculty.String,
			"claimed_for_faculty":      claimedForFaculty.String,
			"claimed_for_department":   claimedForDepartment.String,
			"type_of_approval":         typeOfApproval.String,
			"is_irp_visit_part_of_mou": isIrpVisitPartOfMou.String,
			"mou_name":                 mouName.String,
			"mou_points_discussed":     mouPointsDiscussed.String,
			"from_date":                fromDate.String,
			"to_date":                  toDate.String,
			"mode_of_interaction":      modeOfInteraction.String,
			"purpose_of_visit":         purposeOfVisit.String,
			"amount_incurred":          amountIncurred.String,
			"number_of_industry":       numberOfIndustry.String,
			"apex_proof":               apexProof.String,
			"irp_form_signed":          irpFormSigned.String,
			"consolidated_document":    consolidatedDocument.String,
			"verification_status":      verificationStatus.String,
			"created_at":               string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"irpVisits": results})
}
