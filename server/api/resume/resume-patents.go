package resume

import (
	"bitresume/config"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Patent struct {
	ID                int    `json:"id"`
	Title             string `json:"title"`
	ApplicationNumber string `json:"patent_number"`
	DateOfFiling      string `json:"filed_date"`
	Link              string `json:"link,omitempty"`
	Summary           string `json:"description"`
	UsecaseOfPatent   string `json:"usecase,omitempty"`
	PatentStatus      string `json:"status"`
}

// GetPatentsData fetches patent data for a student
func GetPatentsData(c *gin.Context) {
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
			COALESCE(title, '') as title,
			COALESCE(application_number, '') as application_number,
			COALESCE(DATE_FORMAT(date_of_filing, '%Y-%m-%d'), '') as date_of_filing,
			COALESCE(link_to_patent_listing, '') as link_to_patent_listing,
			COALESCE(summary, '') as summary,
			COALESCE(usecase_of_patent, '') as usecase_of_patent,
			COALESCE(patent_status, 'Pending') as patent_status
		FROM patents 
		WHERE rollno = ? AND patent_status = 'Approved'
		ORDER BY date_of_filing DESC
	`

	rows, err := config.DB.Query(query, rollno)
	if err != nil {
		fmt.Println("Error fetching patents:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch patents"})
		return
	}
	defer rows.Close()

	var patents []Patent

	for rows.Next() {
		var patent Patent
		var link, usecase sql.NullString

		err := rows.Scan(
			&patent.ID,
			&patent.Title,
			&patent.ApplicationNumber,
			&patent.DateOfFiling,
			&link,
			&patent.Summary,
			&usecase,
			&patent.PatentStatus,
		)
		if err != nil {
			fmt.Println("Error scanning patent row:", err)
			continue
		}

		if link.Valid {
			patent.Link = link.String
		}
		if usecase.Valid {
			patent.UsecaseOfPatent = usecase.String
		}

		patents = append(patents, patent)
	}

	if patents == nil {
		patents = []Patent{}
	}

	c.JSON(http.StatusOK, patents)
}
