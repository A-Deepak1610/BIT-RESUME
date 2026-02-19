package resume

import (
	"bitresume/config"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetHackathonData(c *gin.Context) {
	role := c.GetString("role")
	var rollno string
	switch role {
	case "student":
		rollno = c.GetString("rollNo")
	case "faculty", "Admin":
		rollno = c.Param("rollno")
		if rollno == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "rollno query parameter required for faculty"})
			return
		}
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorized role"})
		return
	}
	query := `
        SELECT e.image_url, e.event_name, ce.did_you_win, COALESCE(ce.summary, '') as summary
        FROM certificates_events ce
        JOIN events e ON ce.event_code = e.event_code
        JOIN certificates_type ct ON ct.id = ce.certificate_id
        WHERE ce.rollno = ? AND ct.status = 'Verified' order by ce.submission_date desc
    `

	rows, err := config.DB.Query(query, rollno)
	if err != nil {
		fmt.Println("error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not execute query on hackathon table"})
		return
	}
	defer rows.Close()

	// define slice
	var results []struct {
		ImgUrl    string `json:"img_url"`
		EventName string `json:"event_name"`
		DidYouWin string `json:"did_you_win"`
		Summary   string `json:"summary"`
	}

	for rows.Next() {
		var result struct {
			ImgUrl    string `json:"img_url"`
			EventName string `json:"event_name"`
			DidYouWin string `json:"did_you_win"`
			Summary   string `json:"summary"`
		}

		if err := rows.Scan(&result.ImgUrl, &result.EventName, &result.DidYouWin, &result.Summary); err != nil {
			c.JSON(500, gin.H{"error": "Failed to scan row", "details": err.Error()})
			return
		}

		results = append(results, result)
	}

	// Return empty array if no rows found (instead of 404)
	if results == nil {
		results = []struct {
			ImgUrl    string `json:"img_url"`
			EventName string `json:"event_name"`
			DidYouWin string `json:"did_you_win"`
			Summary   string `json:"summary"`
		}{}
	}

	c.JSON(http.StatusOK, results)
}
