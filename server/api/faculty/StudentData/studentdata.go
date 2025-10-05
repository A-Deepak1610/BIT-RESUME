package studentdata

import (
	"bitresume/config"
	"database/sql"
	"github.com/gin-gonic/gin"
)

type Mentee struct {
	RollNo            string   `json:"rollno"`
	Year              string   `json:"year"`
	Name              string   `json:"user_name"`
	CurrentPoint      *float32 `json:"current_point,omitempty"`
	CurrentRank       *string  `json:"current_rank,omitempty"`
	CummulativePoints *float32 `json:"cummulative_points,omitempty"`
}

func HandleMenteesData(c *gin.Context) {
	userRollNo := c.GetString("rollNo")
	role := c.GetString("role")
	// Base query
	query := `
		SELECT
			l.rollno,
			l.year,
			l.user_name,
			ag.current_point,
			ag.current_rank,
			acg.cummulative_points
		FROM login l
		LEFT JOIN activity_graph ag
			ON ag.id = (
				SELECT ag2.id
				FROM activity_graph ag2
				WHERE ag2.rollno = l.rollno
				ORDER BY ag2.currdate DESC, ag2.id DESC
				LIMIT 1
			)
		LEFT JOIN achievement_graph acg
			ON acg.id = (
				SELECT acg2.id
				FROM achievement_graph acg2
				WHERE acg2.rollno = l.rollno
				ORDER BY acg2.currdate DESC, acg2.id DESC
				LIMIT 1
			)
		WHERE l.role = 'student'`

	args := []interface{}{}

	// For faculty, add mentor filter
	if role == "faculty" {
		query += " AND l.mentor_id = ?"
		args = append(args, userRollNo)
	}

	rows, err := config.DB.Query(query, args...)
	if err != nil {
		c.JSON(500, gin.H{"error": "Database query failed", "details": err.Error()})
		return
	}
	defer rows.Close()
	var results []Mentee
	for rows.Next() {
		var (
			rollno, year, name string
			cp, cpPoints       sql.NullFloat64
			cr                 sql.NullString
		)

		if err := rows.Scan(&rollno, &year, &name, &cp, &cr, &cpPoints); err != nil {
			c.JSON(500, gin.H{"error": "Failed to scan row", "details": err.Error()})
			return
		}

		mentee := Mentee{
			RollNo: rollno,
			Year:   year,
			Name:   name,
		}

		if cp.Valid {
			val := float32(cp.Float64)
			mentee.CurrentPoint = &val
		}
		if cr.Valid {
			val := cr.String
			mentee.CurrentRank = &val
		}
		if cpPoints.Valid {
			val := float32(cpPoints.Float64)
			mentee.CummulativePoints = &val
		}

		results = append(results, mentee)
	}

	c.JSON(200, gin.H{"mentees": results})
}
