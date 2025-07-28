package addevents

import (
	"bitresume/config"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// AddEvents handles the submission of new event data via multipart/form-data
func AddEvents(c *gin.Context) {
	// Parse basic form fields
	eventName := c.PostForm("event_name")
	eventType := c.PostForm("type")
	deadline := c.PostForm("deadline")
	location := c.PostForm("location")
	applyLink := c.PostForm("apply_link")
	domains := c.PostForm("domains")
	description := c.PostForm("description")
	rules := c.PostForm("rules")
	constraints := c.PostForm("constraints")
	minTeamSize := c.PostForm("min_team_size")
	maxTeamSize := c.PostForm("max_team_size")
	noOfRounds := c.PostForm("no_of_rounds")
	onlineRounds := c.PostForm("online_rounds")
	offlineRounds := c.PostForm("offline_rounds")
	finalPrice1 := c.PostForm("final_prize1")
	finalPrice2 := c.PostForm("final_prize2")
	finalPrice3 := c.PostForm("final_prize3")
	log.Println("Received event data:", eventName, eventType, deadline, minTeamSize, maxTeamSize,
		noOfRounds, onlineRounds, offlineRounds, location, applyLink)
	// Handle optional file upload
	var imageURL string
	file, err := c.FormFile("image")
	if err == nil {
		imageURL = "uploads/events/" + file.Filename
		if err := c.SaveUploadedFile(file, imageURL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
	}
	var id int
	err = config.DB.QueryRow(`SELECT COALESCE(MAX(id), 0) FROM events`).Scan(&id)
	if err != nil {
		log.Println("Error fetching max id:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch max id"})
		return
	}

	eventCode := fmt.Sprintf("%02dBIT%d", time.Now().Year()%100, id+1)
	// Insert into database
	query, err := config.DB.Prepare(`
		INSERT INTO events (
			event_name,event_code, type, deadline, min_team_size, max_team_size,
			no_of_rounds, online_rounds, offline_rounds, location, apply_link,
			domains, description, rules, constraints,final_price1,final_price2,final_price3,image_url
		) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?,?)
	`)
	if err != nil {
		log.Println("Error preparing insert:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = query.Exec(
		eventName, eventCode, eventType, deadline, minTeamSize, maxTeamSize,
		noOfRounds, onlineRounds, offlineRounds, location, applyLink,
		domains, description, rules, constraints, finalPrice1, finalPrice2, finalPrice3, imageURL,
	)
	if err != nil {
		log.Println("Error executing insert:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("Event inserted successfully")
	c.JSON(http.StatusOK, gin.H{"message": "Event added successfully"})
}
