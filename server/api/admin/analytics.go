package admin

import (
	"bitresume/config"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// AnalyticsRecord represents a single upload record with student details
type AnalyticsRecord struct {
	ID          int64   `json:"id"`
	Category    string  `json:"category"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Status      string  `json:"status"`
	UploadDate  string  `json:"upload_date"`
	Rollno      string  `json:"rollno"`
	StudentName string  `json:"student_name"`
	Year        string  `json:"year"`
	Batch       string  `json:"batch"`
	Department  string  `json:"department"`
	Subtype     *string `json:"subtype,omitempty"`
}

// DateWiseCount represents count of uploads per date
type DateWiseCount struct {
	Date         string `json:"date"`
	Projects     int    `json:"projects"`
	Certificates int    `json:"certificates"`
	Hackathons   int    `json:"hackathons"`
	Internships  int    `json:"internships"`
	Papers       int    `json:"papers"`
	Patents      int    `json:"patents"`
	Total        int    `json:"total"`
}

// AnalyticsResponse represents the complete analytics response
type AnalyticsResponse struct {
	DateWiseCounts []DateWiseCount   `json:"date_wise_counts"`
	Records        []AnalyticsRecord `json:"records"`
	Summary        CategorySummary   `json:"summary"`
}

// CategorySummary represents total counts per category
type CategorySummary struct {
	Projects     int `json:"projects"`
	Certificates int `json:"certificates"`
	Hackathons   int `json:"hackathons"`
	Internships  int `json:"internships"`
	Papers       int `json:"papers"`
	Patents      int `json:"patents"`
	Total        int `json:"total"`
}

// GetAnalytics returns date-wise analytics with optional year filter
func GetAnalytics(c *gin.Context) {
	yearFilter := c.Query("year")         // Filter by student year (e.g., "II", "III", "IV")
	categoryFilter := c.Query("category") // Filter by category
	startDate := c.Query("start_date")    // Start date filter
	endDate := c.Query("end_date")        // End date filter
	rollnoFilter := c.Query("rollno")     // Filter by roll number

	records := []AnalyticsRecord{}
	dateWiseCounts := []DateWiseCount{}

	// Build the main query for all records
	query := `
		SELECT * FROM (
			-- Projects
			SELECT 
				p.id,
				'projects' AS category,
				COALESCE(p.title_idea, '') AS title,
				COALESCE(p.summary, '') AS description,
				CASE 
					WHEN p.approval_status = 'Approved' THEN 'Approved'
					WHEN p.approval_status = 'Rejected' THEN 'Rejected'
					ELSE 'Pending'
				END AS status,
				DATE(p.created_at) AS upload_date,
				p.rollno,
				COALESCE(l.user_name, '') AS student_name,
				COALESCE(l.year, '') AS year,
				COALESCE(l.batch, '') AS batch,
				COALESCE(l.department, '') AS department,
				NULL AS subtype
			FROM projects p
			LEFT JOIN login l ON p.rollno = l.rollno
			WHERE 1=1
			
			UNION ALL
			
			-- Internships
			SELECT 
				i.id,
				'internships' AS category,
				COALESCE(i.company_name, '') AS title,
				COALESCE(i.domain, '') AS description,
				CASE 
					WHEN i.status = 'Approved' THEN 'Approved'
					WHEN i.status = 'Rejected' THEN 'Rejected'
					ELSE 'Pending'
				END AS status,
				DATE(i.submitted_on) AS upload_date,
				i.rollno,
				COALESCE(l.user_name, '') AS student_name,
				COALESCE(l.year, '') AS year,
				COALESCE(l.batch, '') AS batch,
				COALESCE(l.department, '') AS department,
				NULL AS subtype
			FROM internships i
			LEFT JOIN login l ON i.rollno = l.rollno
			WHERE 1=1
			
			UNION ALL
			
			-- Paper Presentations
			SELECT 
				pp.id,
				'papers' AS category,
				COALESCE(pp.paper_title, '') AS title,
				COALESCE(pp.conference_title, '') AS description,
				CASE 
					WHEN pp.approval_status = 'Approved' THEN 'Approved'
					WHEN pp.approval_status = 'Rejected' OR pp.approval_status = 'Not Approved' THEN 'Rejected'
					ELSE 'Pending'
				END AS status,
				DATE(pp.submitted_on) AS upload_date,
				pp.rollno,
				COALESCE(l.user_name, '') AS student_name,
				COALESCE(l.year, '') AS year,
				COALESCE(l.batch, '') AS batch,
				COALESCE(l.department, '') AS department,
				NULL AS subtype
			FROM paperpresentation pp
			LEFT JOIN login l ON pp.rollno = l.rollno
			WHERE 1=1
			
			UNION ALL
			
			-- Patents
			SELECT 
				pat.id,
				'patents' AS category,
				COALESCE(pat.title, '') AS title,
				COALESCE(pat.summary, '') AS description,
				CASE 
					WHEN pat.patent_status = 'Approved' THEN 'Approved'
					WHEN pat.patent_status = 'Rejected' THEN 'Rejected'
					ELSE 'Pending'
				END AS status,
				DATE(pat.submission_date) AS upload_date,
				pat.rollno,
				COALESCE(l.user_name, '') AS student_name,
				COALESCE(l.year, '') AS year,
				COALESCE(l.batch, '') AS batch,
				COALESCE(l.department, '') AS department,
				NULL AS subtype
			FROM patents pat
			LEFT JOIN login l ON pat.rollno = l.rollno
			WHERE 1=1
			
			UNION ALL
			
			-- Certificates - Online Courses
			SELECT 
				ct.id,
				'certificates' AS category,
				COALESCE(coc.title, '') AS title,
				COALESCE(coc.platform, '') AS description,
				CASE 
					WHEN ct.status = 'Verified' THEN 'Approved'
					WHEN ct.status = 'Rejected' THEN 'Rejected'
					ELSE 'Pending'
				END AS status,
				DATE(ct.created_at) AS upload_date,
				ct.rollno,
				COALESCE(l.user_name, '') AS student_name,
				COALESCE(l.year, '') AS year,
				COALESCE(l.batch, '') AS batch,
				COALESCE(l.department, '') AS department,
				'Online Course' AS subtype
			FROM certificates_type ct
			JOIN certificate_onlinecourses coc ON ct.id = coc.certiificate_id
			LEFT JOIN login l ON ct.rollno = l.rollno
			WHERE ct.certificate_type = 'online-course'
			
			UNION ALL
			
			-- Certificates - Events/Hackathons (JOIN with events table to get event_name)
			SELECT 
				ct.id,
				'hackathons' AS category,
				COALESCE(e.event_name, '') AS title,
				CONCAT('Won: ', COALESCE(ce.did_you_win, 'N/A'), ' | ', COALESCE(ce.summary, '')) AS description,
				CASE 
					WHEN ct.status = 'Verified' THEN 'Approved'
					WHEN ct.status = 'Rejected' THEN 'Rejected'
					ELSE 'Pending'
				END AS status,
				DATE(ce.submission_date) AS upload_date,
				ct.rollno,
				COALESCE(l.user_name, '') AS student_name,
				COALESCE(l.year, '') AS year,
				COALESCE(l.batch, '') AS batch,
				COALESCE(l.department, '') AS department,
				COALESCE(ce.did_you_win, '') AS subtype
			FROM certificates_events ce
			JOIN events e ON ce.event_code = e.event_code
			JOIN certificates_type ct ON ct.id = ce.certificate_id
			LEFT JOIN login l ON ct.rollno = l.rollno
			WHERE ct.certificate_type = 'hackathon'
			
			UNION ALL
			
			-- Certificates - Volunteering
			SELECT 
				ct.id,
				'certificates' AS category,
				COALESCE(cv.activity_type, '') AS title,
				COALESCE(cv.summary, '') AS description,
				CASE 
					WHEN ct.status = 'Verified' THEN 'Approved'
					WHEN ct.status = 'Rejected' THEN 'Rejected'
					ELSE 'Pending'
				END AS status,
				DATE(cv.submission_date) AS upload_date,
				ct.rollno,
				COALESCE(l.user_name, '') AS student_name,
				COALESCE(l.year, '') AS year,
				COALESCE(l.batch, '') AS batch,
				COALESCE(l.department, '') AS department,
				'Volunteering' AS subtype
			FROM certificates_type ct
			JOIN certificates_voluntree cv ON ct.id = cv.certificate_id
			LEFT JOIN login l ON ct.rollno = l.rollno
			WHERE ct.certificate_type = 'Volunteering'
		) AS combined
		WHERE 1=1
	`

	args := []interface{}{}

	// Apply year filter
	if yearFilter != "" {
		query += " AND year = ?"
		args = append(args, yearFilter)
	}

	// Apply rollno filter
	if rollnoFilter != "" {
		query += " AND rollno = ?"
		args = append(args, rollnoFilter)
	}

	// Apply category filter
	if categoryFilter != "" {
		query += " AND category = ?"
		args = append(args, categoryFilter)
	}

	// Apply date range filter
	if startDate != "" {
		query += " AND upload_date >= ?"
		args = append(args, startDate)
	}
	if endDate != "" {
		query += " AND upload_date <= ?"
		args = append(args, endDate)
	}

	query += " ORDER BY upload_date DESC"

	rows, err := config.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch analytics data: " + err.Error()})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var record AnalyticsRecord
		var studentName, year, batch, department *string
		var subtype *string
		err := rows.Scan(
			&record.ID,
			&record.Category,
			&record.Title,
			&record.Description,
			&record.Status,
			&record.UploadDate,
			&record.Rollno,
			&studentName,
			&year,
			&batch,
			&department,
			&subtype,
		)
		if err != nil {
			fmt.Println("Error scanning row:", err)
			continue
		}
		if studentName != nil {
			record.StudentName = *studentName
		}
		if year != nil {
			record.Year = *year
		}
		if batch != nil {
			record.Batch = *batch
		}
		if department != nil {
			record.Department = *department
		}
		record.Subtype = subtype
		records = append(records, record)
	}

	// Get date-wise counts
	dateCountQuery := `
		SELECT 
			upload_date,
			SUM(CASE WHEN category = 'projects' THEN 1 ELSE 0 END) AS projects,
			SUM(CASE WHEN category = 'certificates' THEN 1 ELSE 0 END) AS certificates,
			SUM(CASE WHEN category = 'hackathons' THEN 1 ELSE 0 END) AS hackathons,
			SUM(CASE WHEN category = 'internships' THEN 1 ELSE 0 END) AS internships,
			SUM(CASE WHEN category = 'papers' THEN 1 ELSE 0 END) AS papers,
			SUM(CASE WHEN category = 'patents' THEN 1 ELSE 0 END) AS patents,
			COUNT(*) AS total
		FROM (
			SELECT 'projects' AS category, DATE(created_at) AS upload_date, rollno FROM projects
			UNION ALL
			SELECT 'internships' AS category, DATE(submitted_on) AS upload_date, rollno FROM internships
			UNION ALL
			SELECT 'papers' AS category, DATE(submitted_on) AS upload_date, rollno FROM paperpresentation
			UNION ALL
			SELECT 'patents' AS category, DATE(submission_date) AS upload_date, rollno FROM patents
			UNION ALL
			SELECT 'certificates' AS category, DATE(ct.created_at) AS upload_date, ct.rollno 
			FROM certificates_type ct 
			WHERE ct.certificate_type IN ('Online Course', 'Volunteering')
			UNION ALL
			SELECT 'hackathons' AS category, DATE(ce.submission_date) AS upload_date, ct.rollno 
			FROM certificates_type ct 
			JOIN certificates_events ce ON ct.id = ce.certificate_id
			WHERE ct.certificate_type = 'Events'
		) AS all_uploads
		LEFT JOIN login l ON all_uploads.rollno = l.rollno
		WHERE 1=1
	`

	dateCountArgs := []interface{}{}
	if yearFilter != "" {
		dateCountQuery += " AND l.year = ?"
		dateCountArgs = append(dateCountArgs, yearFilter)
	}
	if rollnoFilter != "" {
		dateCountQuery += " AND all_uploads.rollno = ?"
		dateCountArgs = append(dateCountArgs, rollnoFilter)
	}
	if startDate != "" {
		dateCountQuery += " AND upload_date >= ?"
		dateCountArgs = append(dateCountArgs, startDate)
	}
	if endDate != "" {
		dateCountQuery += " AND upload_date <= ?"
		dateCountArgs = append(dateCountArgs, endDate)
	}

	dateCountQuery += " GROUP BY upload_date ORDER BY upload_date DESC LIMIT 30"

	dateRows, err := config.DB.Query(dateCountQuery, dateCountArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch date counts: " + err.Error()})
		return
	}
	defer dateRows.Close()

	for dateRows.Next() {
		var count DateWiseCount
		err := dateRows.Scan(
			&count.Date,
			&count.Projects,
			&count.Certificates,
			&count.Hackathons,
			&count.Internships,
			&count.Papers,
			&count.Patents,
			&count.Total,
		)
		if err != nil {
			continue
		}
		dateWiseCounts = append(dateWiseCounts, count)
	}

	// Calculate summary
	summary := CategorySummary{}
	for _, record := range records {
		switch record.Category {
		case "projects":
			summary.Projects++
		case "certificates":
			summary.Certificates++
		case "hackathons":
			summary.Hackathons++
		case "internships":
			summary.Internships++
		case "papers":
			summary.Papers++
		case "patents":
			summary.Patents++
		}
		summary.Total++
	}

	response := AnalyticsResponse{
		DateWiseCounts: dateWiseCounts,
		Records:        records,
		Summary:        summary,
	}

	c.JSON(http.StatusOK, response)
}

// GetYearsList returns list of available years for filtering
func GetYearsList(c *gin.Context) {
	query := `SELECT DISTINCT year FROM login WHERE year IS NOT NULL AND year != '' AND role = 'Student' ORDER BY year`

	rows, err := config.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch years"})
		return
	}
	defer rows.Close()

	years := []string{}
	for rows.Next() {
		var year string
		if err := rows.Scan(&year); err != nil {
			continue
		}
		years = append(years, year)
	}

	c.JSON(http.StatusOK, gin.H{"years": years})
}

// GetRollnosList returns list of available rollnos for filtering
func GetRollnosList(c *gin.Context) {
	yearFilter := c.Query("year")

	query := `SELECT DISTINCT rollno, user_name FROM login WHERE rollno IS NOT NULL AND rollno != '' AND role = 'Student'`
	args := []interface{}{}

	if yearFilter != "" {
		query += " AND year = ?"
		args = append(args, yearFilter)
	}

	query += " ORDER BY rollno"

	rows, err := config.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch rollnos"})
		return
	}
	defer rows.Close()

	type RollnoInfo struct {
		Rollno string `json:"rollno"`
		Name   string `json:"name"`
	}

	rollnos := []RollnoInfo{}
	for rows.Next() {
		var info RollnoInfo
		var name *string
		if err := rows.Scan(&info.Rollno, &name); err != nil {
			continue
		}
		if name != nil {
			info.Name = *name
		}
		rollnos = append(rollnos, info)
	}

	c.JSON(http.StatusOK, gin.H{"rollnos": rollnos})
}
