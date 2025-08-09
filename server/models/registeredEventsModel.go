package models

type RegisteredEvent struct {
	EventCode   string   `json:"eventCode"`
	EventName   string   `json:"eventName"`
	ImageUrl    string   `json:"imageUrl"`
	Type        string   `json:"type"`
	Location    string   `json:"location"`
	FinalPrize1 string   `json:"finalPrize1"`
	StartDate   string   `json:"startDate"`
	State       string   `json:"state"`
	Verified    string   `json:"verified"`
	TeamMembers []string `json:"teamMembers"`
}

type RequestedEvent struct {
	EventCode         string `json:"event_code"`
	EventName         string `json:"event_name"`
	ImageURL          string `json:"image_url"`
	Type              string `json:"type"`
	Location          string `json:"location"`
	FinalPrize1       string `json:"final_prize1"`
	StartDate         string `json:"start_date"`
	TeamCode          string `json:"team_code"`
	LeaderRollNo      string `json:"leader_rollno"`
	NumberOfTeammates int    `json:"number_of_teammates"`
	Teammates         string `json:"teammates"`
	UserStatus        string `json:"user_status"`    // Added
	UserVerified      string `json:"user_verified"`  // Added
}

type RegisteredEventResponse struct {
	EventCode       string `json:"event_code"`
	EventName       string `json:"event_name"`
	ImageURL        string `json:"image_url"`
	Type            string `json:"type"`
	Location        string `json:"location"`
	FinalPrize1     string `json:"final_prize1"`
	StartDate       string `json:"start_date"` 
	EndDate       string `json:"end_date"` 
	TeamCode        string `json:"team_code"`
	LeaderRollNo    string `json:"leader_rollno"`
	NumberOfMembers int    `json:"number_of_teammates"`
	Teammates       string `json:"teammates"`
	UserStatus      string `json:"user_status"`      
	UserVerified    string `json:"user_verified"`    
	FacultyRemarks  string `json:"faculty_remarks,omitempty"` 
}