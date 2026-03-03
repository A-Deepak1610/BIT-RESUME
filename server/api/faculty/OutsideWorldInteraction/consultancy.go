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

func HandleConsultancyForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse all form fields
	formData := map[string]string{
		"faculty":                        c.PostForm("faculty"),
		"taskID":                         c.PostForm("taskID"),
		"specialLabsInvolved":            c.PostForm("specialLabsInvolved"),
		"specialLab":                     c.PostForm("specialLab"),
		"faculty2Involved":               c.PostForm("faculty2Involved"),
		"faculty2":                       c.PostForm("faculty2"),
		"faculty2SIG":                    c.PostForm("faculty2SIG"),
		"faculty3Involved":               c.PostForm("faculty3Involved"),
		"faculty3":                       c.PostForm("faculty3"),
		"faculty3SIG":                    c.PostForm("faculty3SIG"),
		"faculty4Involved":               c.PostForm("faculty4Involved"),
		"faculty4":                       c.PostForm("faculty4"),
		"faculty4SIG":                    c.PostForm("faculty4SIG"),
		"faculty5Involved":               c.PostForm("faculty5Involved"),
		"faculty5":                       c.PostForm("faculty5"),
		"faculty5SIG":                    c.PostForm("faculty5SIG"),
		"consultancyClaimingDepartment":  c.PostForm("consultancyClaimingDepartment"),
		"typeOfConsultant":               c.PostForm("typeOfConsultant"),
		"sectorOfConsultant":             c.PostForm("sectorOfConsultant"),
		"organizationName":               c.PostForm("organizationName"),
		"organizationAddress":            c.PostForm("organizationAddress"),
		"coreSector":                     c.PostForm("coreSector"),
		"consultancyProjectTitle":        c.PostForm("consultancyProjectTitle"),
		"consultancyCategory":            c.PostForm("consultancyCategory"),
		"scopeOfWork":                    c.PostForm("scopeOfWork"),
		"durationYear":                   c.PostForm("durationYear"),
		"durationMonth":                  c.PostForm("durationMonth"),
		"durationDay":                    c.PostForm("durationDay"),
		"fromDate":                       c.PostForm("fromDate"),
		"toDate":                         c.PostForm("toDate"),
		"isPartOfMoU":                    c.PostForm("isPartOfMoU"),
		"mouName":                        c.PostForm("mouName"),
		"isInitiatedByIRP":               c.PostForm("isInitiatedByIRP"),
		"irpVisits":                      c.PostForm("irpVisits"),
		"isFesemRelated":                 c.PostForm("isFesemRelated"),
		"isRoiRelated":                   c.PostForm("isRoiRelated"),
		"consultancyAmount":              c.PostForm("consultancyAmount"),
		"includedWithGST":                c.PostForm("includedWithGST"),
		"amountAfterGST":                 c.PostForm("amountAfterGST"),
		"ownershipRightsDescription":     c.PostForm("ownershipRightsDescription"),
		"consultantAgreementDescription": c.PostForm("consultantAgreementDescription"),
		"paymentDate":                    c.PostForm("paymentDate"),
		"collegeResourcesUtilized":       c.PostForm("collegeResourcesUtilized"),
		"resourceList":                   c.PostForm("resourceList"),
		"facultySharePercentage":         c.PostForm("facultySharePercentage"),
		"instituteSharePercentage":       c.PostForm("instituteSharePercentage"),
		"collegeTransportUtilized":       c.PostForm("collegeTransportUtilized"),
		"areaVisited":                    c.PostForm("areaVisited"),
		"distanceTravelled":              c.PostForm("distanceTravelled"),
		"petrolCostPerKm":                c.PostForm("petrolCostPerKm"),
		"transportCost":                  c.PostForm("transportCost"),
		"collegeConsumablesUtilized":     c.PostForm("collegeConsumablesUtilized"),
		"consumablesList":                c.PostForm("consumablesList"),
		"consumablesCharge":              c.PostForm("consumablesCharge"),
		"facultyShareAmount":             c.PostForm("facultyShareAmount"),
		"instituteShareAmount":           c.PostForm("instituteShareAmount"),
		"netFacultyShareAmount":          c.PostForm("netFacultyShareAmount"),
		"netInstituteShareAmount":        c.PostForm("netInstituteShareAmount"),
	}

	// Handle file uploads
	uploadDir := "./uploads/faculty/consultancy"
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

	// List of consultancy files
	filePaths := map[string]string{
		"consultancyAgreement":   saveFile("consultancyAgreement"),
		"communicationProof":     saveFile("communicationProof"),
		"auditDocuments":         saveFile("auditDocuments"),
		"workLogs":               saveFile("workLogs"),
		"invoiceReceipt":         saveFile("invoiceReceipt"),
		"transactionProof":       saveFile("transactionProof"),
		"geotagPhotos":           saveFile("geotagPhotos"),
		"consultancyReport":      saveFile("consultancyReport"),
		"consolidatedDocument":   saveFile("consolidatedDocument"),
		"visitingCard":           saveFile("visitingCard"),
		"partnershipDeed":        saveFile("partnershipDeed"),
		"nocPremises":            saveFile("nocPremises"),
		"nonDisclosureAgreement": saveFile("nonDisclosureAgreement"),
	}

	// Helper function for nullable strings
	nullString := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s
	}

	// Insert into database
	query := `INSERT INTO faculty_consultancy (
		faculty_id, faculty, task_id, special_labs_involved, special_lab,
		faculty2_involved, faculty2, faculty2_sig,
		faculty3_involved, faculty3, faculty3_sig,
		faculty4_involved, faculty4, faculty4_sig,
		faculty5_involved, faculty5, faculty5_sig,
		consultancy_claiming_department, type_of_consultant,
		sector_of_consultant, organization_name, organization_address,
		core_sector, consultancy_project_title, consultancy_category,
		scope_of_work, duration_year, duration_month, duration_day,
		from_date, to_date, is_part_of_mou, mou_name, is_initiated_by_irp,
		irp_visits, is_fesem_related, is_roi_related, consultancy_amount,
		included_with_gst, amount_after_gst, ownership_rights_description,
		consultant_agreement_description, payment_date,
		college_resources_utilized, resource_list, faculty_share_percentage,
		institute_share_percentage, college_transport_utilized, area_visited,
		distance_travelled, petrol_cost_per_km, transport_cost,
		college_consumables_utilized, consumables_list, consumables_charge,
		faculty_share_amount, institute_share_amount, net_faculty_share_amount,
		net_institute_share_amount, consultancy_agreement, communication_proof,
		audit_documents, work_logs, invoice_receipt, transaction_proof,
		geotag_photos, consultancy_report, consolidated_document, visiting_card,
		partnership_deed, noc_premises, non_disclosure_agreement, verification_status
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Initiated')`

	_, err := config.DB.Exec(query,
		nullString(facultyID), nullString(formData["faculty"]), nullString(formData["taskID"]), nullString(formData["specialLabsInvolved"]),
		nullString(formData["specialLab"]), nullString(formData["faculty2Involved"]), nullString(formData["faculty2"]),
		nullString(formData["faculty2SIG"]), nullString(formData["faculty3Involved"]), nullString(formData["faculty3"]),
		nullString(formData["faculty3SIG"]), nullString(formData["faculty4Involved"]), nullString(formData["faculty4"]),
		nullString(formData["faculty4SIG"]), nullString(formData["faculty5Involved"]), nullString(formData["faculty5"]),
		nullString(formData["faculty5SIG"]), nullString(formData["consultancyClaimingDepartment"]),
		nullString(formData["typeOfConsultant"]), nullString(formData["sectorOfConsultant"]),
		nullString(formData["organizationName"]), nullString(formData["organizationAddress"]),
		nullString(formData["coreSector"]), nullString(formData["consultancyProjectTitle"]),
		nullString(formData["consultancyCategory"]), nullString(formData["scopeOfWork"]),
		nullString(formData["durationYear"]), nullString(formData["durationMonth"]), nullString(formData["durationDay"]),
		nullString(formData["fromDate"]), nullString(formData["toDate"]), nullString(formData["isPartOfMoU"]),
		nullString(formData["mouName"]), nullString(formData["isInitiatedByIRP"]), nullString(formData["irpVisits"]),
		nullString(formData["isFesemRelated"]), nullString(formData["isRoiRelated"]),
		nullString(formData["consultancyAmount"]), nullString(formData["includedWithGST"]),
		nullString(formData["amountAfterGST"]), nullString(formData["ownershipRightsDescription"]),
		nullString(formData["consultantAgreementDescription"]), nullString(formData["paymentDate"]),
		nullString(formData["collegeResourcesUtilized"]), nullString(formData["resourceList"]),
		nullString(formData["facultySharePercentage"]), nullString(formData["instituteSharePercentage"]),
		nullString(formData["collegeTransportUtilized"]), nullString(formData["areaVisited"]),
		nullString(formData["distanceTravelled"]), nullString(formData["petrolCostPerKm"]),
		nullString(formData["transportCost"]), nullString(formData["collegeConsumablesUtilized"]),
		nullString(formData["consumablesList"]), nullString(formData["consumablesCharge"]),
		nullString(formData["facultyShareAmount"]), nullString(formData["instituteShareAmount"]),
		nullString(formData["netFacultyShareAmount"]), nullString(formData["netInstituteShareAmount"]),
		nullString(filePaths["consultancyAgreement"]), nullString(filePaths["communicationProof"]),
		nullString(filePaths["auditDocuments"]), nullString(filePaths["workLogs"]),
		nullString(filePaths["invoiceReceipt"]), nullString(filePaths["transactionProof"]),
		nullString(filePaths["geotagPhotos"]), nullString(filePaths["consultancyReport"]),
		nullString(filePaths["consolidatedDocument"]), nullString(filePaths["visitingCard"]),
		nullString(filePaths["partnershipDeed"]), nullString(filePaths["nocPremises"]),
		nullString(filePaths["nonDisclosureAgreement"]),
	)

	if err != nil {
		log.Println("Error inserting Consultancy:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Consultancy submitted successfully"})
}

func FetchConsultancy(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, faculty_id, faculty, task_id, special_labs_involved, special_lab,
		faculty2_involved, faculty2, faculty2_sig,
		faculty3_involved, faculty3, faculty3_sig,
		faculty4_involved, faculty4, faculty4_sig,
		faculty5_involved, faculty5, faculty5_sig,
		consultancy_claiming_department, type_of_consultant,
		sector_of_consultant, organization_name, organization_address,
		core_sector, consultancy_project_title, consultancy_category,
		scope_of_work, duration_year, duration_month, duration_day,
		from_date, to_date, is_part_of_mou, mou_name, is_initiated_by_irp,
		irp_visits, is_fesem_related, is_roi_related, consultancy_amount,
		included_with_gst, amount_after_gst, ownership_rights_description,
		consultant_agreement_description, payment_date,
		college_resources_utilized, resource_list, faculty_share_percentage,
		institute_share_percentage, college_transport_utilized, area_visited,
		distance_travelled, petrol_cost_per_km, transport_cost,
		college_consumables_utilized, consumables_list, consumables_charge,
		faculty_share_amount, institute_share_amount, net_faculty_share_amount,
		net_institute_share_amount, consultancy_agreement, communication_proof,
		audit_documents, work_logs, invoice_receipt, transaction_proof,
		geotag_photos, consultancy_report, consolidated_document, visiting_card,
		partnership_deed, noc_premises, non_disclosure_agreement, verification_status, created_at
	          FROM faculty_consultancy WHERE faculty_id = ? ORDER BY created_at DESC`

	rows, err := config.DB.Query(query, facultyID)
	if err != nil {
		log.Println("Error fetching Consultancy:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var (
			id                                                                      int
			facultyIDRes, faculty, taskID, specialLabsInvolved, specialLab          sql.NullString
			faculty2Involved, faculty2, faculty2SIG                                 sql.NullString
			faculty3Involved, faculty3, faculty3SIG                                 sql.NullString
			faculty4Involved, faculty4, faculty4SIG                                 sql.NullString
			faculty5Involved, faculty5, faculty5SIG                                 sql.NullString
			consultancyClaimingDepartment, typeOfConsultant, sectorOfConsultant     sql.NullString
			organizationName, organizationAddress, coreSector                       sql.NullString
			consultancyProjectTitle, consultancyCategory, scopeOfWork               sql.NullString
			durationYear, durationMonth, durationDay                                sql.NullString
			fromDate, toDate, isPartOfMoU, mouName, isInitiatedByIRP                sql.NullString
			irpVisits, isFesemRelated, isRoiRelated                                 sql.NullString
			consultancyAmount, includedWithGST, amountAfterGST                      sql.NullString
			ownershipRightsDescription, consultantAgreementDescription, paymentDate sql.NullString
			collegeResourcesUtilized, resourceList                                  sql.NullString
			facultySharePercentage, instituteSharePercentage                        sql.NullString
			collegeTransportUtilized, areaVisited, distanceTravelled                sql.NullString
			petrolCostPerKm, transportCost                                          sql.NullString
			collegeConsumablesUtilized, consumablesList, consumablesCharge          sql.NullString
			facultyShareAmount, instituteShareAmount                                sql.NullString
			netFacultyShareAmount, netInstituteShareAmount                          sql.NullString
			consultancyAgreement, communicationProof, auditDocuments, workLogs      sql.NullString
			invoiceReceipt, transactionProof, geotagPhotos, consultancyReport       sql.NullString
			consolidatedDocument, visitingCard, partnershipDeed                     sql.NullString
			nocPremises, nonDisclosureAgreement, verificationStatus                 sql.NullString
			createdAt                                                               []uint8
		)

		if err := rows.Scan(&id, &facultyIDRes, &faculty, &taskID, &specialLabsInvolved, &specialLab,
			&faculty2Involved, &faculty2, &faculty2SIG,
			&faculty3Involved, &faculty3, &faculty3SIG,
			&faculty4Involved, &faculty4, &faculty4SIG,
			&faculty5Involved, &faculty5, &faculty5SIG,
			&consultancyClaimingDepartment, &typeOfConsultant,
			&sectorOfConsultant, &organizationName, &organizationAddress,
			&coreSector, &consultancyProjectTitle, &consultancyCategory,
			&scopeOfWork, &durationYear, &durationMonth, &durationDay,
			&fromDate, &toDate, &isPartOfMoU, &mouName, &isInitiatedByIRP,
			&irpVisits, &isFesemRelated, &isRoiRelated, &consultancyAmount,
			&includedWithGST, &amountAfterGST, &ownershipRightsDescription,
			&consultantAgreementDescription, &paymentDate,
			&collegeResourcesUtilized, &resourceList, &facultySharePercentage,
			&instituteSharePercentage, &collegeTransportUtilized, &areaVisited,
			&distanceTravelled, &petrolCostPerKm, &transportCost,
			&collegeConsumablesUtilized, &consumablesList, &consumablesCharge,
			&facultyShareAmount, &instituteShareAmount, &netFacultyShareAmount,
			&netInstituteShareAmount, &consultancyAgreement, &communicationProof,
			&auditDocuments, &workLogs, &invoiceReceipt, &transactionProof,
			&geotagPhotos, &consultancyReport, &consolidatedDocument, &visitingCard,
			&partnershipDeed, &nocPremises, &nonDisclosureAgreement, &verificationStatus, &createdAt); err != nil {
			log.Println("Error scanning Consultancy:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                               id,
			"faculty_id":                       facultyIDRes.String,
			"faculty":                          faculty.String,
			"task_id":                          taskID.String,
			"special_labs_involved":            specialLabsInvolved.String,
			"special_lab":                      specialLab.String,
			"faculty2_involved":                faculty2Involved.String,
			"faculty2":                         faculty2.String,
			"faculty2_sig":                     faculty2SIG.String,
			"faculty3_involved":                faculty3Involved.String,
			"faculty3":                         faculty3.String,
			"faculty3_sig":                     faculty3SIG.String,
			"faculty4_involved":                faculty4Involved.String,
			"faculty4":                         faculty4.String,
			"faculty4_sig":                     faculty4SIG.String,
			"faculty5_involved":                faculty5Involved.String,
			"faculty5":                         faculty5.String,
			"faculty5_sig":                     faculty5SIG.String,
			"consultancy_claiming_department":  consultancyClaimingDepartment.String,
			"type_of_consultant":               typeOfConsultant.String,
			"sector_of_consultant":             sectorOfConsultant.String,
			"organization_name":                organizationName.String,
			"organization_address":             organizationAddress.String,
			"core_sector":                      coreSector.String,
			"consultancy_project_title":        consultancyProjectTitle.String,
			"consultancy_category":             consultancyCategory.String,
			"scope_of_work":                    scopeOfWork.String,
			"duration_year":                    durationYear.String,
			"duration_month":                   durationMonth.String,
			"duration_day":                     durationDay.String,
			"from_date":                        fromDate.String,
			"to_date":                          toDate.String,
			"is_part_of_mou":                   isPartOfMoU.String,
			"mou_name":                         mouName.String,
			"is_initiated_by_irp":              isInitiatedByIRP.String,
			"irp_visits":                       irpVisits.String,
			"is_fesem_related":                 isFesemRelated.String,
			"is_roi_related":                   isRoiRelated.String,
			"consultancy_amount":               consultancyAmount.String,
			"included_with_gst":                includedWithGST.String,
			"amount_after_gst":                 amountAfterGST.String,
			"ownership_rights_description":     ownershipRightsDescription.String,
			"consultant_agreement_description": consultantAgreementDescription.String,
			"payment_date":                     paymentDate.String,
			"college_resources_utilized":       collegeResourcesUtilized.String,
			"resource_list":                    resourceList.String,
			"faculty_share_percentage":         facultySharePercentage.String,
			"institute_share_percentage":       instituteSharePercentage.String,
			"college_transport_utilized":       collegeTransportUtilized.String,
			"area_visited":                     areaVisited.String,
			"distance_travelled":               distanceTravelled.String,
			"petrol_cost_per_km":               petrolCostPerKm.String,
			"transport_cost":                   transportCost.String,
			"college_consumables_utilized":     collegeConsumablesUtilized.String,
			"consumables_list":                 consumablesList.String,
			"consumables_charge":               consumablesCharge.String,
			"faculty_share_amount":             facultyShareAmount.String,
			"institute_share_amount":           instituteShareAmount.String,
			"net_faculty_share_amount":         netFacultyShareAmount.String,
			"net_institute_share_amount":       netInstituteShareAmount.String,
			"consultancy_agreement":            consultancyAgreement.String,
			"communication_proof":              communicationProof.String,
			"audit_documents":                  auditDocuments.String,
			"work_logs":                        workLogs.String,
			"invoice_receipt":                  invoiceReceipt.String,
			"transaction_proof":                transactionProof.String,
			"geotag_photos":                    geotagPhotos.String,
			"consultancy_report":               consultancyReport.String,
			"consolidated_document":            consolidatedDocument.String,
			"visiting_card":                    visitingCard.String,
			"partnership_deed":                 partnershipDeed.String,
			"noc_premises":                     nocPremises.String,
			"non_disclosure_agreement":         nonDisclosureAgreement.String,
			"verification_status":              verificationStatus.String,
			"created_at":                       string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"consultancies": results})
}
