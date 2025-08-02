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
