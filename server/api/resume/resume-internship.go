// /api/resume/internship.go

package resume

import (
	"bitresume/config"
	"bitresume/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetInternshipData(c *gin.Context) {
	role := c.GetString("role")
	var rollno string
    if role == "student" {
        rollno = c.GetString("rollNo")
    } else if role == "faculty" ||role=="Admin" {
        rollno = c.Param("rollno")
        if rollno == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "rollno query parameter required for faculty"})
            return
        }
    } else {
        c.JSON(http.StatusForbidden, gin.H{"error": "unauthorized role"})
        return
    }
	var internships []models.Internship

	rows, err := config.DB.Query("SELECT company_name, domain, start_date, end_date, is_stipend, roll, COALESCE(skill_gained, '') as skill_gained, COALESCE(outcomes, '') as outcomes FROM internships WHERE rollno = ? AND status = 'Approved'  order by end_date desc", rollno)
	if err != nil {
		fmt.Print("error:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not execute query on internships table"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		// 1. Declare variables to scan into. Dates are simple strings.
		var companyName, domain, role, startDate, endDate, skillGained, outcomes string
		var isStipend int

		// 2. Scan all columns. Dates are now read as plain strings.
		err = rows.Scan(&companyName, &domain, &startDate, &endDate, &isStipend, &role, &skillGained, &outcomes)
		if err != nil {
			fmt.Print("Error scanning internship row:", err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"message": "Could not scan the data from internships table"})
			return
		}

		// 3. Create the struct. The Duration is now a simple combination of the two strings.
		internship := models.Internship{
			CompanyName:  companyName,
			Domain:       domain,
			Roll:         role,
			Duration:     startDate + " to " + endDate, // e.g., "2025-05-22 to 2025-05-30"
			IsPaid:       (isStipend == 1),
			SkillGained:  skillGained,
			Outcomes:     outcomes,
		}

		internships = append(internships, internship)
	}

	if err = rows.Err(); err != nil {
		fmt.Print("Error during row iteration:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": "Error processing internship data rows"})
		return
	}

	// 4. Send the successful response.
	c.JSON(http.StatusOK, internships)
}
