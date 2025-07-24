package facultymodel

import "database/sql"

type ManageActivities struct {
	Activity_title  string `json:"activity_title"`
	Activity_type   string `json:"activity_type"`
	Description     string `json:"description"`
	Start_date      string `json:"start_date"`
	End_date        string `json:"end_date"`
	Linkorlocation  string `json:"linkorlocation"`
	All_students    string `json:"all_students"`
	Specific_rollno string `json:"specific_rollno"`
	Year_type       string `json:"year_type"`
	Target_dept     string `json:"target_dept"`
}
type Event struct {
	ID            int64          `json:"id"`
	EventName     string         `json:"event_name"`
	Type          string         `json:"type"`
	Deadline      string         `json:"deadline"`
	MinTeamSize   int            `json:"min_team_size"`
	MaxTeamSize   int            `json:"max_team_size"`
	NoOfRounds    int            `json:"no_of_rounds"`
	OnlineRounds  sql.NullInt32  `json:"online_rounds"`
	OfflineRounds sql.NullInt32  `json:"offline_rounds"`
	Location      sql.NullString `json:"location"`
	ApplyLink     sql.NullString `json:"apply_link"`
	Domains       sql.NullString `json:"domains"`
	ImageURL      sql.NullString `json:"image_url"`
	Description   sql.NullString `json:"description"`
	Rules         sql.NullString `json:"rules"`
	Constraints   sql.NullString `json:"constraintsql"`
	FinalPrizes   sql.NullString `json:"final_prizes"` 
}

// Round represents a single round of an event.
type Round struct {
	ID           int64  `json:"id"`
	EventID      int64  `json:"event_id"`
	RoundNumber  int    `json:"round_number"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	RewardPoints string `json:"reward_points"` // JSON is sent as a string
}

// RoundData is used to unmarshal the JSON array from the form.
type RoundData struct {
	StartDate    string                 `json:"start_date"`
	EndDate      string                 `json:"end_date"`
	RewardPoints map[string]interface{} `json:"reward_points"`
}