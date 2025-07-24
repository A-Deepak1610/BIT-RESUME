package addevents

import (
	"bitresume/config"
	"bitresume/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

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

	// Convert numeric fields
	minTeamSize, _ := strconv.Atoi(c.PostForm("min_team_size"))
	maxTeamSize, _ := strconv.Atoi(c.PostForm("max_team_size"))
	noOfRounds, _ := strconv.Atoi(c.PostForm("no_of_rounds"))

	onlineRounds := c.PostForm("online_rounds")
	offlineRounds := c.PostForm("offline_rounds")

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

	// Parse JSON fields
	var finalPrizes map[string]string
	if err := json.Unmarshal([]byte(c.PostForm("final_prizes")), &finalPrizes); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid final_prizes JSON"})
		return
	}

	var rounds []models.RoundData
	if err := json.Unmarshal([]byte(c.PostForm("rounds_data")), &rounds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rounds_data JSON"})
		return
	}

	// Insert into database
	insertStmt, err := config.DB.Prepare(`
		INSERT INTO events (
			event_name, type, deadline, min_team_size, max_team_size,
			no_of_rounds, online_rounds, offline_rounds, location, apply_link,
			domains, description, rules, constraints, image_url
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		log.Println("Error preparing insert:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	_, err = insertStmt.Exec(
		eventName, eventType, deadline, minTeamSize, maxTeamSize,
		noOfRounds, onlineRounds, offlineRounds, location, applyLink,
		domains, description, rules, constraints, imageURL,
	)
	if err != nil {
		log.Println("Error executing insert:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("Event inserted successfully")
	fmt.Printf("Received Event: %+v\nFinal Prizes: %+v\nRounds: %+v\n", eventName, finalPrizes, rounds)

	c.JSON(http.StatusOK, gin.H{"message": "Event added successfully"})
}
