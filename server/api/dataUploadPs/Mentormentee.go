package dataUploadPs

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"github.com/gin-gonic/gin"
)

func UploadMentorMentee(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		fmt.Print("The file could not be received")
		return
	}
	const saveDir = "data/MENTOR-MENTEE.xlsx"
	if err := os.MkdirAll(filepath.Dir(saveDir), os.ModePerm); err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create data directory: " + err.Error()})
		return
	}

	if _, err := os.Stat(saveDir); err == nil {
		if err := os.Remove(saveDir); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove old file: " + err.Error()})
			return
		}
	}

	if err := c.SaveUploadedFile(file, saveDir); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save new file: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": fmt.Sprintf("New Excel sheet uploaded and replaced successfully: %s", file.Filename),
	})

}