package pointshandlers

import (
	achievementgraph "bitresume/api/dashboard/achievement_graph"
	activitygraph "bitresume/api/dashboard/activity_graph"
	"bitresume/config"
	"bitresume/models"
	"math"
	"net/http"
	"github.com/gin-gonic/gin"
)

// Main function for points if points is come by his activity
func HandlePointlogs(rollno, source string, points int, desc string, sem int, currdate string) error { //This is for all other than ps
	var newpoints float64
	rank, rankerr := activitygraph.FetchDataRank(rollno)
	if rankerr != nil {
		return rankerr
	}
	if source == "PS" {
		// HandlePs(rollno)
		if rank.Current_rank == "TITANIUM" {
			if points > 0 {
				newpoints = float64(points) * 0.5 / 300.0
			} else if points == 0 {
				newpoints = 0
			} else {
				newpoints = -1

			}
		} else if rank.Current_rank == "GOLD" {
			if points > 0 {
				newpoints = float64(points) * 1 / 300.0
			} else if points == 0 {
				newpoints = 0
			} else {
				newpoints = -0.5
			}
		} else {
			if points > 0 {
				newpoints = float64(points) * 2 / 300.0
			} else if points == 0 {
				newpoints = 0
			} else {
				newpoints = -0.5
			}
		}
	}
	newpoints = math.Round(newpoints*100) / 100
	stmp, reqerr := config.DB.Prepare("INSERT INTO points_logs(rollno,source,points,description,sem,currdate) values (?,?,?,?,?,?)")
	if reqerr != nil {
		return reqerr
	}
	_, execErr := stmp.Exec(rollno, source, newpoints, desc, sem, currdate)
	if execErr != nil {
		return execErr
	}
	if points > 0 {
		achievementgraph.HandlePointlogs2(rollno, newpoints, sem, currdate) //to calculate the achievement points
	}
	return nil
}
func HandlePsLevelStatus(c *gin.Context) {
	var data models.PsLevels
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 1. Check if record exists
	var exists bool
	query := `SELECT EXISTS (
		SELECT 1 FROM ps_level_status 
		WHERE rollno = ? AND skilldomain = ? AND skillname = ?
	)`
	err := config.DB.QueryRow(query, data.RollNo, data.SkillDomain, data.SkillName).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check record"})
		return
	}
	if exists {
		// 2. Update if exists
		updateQuery := `
			UPDATE ps_level_status 
			SET levels_completed = ?, total_levels = ?, updated_at = NOW() 
			WHERE rollno = ? AND skilldomain = ? AND skillname = ?
		`
		_, err := config.DB.Exec(updateQuery, data.SkillLevel, data.TotalLevels, data.RollNo, data.SkillDomain, data.SkillName)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update record"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Skill updated successfully"})
	} else {
		// 3. Insert if not exists
		insertQuery := `
			INSERT INTO ps_level_status (rollno, skilldomain, skillname, levels_completed, total_levels, created_at)
			VALUES (?, ?, ?, ?, ?, NOW())
		`
		_, err := config.DB.Exec(insertQuery, data.RollNo, data.SkillDomain, data.SkillName, data.SkillLevel, data.TotalLevels)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert new skill"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "New skill added"})
	}
}
func HandleFetchPsAttempts(c *gin.Context) {
	var records []models.Ps
	// var r models.Ps
	rollno := c.Param("rollno")
	rows, err := config.DB.Query("SELECT  skill_domain, skill_name, skill_level, attempts FROM ps_status WHERE rollno = ?", rollno)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	for rows.Next() {
		var r models.Ps
		err := rows.Scan(&r.SkillDomain, &r.SkillName, &r.SkillLevel, &r.Attempts)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		records = append(records, r)
	}
	c.JSON(http.StatusAccepted, records)
}
func HandleFetchPsLevels(c *gin.Context) {
	role := c.GetString("role")
	var rollno string
    if role == "student" {
        rollno = c.GetString("rollNo")   // set by middleware from cookie
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

	// Inline model representing one PS status row
	type PsStatus struct {
		ID          int64   `json:"id" db:"id"`
		RollNo      string  `json:"rollno" db:"rollno"`
		SkillName   string  `json:"skill_name" db:"skill_name"`
		SkillLevel  string  `json:"skill_level" db:"skill_level"`
		Attempts    int     `json:"attempts" db:"attempts"`
		Status      string  `json:"status" db:"status"`
		TotalLevels int     `json:"total_levels" db:"total_levels"`
		AttemptedAt string  `json:"attempted_at" db:"attempted_at"`
	}

	const query = `
		SELECT t.*
		FROM ps__status t
		JOIN (
			SELECT skill_name,
			       skill_level,
			       MAX(id) AS max_id
			FROM ps__status
			WHERE rollno = ?
			GROUP BY skill_name, skill_level
		) AS latest
		ON t.id = latest.max_id
		ORDER BY t.skill_name, t.skill_level
	`

	rows, err := config.DB.Query(query, rollno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed: " + err.Error()})
		return
	}
	defer rows.Close()

	var results []PsStatus
	for rows.Next() {
		var r PsStatus
		err := rows.Scan(
			&r.ID,
			&r.RollNo,
			&r.SkillName,
			&r.SkillLevel,
			&r.Attempts,
			&r.Status,
			&r.TotalLevels,
			&r.AttemptedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "scan failed: " + err.Error()})
			return
		}
		results = append(results, r)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "rows error: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"rollno": rollno,
		"data":   results,
	})
}
func HandleSemDays(c *gin.Context) {
	var results []models.SemCount
	rows, err := config.DB.Query("SELECT sem, COUNT(*) as sem_count FROM activity_graph GROUP BY sem ORDER BY sem")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed", "details": err.Error()})
		return
	}
	defer rows.Close()
	for rows.Next() {
		var sc models.SemCount
		if err := rows.Scan(&sc.Sem, &sc.SemCount); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse database result", "details": err.Error()})
			return
		}
		results = append(results, sc)
	}

	c.JSON(http.StatusOK, results)
}
func validateRank(points float64) (float64, string) {
	switch {
	case points >= 90:
		if points > 100 {
			points = 100
		}
		return points, "TITANIUM"
	case points >= 80:
		if points > 89 {
			points = 89
		}
		return points, "GOLD"
	case points >= 70:
		if points > 79 {
			points = 79
		}
		return points, "SILVER"
	default:
		if points < 70 {
			points = 70
		}
		return points, "BELOW"
	}
}
