package projects

import (
	"bitresume/config"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

const maxPDFsize = 5 * 1024 * 1024
const maxVideosize = 50 * 1024 * 1024

func RecieveProjectData(c *gin.Context) {
	// Parse form fields
	title_idea := c.PostForm("title_idea")
	summary := c.PostForm("project_abstract")
	problem_stmt := c.PostForm("problem_statement")
	obj := c.PostForm("objective")
	str_time := c.PostForm("start_time")
	end_time := c.PostForm("end_time")
	tech_stack := c.PostForm("tech_stack")
	is_team_project := c.PostForm("is_team_project")
	team_members := c.PostForm("team_members")
	consulted_mentor := c.PostForm("consulted_mentor")
	github_link := c.PostForm("github_link")
	presented_externally := c.PostForm("presented_externally")
	award_won := c.PostForm("awards_won")
	changes_from_idea := c.PostForm("changes_from_idea")

	// Parse booleans
	isTeam := 0
	if is_team_project == "true" {
		isTeam = 1
	}
	consultedMentor := 0
	if consulted_mentor == "true" {
		consultedMentor = 1
	}
	presentedExternally := 0
	if presented_externally == "true" {
		presentedExternally = 1
	}

	// Parse dates
	layout := "2006-01-02"
	startTimeParsed, err := time.Parse(layout, str_time)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid start time format. Use YYYY-MM-DD"})
		return
	}
	endTimeParsed, err := time.Parse(layout, end_time)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid end time format. Use YYYY-MM-DD"})
		return
	}

	// Handle report PDF
	report_pdf, err := c.FormFile("report_pdf")
	if err != nil {
		c.JSON(400, gin.H{"error": "report_pdf is required"})
		return
	}
	if report_pdf.Size > maxPDFsize {
		c.JSON(413, gin.H{"error": "Report PDF exceeds 5MB limit"})
		return
	}

	// Handle demo video
	video_file, err := c.FormFile("demo_video")
	if err != nil {
		c.JSON(400, gin.H{"error": "demo_video is required"})
		return
	}
	if video_file.Size > maxVideosize {
		c.JSON(413, gin.H{"error": "Demo video exceeds 50MB limit"})
		return
	}

	// Ensure folders exist
	if _, err = os.Stat("uploads/pdf"); os.IsNotExist(err) {
		if err := os.Mkdir("uploads/pdf", os.ModePerm); err != nil {
			c.JSON(500, gin.H{"error": "Failed to create PDF directory"})
			return
		}
	}
	if _, err = os.Stat("uploads/videos"); os.IsNotExist(err) {
		if err := os.Mkdir("uploads/videos", os.ModePerm); err != nil {
			c.JSON(500, gin.H{"error": "Failed to create video directory"})
			return
		}
	}

	// Save files
	savePathPdf := filepath.Join("uploads/pdf", report_pdf.Filename)
	savePathVideo := filepath.Join("uploads/videos", video_file.Filename)

	if err = c.SaveUploadedFile(report_pdf, savePathPdf); err != nil {
		c.JSON(500, gin.H{"error": "Could not save report PDF"})
		return
	}
	if err = c.SaveUploadedFile(video_file, savePathVideo); err != nil {
		c.JSON(500, gin.H{"error": "Could not save demo video"})
		return
	}

	// Insert into DB (using CURRENT_DATE in SQL)
	query := `
		INSERT INTO projects (
			rollno, title_idea, summary, problem_statement, objective, start_time, end_time, tech_stack,
			is_team_project, team_members, consulted_mentor, github_link, report_pdf, demo_video,
			presented_externally, awards_won, changes_from_idea, upload_date,
			approval_status, faculty_remarks
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, ?, ?)`

	_, err = config.DB.Exec(query,
		"7376242AD336", title_idea, summary, problem_stmt, obj,
		startTimeParsed, endTimeParsed, tech_stack,
		isTeam, team_members, consultedMentor, github_link,
		savePathPdf, savePathVideo, presentedExternally,
		award_won, changes_from_idea,
		0, "",
	)

	if err != nil {
		fmt.Println("DB error:", err)
		c.JSON(500, gin.H{"error": "Could not save project to database"})
		return
	}

	c.JSON(200, gin.H{"message": "Project uploaded successfully"})
}
