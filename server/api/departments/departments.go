package departments

import (
	"bitresume/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Department represents a department record
type Department struct {
	ID             int    `json:"id"`
	DepartmentName string `json:"department_name"`
}

// GetDepartments fetches all departments from the database
func GetDepartments(c *gin.Context) {
	var departments []Department

	query := `SELECT id, department_name FROM departments ORDER BY department_name ASC`

	rows, err := config.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch departments",
			"details": err.Error(),
		})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var dept Department
		if err := rows.Scan(&dept.ID, &dept.DepartmentName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to scan department",
				"details": err.Error(),
			})
			return
		}
		departments = append(departments, dept)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error iterating departments",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"departments": departments,
		"count":       len(departments),
	})
}
