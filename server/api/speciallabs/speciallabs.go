package speciallabs

import (
	"bitresume/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SpecialLab represents a special lab record
type SpecialLab struct {
	ID      int    `json:"id"`
	LabName string `json:"lab_name"`
}

// GetSpecialLabs fetches all special labs from the database
func GetSpecialLabs(c *gin.Context) {
	var labs []SpecialLab

	query := `SELECT id, lab_name FROM speciallabs ORDER BY lab_name ASC`

	rows, err := config.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch special labs",
			"details": err.Error(),
		})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var lab SpecialLab
		if err := rows.Scan(&lab.ID, &lab.LabName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to scan special lab",
				"details": err.Error(),
			})
			return
		}
		labs = append(labs, lab)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error iterating special labs",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"labs":    labs,
		"count":   len(labs),
	})
}
