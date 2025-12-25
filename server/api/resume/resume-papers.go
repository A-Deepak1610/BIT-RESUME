package resume

import (
	"bitresume/config"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PaperPresentation struct {
	ID             int    `json:"id"`
	Title          string `json:"title"`
	Conference     string `json:"conference"`
	Location       string `json:"location"`
	PresentedDate  string `json:"presented_date"`
	Award          string `json:"award,omitempty"`
	PDF            string `json:"pdf,omitempty"`
	Certificate    string `json:"certificate,omitempty"`
	ApprovalStatus string `json:"approval_status"`
}

// GetPapersData fetches paper presentation data for a student
func GetPapersData(c *gin.Context) {
	role := c.GetString("role")
	var rollno string
	if role == "student" {
		rollno = c.GetString("rollNo")
	} else if role == "faculty" || role == "Admin" {
		rollno = c.Param("rollno")
		if rollno == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "rollno parameter required"})
			return
		}
	} else {
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorized role"})
		return
	}

	query := `
		SELECT 
			id,
			COALESCE(paper_title, '') as paper_title,
			COALESCE(conference_title, '') as conference_title,
			COALESCE(location, '') as location,
			COALESCE(DATE_FORMAT(date_of_presentation, '%Y-%m-%d'), '') as date_of_presentation,
			COALESCE(award, '') as award,
			COALESCE(pdf, '') as pdf,
			COALESCE(certificate, '') as certificate,
			COALESCE(approval_status, 'Pending') as approval_status
		FROM paperpresentation 
		WHERE rollno = ? AND approval_status = 'Approved'
		ORDER BY date_of_presentation DESC
	`

	rows, err := config.DB.Query(query, rollno)
	if err != nil {
		fmt.Println("Error fetching paper presentations:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch paper presentations"})
		return
	}
	defer rows.Close()

	var papers []PaperPresentation

	for rows.Next() {
		var paper PaperPresentation
		var award, pdf, certificate sql.NullString

		err := rows.Scan(
			&paper.ID,
			&paper.Title,
			&paper.Conference,
			&paper.Location,
			&paper.PresentedDate,
			&award,
			&pdf,
			&certificate,
			&paper.ApprovalStatus,
		)
		if err != nil {
			fmt.Println("Error scanning paper row:", err)
			continue
		}

		if award.Valid {
			paper.Award = award.String
		}
		if pdf.Valid {
			paper.PDF = pdf.String
		}
		if certificate.Valid {
			paper.Certificate = certificate.String
		}

		papers = append(papers, paper)
	}

	if papers == nil {
		papers = []PaperPresentation{}
	}

	c.JSON(http.StatusOK, papers)
}
