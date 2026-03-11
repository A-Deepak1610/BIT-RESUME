package outsideworld

import (
	"bitresume/config"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func HandleConsultancyForm(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// --- Workflow link (optional) ---
	// When submitted via the principal's consultancy workflow, the frontend
	// sends the consultancy_work_id so we can mark that work as 'completed'.
	consultancyWorkId := c.PostForm("consultancyWorkId")

	// --- Duration: new form sends durationUnit + durationValue ---
	durationUnit := c.PostForm("durationUnit")
	durationValue := c.PostForm("durationValue")
	var durationYear, durationMonth, durationDay string
	switch durationUnit {
	case "Year":
		durationYear = durationValue
	case "Month":
		durationMonth = durationValue
	case "Day":
		durationDay = durationValue
	}

	// --- Share split: "60-40" or "70-30" → individual percentages ---
	var facultySharePct, instituteSharePct string
	switch c.PostForm("sharePercentageSplit") {
	case "60-40":
		facultySharePct, instituteSharePct = "60", "40"
	case "70-30":
		facultySharePct, instituteSharePct = "70", "30"
	default:
		// Legacy: accept individual percentage fields if sent directly
		facultySharePct = c.PostForm("facultySharePercentage")
		instituteSharePct = c.PostForm("instituteSharePercentage")
	}

	// --- Derive faculty2/3/4/5 involvement from numberOfAdditionalFaculty ---
	additionalFaculty := 0
	if n, err2 := strconv.Atoi(c.PostForm("numberOfAdditionalFaculty")); err2 == nil {
		additionalFaculty = n
	}
	involvedFlag := func(idx int) string {
		if additionalFaculty >= idx {
			return "Yes"
		}
		return "No"
	}

	// --- Map new ConsultancyForm.jsx field names → existing DB column values ---
	formData := map[string]string{
		// Step 1
		"faculty":                       c.PostForm("faculty"),
		"taskID":                        c.PostForm("taskID"),
		"specialLabsInvolved":           c.PostForm("specialLabsInvolved"),
		"specialLab":                    c.PostForm("specialLab"),
		"faculty2Involved":              involvedFlag(2),
		"faculty2":                      c.PostForm("faculty2"),
		"faculty2SIG":                   c.PostForm("faculty2SIG"),
		"faculty3Involved":              involvedFlag(3),
		"faculty3":                      c.PostForm("faculty3"),
		"faculty3SIG":                   c.PostForm("faculty3SIG"),
		"faculty4Involved":              involvedFlag(4),
		"faculty4":                      c.PostForm("faculty4"),
		"faculty4SIG":                   c.PostForm("faculty4SIG"),
		"faculty5Involved":              involvedFlag(5),
		"faculty5":                      c.PostForm("faculty5"),
		"faculty5SIG":                   c.PostForm("faculty5SIG"),
		"consultancyClaimingDepartment": c.PostForm("consultancyClaimingDepartment"),
		// Step 2
		"typeOfConsultant":        c.PostForm("typeOfConsultant"),
		"sectorOfConsultant":      c.PostForm("sectorOfConsultant"),
		"organizationName":        c.PostForm("organizationName"),
		"organizationAddress":     c.PostForm("organizationAddress"),
		"coreSector":              c.PostForm("coreSector"),
		"consultancyProjectTitle": c.PostForm("consultancyProjectTitle"),
		"consultancyCategory":     c.PostForm("consultancyCategory"),
		"scopeOfWork":             c.PostForm("scopeOfWork"),
		// Step 3 – duration mapped to legacy columns
		"durationYear":     durationYear,
		"durationMonth":    durationMonth,
		"durationDay":      durationDay,
		"fromDate":         c.PostForm("fromDate"),
		"toDate":           c.PostForm("toDate"),
		"isPartOfMoU":      c.PostForm("isMoUResult"),
		"mouName":          c.PostForm("mouName"),
		"isInitiatedByIRP": c.PostForm("isIRPResult"),
		"irpVisits":        c.PostForm("irpVisits"),
		"isFesemRelated":   c.PostForm("isFESEMRelated"),
		"isRoiRelated":     c.PostForm("isROIRelated"),
		// Step 4
		"consultancyAmount":              c.PostForm("consultancyAmount"),
		"includedWithGST":                c.PostForm("includedWithGST"),
		"amountAfterGST":                 c.PostForm("amountAfterGST"),
		"ownershipRightsDescription":     c.PostForm("ownershipRightsDesc"),
		"consultantAgreementDescription": c.PostForm("consultantAgreementDesc"),
		"paymentDate":                    c.PostForm("dateOfPayment"),
		// Step 5
		"collegeResourcesUtilized":   c.PostForm("collegeResourcesUtilized"),
		"resourceList":               c.PostForm("listResources"),
		"facultySharePercentage":     facultySharePct,
		"instituteSharePercentage":   instituteSharePct,
		"collegeTransportUtilized":   c.PostForm("collegeTransportUtilized"),
		"areaVisited":                c.PostForm("transportAreaVisited"),
		"distanceTravelled":          c.PostForm("distanceTravelled"),
		"petrolCostPerKm":            c.PostForm("defaultPetrolCost"),
		"transportCost":              c.PostForm("transportCost"),
		"collegeConsumablesUtilized": c.PostForm("collegeConsumablesUtilized"),
		"consumablesList":            c.PostForm("listConsumables"),
		"consumablesCharge":          c.PostForm("consumablesCharge"),
		// Step 6
		"facultyShareAmount":      c.PostForm("facultyShareAmountBefore"),
		"instituteShareAmount":    c.PostForm("instituteShareAmountBefore"),
		"netFacultyShareAmount":   c.PostForm("netFacultyShare"),
		"netInstituteShareAmount": c.PostForm("netInstituteShare"),
	}

	// --- File uploads ---
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

	// New form field names → DB column keys
	filePaths := map[string]string{
		"consultancyAgreement":   saveFile("consultancyAgreement"),
		"communicationProof":     saveFile("communicationProof"),
		"auditDocuments":         saveFile("auditDocuments"),
		"workLogs":               saveFile("workLogsProof"), // new name
		"invoiceReceipt":         saveFile("invoiceReceipt"),
		"transactionProof":       saveFile("transactionProof"),
		"geotagPhotos":           saveFile("geotagPhotos"),
		"consultancyReport":      saveFile("consultancyReportProof"), // new name
		"consolidatedDocument":   saveFile("consolidatedDocument"),
		"visitingCard":           saveFile("visitingCard"),
		"partnershipDeed":        saveFile("partnershipDeed"),
		"nocPremises":            saveFile("nocBusinessPremises"), // new name
		"nonDisclosureAgreement": saveFile("ndaMutual"),           // new name
		"rentAgreement":          saveFile("rentAgreement"),       // new column
	}

	// --- Helper ---
	nullString := func(s string) interface{} {
		if s == "" || s == "Choose an option" {
			return nil
		}
		return s
	}

	// --- INSERT — column names match consultancy_table.sql (new schema) ---
	query := `INSERT INTO faculty_consultancy (
		faculty_id,
		faculty, task_id, consultancy_claiming_department,
		special_labs_involved, special_lab, number_of_additional_faculty,
		faculty2, faculty2_sig, faculty2_requirements,
		faculty3, faculty3_sig, faculty3_requirements,
		faculty4, faculty4_sig, faculty4_requirements,
		faculty5, faculty5_sig, faculty5_requirements,
		consultancy_project_title, consultancy_category,
		type_of_consultant, sector_of_consultant, scope_of_work,
		core_sector, organization_name, organization_address,
		duration_unit, duration_value,
		from_date, to_date,
		is_mou_result, mou_name, is_irp_result, irp_visits,
		is_fesem_related, is_roi_related,
		consultancy_amount, included_with_gst, amount_after_gst,
		date_of_payment, ownership_rights_desc, consultant_agreement_desc,
		college_resources_utilized, list_resources,
		college_transport_utilized, transport_area_visited,
		distance_travelled, default_petrol_cost, transport_cost,
		college_consumables_utilized, list_consumables, consumables_charge,
		share_percentage_split,
		faculty_share_amount_before, institute_share_amount_before,
		net_faculty_share, net_institute_share, based_on_faculty_count,
		consolidated_document, consultancy_agreement, communication_proof,
		audit_documents, work_logs_proof, invoice_receipt, transaction_proof,
		geotag_photos, consultancy_report_proof, visiting_card,
		partnership_deed, noc_business_premises, nda_mutual, rent_agreement,
		verification_status
	) VALUES (
		?,
		?, ?, ?,
		?, ?, ?,
		?, ?, ?,
		?, ?, ?,
		?, ?, ?,
		?, ?, ?,
		?, ?,
		?, ?, ?,
		?, ?, ?,
		?, ?,
		?, ?,
		?, ?, ?, ?,
		?, ?,
		?, ?, ?,
		?, ?, ?,
		?, ?,
		?, ?,
		?, ?, ?,
		?, ?, ?,
		?,
		?, ?,
		?, ?, ?,
		?, ?, ?,
		?, ?, ?, ?,
		?, ?, ?,
		?, ?, ?, ?,
		'Initiated'
	)`

	_, err := config.DB.Exec(query,
		// identity
		nullString(facultyID),
		// step 1 – faculty info
		nullString(formData["faculty"]),
		nullString(formData["taskID"]),
		nullString(formData["consultancyClaimingDepartment"]),
		nullString(formData["specialLabsInvolved"]),
		nullString(formData["specialLab"]),
		nullString(c.PostForm("numberOfAdditionalFaculty")),
		nullString(formData["faculty2"]), nullString(formData["faculty2SIG"]), nullString(c.PostForm("faculty2Requirements")),
		nullString(formData["faculty3"]), nullString(formData["faculty3SIG"]), nullString(c.PostForm("faculty3Requirements")),
		nullString(formData["faculty4"]), nullString(formData["faculty4SIG"]), nullString(c.PostForm("faculty4Requirements")),
		nullString(formData["faculty5"]), nullString(formData["faculty5SIG"]), nullString(c.PostForm("faculty5Requirements")),
		// step 2 – project
		nullString(formData["consultancyProjectTitle"]),
		nullString(formData["consultancyCategory"]),
		nullString(formData["typeOfConsultant"]),
		nullString(formData["sectorOfConsultant"]),
		nullString(formData["scopeOfWork"]),
		nullString(formData["coreSector"]),
		nullString(formData["organizationName"]),
		nullString(formData["organizationAddress"]),
		// step 3 – timeline (duration_unit + duration_value, not year/month/day)
		nullString(durationUnit),
		nullString(durationValue),
		nullString(formData["fromDate"]),
		nullString(formData["toDate"]),
		nullString(formData["isPartOfMoU"]),
		nullString(formData["mouName"]),
		nullString(formData["isInitiatedByIRP"]),
		nullString(formData["irpVisits"]),
		nullString(formData["isFesemRelated"]),
		nullString(formData["isRoiRelated"]),
		// step 4 – financials
		nullString(formData["consultancyAmount"]),
		nullString(formData["includedWithGST"]),
		nullString(formData["amountAfterGST"]),
		nullString(formData["paymentDate"]),
		nullString(formData["ownershipRightsDescription"]),
		nullString(formData["consultantAgreementDescription"]),
		// step 5 – resources
		nullString(formData["collegeResourcesUtilized"]),
		nullString(formData["resourceList"]),
		nullString(formData["collegeTransportUtilized"]),
		nullString(formData["areaVisited"]),
		nullString(formData["distanceTravelled"]),
		nullString(formData["petrolCostPerKm"]),
		nullString(formData["transportCost"]),
		nullString(formData["collegeConsumablesUtilized"]),
		nullString(formData["consumablesList"]),
		nullString(formData["consumablesCharge"]),
		// step 6 – shares
		nullString(c.PostForm("sharePercentageSplit")),
		nullString(formData["facultyShareAmount"]),
		nullString(formData["instituteShareAmount"]),
		nullString(formData["netFacultyShareAmount"]),
		nullString(formData["netInstituteShareAmount"]),
		nullString(c.PostForm("basedOnFacultyCount")),
		// step 7 – files (order matches column list above)
		nullString(filePaths["consolidatedDocument"]),
		nullString(filePaths["consultancyAgreement"]),
		nullString(filePaths["communicationProof"]),
		nullString(filePaths["auditDocuments"]),
		nullString(filePaths["workLogs"]),
		nullString(filePaths["invoiceReceipt"]),
		nullString(filePaths["transactionProof"]),
		nullString(filePaths["geotagPhotos"]),
		nullString(filePaths["consultancyReport"]),
		nullString(filePaths["visitingCard"]),
		nullString(filePaths["partnershipDeed"]),
		nullString(filePaths["nocPremises"]),
		nullString(filePaths["nonDisclosureAgreement"]),
		nullString(filePaths["rentAgreement"]),
		// verification_status is hardcoded 'Initiated'
	)

	if err != nil {
		log.Println("Error inserting Consultancy:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	// If submitted via the principal consultancy workflow, mark the work as completed
	// so IQAC can see the final record.
	if consultancyWorkId != "" {
		if _, updErr := config.DB.Exec(
			`UPDATE consultancy_works SET status = 'completed' WHERE id = ? AND status = 'consultancy_form_pending'`,
			consultancyWorkId,
		); updErr != nil {
			log.Printf("Warning: could not mark consultancy_work %s as completed: %v", consultancyWorkId, updErr)
			// Non-fatal — the consultancy entry was saved successfully.
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Consultancy submitted successfully"})
}

func FetchConsultancy(c *gin.Context) {
	facultyID := c.GetString("rollNo")
	if facultyID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	query := `SELECT id, faculty_id, faculty, task_id, consultancy_claiming_department,
		special_labs_involved, special_lab, number_of_additional_faculty,
		faculty2, faculty2_sig, faculty2_requirements,
		faculty3, faculty3_sig, faculty3_requirements,
		faculty4, faculty4_sig, faculty4_requirements,
		faculty5, faculty5_sig, faculty5_requirements,
		consultancy_project_title, consultancy_category,
		type_of_consultant, sector_of_consultant, scope_of_work,
		core_sector, organization_name, organization_address,
		duration_unit, duration_value,
		from_date, to_date,
		is_mou_result, mou_name, is_irp_result, irp_visits,
		is_fesem_related, is_roi_related,
		consultancy_amount, included_with_gst, amount_after_gst,
		date_of_payment, ownership_rights_desc, consultant_agreement_desc,
		college_resources_utilized, list_resources,
		college_transport_utilized, transport_area_visited,
		distance_travelled, default_petrol_cost, transport_cost,
		college_consumables_utilized, list_consumables, consumables_charge,
		share_percentage_split,
		faculty_share_amount_before, institute_share_amount_before,
		net_faculty_share, net_institute_share, based_on_faculty_count,
		consolidated_document, consultancy_agreement, communication_proof,
		audit_documents, work_logs_proof, invoice_receipt, transaction_proof,
		geotag_photos, consultancy_report_proof, visiting_card,
		partnership_deed, noc_business_premises, nda_mutual, rent_agreement,
		verification_status, created_at
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
			id                                                              int
			facultyIDRes, faculty, taskID, consultancyClaimingDept          sql.NullString
			specialLabsInvolved, specialLab, numberOfAdditionalFaculty      sql.NullString
			faculty2, faculty2Sig, faculty2Req                              sql.NullString
			faculty3, faculty3Sig, faculty3Req                              sql.NullString
			faculty4, faculty4Sig, faculty4Req                              sql.NullString
			faculty5, faculty5Sig, faculty5Req                              sql.NullString
			consultancyProjectTitle, consultancyCategory                    sql.NullString
			typeOfConsultant, sectorOfConsultant, scopeOfWork               sql.NullString
			coreSector, organizationName, organizationAddress               sql.NullString
			durationUnit, durationValue                                     sql.NullString
			fromDate, toDate                                                sql.NullString
			isMouResult, mouName, isIrpResult, irpVisits                    sql.NullString
			isFesemRelated, isRoiRelated                                    sql.NullString
			consultancyAmount, includedWithGST, amountAfterGST              sql.NullString
			dateOfPayment, ownershipRightsDesc, consultantAgreementDesc     sql.NullString
			collegeResourcesUtilized, listResources                         sql.NullString
			collegeTransportUtilized, transportAreaVisited                  sql.NullString
			distanceTravelled, defaultPetrolCost, transportCost             sql.NullString
			collegeConsumablesUtilized, listConsumables, consumablesCharge  sql.NullString
			sharePercentageSplit                                            sql.NullString
			facultyShareAmountBefore, instituteShareAmountBefore            sql.NullString
			netFacultyShare, netInstituteShare, basedOnFacultyCount         sql.NullString
			consolidatedDocument, consultancyAgreement, communicationProof  sql.NullString
			auditDocuments, workLogsProof, invoiceReceipt, transactionProof sql.NullString
			geotagPhotos, consultancyReportProof, visitingCard              sql.NullString
			partnershipDeed, nocBusinessPremises, ndaMutual, rentAgreement  sql.NullString
			verificationStatus                                              sql.NullString
			createdAt                                                       []uint8
		)

		if err := rows.Scan(
			&id, &facultyIDRes, &faculty, &taskID, &consultancyClaimingDept,
			&specialLabsInvolved, &specialLab, &numberOfAdditionalFaculty,
			&faculty2, &faculty2Sig, &faculty2Req,
			&faculty3, &faculty3Sig, &faculty3Req,
			&faculty4, &faculty4Sig, &faculty4Req,
			&faculty5, &faculty5Sig, &faculty5Req,
			&consultancyProjectTitle, &consultancyCategory,
			&typeOfConsultant, &sectorOfConsultant, &scopeOfWork,
			&coreSector, &organizationName, &organizationAddress,
			&durationUnit, &durationValue,
			&fromDate, &toDate,
			&isMouResult, &mouName, &isIrpResult, &irpVisits,
			&isFesemRelated, &isRoiRelated,
			&consultancyAmount, &includedWithGST, &amountAfterGST,
			&dateOfPayment, &ownershipRightsDesc, &consultantAgreementDesc,
			&collegeResourcesUtilized, &listResources,
			&collegeTransportUtilized, &transportAreaVisited,
			&distanceTravelled, &defaultPetrolCost, &transportCost,
			&collegeConsumablesUtilized, &listConsumables, &consumablesCharge,
			&sharePercentageSplit,
			&facultyShareAmountBefore, &instituteShareAmountBefore,
			&netFacultyShare, &netInstituteShare, &basedOnFacultyCount,
			&consolidatedDocument, &consultancyAgreement, &communicationProof,
			&auditDocuments, &workLogsProof, &invoiceReceipt, &transactionProof,
			&geotagPhotos, &consultancyReportProof, &visitingCard,
			&partnershipDeed, &nocBusinessPremises, &ndaMutual, &rentAgreement,
			&verificationStatus, &createdAt,
		); err != nil {
			log.Println("Error scanning Consultancy:", err)
			continue
		}

		results = append(results, map[string]interface{}{
			"id":                              id,
			"faculty_id":                      facultyIDRes.String,
			"faculty":                         faculty.String,
			"task_id":                         taskID.String,
			"consultancy_claiming_department": consultancyClaimingDept.String,
			"special_labs_involved":           specialLabsInvolved.String,
			"special_lab":                     specialLab.String,
			"number_of_additional_faculty":    numberOfAdditionalFaculty.String,
			"faculty2":                        faculty2.String,
			"faculty2_sig":                    faculty2Sig.String,
			"faculty2_requirements":           faculty2Req.String,
			"faculty3":                        faculty3.String,
			"faculty3_sig":                    faculty3Sig.String,
			"faculty3_requirements":           faculty3Req.String,
			"faculty4":                        faculty4.String,
			"faculty4_sig":                    faculty4Sig.String,
			"faculty4_requirements":           faculty4Req.String,
			"faculty5":                        faculty5.String,
			"faculty5_sig":                    faculty5Sig.String,
			"faculty5_requirements":           faculty5Req.String,
			"consultancy_project_title":       consultancyProjectTitle.String,
			"consultancy_category":            consultancyCategory.String,
			"type_of_consultant":              typeOfConsultant.String,
			"sector_of_consultant":            sectorOfConsultant.String,
			"scope_of_work":                   scopeOfWork.String,
			"core_sector":                     coreSector.String,
			"organization_name":               organizationName.String,
			"organization_address":            organizationAddress.String,
			"duration_unit":                   durationUnit.String,
			"duration_value":                  durationValue.String,
			"from_date":                       fromDate.String,
			"to_date":                         toDate.String,
			"is_mou_result":                   isMouResult.String,
			"mou_name":                        mouName.String,
			"is_irp_result":                   isIrpResult.String,
			"irp_visits":                      irpVisits.String,
			"is_fesem_related":                isFesemRelated.String,
			"is_roi_related":                  isRoiRelated.String,
			"consultancy_amount":              consultancyAmount.String,
			"included_with_gst":               includedWithGST.String,
			"amount_after_gst":                amountAfterGST.String,
			"date_of_payment":                 dateOfPayment.String,
			"ownership_rights_desc":           ownershipRightsDesc.String,
			"consultant_agreement_desc":       consultantAgreementDesc.String,
			"college_resources_utilized":      collegeResourcesUtilized.String,
			"list_resources":                  listResources.String,
			"college_transport_utilized":      collegeTransportUtilized.String,
			"transport_area_visited":          transportAreaVisited.String,
			"distance_travelled":              distanceTravelled.String,
			"default_petrol_cost":             defaultPetrolCost.String,
			"transport_cost":                  transportCost.String,
			"college_consumables_utilized":    collegeConsumablesUtilized.String,
			"list_consumables":                listConsumables.String,
			"consumables_charge":              consumablesCharge.String,
			"share_percentage_split":          sharePercentageSplit.String,
			"faculty_share_amount_before":     facultyShareAmountBefore.String,
			"institute_share_amount_before":   instituteShareAmountBefore.String,
			"net_faculty_share":               netFacultyShare.String,
			"net_institute_share":             netInstituteShare.String,
			"based_on_faculty_count":          basedOnFacultyCount.String,
			"consolidated_document":           consolidatedDocument.String,
			"consultancy_agreement":           consultancyAgreement.String,
			"communication_proof":             communicationProof.String,
			"audit_documents":                 auditDocuments.String,
			"work_logs_proof":                 workLogsProof.String,
			"invoice_receipt":                 invoiceReceipt.String,
			"transaction_proof":               transactionProof.String,
			"geotag_photos":                   geotagPhotos.String,
			"consultancy_report_proof":        consultancyReportProof.String,
			"visiting_card":                   visitingCard.String,
			"partnership_deed":                partnershipDeed.String,
			"noc_business_premises":           nocBusinessPremises.String,
			"nda_mutual":                      ndaMutual.String,
			"rent_agreement":                  rentAgreement.String,
			"verification_status":             verificationStatus.String,
			"created_at":                      string(createdAt),
		})
	}

	c.JSON(http.StatusOK, gin.H{"consultancies": results})
}
