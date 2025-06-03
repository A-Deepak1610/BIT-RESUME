package facultymodel

type ManageActivities struct {
	Activity_title string `json:"activity_title"`
	Activity_type string `json:"activity_type"`
	Description string `json:"description"`
	Start_date string `json:"start_date"`
	End_date string `json:"end_date"`
	Linkorlocation string `json:"linkorlocation"`
	All_students string `json:"all_students"`
	Specific_rollno string `json:"specific_rollno"`
	Year_type string `json:"year_type"`
	Target_dept string `json:"target_dept"`
}