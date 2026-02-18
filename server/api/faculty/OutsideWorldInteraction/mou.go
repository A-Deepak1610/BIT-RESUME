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

func HandleMouForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse all form fields
	formData := map[string]string{
		"faculty":                     c.PostForm("faculty"),
		"sigNumber":                   c.PostForm("sigNumber"),
		"taskID":                      c.PostForm("taskID"),
		"specialLabsInvolved":         c.PostForm("specialLabsInvolved"),
		"specialLab":                  c.PostForm("specialLab"),
		"typeOfMoU":                   c.PostForm("typeOfMoU"),
		"typeOfIndustry":              c.PostForm("typeOfIndustry"),
		"mouBasedOn":                  c.PostForm("mouBasedOn"),
		"domainArea":                  c.PostForm("domainArea"),
		"dateOfAgreement":             c.PostForm("dateOfAgreement"),
		"duration":                    c.PostForm("duration"),
		"legalNameOfIndustry":         c.PostForm("legalNameOfIndustry"),
		"industryLocation":            c.PostForm("industryLocation"),
		"scopeOfAgreement":            c.PostForm("scopeOfAgreement"),
		"bitRolesAndResponsibilities": c.PostForm("bitRolesAndResponsibilities"),
		"spocName":                    c.PostForm("spocName"),
		// NOTE: The following fields are present in the frontend but MISSING in the database schema:
		// mouClaimingDepartment, mouEffectFrom, mouEffectTill, purposeOfMoU,
		// industryWebsite, industryAddress, industryContact, industryEmail, objectivesAndGoals,
		// boundariesAndLimitation, collaboratorRolesAndResponsibilities, spocDesignation, spocEmail,
		// spocPhone, mouSigningInitiatedThrough, noOfFaculty
	}

	// Handle file uploads
	uploadDir := "./uploads/faculty/mou"
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
	signedMoUPath := saveFile("signedMoU")
	// NOTE: The following file fields are present in the frontend but MISSING in the database schema:
	// emailProof, partyRights, nondisclosureAffidavit, geotagPhotos, allDocuments

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s
	}

	// Insert into database - ONLY using columns that exist in setup_tables.sql
	query := `INSERT INTO faculty_mou (
		faculty, sig_number, task_id, special_labs_involved, special_lab,
		type_of_mou, type_of_industry, mou_based_on, domain_area,
		date_of_agreement, duration, legal_name_of_industry, industry_location,
		scope_of_agreement, bit_roles_and_responsibilities, spoc_name,
		apex_proof, signed_mou, verification_status
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initiated')`

	_, err := config.DB.Exec(query,
		nullString(formData["faculty"]), nullString(formData["sigNumber"]), nullString(formData["taskID"]),
		nullString(formData["specialLabsInvolved"]), nullString(formData["specialLab"]),
		nullString(formData["typeOfMoU"]), nullString(formData["typeOfIndustry"]),
		nullString(formData["mouBasedOn"]), nullString(formData["domainArea"]),
		nullString(formData["dateOfAgreement"]), nullString(formData["duration"]),
		nullString(formData["legalNameOfIndustry"]), nullString(formData["industryLocation"]),
		nullString(formData["scopeOfAgreement"]), nullString(formData["bitRolesAndResponsibilities"]),
		nullString(formData["spocName"]),
		nullString(apexProofPath), nullString(signedMoUPath),
	)

	if err != nil {
		log.Println("Error inserting MoU:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "MoU submitted successfully"})
}

func FetchMou(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, faculty, sig_number, task_id, special_labs_involved, special_lab, 
	          type_of_mou, type_of_industry, mou_based_on, domain_area, date_of_agreement, 
			  duration, legal_name_of_industry, industry_location, scope_of_agreement, 
			  bit_roles_and_responsibilities, spoc_name, apex_proof, signed_mou, 
			  verification_status, created_at
	          FROM faculty_mou WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching MoU:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                int
			faculty, sigNumber, taskID, specialLabsInvolved, specialLab, typeOfMoU, typeOfIndustry            sql.NullString
			mouBasedOn, domainArea, dateOfAgreement, duration, legalNameOfIndustry, industryLocation          sql.NullString
			scopeOfAgreement, bitRolesAndResponsibilities, spocName, apexProof, signedMoU, verificationStatus sql.NullString
			createdAt                                                                                         []uint8
		)

		if err := rows.Scan(&id, &faculty, &sigNumber, &taskID, &specialLabsInvolved, &specialLab,
			&typeOfMoU, &typeOfIndustry, &mouBasedOn, &domainArea, &dateOfAgreement,
			&duration, &legalNameOfIndustry, &industryLocation, &scopeOfAgreement,
			&bitRolesAndResponsibilities, &spocName, &apexProof, &signedMoU,
			&verificationStatus, &createdAt); err != nil {
			log.Println("Error scanning MoU:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                             id,
			"faculty":                        faculty.String,
			"sig_number":                     sigNumber.String,
			"task_id":                        taskID.String,
			"special_labs_involved":          specialLabsInvolved.String,
			"special_lab":                    specialLab.String,
			"type_of_mou":                    typeOfMoU.String,
			"type_of_industry":               typeOfIndustry.String,
			"mou_based_on":                   mouBasedOn.String,
			"domain_area":                    domainArea.String,
			"date_of_agreement":              dateOfAgreement.String,
			"duration":                       duration.String,
			"legal_name_of_industry":         legalNameOfIndustry.String,
			"industry_location":              industryLocation.String,
			"scope_of_agreement":             scopeOfAgreement.String,
			"bit_roles_and_responsibilities": bitRolesAndResponsibilities.String,
			"spoc_name":                      spocName.String,
			"apex_proof":                     apexProof.String,
			"signed_mou":                     signedMoU.String,
			"verification_status":            verificationStatus.String,
			"created_at":                     string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"mous": results})
}
