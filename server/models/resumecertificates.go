package models

type Certificates struct {
	Title        string  `json:"title"`
	Platform     *string `json:"platform"`
	IssueDate    *string `json:"issue_date"`
	LinkedinLink *string `json:"linkedin_link"`
}
