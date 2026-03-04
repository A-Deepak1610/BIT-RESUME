package models

// IndustryAdvisor represents the industry_advisor table
type IndustryAdvisor struct {
	ID                      int     `json:"id,omitempty"`
	Faculty                 string  `json:"faculty"`
	SigNumber               string  `json:"sigNumber"`
	SpecialLabsInvolved     string  `json:"specialLabsInvolved"`
	SpecialLab              string  `json:"specialLab"`
	IndustryName            string  `json:"industryName"`
	DomainArea              string  `json:"domainArea"`
	IndustryType            string  `json:"industryType"`
	IndustryTypeOther       string  `json:"industryTypeOther"`
	ExpertName              string  `json:"expertName"`
	Designation             string  `json:"designation"`
	EmailID                 string  `json:"emailId"`
	PhoneNumber             string  `json:"phoneNumber"`
	ExperienceYears         string  `json:"experienceYears"`
	AreaOfExpertise         string  `json:"areaOfExpertise"`
	IndustryAddress         string  `json:"industryAddress"`
	IndustryWebsite         string  `json:"industryWebsite"`
	FrequencyOfInteraction  string  `json:"frequencyOfInteraction"`
	DateOfMeeting           string  `json:"dateOfMeeting"`
	ExpenseIncurred         float64 `json:"expenseIncurred"`
	Suggestions             string  `json:"suggestions"`
	CollaborativeActivities string  `json:"collaborativeActivities"`
	ApprovalDocument        string  `json:"approvalDocument"`
	OWIVerification         string  `json:"owiVerification"`
	CreatedAt               string  `json:"createdAt,omitempty"`
	UpdatedAt               string  `json:"updatedAt,omitempty"`
}

// LaboratoryByIndustry represents the faculty_laboratory_by_industry table
type LaboratoryByIndustry struct {
	ID                           int     `json:"id,omitempty"`
	Faculty                      string  `json:"faculty"`
	SigNumber                    string  `json:"sigNumber"`
	TaskID                       string  `json:"taskId"`
	NameOfLaboratory             string  `json:"nameOfLaboratory"`
	CollaborativeIndustry        string  `json:"collaborativeIndustry"`
	DomainAreaOfIndustry         string  `json:"domainAreaOfIndustry"`
	LaboratoryArea               float64 `json:"laboratoryArea"`
	TotalAmountIncurred          float64 `json:"totalAmountIncurred"`
	BitContribution              float64 `json:"bitContribution"`
	FinancialSupportFromIndustry float64 `json:"financialSupportFromIndustry"`
	EquipmentSponsored           string  `json:"equipmentSponsored"`
	EquipmentEnhancement         string  `json:"equipmentEnhancement"`
	LayoutDesignEnhancement      string  `json:"layoutDesignEnhancement"`
	CurriculumMapping            string  `json:"curriculumMapping"`
	ExpectedOutcomes             string  `json:"expectedOutcomes"`
	ProofDocument                string  `json:"proofDocument"`
	OWIVerification              string  `json:"owiVerification"`
	CreatedAt                    string  `json:"createdAt,omitempty"`
	UpdatedAt                    string  `json:"updatedAt,omitempty"`
}

// ProfessionalMembership represents the professional_membership table
type ProfessionalMembership struct {
	ID                       int     `json:"id,omitempty"`
	MembershipCategory       string  `json:"membershipCategory"`
	Faculty                  string  `json:"faculty"`
	TaskID                   string  `json:"taskId"`
	SpecialLabsInvolved      string  `json:"specialLabsInvolved"`
	SpecialLab               string  `json:"specialLab"`
	NameOfProfessionalBody   string  `json:"nameOfProfessionalBody"`
	MembershipType           string  `json:"membershipType"`
	MembershipID             string  `json:"membershipId"`
	NameOfGradeLevelPosition string  `json:"nameOfGradeLevelPosition"`
	Category                 string  `json:"category"`
	ValidityType             string  `json:"validityType"`
	ApexDocumentProof        string  `json:"apexDocumentProof"`
	Amount                   float64 `json:"amount"`
	IfOthers                 string  `json:"ifOthers"`
	AmountIfOthers           float64 `json:"amountIfOthers"`
	DocumentProof            string  `json:"documentProof"`
	OWIVerification          string  `json:"owiVerification"`
	CreatedAt                string  `json:"createdAt,omitempty"`
	UpdatedAt                string  `json:"updatedAt,omitempty"`
}

// StudentsIndustrialVisit represents the students_industrial_visit table
type StudentsIndustrialVisit struct {
	ID                       int    `json:"id,omitempty"`
	Faculty                  string `json:"faculty"`
	SigNumber                string `json:"sigNumber"`
	TaskID                   string `json:"taskId"`
	Programme                string `json:"programme"`
	IndustryName             string `json:"industryName"`
	DomainArea               string `json:"domainArea"`
	IndustryType             string `json:"industryType"`
	IndustryTypeOther        string `json:"industryTypeOther"`
	IndustryLocation         string `json:"industryLocation"`
	IndustryWebsite          string `json:"industryWebsite"`
	ContactPersonName        string `json:"contactPersonName"`
	ContactPersonDesignation string `json:"contactPersonDesignation"`
	ContactPersonEmail       string `json:"contactPersonEmail"`
	ContactPersonPhone       string `json:"contactPersonPhone"`
	VisitStartDate           string `json:"visitStartDate"`
	VisitEndDate             string `json:"visitEndDate"`
	YearOfStudy              string `json:"yearOfStudy"`
	NumberOfStudents         int    `json:"numberOfStudents"`
	MaleStudents             int    `json:"maleStudents"`
	FemaleStudents           int    `json:"femaleStudents"`
	PurposeOfVisit           string `json:"purposeOfVisit"`
	Faculty1                 string `json:"faculty1"`
	Faculty2                 string `json:"faculty2"`
	Faculty3                 string `json:"faculty3"`
	SourceOfArrangement      string `json:"sourceOfArrangement"`
	CurriculumMapping        string `json:"curriculumMapping"`
	OutcomeOfVisit           string `json:"outcomeOfVisit"`
	ProofDocument            string `json:"proofDocument"`
	OWIVerification          string `json:"owiVerification"`
	CreatedAt                string `json:"createdAt,omitempty"`
	UpdatedAt                string `json:"updatedAt,omitempty"`
}

// TechnicalSocieties represents the technical_societies table
type TechnicalSocieties struct {
	ID              int     `json:"id,omitempty"`
	Name            string  `json:"name"`
	Society         string  `json:"society"`
	Status          *string `json:"status"`
	Faculty         string  `json:"faculty"`
	SigNumber       string  `json:"sigNumber"`
	TaskID          string  `json:"taskId"`
	OWIVerification string  `json:"owiVerification"`
	CreatedAt       string  `json:"createdAt,omitempty"`
	UpdatedAt       string  `json:"updatedAt,omitempty"`
}

// TrainingToIndustry represents the training_to_industry table
type TrainingToIndustry struct {
	ID                     int     `json:"id,omitempty"`
	Faculty                string  `json:"faculty"`
	SigNumber              string  `json:"sigNumber"`
	SpecialLabsInvolved    string  `json:"specialLabsInvolved"`
	SpecialLab             string  `json:"specialLab"`
	EventName              string  `json:"eventName"`
	EventNameOther         string  `json:"eventNameOther"`
	IndustryName           string  `json:"industryName"`
	IndustryAddress        string  `json:"industryAddress"`
	DomainArea             string  `json:"domainArea"`
	IndustryType           string  `json:"industryType"`
	IndustryTypeOther      string  `json:"industryTypeOther"`
	ModeOfTraining         string  `json:"modeOfTraining"`
	IndustryWebsite        string  `json:"industryWebsite"`
	NumberOfPersonsTrained int     `json:"numberOfPersonsTrained"`
	DurationDays           int     `json:"durationDays"`
	StartDate              string  `json:"startDate"`
	EndDate                string  `json:"endDate"`
	OutcomeOfTraining      string  `json:"outcomeOfTraining"`
	HonorariumReceived     float64 `json:"honorariumReceived"`
	CommunicationProof     string  `json:"communicationProof"`
	ApprovalLetter         string  `json:"approvalLetter"`
	GeotagPhotos           string  `json:"geotagPhotos"`
	ParticipantsAttendance string  `json:"participantsAttendance"`
	PaymentProofs          string  `json:"paymentProofs"`
	ConsolidatedDocument   string  `json:"consolidatedDocument"`
	OWIVerification        string  `json:"owiVerification"`
	CreatedAt              string  `json:"createdAt,omitempty"`
	UpdatedAt              string  `json:"updatedAt,omitempty"`
}
