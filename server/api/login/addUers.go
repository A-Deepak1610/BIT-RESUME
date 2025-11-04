package login

import (
	"bitresume/config"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type AddUserRequest struct {
	Name       string `json:"name" binding:"required"`
	Email      string `json:"email" binding:"required,email"`
	RollNo     string `json:"rollno"`
	FacultyId  string `json:"facultyId"`
	Role       string `json:"role" binding:"required"`
	Year       string `json:"year"`
	Department string `json:"department" binding:"required"`
	MentorId   string `json:"mentorId"`
	Mobile     string `json:"mobile" binding:"required"`
}

func AddUsers(c *gin.Context) {
	var req AddUserRequest

	// Bind and validate JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request data",
			"details": err.Error(),
		})
		return
	}

	// Validate role
	validRoles := map[string]bool{"student": true, "faculty": true, "admin": true}
	role := strings.ToLower(req.Role)
	if !validRoles[role] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid role. Must be one of: student, faculty, admin",
		})
		return
	}

	// Validate email domain
	if !strings.HasSuffix(strings.ToLower(req.Email), "@bitsathy.ac.in") {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email must be a valid @bitsathy.ac.in address",
		})
		return
	}

	// Role-specific validation
	var rollno string
	if role == "student" {
		if req.RollNo == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Roll number is required for students",
			})
			return
		}
		if req.Year == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Year is required for students",
			})
			return
		}
		rollno = req.RollNo
	} else if role == "faculty" || role == "admin" {
		if req.FacultyId == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Faculty ID is required for faculty/admin",
			})
			return
		}
		rollno = req.FacultyId
	}

	// Check if user already exists using config.DB
	var exists bool
	checkQuery := "SELECT EXISTS(SELECT 1 FROM login WHERE user_email = ? OR rollno = ?)"
	err := config.DB.QueryRow(checkQuery, req.Email, rollno).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error while checking user existence",
			"details": err.Error(),
		})
		return
	}

	if exists {
		c.JSON(http.StatusConflict, gin.H{
			"error": "User with this email or roll number already exists",
		})
		return
	}

	// Insert new user using config.DB
	insertQuery := `
		INSERT INTO login (user_name, user_email, rollno, role, year, department, mentor_id)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`

	result, err := config.DB.Exec(
		insertQuery,
		req.Name,
		req.Email,
		rollno,
		role,
		req.Year,
		req.Department,
		req.MentorId,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to add user",
			"details": err.Error(),
		})
		return
	}

	// Get the inserted ID
	userId, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve user ID",
		})
		return
	}

	// Success response
	c.JSON(http.StatusCreated, gin.H{
		"message": "User added successfully",
		"user": gin.H{
			"id":         userId,
			"name":       req.Name,
			"email":      req.Email,
			"rollno":     rollno,
			"role":       role,
			"year":       req.Year,
			"department": req.Department,
			"mentor_id":  req.MentorId,
		},
	})
}