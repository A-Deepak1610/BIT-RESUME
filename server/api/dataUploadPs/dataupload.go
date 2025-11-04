package dataUploadPs

import (
	achievementgraph "bitresume/api/dashboard/achievement_graph"
	activitygraph "bitresume/api/dashboard/activity_graph"
	pointshandlers "bitresume/api/pointsHandlers"
	"bitresume/config"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)                                  
// func UploadDataFromExcel() error {
// 	fmt.Print("Starting UploadDataFromExcel...\n")
// 	const excelPath = "data/PS SKILL STATUS.xlsx"
// 	f, err := excelize.OpenFile(excelPath)
// 	if err != nil {
// 		return fmt.Errorf("failed to open Excel file: %w", err)
// 	}
// 	defer f.Close()
// 	sheet := f.GetSheetName(0)
// 	if sheet == "" {
// 		return fmt.Errorf("no sheet found in %s", excelPath)
// 	}
// 	rows, err := f.GetRows(sheet)
// 	if err != nil {
// 		return fmt.Errorf("cannot read rows: %w", err)
// 	}
// 	stmt, err := config.DB.Prepare(`		
// 		INSERT INTO ps__status
// 			(rollno, skill_name, skill_level, attempts, status, total_levels, attempted_at)
// 		VALUES (?, ?, ?, ?, ?, 7, ?)
// 	`)
// 	if err != nil {
// 		return fmt.Errorf("prepare failed: %w", err)
// 	}
// 	defer stmt.Close()

// 	inserted := 0
// 	for i, row := range rows {
// 		if i == 0 || len(row) < 7 { // skip header or incomplete rows
// 			continue
// 		}
// 		rollno := strings.TrimSpace(row[0])
// 		dateStr := strings.TrimSpace(row[1])
// 		skillName := strings.TrimSpace(row[2])
// 		skillLevel := strings.TrimSpace(row[3])
// 		attemptStr := strings.TrimSpace(row[4])
// 		status := strings.ToLower(strings.TrimSpace(row[5]))
// 		attempts, _ := strconv.Atoi(attemptStr)

// 		switch status {
// 		case "pending":
// 			HandlePs(rollno, skillName, skillLevel, 0, dateStr)
// 		case "missed":
// 			HandlePs(rollno, skillName, skillLevel, -50, dateStr)
// 		default:
// 			rewardPoints, err := strconv.Atoi(strings.TrimSpace(row[6]))
// 			if err != nil {
// 				rewardPoints = 0
// 			}

// 			_, err = stmt.Exec(
// 				rollno,
// 				skillName,
// 				skillLevel,
// 				attempts,
// 				status,
// 				time.Now(),
// 			)
// 			if err != nil {
// 				fmt.Printf("Row %d insert error: %v\n", i+1, err)
// 				continue
// 			}

// 			HandlePs(rollno, skillName, skillLevel, rewardPoints, dateStr)
// 			inserted++
// 		}
// 	}

// 	fmt.Printf("UploadDataFromExcel completed: inserted %d rows\n", inserted)
// 	return nil
// }
func UploadDataFromExcel() error {
	fmt.Print("Starting UploadDataFromExcel...\n")
	const excelPath = "data/PS SKILL STATUS.xlsx"

	f, err := excelize.OpenFile(excelPath)
	if err != nil {
		return fmt.Errorf("failed to open Excel file: %w", err)
	}
	defer f.Close()

	sheet := f.GetSheetName(0)
	if sheet == "" {
		return fmt.Errorf("no sheet found in %s", excelPath)
	}

	rows, err := f.GetRows(sheet)
	if err != nil {
		return fmt.Errorf("cannot read rows: %w", err)
	}

	stmt, err := config.DB.Prepare(`
		INSERT INTO ps__status 
			(rollno, skill_name, skill_level, attempts, status, total_levels, attempted_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		return fmt.Errorf("prepare failed: %w", err)
	}
	defer stmt.Close()

	inserted := 0

	for i, row := range rows {
		if i == 0 || len(row) < 6 { // skip header
			continue
		}

		rollno := strings.TrimSpace(row[0])
		dateStr := strings.TrimSpace(row[1])
		idStr := strings.TrimSpace(row[2])
		attemptStr := strings.TrimSpace(row[3])
		status := strings.ToLower(strings.TrimSpace(row[4]))
		pointsStr := strings.TrimSpace(row[5])

		id, err := strconv.Atoi(idStr)
		if err != nil {
			fmt.Printf("Row %d: invalid id %s\n", i+1, idStr)
			continue
		}

		attempts, _ := strconv.Atoi(attemptStr)
		rewardPoints, _ := strconv.Atoi(pointsStr)

		// ✅ Fetch skill details from master_course
		var skillName, skillLevel string
		err = config.DB.QueryRow(`
			SELECT group_name, level_name 
			FROM master_course 
			WHERE level_id = ?`, id).Scan(&skillName, &skillLevel)
		if err != nil {
			fmt.Printf("Row %d: no skill found for id %d (%v)\n", i+1, id, err)
			continue
		}

		// ✅ Insert into ps__status
		_, err = stmt.Exec(
			rollno,
			skillName,
			skillLevel,
			attempts,
			status,
			7,               // total_levels (constant)
			time.Now(),         // attempted_at
		)
		if err != nil {
			fmt.Printf("Row %d insert error: %v\n", i+1, err)
			continue
		}

		// ✅ Handle points logic
		if status == "pending" {
			HandlePs(rollno, skillName, skillLevel, 0, dateStr)
		} else if status == "missed" {
			HandlePs(rollno, skillName, skillLevel, -50, dateStr)
		} else {
			HandlePs(rollno, skillName, skillLevel, rewardPoints, dateStr)
		}

		inserted++
	}

	fmt.Printf("UploadDataFromExcel completed: inserted %d rows\n", inserted)
	return nil
}
func HandlePs(rollno, skillname, skilllevel string, points int, dateStr string) error {
	// var data models.Ps
	currdate := dateStr
	sem := pointshandlers.GetCurrentSem(rollno)
	source := "PS"
	desc := skillname + " " + skilllevel
	now := time.Now().Format("2006-01-02")
	rank, err := activitygraph.FetchDataRank(rollno)
	if err != nil {
		log.Println("FetchDataRank error:", err)
		return err
	}
	// calculate new points
	var newpoints float64
	switch rank.Current_rank {
	case "TITANIUM":
		if points > 0 {
			newpoints = float64(points) * 0.5 / 300
		} else if points < 0 {
			newpoints = -1
		}
	case "GOLD":
		if points > 0 {
			newpoints = float64(points) / 300
		} else if points < 0 {
			newpoints = -0.5
		}
	default: // Silver or others
		if points > 0 {
			newpoints = float64(points) * 2 / 300
		} else if points < 0 {
			newpoints = -0.5
		}
	}
	newpoints = math.Round(newpoints*100) / 100
	// insert into points_logs
	stmp, err := config.DB.Prepare(`
		INSERT INTO points_logs
			(rollno, source, points, description, sem, currdate)
		VALUES (?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		log.Println("Prepare points_logs error:", err)
		return err
	}
	defer stmp.Close()
	if _, err = stmp.Exec(rollno, source, newpoints, desc, sem, currdate); err != nil {
		log.Println("Exec points_logs error:", err)
		return err
	}
	if newpoints > 0 {
		achievementgraph.HandlePointlogs2(rollno, newpoints, sem, currdate)
	}
	// update activity/achievement graphs for future dates
	if currdate != now {
		delta := newpoints
		rows, err := config.DB.Query(`
			SELECT currdate, current_point
			FROM activity_graph
			WHERE rollno = ? AND currdate >= ?
			ORDER BY currdate ASC`, rollno, currdate)
		if err != nil {
			log.Println("Query activity_graph error:", err)
			return err
		}
		defer rows.Close()

		for rows.Next() {
			var d string
			var pts float64
			if err := rows.Scan(&d, &pts); err != nil {
				log.Println("Scan row error:", err)
				continue
			}

			newPts := pts + delta
			newPts, newRank := validateRank(newPts)

			if _, err := config.DB.Exec(`
				UPDATE activity_graph
				SET current_point = ?, current_rank = ?
				WHERE rollno = ? AND currdate = ?`,
				newPts, newRank, rollno, d); err != nil {
				log.Println("Update activity_graph error:", err)
			}

			if d == currdate {
				_, err = config.DB.Exec(`
					UPDATE achievement_graph
					SET points_earned = points_earned + ?,
						cummulative_points = cummulative_points + ?
					WHERE rollno = ? AND currdate = ?`,
					delta, delta, rollno, d)
			} else {
				_, err = config.DB.Exec(`
					UPDATE achievement_graph
					SET cummulative_points = cummulative_points + ?
					WHERE rollno = ? AND currdate = ?`,
					delta, rollno, d)
			}
			if err != nil {
				log.Println("Update achievement_graph error:", err)
			}
		}
		if err := rows.Err(); err != nil {
			log.Println("Row iteration error:", err)
		}
	}
	return nil
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
func GetPsStatus(c *gin.Context) {
	rollno := c.Param("rollno")
	rows, err := config.DB.Query(
		`SELECT rollno, skill_name, skill_level, attempts, total_levels
		 FROM ps__status
		 WHERE rollno = ?`,
		rollno,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Query failed: " + err.Error()})
		return
	}
	defer rows.Close()
	type PsStatus struct {
		RollNo     string `json:"roll_no"`
		SkillName  string `json:"skill_name"`
		SkillLevel int    `json:"skill_level"`
		Attempts   int    `json:"attempts"`
		TotalLevel int    `json:"total_level"`
	}
	var results []PsStatus
	for rows.Next() {
		var ps PsStatus
		if err := rows.Scan(&ps.RollNo, &ps.SkillName, &ps.SkillLevel, &ps.Attempts, &ps.TotalLevel); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Row scan failed: " + err.Error()})
			return
		}
		results = append(results, ps)
	}
	if len(results) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No records found for rollno: " + rollno})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"roll_no": rollno,
		"data":    results,
	})
}
func BulkUploadHandler(c *gin.Context) {
	// The uploaded file will come in the "file" field
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded: " + err.Error()})
		return
	}
	const destPath = "data/PS SKILL STATUS.xlsx"
	if err := os.MkdirAll(filepath.Dir(destPath), os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create data directory: " + err.Error()})
		return
	}
	// Remove old file if it exists (optional: you can overwrite without removing)
	if _, err := os.Stat(destPath); err == nil {
		if err := os.Remove(destPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove old file: " + err.Error()})
			return
		}
	}
	// Save the new file
	if err := c.SaveUploadedFile(file, destPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save new file: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": fmt.Sprintf("New Excel sheet uploaded and replaced successfully: %s", file.Filename),
	})
}
