package registerevents

import (
	"bitresume/config"
	"bitresume/models"
	"database/sql"
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

func getRegisteredCount(eventCode string) (string, error) {
	var team_code string
	query := `
		SELECT CONCAT(?, '_', IFNULL(COUNT(DISTINCT team_code), 0) + 1) 
		FROM register_events 
		WHERE event_code = ?
	`
	err := config.DB.QueryRow(query, eventCode, eventCode).Scan(&team_code)
	return team_code, err
}

func HandleRegisterEvents(c *gin.Context) {
	var req RegisterEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	teamCode, err := getRegisteredCount(req.EventCode)
	if err != nil {
		fmt.Println("Error fetching registered count:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching registration count"})
		return
	}
	leaderRollNo := req.LeaderRollNo
	insertEvent := `INSERT INTO register_teams (event_code, team_code, leader_rollno, domain, problem_statement, state, verified)
	                VALUES (?, ?, ?, ?, ?, ?, ?)`
	_, err = config.DB.Exec(insertEvent, req.EventCode, teamCode, leaderRollNo, req.Domain, req.ProblemStatement, "faculty", "pending")
	if err != nil {
		fmt.Println("Error inserting into register_teams:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register event"})
		return
	}
	insertParticipant := `
    INSERT INTO register_events (
        rollno,
        event_code,
        team_code,
        status,
        event_state,
        verified,
        leader_rollno	
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
`

	// Insert the leader first with 'accepted' status
	_, err = config.DB.Exec(
		insertParticipant,
		req.LeaderRollNo,
		req.EventCode,
		teamCode,
		"accepted",
		"faculty",
		"pending",
		req.LeaderRollNo,
	)
	if err != nil {
		fmt.Println("Error inserting leader into register_events:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register leader"})
		return
	}

	// Insert each teammate with 'pending' status
	for _, member := range req.TeamMates {
		member = strings.TrimSpace(member)
		if member == "" {
			continue
		}
		_, err := config.DB.Exec(
			insertParticipant,
			member,
			req.EventCode,
			teamCode,
			"pending",
			"faculty",
			"pending",
			req.LeaderRollNo,
		)
		if err != nil {
			fmt.Println("Error inserting team member:", member, "Error:", err)
			// Optional: continue or break on failure
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"teamCode": teamCode,
		"members":  len(req.TeamMates),
	})
}
func GetRequestedEvents(c *gin.Context) {
	rollno := c.Param("rollno")

	query := `SELECT DISTINCT
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
    user_re.team_code,
    user_re.leader_rollno,
    (
        SELECT COUNT(rollno) 
        FROM register_events 
        WHERE team_code = user_re.team_code 
        AND event_code = e.event_code
    ) AS number_of_teammates,
    (
        SELECT GROUP_CONCAT(rollno) 
        FROM register_events 
        WHERE team_code = user_re.team_code 
        AND event_code = e.event_code
    ) AS teammates,
    user_re.status AS user_status,
    user_re.verified AS user_verified
FROM 
    events e
JOIN 
    register_events user_re ON e.event_code = user_re.event_code 
WHERE 
    user_re.rollno = ?
    AND user_re.status = 'pending'
ORDER BY 
    e.event_code`

	rows, err := config.DB.Query(query, rollno)
	if err != nil {
		fmt.Printf("Database query error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed for requested events"})
		return
	}
	defer rows.Close()

	var events []models.RequestedEvent
	for rows.Next() {
		var event models.RequestedEvent
		var userStatus, userVerified string

		err := rows.Scan(
			&event.EventCode,
			&event.EventName,
			&event.ImageURL,
			&event.Type,
			&event.Location,
			&event.FinalPrize1,
			&event.StartDate,
			&event.TeamCode,
			&event.LeaderRollNo,
			&event.NumberOfTeammates,
			&event.Teammates,
			&userStatus,   // Added missing field
			&userVerified, // Added missing field
		)
		if err != nil {
			fmt.Printf("Row scan error: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan requested event row"})
			return
		}
		events = append(events, event)
	}

	c.JSON(http.StatusOK, gin.H{
		"requested_events": events,
	})
}
func GetRegisteredEvents(c *gin.Context) {
	rollno := c.Param("rollno")
	if rollno == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "rollno is required"})
		return
	}
	var events []models.RegisteredEventResponse
	query := `
	SELECT 
    e.event_code,
    e.event_name,
    e.image_url,
    e.type,
    e.location,
    e.final_prize1,

    -- Start date from first round
    IFNULL(erd.start_date, '') AS start_date,

    -- End date from last round
    IFNULL(erd_end.end_date, '') AS end_date,

    user_re.team_code,
    user_re.leader_rollno,

    -- Teammate info
    IFNULL(team_stats.number_of_teammates, 0) AS number_of_teammates,
    IFNULL(team_stats.teammates, '') AS teammates,

    -- User registration info
    user_re.status AS user_status,
    user_re.verified AS user_verified,
    user_re.faculty_remarks

FROM 
    events e

JOIN 
    register_events user_re ON e.event_code = user_re.event_code 
LEFT JOIN (
    SELECT 
        event_code,
        MIN(start_date) AS start_date
    FROM event_rounds_dates 
    GROUP BY event_code
) erd ON erd.event_code = e.event_code
LEFT JOIN (
    SELECT erd1.event_code, erd1.end_date
    FROM event_rounds_dates erd1
    JOIN (
        SELECT event_code, MAX(round_number) AS max_round
        FROM event_rounds_dates
        GROUP BY event_code
    ) erd2 ON erd1.event_code = erd2.event_code AND erd1.round_number = erd2.max_round
) erd_end ON erd_end.event_code = e.event_code

-- Join for team info
LEFT JOIN (
    SELECT 
        team_code,
        event_code,
        COUNT(rollno) AS number_of_teammates,
        GROUP_CONCAT(rollno) AS teammates
    FROM register_events
    GROUP BY team_code, event_code
) team_stats ON team_stats.team_code = user_re.team_code 
            AND team_stats.event_code = e.event_code

WHERE 
    user_re.rollno = ?
    AND user_re.status = 'accepted'

ORDER BY 
    e.event_code;
`

	rows, err := config.DB.Query(query, rollno)
	if err != nil {
		fmt.Printf("Database query error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var event models.RegisteredEventResponse
		// var userStatus, userVerified string
		var facultyRemarks sql.NullString // <-- Change this

		err := rows.Scan(
			&event.EventCode,
			&event.EventName,
			&event.ImageURL,
			&event.Type,
			&event.Location,
			&event.FinalPrize1,
			&event.StartDate,
			&event.EndDate,
			&event.TeamCode,
			&event.LeaderRollNo,
			&event.NumberOfMembers,
			&event.Teammates,
			&event.UserStatus,
			&event.UserVerified,
			&facultyRemarks,
		)
		if err != nil {
			fmt.Printf("Row scan error: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan registered event"})
			return
		}

		// Convert sql.NullString to string
		if facultyRemarks.Valid {
			event.FacultyRemarks = facultyRemarks.String
		} else {
			event.FacultyRemarks = "" // or leave it empty if NULL
		}

		events = append(events, event)
	}

	c.JSON(http.StatusOK, events)
}
func HandleRequestEventsApproveReject(c *gin.Context) {
	var req struct {
		Rollno    string `json:"rollno"` // This should match the rollno in the URL
		EventCode string `json:"event_code"`
		TeamCode  string `json:"team_code"`
		Action    string `json:"action"` // "approve" or "reject"
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Determine new status based on action
	var newStatus string
	if req.Action == "approve" {
		newStatus = "accepted"
	} else if req.Action == "reject" {
		newStatus = "rejected"
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action. Use 'approve' or 'reject'"})
		return
	}

	updateQuery := `
	UPDATE register_events 
	SET status = ?
	WHERE rollno = ? AND event_code = ? AND team_code = ?`

	result, err := config.DB.Exec(updateQuery, newStatus, req.Rollno, req.EventCode, req.TeamCode)
	if err != nil {
		fmt.Printf("Database update error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update registration status"})
		return
	}

	// Check if any rows were affected
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Registration not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Registration status updated successfully",
		"status":  newStatus,
	})
}
