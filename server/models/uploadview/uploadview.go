package uploadview

type UploadView struct {
	ID             int     `json:"id"`
	Title          string  `json:"title"`
	Description    string  `json:"description"`
	Type           string  `json:"type"`
	Complexity     *string `json:"complexity,omitempty"`
	Status         string  `json:"status"`
	UploadedOn     string  `json:"uploaded_on"`
	Subtype        *string `json:"SUb-type,omitempty"`
	RollNo         string  `json:"rollno"`
	FacultyRemarks *string `json:"faculty_remarks,omitempty"`
}
