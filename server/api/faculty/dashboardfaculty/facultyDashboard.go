package dashBoardfaculty

import (
	"bitresume/config"

	"github.com/gin-gonic/gin"
)

func Leaderboard(c *gin.Context) {
	query := `SELECT
		l.rollno,
		l.user_name,
		l.department,
		COALESCE(p.project_count, 0) AS project_count,
		COALESCE(i.internship_count, 0) AS internship_count,
		COALESCE(cert.certificate_count, 0) AS certificate_count,
		COALESCE(pp.paper_count, 0) AS paper_count,
		COALESCE(pat.patent_count, 0) AS patent_count,
		(COALESCE(p.project_count, 0) + COALESCE(i.internship_count, 0) + COALESCE(cert.certificate_count, 0) + COALESCE(pp.paper_count, 0) + COALESCE(pat.patent_count, 0)) AS total_uploads
	FROM
		login l
	LEFT JOIN (
		SELECT rollno, COUNT(*) AS project_count FROM projects GROUP BY rollno
	) AS p ON l.rollno = p.rollno
	LEFT JOIN (
		SELECT rollno, COUNT(*) AS internship_count FROM internships GROUP BY rollno
	) AS i ON l.rollno = i.rollno
	LEFT JOIN (
		SELECT rollno, COUNT(*) AS certificate_count FROM certificates_type GROUP BY rollno
	) AS cert ON l.rollno = cert.rollno
	LEFT JOIN (
		SELECT rollno, COUNT(*) AS paper_count FROM paperpresentation GROUP BY rollno
	) AS pp ON l.rollno = pp.rollno
	LEFT JOIN (
		SELECT rollno, COUNT(*) AS patent_count FROM patents GROUP BY rollno
	) AS pat ON l.rollno = pat.rollno
	WHERE l.mentor_id = ?
	ORDER BY total_uploads DESC
	`
	rows, err := config.DB.Query(query, c.Param("rollno"))
	if err != nil {
		c.JSON(500, gin.H{"error": "Database query failed", "details": err.Error()})
		return
	}
	defer rows.Close()
	var results []struct {
		RollNo           string `json:"rollno"`
		Name             string `json:"user_name"`
		Department       string `json:"department"`
		ProjectCount     int    `json:"project_count"`
		InternshipCount  int    `json:"internship_count"`
		CertificateCount int    `json:"certificate_count"`
		PaperCount       int    `json:"paper_count"`
		PatentCount      int    `json:"patent_count"`
		TotalUploads     int    `json:"total_uploads"`
	}
	for rows.Next() {
		var result struct {
			RollNo           string `json:"rollno"`
			Name             string `json:"user_name"`
			Department       string `json:"department"`
			ProjectCount     int    `json:"project_count"`
			InternshipCount  int    `json:"internship_count"`
			CertificateCount int    `json:"certificate_count"`
			PaperCount       int    `json:"paper_count"`
			PatentCount      int    `json:"patent_count"`
			TotalUploads     int    `json:"total_uploads"`
		}
		if err := rows.Scan(&result.RollNo, &result.Name, &result.Department, &result.ProjectCount, &result.InternshipCount, &result.CertificateCount, &result.PaperCount, &result.PatentCount, &result.TotalUploads); err != nil {
			c.JSON(500, gin.H{"error": "Failed to scan row", "details": err.Error()})
			return
		}
		results = append(results, result)
	}
	c.JSON(200, gin.H{"leaderboard": results})
}
func HandlePriorityLearners(c *gin.Context) {
	query := `SELECT
    ag.rollno,
    l.user_name,
    l.department,
    ag.current_point,
    ag.current_rank,
    COALESCE(p.project_count, 0) AS project_count
	FROM
		activity_graph ag
	INNER JOIN (
		SELECT
			rollno,
			MAX(currdate) AS max_date
		FROM
			activity_graph
		GROUP BY
			rollno
	) AS latest 
		ON ag.rollno = latest.rollno 
		AND ag.currdate = latest.max_date
	JOIN login l 
		ON ag.rollno = l.rollno 
		AND l.mentor_id = ?
	LEFT JOIN (
		SELECT 
			rollno, 
			COUNT(*) AS project_count
		FROM 
			projects       
		GROUP BY 
			rollno
	) AS p 
		ON ag.rollno = p.rollno where ag.current_rank='silver' order by current_point`
	rows, err := config.DB.Query(query, c.Param("rollno"))
	if err != nil {
		c.JSON(500, gin.H{"error": "Database query failed", "details": err.Error()})
		return
	}
	defer rows.Close()
	var results []struct {
		RollNo       string  `json:"rollno"`
		Name         string  `json:"user_name"`
		Department   string  `json:"department"`
		CurrentPoint float32 `json:"current_point"`
		CurrentRank  string  `json:"current_rank"`
		ProjectCount int     `json:"project_count"`
	}
	for rows.Next() {
		var result struct {
			RollNo       string  `json:"rollno"`
			Name         string  `json:"user_name"`
			Department   string  `json:"department"`
			CurrentPoint float32 `json:"current_point"`
			CurrentRank  string  `json:"current_rank"`
			ProjectCount int     `json:"project_count"`
		}
		if err := rows.Scan(&result.RollNo, &result.Name, &result.Department, &result.CurrentPoint, &result.CurrentRank, &result.ProjectCount); err != nil {
			c.JSON(500, gin.H{"error": "Failed to scan row", "details": err.Error()})
			return
		}
		results = append(results, result)
		c.JSON(200, gin.H{"prioritylearners": results})
	}
}
