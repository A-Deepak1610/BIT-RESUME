package admin

import (
	"bitresume/config"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

// UploadStatsResponse represents the response structure for upload statistics
type UploadStatsResponse struct {
	Data []UploadRecord `json:"data"`
}

// UploadRecord represents a single upload record with category and status
type UploadRecord struct {
	ID         int64  `json:"id"`
	Category   string `json:"category"`
	Date       string `json:"date"`
	Status     string `json:"status"`
	UploadTime string `json:"uploadTime"`
	StudentID  string `json:"studentId"`
	Title      string `json:"title"`
}

// CategoryStats represents statistics for a single category
type CategoryStats struct {
	Total    int `json:"total"`
	Approved int `json:"approved"`
	Pending  int `json:"pending"`
	Rejected int `json:"rejected"`
}

// GetDashboardStats returns upload statistics for admin dashboard
func GetDashboardStats(c *gin.Context) {
	// Get optional date filter from query params
	dateFilter := c.Query("date")            // Format: YYYY-MM-DD
	daysBack := c.DefaultQuery("days", "30") // Default to last 30 days

	var records []UploadRecord

	// Query to get all uploads with their categories and statuses
	query := `
		SELECT * FROM (
			-- Projects
			SELECT 
				p.id,
				'project' AS category,
				DATE(p.created_at) AS date,
				CASE 
					WHEN p.approval_status = 'Approved' THEN 'approved'
					WHEN p.approval_status = 'Rejected' THEN 'rejected'
					ELSE 'pending'
				END AS status,
				p.created_at AS upload_time,
				p.rollno AS student_id,
				p.title_idea AS title
			FROM projects p
			WHERE p.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			-- Internships
			SELECT 
				i.id,
				'internship' AS category,
				DATE(i.submitted_on) AS date,
				CASE 
					WHEN i.status = 'Approved' THEN 'approved'
					WHEN i.status = 'Rejected' THEN 'rejected'
					ELSE 'pending'
				END AS status,
				i.submitted_on AS upload_time,
				i.rollno AS student_id,
				i.company_name AS title
			FROM internships i
			WHERE i.submitted_on >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			-- Paper Presentations
			SELECT 
				pp.id,
				'paper' AS category,
				DATE(pp.submitted_on) AS date,
				CASE 
					WHEN pp.approval_status = 'Approved' THEN 'approved'
					WHEN pp.approval_status = 'Rejected' OR pp.approval_status = 'Not Approved' THEN 'rejected'
					ELSE 'pending'
				END AS status,
				pp.submitted_on AS upload_time,
				pp.rollno AS student_id,
				pp.paper_title AS title
			FROM paperpresentation pp
			WHERE pp.submitted_on >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			-- Patents
			SELECT 
				pat.id,
				'patent' AS category,
				DATE(pat.submission_date) AS date,
				CASE 
					WHEN pat.patent_status = 'Approved' THEN 'approved'
					WHEN pat.patent_status = 'Rejected' THEN 'rejected'
					ELSE 'pending'
				END AS status,
				pat.submission_date AS upload_time,
				pat.rollno AS student_id,
				pat.title AS title
			FROM patents pat
			WHERE pat.submission_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			-- Workshops (as seminar category)
			SELECT 
				w.id,
				'seminar' AS category,
				DATE(w.submitted_on) AS date,
				CASE 
					WHEN w.status = 'Approved' THEN 'approved'
					WHEN w.status = 'Rejected' THEN 'rejected'
					ELSE 'pending'
				END AS status,
				w.submitted_on AS upload_time,
				w.rollno AS student_id,
				w.title AS title
			FROM workshops w
			WHERE w.submitted_on >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			-- Certificates
			SELECT 
				ct.id,
				'certificate' AS category,
				DATE(ct.created_at) AS date,
				CASE 
					WHEN ct.status = 'Verified' OR ct.status = 'Approved' THEN 'approved'
					WHEN ct.status = 'Rejected' THEN 'rejected'
					ELSE 'pending'
				END AS status,
				ct.created_at AS upload_time,
				ct.rollno AS student_id,
				ct.certificate_type AS title
			FROM certificates_type ct
			WHERE ct.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
		) AS combined_uploads
		ORDER BY upload_time DESC
	`

	rows, err := config.DB.Query(query, daysBack, daysBack, daysBack, daysBack, daysBack, daysBack)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch upload statistics", "details": err.Error()})
		return
	}
	defer rows.Close()

	// Initialize as empty slice (not nil) so JSON returns [] instead of null
	records = []UploadRecord{}

	for rows.Next() {
		var record UploadRecord
		var dateStr, uploadTimeStr, studentID, title sql.NullString
		var id int64
		var category, status string

		err := rows.Scan(&id, &category, &dateStr, &status, &uploadTimeStr, &studentID, &title)
		if err != nil {
			continue
		}

		record.ID = id
		record.Category = category
		record.Status = status
		record.Date = dateStr.String
		record.UploadTime = uploadTimeStr.String
		record.StudentID = studentID.String
		record.Title = title.String

		// Apply date filter if provided
		if dateFilter != "" && record.Date != dateFilter {
			continue
		}

		records = append(records, record)
	}

	c.JSON(http.StatusOK, UploadStatsResponse{Data: records})
}

// GetCategorySummary returns summarized statistics by category
func GetCategorySummary(c *gin.Context) {
	daysBack := c.DefaultQuery("days", "30")

	type SummaryRow struct {
		Category string `json:"category"`
		Total    int    `json:"total"`
		Approved int    `json:"approved"`
		Pending  int    `json:"pending"`
		Rejected int    `json:"rejected"`
	}

	query := `
		SELECT 
			category,
			COUNT(*) AS total,
			SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved,
			SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
			SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected
		FROM (
			SELECT 'project' AS category,
				CASE WHEN approval_status = 'Approved' THEN 'approved'
					 WHEN approval_status = 'Rejected' THEN 'rejected'
					 ELSE 'pending' END AS status
			FROM projects WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			SELECT 'internship' AS category,
				CASE WHEN status = 'Approved' THEN 'approved'
					 WHEN status = 'Rejected' THEN 'rejected'
					 ELSE 'pending' END AS status
			FROM internships WHERE submitted_on >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			SELECT 'paper' AS category,
				CASE WHEN approval_status = 'Approved' THEN 'approved'
					 WHEN approval_status IN ('Rejected', 'Not Approved') THEN 'rejected'
					 ELSE 'pending' END AS status
			FROM paperpresentation WHERE submitted_on >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			SELECT 'patent' AS category,
				CASE WHEN patent_status = 'Approved' THEN 'approved'
					 WHEN patent_status = 'Rejected' THEN 'rejected'
					 ELSE 'pending' END AS status
			FROM patents WHERE submission_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			SELECT 'seminar' AS category,
				CASE WHEN status = 'Approved' THEN 'approved'
					 WHEN status = 'Rejected' THEN 'rejected'
					 ELSE 'pending' END AS status
			FROM workshops WHERE submitted_on >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
			
			UNION ALL
			
			SELECT 'certificate' AS category,
				CASE WHEN status IN ('Verified', 'Approved') THEN 'approved'
					 WHEN status = 'Rejected' THEN 'rejected'
					 ELSE 'pending' END AS status
			FROM certificates_type WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
		) AS all_uploads
		GROUP BY category
	`

	rows, err := config.DB.Query(query, daysBack, daysBack, daysBack, daysBack, daysBack, daysBack)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch category summary", "details": err.Error()})
		return
	}
	defer rows.Close()

	var summaries []SummaryRow
	for rows.Next() {
		var s SummaryRow
		if err := rows.Scan(&s.Category, &s.Total, &s.Approved, &s.Pending, &s.Rejected); err != nil {
			continue
		}
		summaries = append(summaries, s)
	}

	c.JSON(http.StatusOK, gin.H{"data": summaries})
}

// GetUserStats returns user statistics
func GetUserStats(c *gin.Context) {
	type UserStats struct {
		TotalUsers    int `json:"total"`
		ActiveUsers   int `json:"active"`
		InactiveUsers int `json:"inactive"`
		NewThisMonth  int `json:"newThisMonth"`
	}

	var stats UserStats

	// Get total users - using 'login' table (your users table)
	err := config.DB.QueryRow("SELECT COUNT(*) FROM login WHERE role = 'student'").Scan(&stats.TotalUsers)
	if err != nil {
		stats.TotalUsers = 0
	}

	// Get active users (users who have uploaded something in the last 30 days)
	activeQuery := `
		SELECT COUNT(DISTINCT rollno) FROM (
			SELECT rollno FROM projects WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
			UNION SELECT rollno FROM internships WHERE submitted_on >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
			UNION SELECT rollno FROM paperpresentation WHERE submitted_on >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
			UNION SELECT rollno FROM patents WHERE submission_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
			UNION SELECT rollno FROM workshops WHERE submitted_on >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
			UNION SELECT rollno FROM certificates_type WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
		) AS active_students
	`
	err = config.DB.QueryRow(activeQuery).Scan(&stats.ActiveUsers)
	if err != nil {
		stats.ActiveUsers = 0
	}

	stats.InactiveUsers = stats.TotalUsers - stats.ActiveUsers
	if stats.InactiveUsers < 0 {
		stats.InactiveUsers = 0
	}

	// Get new users this month - using 'login' table
	err = config.DB.QueryRow("SELECT COUNT(*) FROM login WHERE role = 'student' AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')").Scan(&stats.NewThisMonth)
	if err != nil {
		stats.NewThisMonth = 0
	}

	c.JSON(http.StatusOK, gin.H{"data": stats})
}

// FacultyPerformance represents a faculty member's approval statistics
type FacultyPerformance struct {
	Name          string  `json:"name"`
	FacultyID     string  `json:"faculty_id"`
	Total         int     `json:"total"`
	Approved      int     `json:"approved"`
	Pending       int     `json:"pending"`
	Rejected      int     `json:"rejected"`
	RejectionRate float64 `json:"rejectionRate"`
}

// GetFacultyPerformance returns performance statistics for all faculty members
func GetFacultyPerformance(c *gin.Context) {
	var performances []FacultyPerformance

	// Query to get all faculty members with their approval stats
	// Faculty are identified by users who have students assigned to them (mentor_id)
	query := `
		SELECT 
			f.user_name AS faculty_name,
			f.rollno AS faculty_id,
			COALESCE(stats.total_reviews, 0) AS total,
			COALESCE(stats.approved, 0) AS approved,
			COALESCE(stats.pending, 0) AS pending,
			COALESCE(stats.rejected, 0) AS rejected
		FROM login f
		LEFT JOIN (
			SELECT 
				l.mentor_id,
				COUNT(*) AS total_reviews,
				SUM(CASE WHEN upload_status = 'approved' THEN 1 ELSE 0 END) AS approved,
				SUM(CASE WHEN upload_status = 'pending' THEN 1 ELSE 0 END) AS pending,
				SUM(CASE WHEN upload_status = 'rejected' THEN 1 ELSE 0 END) AS rejected
			FROM (
				SELECT p.rollno,
					CASE 
						WHEN p.approval_status = 'Approved' THEN 'approved'
						WHEN p.approval_status = 'Rejected' THEN 'rejected'
						ELSE 'pending'
					END AS upload_status
				FROM projects p
				
				UNION ALL
				
				SELECT i.rollno,
					CASE 
						WHEN i.status = 'Approved' THEN 'approved'
						WHEN i.status = 'Rejected' THEN 'rejected'
						ELSE 'pending'
					END AS upload_status
				FROM internships i
				
				UNION ALL
				
				SELECT pp.rollno,
					CASE 
						WHEN pp.approval_status = 'Approved' THEN 'approved'
						WHEN pp.approval_status IN ('Rejected', 'Not Approved') THEN 'rejected'
						ELSE 'pending'
					END AS upload_status
				FROM paperpresentation pp
				
				UNION ALL
				
				SELECT pat.rollno,
					CASE 
						WHEN pat.patent_status = 'Approved' THEN 'approved'
						WHEN pat.patent_status = 'Rejected' THEN 'rejected'
						ELSE 'pending'
					END AS upload_status
				FROM patents pat
				
				UNION ALL
				
				SELECT w.rollno,
					CASE 
						WHEN w.status = 'Approved' THEN 'approved'
						WHEN w.status = 'Rejected' THEN 'rejected'
						ELSE 'pending'
					END AS upload_status
				FROM workshops w
				
				UNION ALL
				
				SELECT ct.rollno,
					CASE 
						WHEN ct.status = 'Approved' THEN 'approved'
						WHEN ct.status = 'Rejected' THEN 'rejected'
						ELSE 'pending'
					END AS upload_status
				FROM certificates_type ct
			) AS uploads
			JOIN login l ON uploads.rollno = l.rollno
			WHERE l.mentor_id IS NOT NULL
			GROUP BY l.mentor_id
		) stats ON f.rollno = stats.mentor_id
		WHERE f.role = 'faculty'
		ORDER BY stats.total_reviews DESC
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		// If the complex query fails, try a simpler approach
		simpleQuery := `
			SELECT 
				f.user_name AS faculty_name,
				f.rollno AS faculty_id,
				0 AS total,
				0 AS approved,
				0 AS pending,
				0 AS rejected
			FROM login f
			WHERE f.role = 'faculty'
			ORDER BY f.user_name
		`
		rows, err = config.DB.Query(simpleQuery)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch faculty data"})
			return
		}
	}
	defer rows.Close()

	for rows.Next() {
		var p FacultyPerformance
		if err := rows.Scan(&p.Name, &p.FacultyID, &p.Total, &p.Approved, &p.Pending, &p.Rejected); err != nil {
			continue
		}

		// Calculate rejection rate
		if p.Total > 0 {
			p.RejectionRate = float64(p.Rejected) / float64(p.Total) * 100
			// Round to 1 decimal place
			p.RejectionRate = float64(int(p.RejectionRate*10)) / 10
		} else {
			p.RejectionRate = 0
		}

		performances = append(performances, p)
	}

	// Return empty array if no data
	if performances == nil {
		performances = []FacultyPerformance{}
	}

	c.JSON(http.StatusOK, gin.H{"data": performances})
}
