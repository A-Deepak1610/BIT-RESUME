package resume

import (
	"bitresume/models"
	"database/sql" // Import the sql package to handle NullString
	"fmt"
	"net/http"
	"strings"

	"bitresume/config"

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

	// Step 1: Fetch base projects
	rows, err := config.DB.Query("SELECT id, title_idea, summary FROM projects WHERE rollno = ?", rollno)
	if err != nil {
		fmt.Println("Error fetching from projects table:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch base project data"})
		return
	}
	defer rows.Close()

	projectsMap := make(map[int]*models.Project)
	var projectIDs []int

	for rows.Next() {
		var p models.Project
		var id int
		if err := rows.Scan(&id, &p.Title, &p.Description); err != nil {
			fmt.Println("Error scanning base project row:", err)
			continue
		}
		projectsMap[id] = &p
		projectIDs = append(projectIDs, id)
	}

	if len(projectIDs) == 0 {
		c.JSON(http.StatusOK, []models.Project{})
		return
	}

	// Prepare args for IN clause
	args := make([]interface{}, len(projectIDs))
	for i, id := range projectIDs {
		args[i] = id
	}

	// Generate placeholders (?,?,?)
	placeholders := "?" + strings.Repeat(",?", len(projectIDs)-1)

	// Step 2: Fetch all GitHub links in one query
	linkQuery := fmt.Sprintf("SELECT project_id, github_link FROM project_files WHERE project_id IN (%s)", placeholders)
	linkRows, err := config.DB.Query(linkQuery, args...)
	if err != nil {
		fmt.Println("Error fetching github links:", err)
	} else {
		defer linkRows.Close()
		for linkRows.Next() {
			var projectID int
			var githubLink sql.NullString
			if err := linkRows.Scan(&projectID, &githubLink); err == nil {
				if proj, ok := projectsMap[projectID]; ok {
					proj.Github = githubLink.String
				}
			}
		}
	}

	// Step 3: Fetch all tech stacks in one query
	stackQuery := fmt.Sprintf("SELECT project_id, tech_name FROM project_tech_stack WHERE project_id IN (%s)", placeholders)
	stackRows, err := config.DB.Query(stackQuery, args...)
	if err != nil {
		fmt.Println("Error fetching tech stack:", err)
	} else {
		defer stackRows.Close()
		for stackRows.Next() {
			var projectID int
			var techName string
			if err := stackRows.Scan(&projectID, &techName); err == nil {
				if proj, ok := projectsMap[projectID]; ok {
					proj.Stack = append(proj.Stack, techName)
				}
			}
		}
	}

	// Step 4: Convert map to slice
	var allProjects []models.Project
	for _, id := range projectIDs {
		allProjects = append(allProjects, *projectsMap[id])
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

	// Optimized Query: Fetch skills and their categories in a single query
	query := `
		SELECT DISTINCT 
			pt.tech_name, 
			COALESCE(c.category_name, 'Others') AS category
		FROM projects p
		JOIN project_tech_stack pt ON p.id = pt.project_id
		LEFT JOIN skills s ON LOWER(s.skill_name) = LOWER(pt.tech_name)
		LEFT JOIN skill_category_map scm ON s.skill_id = scm.skill_id
		LEFT JOIN categories c ON scm.category_id = c.category_id
		WHERE p.rollno = ?
	`
	rows, err := config.DB.Query(query, rollno)
	if err != nil {
		fmt.Println("Error fetching areas of expertise:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch areas of expertise"})
		return
	}
	defer rows.Close()

	// Map to hold categorized skills
	categoryMap := make(map[string][]string)

	for rows.Next() {
		var skill string
		var category string
		if err := rows.Scan(&skill, &category); err != nil {
			fmt.Println("Error scanning expertise row:", err)
			continue
		}
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
