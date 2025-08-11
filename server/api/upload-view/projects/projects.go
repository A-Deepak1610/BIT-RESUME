package projects

import (
	"bitresume/config"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

var maxPDFsize = 5 * 1024 * 1024       // 5MB
var maxVideosize = 50 * 1024 * 1024   // 50MB

// Define a struct to match the team member JSON
type TeamMember struct {
	Name       string `json:"name"`
	RollNumber string `json:"rollNumber"`
	Department string `json:"department"`
}


func RecieveProjectData(c *gin.Context) {
	// --- Parse Form Fields ---
	roll_no := c.PostForm("submitter_roll_no")
	title := c.PostForm("title_idea")
	problem_statement := c.PostForm("problem_statement")
	objective := c.PostForm("objective")
	start_time := c.PostForm("start_time")
	end_time := c.PostForm("end_time")
	tech_stack := c.PostForm("tech_stack")
	is_team_project := c.PostForm("is_team_project")
	team_members := c.PostForm("team_members")
	consulted_mentor := c.PostForm("consulted_mentor")
	github_link := c.PostForm("github_link")
	presented_externally := c.PostForm("presented_externally")
	awards_won := c.PostForm("awards_won") //can be null
	changes_from_idea := c.PostForm("changes_from_idea")
	project_abstract := c.PostForm("project_abstract")

	// --- Unmarshal JSON fields ---
	var techStack []string
	if err := json.Unmarshal([]byte(tech_stack), &techStack); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tech_stack format. Expected a JSON array of strings."})
		return
	}

	var teamMembers []TeamMember
	if err := json.Unmarshal([]byte(team_members), &teamMembers); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team_members format. Expected a JSON array of objects."})
		return
	}
    // Basic validation
	if(is_team_project == "true"){
		if len(teamMembers) == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Team members cannot be empty."})
			return
		}
	}    


	// --- Parse Booleans ---
	isTeam := is_team_project == "true"
	consultedMentor := consulted_mentor == "true"
	presentedExternally := presented_externally == "true"
	
	// --- Parse Dates ---
	layout := "2006-01-02"
	startTimeParsed, err := time.Parse(layout, start_time)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start time format. Use YYYY-MM-DD"})
		return
	}
	endTimeParsed, err := time.Parse(layout, end_time)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end time format. Use YYYY-MM-DD"})
		return
	}

	// --- Handle File Uploads ---
	// Report PDF (Optional)
	report_pdf, err := c.FormFile("report_pdf")
    var savePathPdf string
	if err == nil { // File was provided
		if report_pdf.Size > int64(maxPDFsize) {
			c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "Report PDF exceeds 5MB limit"})
			return
		}
		os.MkdirAll("uploads/pdf", os.ModePerm)
        // Security: Sanitize filename to prevent path traversal attacks
		safePdfFilename := filepath.Base(report_pdf.Filename)
		savePathPdf = filepath.Join("uploads/pdf", safePdfFilename)
		if err := c.SaveUploadedFile(report_pdf, savePathPdf); err != nil {
             c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save PDF file."})
             return
        }
	} else if err != http.ErrMissingFile {
        // Handle other potential errors from FormFile
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid PDF file upload."})
        return
    }


	// Demo Video (Required)
	video_file, err := c.FormFile("demo_video")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "demo_video is required"})
		return
	}
	if video_file.Size > int64(maxVideosize) {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "Demo video exceeds 50MB limit"})
		return
	}
	os.MkdirAll("uploads/videos", os.ModePerm)
    // Security: Sanitize filename
    safeVideoFilename := filepath.Base(video_file.Filename)
	savePathVideo := filepath.Join("uploads/videos", safeVideoFilename)
	if err := c.SaveUploadedFile(video_file, savePathVideo); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save video file."})
        return
    }
	uploadType := "project"

	insertProject := `INSERT INTO projects 
		(upload_type,rollno, title_idea, summary, problem_statement, objective, start_time, end_time, is_team_project, consulted_mentor) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	res, err := config.DB.Exec(insertProject,uploadType,
		roll_no, title, project_abstract, problem_statement, objective,
		startTimeParsed, endTimeParsed, isTeam, consultedMentor) // Use string status
	if err != nil {
		fmt.Println("Error: ",err.Error());
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not insert into the Database(projects)"})
		return
	}
	projectID, _ := res.LastInsertId()

	// Insert tech stack
	for _, tech := range techStack {
		_, err := config.DB.Exec(`INSERT INTO project_tech_stack (project_id, tech_name) VALUES (?, ?)`, projectID, tech)
		if err != nil {
			fmt.Println("Error: ", err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"message":"Could not insert into the Database(project_tech_stack)"})
			return
		}
	}

	// Insert team members
	for _, member := range teamMembers {
		// You might want to insert more details than just the roll number here
		_, err := config.DB.Exec(`INSERT INTO project_team_members (project_id, rollno, member_name, department) VALUES (?, ?, ?, ?)`, 
            projectID, member.RollNumber, member.Name, member.Department)
		if err != nil {
			fmt.Println("Error: ",err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"message": "Could not insert into the database(project_team_members)"})
			return
		}
	}

	query := `
		insert into project_files(
			project_id,
			github_link,
			report_pdf,
			demo_video
		) values (?,?,?,?);
	`
	_,err = config.DB.Exec(query, projectID, github_link, savePathPdf, savePathVideo)
	if err != nil{
		fmt.Println("Error: ", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not insert into database(project_files)"})
		return
	}


	query = `
		insert into project_presentations(
			project_id,
			presented_externally,
			awards_won
		) values (?,?,?);
	`
	_,err = config.DB.Exec(query, projectID, presentedExternally,awards_won)
	if err != nil{
		fmt.Println("Error: ", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not insert into database(project_presentations)"})
		return
	}


	query = `
		insert into project_evaluation(
			project_id,
			changes_from_idea
		) values (?,?);
	`
	_,err = config.DB.Exec(query, projectID, changes_from_idea)
	if err != nil{
		fmt.Println("Error: ", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not insert into database(project_evaluation)"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project uploaded successfully", "projectId": projectID})
}