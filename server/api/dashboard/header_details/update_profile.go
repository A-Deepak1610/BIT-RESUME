package headerdetails

import (
	"fmt"
	"net/http"

	"bitresume/config" // ✅ use your global DB

	"github.com/gin-gonic/gin"
)

type ProfileUpdate struct {
	Domain   string `json:"domain"`
	Phone    string `json:"phone"`
	Github   string `json:"github"`
	Linkedin string `json:"linkedin"`
	Location string `json:"location"`
}

func UpdateProfile(c *gin.Context) {
	rollno := c.GetString("rollNo")
	var profile ProfileUpdate
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}
	fmt.Println("Roll Number:", rollno)
	fmt.Printf("Received Profile: %+v\n", profile)
	query := `
		INSERT INTO student_info (rollno, domain, phone_no, github_url, linkedin_url, location)
		VALUES (?, ?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			domain = VALUES(domain),
			phone_no = VALUES(phone_no),
			github_url = VALUES(github_url),
			linkedin_url = VALUES(linkedin_url),
			location = VALUES(location);
	`
	_, err := config.DB.Exec(query,
		rollno,
		profile.Domain,
		profile.Phone,
		profile.Github,
		profile.Linkedin,
		profile.Location,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update DB",
			"error":   err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Profile updated successfully",
		"rollno":  rollno,
		"data":    profile,
	})
}
func GetProfileDetails(c *gin.Context) {
	type ProfileDetails struct {
		Name       string `json:"user_name"`
		Domain     string `json:"domain"`
		Phone      string `json:"phone"`
		Github     string `json:"github"`
		Linkedin   string `json:"linkedin"`
		Location   string `json:"location"`
		Email      string `json:"user_email"`
		Batch      string `json:"batch"`
		Department string `json:"department"`
	}
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
	query := "SELECT l.user_name,s.domain,s.phone_no,s.github_url,s.linkedin_url,s.location,l.user_email,l.batch,l.department FROM student_info s join login l on s.rollno=l.rollno and s.rollno=?"
	var profile ProfileDetails
	err := config.DB.QueryRow(query, rollno).Scan(&profile.Name, &profile.Domain, &profile.Phone, &profile.Github, &profile.Linkedin, &profile.Location, &profile.Email, &profile.Batch, &profile.Department)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to fetch profile details",
			"error":   err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data": profile,
	})
}
