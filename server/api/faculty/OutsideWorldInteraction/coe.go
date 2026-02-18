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

func HandleCoeForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse all form fields
	formData := map[string]string{
		"faculty":                        c.PostForm("faculty"),
		"sigNumber":                      c.PostForm("sigNumber"),
		"taskID":                         c.PostForm("taskID"),
		"coeName":                        c.PostForm("coeName"),
		"centreClaimedDepartment":        c.PostForm("centreClaimedDepartment"),
		"facultyIncharge":                c.PostForm("facultyIncharge"),
		"typeOfCOE":                      c.PostForm("typeOfCOE"),
		"collaborativeIndustry1":         c.PostForm("collaborativeIndustry1"),
		"collaborativeIndustry2":         c.PostForm("collaborativeIndustry2"),
		"areaInSqm":                      c.PostForm("areaInSqm"),
		"domain":                         c.PostForm("domain"),
		"isMoUPart":                      c.PostForm("isMoUPart"),
		"mouName":                        c.PostForm("mouName"),
		"isIRPResult":                    c.PostForm("isIRPResult"),
		"irpVisits":                      c.PostForm("irpVisits"),
		"stockRegisterMaintained":        c.PostForm("stockRegisterMaintained"),
		"totalAmountIncurred":            c.PostForm("totalAmountIncurred"),
		"bitContribution":                c.PostForm("bitContribution"),
		"industryContributionWithGST":    c.PostForm("industryContributionWithGST"),
		"industryContributionWithoutGST": c.PostForm("industryContributionWithoutGST"),
		"studentsPerBatch":               c.PostForm("studentsPerBatch"),
		"academicCourse":                 c.PostForm("academicCourse"),
	}

	// Handle file uploads
	uploadDir := "./uploads/faculty/coe"
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

	syllabusDocumentPath := saveFile("syllabusDocument")
	labPhotoPath := saveFile("labPhoto")
	communicationProofPath := saveFile("communicationProof")
	apexDocumentPath := saveFile("apexDocument")
	facilitiesReportPath := saveFile("facilitiesReport")
	utilizationReportPath := saveFile("utilizationReport")

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_coe (
		faculty, sig_number, task_id, coe_name, centre_claimed_department,
		faculty_incharge, type_of_coe, collaborative_industry1,
		collaborative_industry2, area_in_sqm, domain, is_mou_part,
		mou_name, is_irp_result, irp_visits, stock_register_maintained,
		total_amount_incurred, bit_contribution, industry_contribution_with_gst,
		industry_contribution_without_gst, students_per_batch, academic_course,
		syllabus_document, lab_photo, communication_proof, apex_document,
		facilities_report, utilization_report, verification_status
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initiated')`

	_, err := config.DB.Exec(query,
		nullString(formData["faculty"]), nullString(formData["sigNumber"]), nullString(formData["taskID"]),
		nullString(formData["coeName"]), nullString(formData["centreClaimedDepartment"]),
		nullString(formData["facultyIncharge"]), nullString(formData["typeOfCOE"]),
		nullString(formData["collaborativeIndustry1"]), nullString(formData["collaborativeIndustry2"]),
		nullString(formData["areaInSqm"]), nullString(formData["domain"]), nullString(formData["isMoUPart"]),
		nullString(formData["mouName"]), nullString(formData["isIRPResult"]), nullString(formData["irpVisits"]),
		nullString(formData["stockRegisterMaintained"]), nullString(formData["totalAmountIncurred"]),
		nullString(formData["bitContribution"]), nullString(formData["industryContributionWithGST"]),
		nullString(formData["industryContributionWithoutGST"]), nullString(formData["studentsPerBatch"]),
		nullString(formData["academicCourse"]), nullString(syllabusDocumentPath), nullString(labPhotoPath),
		nullString(communicationProofPath), nullString(apexDocumentPath),
		nullString(facilitiesReportPath), nullString(utilizationReportPath),
	)

	if err != nil {
		log.Println("Error inserting COE:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "COE submitted successfully"})
}

func FetchCoe(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, faculty, sig_number, task_id, coe_name, centre_claimed_department, 
	          faculty_incharge, type_of_coe, collaborative_industry1, collaborative_industry2, 
			  area_in_sqm, domain, is_mou_part, mou_name, is_irp_result, irp_visits, 
			  stock_register_maintained, total_amount_incurred, bit_contribution, 
			  industry_contribution_with_gst, industry_contribution_without_gst, 
			  students_per_batch, academic_course, syllabus_document, lab_photo, 
			  communication_proof, apex_document, facilities_report, utilization_report, 
			  verification_status, created_at
	          FROM faculty_coe WHERE faculty = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching COE:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                                                int
			faculty, sigNumber, taskID, coeName, centreClaimedDepartment, facultyIncharge                     sql.NullString
			typeOfCoe, collaborativeIndustry1, collaborativeIndustry2, areaInSqm, domain                      sql.NullString
			isMouPart, mouName, isIrpResult, irpVisits, stockRegisterMaintained                               sql.NullString
			totalAmountIncurred, bitContribution, industryContributionWithGST, industryContributionWithoutGST sql.NullString
			studentsPerBatch, academicCourse, syllabusDocument, labPhoto, communicationProof                  sql.NullString
			apexDocument, facilitiesReport, utilizationReport, verificationStatus                             sql.NullString
			createdAt                                                                                         []uint8
		)

		if err := rows.Scan(&id, &faculty, &sigNumber, &taskID, &coeName, &centreClaimedDepartment,
			&facultyIncharge, &typeOfCoe, &collaborativeIndustry1, &collaborativeIndustry2,
			&areaInSqm, &domain, &isMouPart, &mouName, &isIrpResult, &irpVisits,
			&stockRegisterMaintained, &totalAmountIncurred, &bitContribution,
			&industryContributionWithGST, &industryContributionWithoutGST,
			&studentsPerBatch, &academicCourse, &syllabusDocument, &labPhoto,
			&communicationProof, &apexDocument, &facilitiesReport, &utilizationReport,
			&verificationStatus, &createdAt); err != nil {
			log.Println("Error scanning COE:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                                id,
			"faculty":                           faculty.String,
			"sig_number":                        sigNumber.String,
			"task_id":                           taskID.String,
			"coe_name":                          coeName.String,
			"centre_claimed_department":         centreClaimedDepartment.String,
			"faculty_incharge":                  facultyIncharge.String,
			"type_of_coe":                       typeOfCoe.String,
			"collaborative_industry1":           collaborativeIndustry1.String,
			"collaborative_industry2":           collaborativeIndustry2.String,
			"area_in_sqm":                       areaInSqm.String,
			"domain":                            domain.String,
			"is_mou_part":                       isMouPart.String,
			"mou_name":                          mouName.String,
			"is_irp_result":                     isIrpResult.String,
			"irp_visits":                        irpVisits.String,
			"stock_register_maintained":         stockRegisterMaintained.String,
			"total_amount_incurred":             totalAmountIncurred.String,
			"bit_contribution":                  bitContribution.String,
			"industry_contribution_with_gst":    industryContributionWithGST.String,
			"industry_contribution_without_gst": industryContributionWithoutGST.String,
			"students_per_batch":                studentsPerBatch.String,
			"academic_course":                   academicCourse.String,
			"syllabus_document":                 syllabusDocument.String,
			"lab_photo":                         labPhoto.String,
			"communication_proof":               communicationProof.String,
			"apex_document":                     apexDocument.String,
			"facilities_report":                 facilitiesReport.String,
			"utilization_report":                utilizationReport.String,
			"verification_status":               verificationStatus.String,
			"created_at":                        string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"coes": results})
}
