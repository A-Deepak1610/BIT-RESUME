package resume

import (
	"bitresume/config"
	"bitresume/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetCertificatesData(c *gin.Context) {
	role := c.GetString("role")
	var rollno string
	if role == "student" {
		rollno = c.GetString("rollNo")
	} else if role == "faculty" || role == "Admin" {
		rollno = c.Param("rollno")
		if rollno == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "rollno query parameter required for faculty"})
			return
		}
	} else {
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorized role"})
		return
	}
	var certificates []models.Certificates

	// Fetch online courses certificates only
	rows, err := config.DB.Query(`
		SELECT title, platform, issue_date, linkedin_link 
		FROM certificate_onlinecourses coc 
		JOIN certificates_type ct ON coc.certiificate_id = ct.id 
		AND ct.rollno = ? AND status = 'Verified' order by coc.issue_date desc
	`, rollno)
	if err != nil {
		fmt.Print("error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not fetch the data from certificate_onlinecourses table"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var p models.Certificates

		err = rows.Scan(&p.Title, &p.Platform, &p.IssueDate, &p.LinkedinLink)
		if err != nil {
			fmt.Print("Error:", err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"message": "Could not scan the data from certificate_onlinecourses table"})
			return
		}
		certificates = append(certificates, p)
	}

	c.JSON(http.StatusAccepted, certificates)
}
