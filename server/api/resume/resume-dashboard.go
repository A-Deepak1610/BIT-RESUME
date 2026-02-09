package resume

import (
	"bitresume/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DashboardStats struct {
	TotalPapers  int `json:"total_papers"`
	TotalPatents int `json:"total_patents"`
}

// GetDashboardStats fetches paper and patent counts for dashboard
func GetDashboardStats(c *gin.Context) {
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

	var stats DashboardStats

	// Count papers
	paperQuery := `SELECT COUNT(*) FROM paperpresentation WHERE rollno = ?`
	err := config.DB.QueryRow(paperQuery, rollno).Scan(&stats.TotalPapers)
	if err != nil {
		stats.TotalPapers = 0
	}

	// Count patents
	patentQuery := `SELECT COUNT(*) FROM patents WHERE rollno = ?`
	err = config.DB.QueryRow(patentQuery, rollno).Scan(&stats.TotalPatents)
	if err != nil {
		stats.TotalPatents = 0
	}

	c.JSON(http.StatusOK, stats)
}
