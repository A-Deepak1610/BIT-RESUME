package resume

import (
	"bitresume/config"
	"bitresume/models"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProjectsData(c *gin.Context) {
	rollno := c.Param("rollno")
	var projects []models.Projects
	var title, description, github string
	var techstackRaw string
	rows, err := config.DB.Query("select title_idea,objective,tech_stack,github_link from projects where rollno = ?", rollno)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"message": "Could not fetch the data from database!!"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		fmt.Println("Starting scan...")
		err = rows.Scan(&title, &description, &techstackRaw, &github)
		if err != nil {
			fmt.Println("Scan error:", err)
			c.JSON(http.StatusBadGateway, gin.H{"message": "Could not scan the data!!"})
			return
		}
		fmt.Println("Raw tech_stack from DB:", techstackRaw)

		var techstack []string
		err = json.Unmarshal([]byte(techstackRaw), &techstack)
		if err != nil {
			fmt.Println("JSON unmarshal error:", err)
			fmt.Println("Value causing error:", techstackRaw)
			techstack = []string{}
		}

		project := models.Projects{
			Title:        title,
			Descrription: description,
			Stack:        techstack,
			Github:       github,
		}

		projects = append(projects, project)
	}

	c.JSON(http.StatusAccepted, projects)
}