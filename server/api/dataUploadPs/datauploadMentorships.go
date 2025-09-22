package dataUploadPs

import (
	"bitresume/config"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

// UpdateMentorShips reads mentorships_sample.xlsx and inserts rows into
// the mentorships table, logging each inserted row to the terminal.
func UpdateMentorShips() error {
	const excelPath = "data/MENTOR-MENTEE.xlsx"

	f, err := excelize.OpenFile(excelPath)
	if err != nil {
		return fmt.Errorf("failed to open Excel file %s: %w", excelPath, err)
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
		INSERT INTO mentorships
			(mentor_rollno, mentee_rollno, skill_name, skill_level, updated_at)
		VALUES (?, ?, ?, ?, ?)
	`)
	if err != nil {
		return fmt.Errorf("prepare failed: %w", err)
	}
	defer stmt.Close()

	inserted := 0
	for i, row := range rows {
		if i == 0 {
			continue // skip header
		}
		if len(row) < 5 {
			log.Printf("Row %d skipped: not enough columns\n", i+1)
			continue
		}

		mentor := strings.TrimSpace(row[0])
		mentee := strings.TrimSpace(row[1])
		skill := strings.TrimSpace(row[2])
		level := strings.TrimSpace(row[3])
		dateStr := strings.TrimSpace(row[4])

		if mentor == "" || mentee == "" || skill == "" {
			log.Printf("Row %d skipped: missing required data\n", i+1)
			continue
		}

		var updated time.Time
		if t, err := time.Parse("2006-01-02", dateStr); err == nil {
			updated = t
		} else if serial, err := strconv.ParseFloat(dateStr, 64); err == nil {
			if d, err := excelize.ExcelDateToTime(serial, false); err == nil {
				updated = d
			} else {
				updated = time.Now()
			}
		} else {
			updated = time.Now()
		}

		// **Detailed row logging before insertion**
		log.Printf("Inserting -> Mentor:%s | Mentee:%s | Skill:%s | Level:%s | Date:%s",
			mentor, mentee, skill, level, updated.Format("2006-01-02"))

		if _, err := stmt.Exec(mentor, mentee, skill, level, updated.Format("2006-01-02")); err != nil {
			log.Printf("Row %d insert error: %v\n", i+1, err)
			continue
		}
		inserted++
	}

	log.Printf("UpdateMentorShips completed: inserted %d rows\n", inserted)
	return nil
}

func GetMentorShips(c *gin.Context) {
	rollno := c.GetString("rollNo")
	query := `SELECT
		m.mentor_rollno,
		m.skill_name,
		COUNT(*) AS mentee_count,
		(
			SELECT AVG(skill_count)
			FROM (
				SELECT COUNT(*) AS skill_count
				FROM mentorships
				WHERE skill_name = m.skill_name
				GROUP BY mentor_rollno
			) AS skill_counts
		) AS institute_avg
	FROM mentorships m
	WHERE m.mentor_rollno = ?
	GROUP BY
		m.mentor_rollno,
		m.skill_name
	ORDER BY
		m.skill_name;`
	rows, err := config.DB.Query(query, rollno)
	if err != nil {
		c.JSON(500, gin.H{"error": "Database query error: " + err.Error()})
		return
	}
	defer rows.Close()
	type MentorShip struct {
		MentorRollNo string  `json:"mentor_rollno"`
		SkillName    string  `json:"skill_name"`
		MenteeCount  int     `json:"mentee_count"`
		InstituteAvg float64 `json:"institute_avg"`
	}
	var mentorShips []MentorShip
	for rows.Next() {
		var m MentorShip
		err := rows.Scan(&m.MentorRollNo, &m.SkillName, &m.MenteeCount, &m.InstituteAvg)
		if err != nil {
			c.JSON(500, gin.H{"error": "Row scan error: " + err.Error()})
			return
		}
		mentorShips = append(mentorShips, m)
	}
	if err = rows.Err(); err != nil {
		c.JSON(500, gin.H{"error": "Rows iteration error: " + err.Error()})
		return
	}
	c.JSON(200, gin.H{"mentorships": mentorShips})
}
