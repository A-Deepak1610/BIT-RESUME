package registerevents

import (
	"bitresume/config"
	"bitresume/models"
	"fmt"
	"net/http"
	"strings"
	"github.com/gin-gonic/gin"
)

type RegisterEventRequest struct {
	EventCode        string   `json:"eventCode"`
	LeaderRollNo     string   `json:"leaderRollNo"` 
	Domain           string   `json:"domain"`
	ProblemStatement string   `json:"problemStatement"`
	TeamMates        []string `json:"teamMates"`
}
func getRegisteredCount(eventCode string) (int, error) {
	var count int
	query := "SELECT COUNT(*) FROM team_members WHERE event_code = ?"
	err := config.DB.QueryRow(query, eventCode).Scan(&count)
	return count, err
}
func HandleRegisterEvents(c *gin.Context) {
	var req RegisterEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	currentCount, err := getRegisteredCount(req.EventCode)
	if err != nil {
		fmt.Println("Error fetching registered count:", err) 
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching registration count"})
		return
	}
	leaderRollNo := req.LeaderRollNo
	teamCode := fmt.Sprintf("%s%03d", req.EventCode, currentCount+1)
	insertEvent := `INSERT INTO register_events (event_code, team_code, leader_rollno, domain, problem_statement, state, verified)
	                VALUES (?, ?, ?, ?, ?, ?, ?)`

	_, err = config.DB.Exec(insertEvent, req.EventCode, teamCode, leaderRollNo, req.Domain, req.ProblemStatement, "faculty", "pending")
	if err != nil {
		fmt.Println("Error inserting into register_events:", err) 
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register event"})
		return
	}
	stmt, err := config.DB.Prepare(`INSERT INTO requested_events (event_code, member_rollno) VALUES (?, ?)`)
	if err != nil {
		fmt.Println("Error preparing insert statement for team members:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare team member statement"})
		return
	}
	defer stmt.Close()

	for _, rollNo := range req.TeamMates {
		_, err := stmt.Exec(req.EventCode, rollNo)
		if err != nil {
			fmt.Printf("Error inserting team member %s: %v\n", rollNo, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert a team member"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"teamCode": teamCode,
		"members":  len(req.TeamMates),
	})
}
func GetRegisteredEvents(c *gin.Context) {
	rollno := c.Param("rollno")
	query := `
	SELECT 
		e.event_code,
		e.event_name,
		e.image_url,
		e.type,
		e.location,
		e.final_prize1,
		(
			SELECT start_date 
			FROM event_rounds_dates erd 
			WHERE erd.event_code = e.event_code 
			ORDER BY round_number ASC 
			LIMIT 1
		) AS start_date,
		r.state,
		r.verified,
		GROUP_CONCAT(tm.member_rollno) AS team_members
	FROM events e
	INNER JOIN team_members tm 
		ON e.event_code = tm.event_code
	INNER JOIN register_events r
		ON r.event_code = e.event_code
		AND r.team_code = tm.team_code
	WHERE tm.team_code IN (
		SELECT team_code 
		FROM team_members 
		WHERE member_rollno = ?
	)
	GROUP BY e.event_code, e.event_name, e.type, e.location, e.final_prize1, r.state, r.verified
	`
	rows, err := config.DB.Query(query, rollno)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
		return
	}
	defer rows.Close()
	var events []models.RegisteredEvent
	for rows.Next() {
		var e models.RegisteredEvent
		var teamMembers string
		err := rows.Scan(
			&e.EventCode,
			&e.EventName,
			&e.ImageUrl,
			&e.Type,
			&e.Location,
			&e.FinalPrize1,
			&e.StartDate,
			&e.State,
			&e.Verified,
			&teamMembers,
		)
		if err != nil {
			fmt.Print("Row scan error: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Row scan failed"})
			return
		}
		// Split team members string into slice
		e.TeamMembers = strings.Split(teamMembers, ",")
		events = append(events, e)
	}
	// If no rows found
	if len(events) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No registered events found", "data": []models.RegisteredEvent{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": events})
}