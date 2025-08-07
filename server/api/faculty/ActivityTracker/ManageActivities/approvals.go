// manageactivities/activity_approvals.go
package manageactivities

import (
	"bitresume/config"
	facultymodel "bitresume/models/faculty"
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func HandleActivityApprovals(c *gin.Context) {
	query := `
	SELECT DISTINCT
		e.event_name,
		e.type AS event_type,
		(
			SELECT start_date 
			FROM event_rounds_dates erd 
			WHERE erd.event_code = e.event_code 
			ORDER BY round_number ASC 
			LIMIT 1
		) AS event_start_date,
		rt.domain,
		rt.problem_statement,
		l.user_name AS applicant_name,
		re.rollno,
		re.verified,
		re.created_at AS submitted_date
	FROM 
		events e 
	LEFT JOIN 
		register_events re ON re.event_code = e.event_code 
	LEFT JOIN 
		register_teams rt ON re.team_code = rt.team_code 
	LEFT JOIN 
		login l ON re.rollno = l.rollno 
	ORDER BY 
		re.created_at DESC`

	rows, err := config.DB.Query(query)
	if err != nil {
		fmt.Printf("Database query error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
		return
	}
	defer rows.Close()

	var approvals []facultymodel.ActivityApproval
	for rows.Next() {
		var approval facultymodel.ActivityApproval
		var eventStartDateStr sql.NullString  // Changed to NullString
		var domain sql.NullString
		var problemStatement sql.NullString
		var applicantName sql.NullString
		var rollno sql.NullString
		var verified sql.NullString
		var submittedDateStr sql.NullString   // Changed to NullString

		err := rows.Scan(
			&approval.EventName,
			&approval.EventType,
			&eventStartDateStr,     // Scan as string
			&domain,
			&problemStatement,
			&applicantName,
			&rollno,
			&verified,
			&submittedDateStr,      // Scan as string
		)
		if err != nil {
			fmt.Printf("Error scanning row: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan row"})
			return
		}

		// Parse event start date
		if eventStartDateStr.Valid && eventStartDateStr.String != "" {
			// Try parsing date only format first (2025-07-16)
			if parsedTime, err := time.Parse("2006-01-02", eventStartDateStr.String); err == nil {
				approval.EventStartDate = &parsedTime
			} else if parsedTime, err := time.Parse("2006-01-02 15:04:05", eventStartDateStr.String); err == nil {
				approval.EventStartDate = &parsedTime
			} else {
				fmt.Printf("Could not parse event start date: %s, error: %v\n", eventStartDateStr.String, err)
			}
		}

		// Parse submitted date
		if submittedDateStr.Valid && submittedDateStr.String != "" {
			// Try parsing datetime format first (2025-08-06 20:29:27)
			if parsedTime, err := time.Parse("2006-01-02 15:04:05", submittedDateStr.String); err == nil {
				approval.SubmittedDate = &parsedTime
			} else if parsedTime, err := time.Parse("2006-01-02", submittedDateStr.String); err == nil {
				approval.SubmittedDate = &parsedTime
			} else {
				fmt.Printf("Could not parse submitted date: %s, error: %v\n", submittedDateStr.String, err)
			}
		}

		// Handle other NULL values
		if domain.Valid {
			approval.Domain = &domain.String
		}
		if problemStatement.Valid {
			approval.ProblemStatement = &problemStatement.String
		}
		if applicantName.Valid {
			approval.ApplicantName = &applicantName.String
		}
		if rollno.Valid {
			approval.Rollno = &rollno.String
		}
		if verified.Valid {
			approval.Verified = &verified.String
		}

		approvals = append(approvals, approval)
	}
	// Check for row iteration errors
	if err = rows.Err(); err != nil {
		fmt.Printf("Row iteration error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing results"})
		return
	}
	fmt.Printf("Successfully processed %d approval records\n", len(approvals))
	c.JSON(http.StatusOK, approvals)
}