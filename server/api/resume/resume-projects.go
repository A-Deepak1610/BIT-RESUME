package resume

import (
	"bitresume/config"
	"bitresume/models"
	"database/sql" // Import the sql package to handle NullString
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetProjectsData fetches and combines project data from multiple tables.
func GetProjectsData(c *gin.Context) {
	role := c.GetString("role")
	var rollno string
	if role == "student" {
		rollno = c.GetString("rollNo")
	} else if role == "faculty" || role == "Admin" {
		rollno = c.Param("rollno")
		if rollno == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "rollno query parameter required for faculty"})
			return
		}
	} else {
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorized role"})
		return
	}
	var allProjects []models.Project

	// Step 1: Fetch all base projects for the given rollno from the main 'projects' table.
	// We get the project's unique ID here to use in subsequent queries.
	rows, err := config.DB.Query("SELECT id, title_idea, summary FROM projects WHERE rollno = ?", rollno)
	if err != nil {
		fmt.Println("Error fetching from projects table:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch base project data"})
		return
	}
	defer rows.Close()

	// Step 2: Loop through each base project found.
	for rows.Next() {
		var projectID int
		var title, summary string

		if err := rows.Scan(&projectID, &title, &summary); err != nil {
			fmt.Println("Error scanning base project row:", err)
			continue // Skip this project if there's an error
		}
		// Step 3: For each project, fetch its related data (GitHub link and Tech Stack).
		// Fetch the GitHub link from the 'project_files' table.
		var githubLink sql.NullString // Use sql.NullString to handle potential NULL values
		err := config.DB.QueryRow("SELECT github_link FROM project_files WHERE project_id = ?", projectID).Scan(&githubLink)
		if err != nil && err != sql.ErrNoRows {
			fmt.Println("Error fetching github link for project_id", projectID, ":", err)
			// Decide if you want to skip or continue with an empty link
		}
		// Fetch the list of tech stack names from the 'project_tech_stack' table.
		var techStack []string
		stackRows, err := config.DB.Query("SELECT tech_name FROM project_tech_stack WHERE project_id = ?", projectID)
		if err != nil {
			fmt.Println("Error fetching tech stack for project_id", projectID, ":", err)
			// Continue with an empty stack if there's an error
		} else {
			for stackRows.Next() {
				var techName string
				if err := stackRows.Scan(&techName); err == nil {
					techStack = append(techStack, techName)
				}
			}
			stackRows.Close() // Important to close the inner rows loop
		}

		// Step 4: Combine all fetched data into the final struct.
		project := models.Project{
			Title:       title,
			Description: summary,
			Github:      githubLink.String, // .String provides the value or "" if NULL
			Stack:       techStack,
		}

		allProjects = append(allProjects, project)
	}

	// Final Step: Send the complete, aggregated list to the frontend.
	c.JSON(http.StatusOK, allProjects)
}

// CategorizedExpertise represents areas of expertise grouped by category
type CategorizedExpertise struct {
	Category string   `json:"category"`
	Skills   []string `json:"skills"`
}

func GetAreasOfExpertise(c *gin.Context) {
	role := c.GetString("role")
	var rollno string
	if role == "student" {
		rollno = c.GetString("rollNo")
	} else if role == "faculty" || role == "Admin" {
		rollno = c.Param("rollno")
		if rollno == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "rollno query parameter required for faculty"})
			return
		}
	} else {
		c.JSON(http.StatusForbidden, gin.H{"error": "unauthorized role"})
		return
	}

	// Query to get all distinct tech skills for the student
	techQuery := "SELECT DISTINCT pt.tech_name FROM projects p JOIN project_tech_stack pt ON p.id = pt.project_id WHERE p.rollno = ?"
	rows, err := config.DB.Query(techQuery, rollno)
	if err != nil {
		fmt.Println("Error fetching areas of expertise:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch areas of expertise"})
		return
	}
	defer rows.Close()

	// Collect all skills
	var allSkills []string
	for rows.Next() {
		var skill string
		if err := rows.Scan(&skill); err != nil {
			continue
		}
		allSkills = append(allSkills, skill)
	}

	// Map to hold categorized skills
	categoryMap := make(map[string][]string)

	// For each skill, find its category
	for _, skill := range allSkills {
		categoryQuery := `
			SELECT COALESCE(
				(
					SELECT c.category_name
					FROM skills s
					JOIN skill_category_map scm ON s.skill_id = scm.skill_id
					JOIN categories c ON scm.category_id = c.category_id
					WHERE LOWER(s.skill_name) = LOWER(?)
					LIMIT 1
				),
				'Others'
			) AS category
		`
		var category string
		err := config.DB.QueryRow(categoryQuery, skill).Scan(&category)
		if err != nil {
			category = "Others"
		}

		// Add skill to its category
		categoryMap[category] = append(categoryMap[category], skill)
	}

	// Convert map to slice of CategorizedExpertise
	var result []CategorizedExpertise

	// Define preferred order of categories
	preferredOrder := []string{"Programming Languages", "Frameworks & Libraries", "Web & Database", "Tools & Platforms", "Others"}

	// Add categories in preferred order first
	for _, cat := range preferredOrder {
		if skills, exists := categoryMap[cat]; exists && len(skills) > 0 {
			result = append(result, CategorizedExpertise{
				Category: cat,
				Skills:   skills,
			})
			delete(categoryMap, cat)
		}
	}

	// Add any remaining categories not in preferred order
	for category, skills := range categoryMap {
		if len(skills) > 0 {
			result = append(result, CategorizedExpertise{
				Category: category,
				Skills:   skills,
			})
		}
	}

	// Return empty array if no data
	if result == nil {
		result = []CategorizedExpertise{}
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}
