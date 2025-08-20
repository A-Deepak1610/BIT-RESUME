package resume

import (
    "bitresume/config"
    "bitresume/models"
    "fmt"
    "net/http"

    "github.com/gin-gonic/gin"
)

func GetHackathonData(c *gin.Context) {
    rollno := c.Param("rollno")
    var hackathon []models.Hackathon

    // Your SQL query selects three columns
    rows, err := config.DB.Query("SELECT event_name, event_code, did_you_win FROM certificates_events WHERE rollno = ?", rollno)
    if err != nil {
        fmt.Print("error:", err.Error())
        c.JSON(http.StatusBadRequest, gin.H{"message": "Could not fetch the data from certificates_events table"})
        return
    }
    defer rows.Close()

    for rows.Next() {
        var p models.Hackathon
        var eventCode string

        err = rows.Scan(&p.Title, &eventCode, &p.Place)
        if err != nil {
            fmt.Print("Error:", err.Error())
            c.JSON(http.StatusBadRequest, gin.H{"message": "Could not scan the data from certificates_events table"})
            return
        }

        // Fetch image_url for this eventCode
        var imageURL string
        err = config.DB.QueryRow("SELECT image_url FROM events WHERE event_code = ?", eventCode).Scan(&imageURL)
        if err == nil {
            p.ImgUrl = imageURL // Make sure models.Hackathon has ImgUrl field
        } else {
            p.ImgUrl = "" // Set to empty if not found
        }

        hackathon = append(hackathon, p)
    }

    // Send response after processing all rows
    c.JSON(http.StatusOK, hackathon)
}