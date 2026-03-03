package outsideworld

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
		// Faculty Information
		"faculty":               c.PostForm("faculty"),
		"sigNumber":             c.PostForm("sigNumber"),
		"taskID":                c.PostForm("taskID"),
		"specialLabsInvolved":   c.PostForm("specialLabsInvolved"),
		"specialLab":            c.PostForm("specialLab"),
		"mouClaimingDepartment": c.PostForm("mouClaimingDepartment"),
		// MoU Classification
		"typeOfMoU":      c.PostForm("typeOfMoU"),
		"typeOfIndustry": c.PostForm("typeOfIndustry"),
		"mouBasedOn":     c.PostForm("mouBasedOn"),
		"domainArea":     c.PostForm("domainArea"),
		// Timeline & Purpose
		"dateOfAgreement": c.PostForm("dateOfAgreement"),
		"duration":        c.PostForm("duration"),
		"mouEffectFrom":   c.PostForm("mouEffectFrom"),
		"mouEffectTill":   c.PostForm("mouEffectTill"),
		"purposeOfMoU":    c.PostForm("purposeOfMoU"),
		// Collaborator Details
		"legalNameOfIndustry": c.PostForm("legalNameOfIndustry"),
		"industryLocation":    c.PostForm("industryLocation"),
		"industryAddress":     c.PostForm("industryAddress"),
		"industryWebsite":     c.PostForm("industryWebsite"),
		"industryContact":     c.PostForm("industryContact"),
		"industryEmail":       c.PostForm("industryEmail"),
		// Agreement Scope
		"scopeOfAgreement":        c.PostForm("scopeOfAgreement"),
		"objectivesAndGoals":      c.PostForm("objectivesAndGoals"),
		"boundariesAndLimitation": c.PostForm("boundariesAndLimitation"),
		// Roles & Responsibilities
		"bitRolesAndResponsibilities":          c.PostForm("bitRolesAndResponsibilities"),
		"collaboratorRolesAndResponsibilities": c.PostForm("collaboratorRolesAndResponsibilities"),
		// SPOC Details
		"spocName":                   c.PostForm("spocName"),
		"spocDesignation":            c.PostForm("spocDesignation"),
		"spocEmail":                  c.PostForm("spocEmail"),
		"spocPhone":                  c.PostForm("spocPhone"),
		"mouSigningInitiatedThrough": c.PostForm("mouSigningInitiatedThrough"),
		"noOfFaculty":                c.PostForm("noOfFaculty"),
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
	emailProofPath := saveFile("emailProof")
	signedMoUPath := saveFile("signedMoU")
	partyRightsPath := saveFile("partyRights")
	nondisclosureAffidavitPath := saveFile("nondisclosureAffidavit")
	geotagPhotosPath := saveFile("geotagPhotos")
	allDocumentsPath := saveFile("allDocuments")

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s
	}

	// Insert into database with all fields
	query := `INSERT INTO faculty_mou (
		faculty_id, faculty, sig_number, task_id, special_labs_involved, special_lab, mou_claiming_department,
		type_of_mou, type_of_industry, mou_based_on, domain_area,
		date_of_agreement, duration, mou_effect_from, mou_effect_till, purpose_of_mou,
		legal_name_of_industry, industry_location, industry_address, industry_website, industry_contact, industry_email,
		scope_of_agreement, objectives_and_goals, boundaries_and_limitation,
		bit_roles_and_responsibilities, collaborator_roles_and_responsibilities,
		spoc_name, spoc_designation, spoc_email, spoc_phone, mou_signing_initiated_through, no_of_faculty,
		apex_proof, email_proof, signed_mou, party_rights, nondisclosure_affidavit, geotag_photos, all_documents,
		verification_status
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initiated')`

	_, err := config.DB.Exec(query,
		// Faculty ID (logged in user)
		facultyID,
		// Faculty Information
		nullString(formData["faculty"]), nullString(formData["sigNumber"]), nullString(formData["taskID"]),
		nullString(formData["specialLabsInvolved"]), nullString(formData["specialLab"]), nullString(formData["mouClaimingDepartment"]),
		// MoU Classification
		nullString(formData["typeOfMoU"]), nullString(formData["typeOfIndustry"]),
		nullString(formData["mouBasedOn"]), nullString(formData["domainArea"]),
		// Timeline & Purpose
		nullString(formData["dateOfAgreement"]), nullString(formData["duration"]),
		nullString(formData["mouEffectFrom"]), nullString(formData["mouEffectTill"]), nullString(formData["purposeOfMoU"]),
		// Collaborator Details
		nullString(formData["legalNameOfIndustry"]), nullString(formData["industryLocation"]),
		nullString(formData["industryAddress"]), nullString(formData["industryWebsite"]),
		nullString(formData["industryContact"]), nullString(formData["industryEmail"]),
		// Agreement Scope
		nullString(formData["scopeOfAgreement"]), nullString(formData["objectivesAndGoals"]), nullString(formData["boundariesAndLimitation"]),
		// Roles & Responsibilities
		nullString(formData["bitRolesAndResponsibilities"]), nullString(formData["collaboratorRolesAndResponsibilities"]),
		// SPOC Details
		nullString(formData["spocName"]), nullString(formData["spocDesignation"]),
		nullString(formData["spocEmail"]), nullString(formData["spocPhone"]),
		nullString(formData["mouSigningInitiatedThrough"]), nullString(formData["noOfFaculty"]),
		// Documents
		nullString(apexProofPath), nullString(emailProofPath), nullString(signedMoUPath),
		nullString(partyRightsPath), nullString(nondisclosureAffidavitPath),
		nullString(geotagPhotosPath), nullString(allDocumentsPath),
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

	// Query MOUs - filter by faculty_id
	query := `SELECT id, faculty_id, faculty, sig_number, task_id, special_labs_involved, special_lab, mou_claiming_department,
	          type_of_mou, type_of_industry, mou_based_on, domain_area,
			  date_of_agreement, duration, mou_effect_from, mou_effect_till, purpose_of_mou,
			  legal_name_of_industry, industry_location, industry_address, industry_website, industry_contact, industry_email,
			  scope_of_agreement, objectives_and_goals, boundaries_and_limitation,
			  bit_roles_and_responsibilities, collaborator_roles_and_responsibilities,
			  spoc_name, spoc_designation, spoc_email, spoc_phone, mou_signing_initiated_through, no_of_faculty,
			  apex_proof, email_proof, signed_mou, party_rights, nondisclosure_affidavit, geotag_photos, all_documents,
			  verification_status, created_at
	          FROM faculty_mou WHERE faculty_id = ? ORDER BY created_at DESC`

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
			id                                                                                                      int
			facultyIDDB                                                                                             sql.NullString
			faculty, sigNumber, taskID, specialLabsInvolved, specialLab, mouClaimingDepartment                      sql.NullString
			typeOfMoU, typeOfIndustry, mouBasedOn, domainArea                                                       sql.NullString
			dateOfAgreement, duration, mouEffectFrom, mouEffectTill, purposeOfMoU                                   sql.NullString
			legalNameOfIndustry, industryLocation, industryAddress, industryWebsite, industryContact, industryEmail sql.NullString
			scopeOfAgreement, objectivesAndGoals, boundariesAndLimitation                                           sql.NullString
			bitRolesAndResponsibilities, collaboratorRolesAndResponsibilities                                       sql.NullString
			spocName, spocDesignation, spocEmail, spocPhone, mouSigningInitiatedThrough                             sql.NullString
			noOfFaculty                                                                                             sql.NullInt64
			apexProof, emailProof, signedMoU, partyRights, nondisclosureAffidavit, geotagPhotos, allDocuments       sql.NullString
			verificationStatus                                                                                      sql.NullString
			createdAt                                                                                               []uint8
		)

		if err := rows.Scan(&id, &facultyIDDB, &faculty, &sigNumber, &taskID, &specialLabsInvolved, &specialLab, &mouClaimingDepartment,
			&typeOfMoU, &typeOfIndustry, &mouBasedOn, &domainArea,
			&dateOfAgreement, &duration, &mouEffectFrom, &mouEffectTill, &purposeOfMoU,
			&legalNameOfIndustry, &industryLocation, &industryAddress, &industryWebsite, &industryContact, &industryEmail,
			&scopeOfAgreement, &objectivesAndGoals, &boundariesAndLimitation,
			&bitRolesAndResponsibilities, &collaboratorRolesAndResponsibilities,
			&spocName, &spocDesignation, &spocEmail, &spocPhone, &mouSigningInitiatedThrough, &noOfFaculty,
			&apexProof, &emailProof, &signedMoU, &partyRights, &nondisclosureAffidavit, &geotagPhotos, &allDocuments,
			&verificationStatus, &createdAt); err != nil {
			log.Println("Error scanning MoU:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                             id,
			"faculty_id":                     facultyIDDB.String,
			"faculty":                        faculty.String,
			"sig_number":                     sigNumber.String,
			"task_id":                        taskID.String,
			"special_labs_involved":          specialLabsInvolved.String,
			"special_lab":                    specialLab.String,
			"mou_claiming_department":        mouClaimingDepartment.String,
			"type_of_mou":                    typeOfMoU.String,
			"type_of_industry":               typeOfIndustry.String,
			"mou_based_on":                   mouBasedOn.String,
			"domain_area":                    domainArea.String,
			"date_of_agreement":              dateOfAgreement.String,
			"duration":                       duration.String,
			"mou_effect_from":                mouEffectFrom.String,
			"mou_effect_till":                mouEffectTill.String,
			"purpose_of_mou":                 purposeOfMoU.String,
			"legal_name_of_industry":         legalNameOfIndustry.String,
			"industry_location":              industryLocation.String,
			"industry_address":               industryAddress.String,
			"industry_website":               industryWebsite.String,
			"industry_contact":               industryContact.String,
			"industry_email":                 industryEmail.String,
			"scope_of_agreement":             scopeOfAgreement.String,
			"objectives_and_goals":           objectivesAndGoals.String,
			"boundaries_and_limitation":      boundariesAndLimitation.String,
			"bit_roles_and_responsibilities": bitRolesAndResponsibilities.String,
			"collaborator_roles_and_responsibilities": collaboratorRolesAndResponsibilities.String,
			"spoc_name":                     spocName.String,
			"spoc_designation":              spocDesignation.String,
			"spoc_email":                    spocEmail.String,
			"spoc_phone":                    spocPhone.String,
			"mou_signing_initiated_through": mouSigningInitiatedThrough.String,
			"no_of_faculty":                 noOfFaculty.Int64,
			"apex_proof":                    apexProof.String,
			"email_proof":                   emailProof.String,
			"signed_mou":                    signedMoU.String,
			"party_rights":                  partyRights.String,
			"nondisclosure_affidavit":       nondisclosureAffidavit.String,
			"geotag_photos":                 geotagPhotos.String,
			"all_documents":                 allDocuments.String,
			"verification_status":           verificationStatus.String,
			"created_at":                    string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"mous": results})
}
