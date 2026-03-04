package consultancy

import (
	"bitresume/config"
	"database/sql"
	"log"
)

// FetchFormDataForWork queries the three form tables for the given consultancy work ID.
// Returns nil if no form has been submitted yet.
func FetchFormDataForWork(workID int64) map[string]interface{} {
	// ── 1. Try Drone form ──────────────────────────────────────────────────────
	var (
		droneID            int64
		droneOWI           sql.NullString
		droneDurFrom       sql.NullString
		droneDurTo         sql.NullString
		droneQuotURL       sql.NullString
		droneAmtWithGST    sql.NullFloat64
		droneAmtWithoutGST sql.NullFloat64
		droneFinSplit      sql.NullString
		droneSubmittedBy   sql.NullString
		droneSubmittedAt   sql.NullString
	)
	err := config.DB.QueryRow(`
		SELECT id, owi_ref_no, project_duration_from, project_duration_to,
		       quotation_file_url, total_amount_with_gst, total_amount_without_gst,
		       financial_split, submitted_by, submitted_at
		FROM consultancy_drone_forms
		WHERE consultancy_work_id = ?
		LIMIT 1
	`, workID).Scan(
		&droneID, &droneOWI, &droneDurFrom, &droneDurTo,
		&droneQuotURL, &droneAmtWithGST, &droneAmtWithoutGST,
		&droneFinSplit, &droneSubmittedBy, &droneSubmittedAt,
	)
	if err == nil {
		members := fetchDroneMembers(droneID)
		equipment := fetchDroneEquipment(droneID)
		activities := fetchDroneActivities(droneID)
		return map[string]interface{}{
			"form_type":                "drone",
			"owi_ref_no":               nullStr(droneOWI),
			"duration_from":            nullStr(droneDurFrom),
			"duration_to":              nullStr(droneDurTo),
			"quotation_file_url":       nullStr(droneQuotURL),
			"total_amount_with_gst":    nullFloat(droneAmtWithGST),
			"total_amount_without_gst": nullFloat(droneAmtWithoutGST),
			"financial_split":          nullStr(droneFinSplit),
			"submitted_by":             nullStr(droneSubmittedBy),
			"submitted_at":             nullStr(droneSubmittedAt),
			"members":                  members,
			"equipment":                equipment,
			"activities":               activities,
		}
	}
	if err != sql.ErrNoRows {
		log.Printf("[form_fetch] drone query error for work %d: %v", workID, err)
	}

	// ── 2. Try Industrial form ─────────────────────────────────────────────────
	var (
		indID            int64
		indOWI           sql.NullString
		indDurFrom       sql.NullString
		indDurTo         sql.NullString
		indQuotURL       sql.NullString
		indAmtWithGST    sql.NullFloat64
		indAmtWithoutGST sql.NullFloat64
		indFinSplit      sql.NullString
		indSubmittedBy   sql.NullString
		indSubmittedAt   sql.NullString
	)
	err = config.DB.QueryRow(`
		SELECT id, owi_ref_no, training_duration_from, training_duration_to,
		       quotation_file_url, total_amount_with_gst, total_amount_without_gst,
		       financial_split, submitted_by, submitted_at
		FROM consultancy_industrial_forms
		WHERE consultancy_work_id = ?
		LIMIT 1
	`, workID).Scan(
		&indID, &indOWI, &indDurFrom, &indDurTo,
		&indQuotURL, &indAmtWithGST, &indAmtWithoutGST,
		&indFinSplit, &indSubmittedBy, &indSubmittedAt,
	)
	if err == nil {
		members := fetchIndustrialMembers(indID)
		travelPlans := fetchIndustrialTravelPlans(indID)
		additionalResources := fetchIndustrialAdditionalResources(indID)
		return map[string]interface{}{
			"form_type":                "industrial_project",
			"owi_ref_no":               nullStr(indOWI),
			"duration_from":            nullStr(indDurFrom),
			"duration_to":              nullStr(indDurTo),
			"quotation_file_url":       nullStr(indQuotURL),
			"total_amount_with_gst":    nullFloat(indAmtWithGST),
			"total_amount_without_gst": nullFloat(indAmtWithoutGST),
			"financial_split":          nullStr(indFinSplit),
			"submitted_by":             nullStr(indSubmittedBy),
			"submitted_at":             nullStr(indSubmittedAt),
			"members":                  members,
			"travel_plans":             travelPlans,
			"additional_resources":     additionalResources,
		}
	}
	if err != sql.ErrNoRows {
		log.Printf("[form_fetch] industrial query error for work %d: %v", workID, err)
	}

	// ── 3. Try Declaration form ────────────────────────────────────────────────
	var (
		declID            int64
		declOWI           sql.NullString
		declDurFrom       sql.NullString
		declDurTo         sql.NullString
		declQuotURL       sql.NullString
		declAmtWithGST    sql.NullFloat64
		declAmtWithoutGST sql.NullFloat64
		declFinSplit      sql.NullString
		declSubmittedBy   sql.NullString
		declSubmittedAt   sql.NullString
	)
	err = config.DB.QueryRow(`
		SELECT id, owi_ref_no, project_duration_from, project_duration_to,
		       quotation_report_file_url, total_amount_with_gst, total_amount_without_gst,
		       financial_split, submitted_by, submitted_at
		FROM consultancy_declaration_forms
		WHERE consultancy_work_id = ?
		LIMIT 1
	`, workID).Scan(
		&declID, &declOWI, &declDurFrom, &declDurTo,
		&declQuotURL, &declAmtWithGST, &declAmtWithoutGST,
		&declFinSplit, &declSubmittedBy, &declSubmittedAt,
	)
	if err == nil {
		members := fetchDeclarationMembers(declID)
		equipment := fetchDeclarationEquipment(declID)
		activities := fetchDeclarationActivities(declID)
		return map[string]interface{}{
			"form_type":                "project_declaration",
			"owi_ref_no":               nullStr(declOWI),
			"duration_from":            nullStr(declDurFrom),
			"duration_to":              nullStr(declDurTo),
			"quotation_file_url":       nullStr(declQuotURL),
			"total_amount_with_gst":    nullFloat(declAmtWithGST),
			"total_amount_without_gst": nullFloat(declAmtWithoutGST),
			"financial_split":          nullStr(declFinSplit),
			"submitted_by":             nullStr(declSubmittedBy),
			"submitted_at":             nullStr(declSubmittedAt),
			"members":                  members,
			"equipment":                equipment,
			"activities":               activities,
		}
	}
	if err != sql.ErrNoRows {
		log.Printf("[form_fetch] declaration query error for work %d: %v", workID, err)
	}

	return nil
}

// ── Null helpers ───────────────────────────────────────────────────────────────

func nullStr(n sql.NullString) string {
	if n.Valid {
		return n.String
	}
	return ""
}

func nullFloat(n sql.NullFloat64) float64 {
	if n.Valid {
		return n.Float64
	}
	return 0
}

// ── Drone sub-table fetchers ───────────────────────────────────────────────────

func fetchDroneMembers(formID int64) []map[string]interface{} {
	rows, err := config.DB.Query(`
		SELECT s_no, name, designation, department, financial_split, amount
		FROM consultancy_drone_members WHERE form_id = ? ORDER BY s_no`, formID)
	if err != nil {
		return []map[string]interface{}{}
	}
	defer rows.Close()
	var out []map[string]interface{}
	for rows.Next() {
		var sno int
		var name, desig, dept, finSplit string
		var amount sql.NullFloat64
		if err := rows.Scan(&sno, &name, &desig, &dept, &finSplit, &amount); err != nil {
			continue
		}
		out = append(out, map[string]interface{}{
			"s_no": sno, "name": name, "designation": desig,
			"department": dept, "financial_split": finSplit, "amount": nullFloat(amount),
		})
	}
	if out == nil {
		return []map[string]interface{}{}
	}
	return out
}

func fetchDroneEquipment(formID int64) []map[string]interface{} {
	rows, err := config.DB.Query(`
		SELECT item, calibration_done_readily_available, requires_maintenance
		FROM consultancy_drone_equipment WHERE form_id = ?`, formID)
	if err != nil {
		return []map[string]interface{}{}
	}
	defer rows.Close()
	var out []map[string]interface{}
	for rows.Next() {
		var item string
		var calib, maint bool
		if err := rows.Scan(&item, &calib, &maint); err != nil {
			continue
		}
		out = append(out, map[string]interface{}{
			"item": item, "calibration_done_readily_available": calib, "requires_maintenance": maint,
		})
	}
	if out == nil {
		return []map[string]interface{}{}
	}
	return out
}

func fetchDroneActivities(formID int64) []map[string]interface{} {
	rows, err := config.DB.Query(`
		SELECT proposed_activity, description, availability, start_date, end_date, responsible
		FROM consultancy_drone_activities WHERE form_id = ?`, formID)
	if err != nil {
		return []map[string]interface{}{}
	}
	defer rows.Close()
	var out []map[string]interface{}
	for rows.Next() {
		var activity, desc, avail, responsible string
		var startDate, endDate sql.NullString
		if err := rows.Scan(&activity, &desc, &avail, &startDate, &endDate, &responsible); err != nil {
			continue
		}
		out = append(out, map[string]interface{}{
			"proposed_activity": activity, "description": desc, "availability": avail,
			"start_date": nullStr(startDate), "end_date": nullStr(endDate), "responsible": responsible,
		})
	}
	if out == nil {
		return []map[string]interface{}{}
	}
	return out
}

// ── Industrial sub-table fetchers ─────────────────────────────────────────────

func fetchIndustrialMembers(formID int64) []map[string]interface{} {
	rows, err := config.DB.Query(`
		SELECT s_no, name, designation, department, financial_split, amount
		FROM consultancy_industrial_members WHERE form_id = ? ORDER BY s_no`, formID)
	if err != nil {
		return []map[string]interface{}{}
	}
	defer rows.Close()
	var out []map[string]interface{}
	for rows.Next() {
		var sno int
		var name, desig, dept, finSplit string
		var amount sql.NullFloat64
		if err := rows.Scan(&sno, &name, &desig, &dept, &finSplit, &amount); err != nil {
			continue
		}
		out = append(out, map[string]interface{}{
			"s_no": sno, "name": name, "designation": desig,
			"department": dept, "financial_split": finSplit, "amount": nullFloat(amount),
		})
	}
	if out == nil {
		return []map[string]interface{}{}
	}
	return out
}

func fetchIndustrialTravelPlans(formID int64) []map[string]interface{} {
	rows, err := config.DB.Query(`
		SELECT proposed_activity, required_on_duty_date, travel_required,
		       requested_travel_allowance, requested_dearness_allowance, responsible_persons
		FROM consultancy_industrial_travel_plans WHERE form_id = ?`, formID)
	if err != nil {
		return []map[string]interface{}{}
	}
	defer rows.Close()
	var out []map[string]interface{}
	for rows.Next() {
		var activity, travelReq, responsible string
		var dutyDate sql.NullString
		var travelAllowance, dearnessAllowance sql.NullFloat64
		if err := rows.Scan(&activity, &dutyDate, &travelReq, &travelAllowance, &dearnessAllowance, &responsible); err != nil {
			continue
		}
		out = append(out, map[string]interface{}{
			"proposed_activity": activity, "required_on_duty_date": nullStr(dutyDate),
			"travel_required":              travelReq,
			"requested_travel_allowance":   nullFloat(travelAllowance),
			"requested_dearness_allowance": nullFloat(dearnessAllowance),
			"responsible_persons":          responsible,
		})
	}
	if out == nil {
		return []map[string]interface{}{}
	}
	return out
}

func fetchIndustrialAdditionalResources(formID int64) []map[string]interface{} {
	rows, err := config.DB.Query(`
		SELECT proposed_activity, description, availability_of_consumables, responsible_persons
		FROM consultancy_industrial_additional_resources WHERE form_id = ?`, formID)
	if err != nil {
		return []map[string]interface{}{}
	}
	defer rows.Close()
	var out []map[string]interface{}
	for rows.Next() {
		var activity, desc, avail, responsible string
		if err := rows.Scan(&activity, &desc, &avail, &responsible); err != nil {
			continue
		}
		out = append(out, map[string]interface{}{
			"proposed_activity": activity, "description": desc,
			"availability_of_consumables": avail, "responsible_persons": responsible,
		})
	}
	if out == nil {
		return []map[string]interface{}{}
	}
	return out
}

// ── Declaration sub-table fetchers ────────────────────────────────────────────

func fetchDeclarationMembers(formID int64) []map[string]interface{} {
	rows, err := config.DB.Query(`
		SELECT s_no, name, designation, department, financial_split, amount
		FROM consultancy_declaration_members WHERE form_id = ? ORDER BY s_no`, formID)
	if err != nil {
		return []map[string]interface{}{}
	}
	defer rows.Close()
	var out []map[string]interface{}
	for rows.Next() {
		var sno int
		var name, desig, dept, finSplit string
		var amount sql.NullFloat64
		if err := rows.Scan(&sno, &name, &desig, &dept, &finSplit, &amount); err != nil {
			continue
		}
		out = append(out, map[string]interface{}{
			"s_no": sno, "name": name, "designation": desig,
			"department": dept, "financial_split": finSplit, "amount": nullFloat(amount),
		})
	}
	if out == nil {
		return []map[string]interface{}{}
	}
	return out
}

func fetchDeclarationEquipment(formID int64) []map[string]interface{} {
	rows, err := config.DB.Query(`
		SELECT item, calibration_done_readily_available, requires_maintenance
		FROM consultancy_declaration_equipment WHERE form_id = ?`, formID)
	if err != nil {
		return []map[string]interface{}{}
	}
	defer rows.Close()
	var out []map[string]interface{}
	for rows.Next() {
		var item string
		var calib, maint bool
		if err := rows.Scan(&item, &calib, &maint); err != nil {
			continue
		}
		out = append(out, map[string]interface{}{
			"item": item, "calibration_done_readily_available": calib, "requires_maintenance": maint,
		})
	}
	if out == nil {
		return []map[string]interface{}{}
	}
	return out
}

func fetchDeclarationActivities(formID int64) []map[string]interface{} {
	rows, err := config.DB.Query(`
		SELECT proposed_activity, description, availability, start_date, end_date, responsible
		FROM consultancy_declaration_activities WHERE form_id = ?`, formID)
	if err != nil {
		return []map[string]interface{}{}
	}
	defer rows.Close()
	var out []map[string]interface{}
	for rows.Next() {
		var activity, desc, avail, responsible string
		var startDate, endDate sql.NullString
		if err := rows.Scan(&activity, &desc, &avail, &startDate, &endDate, &responsible); err != nil {
			continue
		}
		out = append(out, map[string]interface{}{
			"proposed_activity": activity, "description": desc, "availability": avail,
			"start_date": nullStr(startDate), "end_date": nullStr(endDate), "responsible": responsible,
		})
	}
	if out == nil {
		return []map[string]interface{}{}
	}
	return out
}
