package manageactivities

import (
	"bitresume/config"
	facultymodel "bitresume/models/faculty"
	// "bitresume/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ReceiveActivityData(c *gin.Context) {
	activity_title := c.PostForm("activity_title")
	activity_type := c.PostForm("activity_type")
	description := c.PostForm("description")
	start_date := c.PostForm("start_date")
	end_date := c.PostForm("end_date")
	linkorlocation := c.PostForm("linkorlocation")
	year_type := c.PostForm("year_type")
	target_dept := c.PostForm("target_dept")
	specific_rollno := c.PostForm("specific_rollno")
	all_students := c.PostForm("all_students")
	var boolvalue int
	if all_students == "1" {
		boolvalue = 1
	}
	if all_students == "0" {
		boolvalue = 0
	}

	// cookie, err := c.Cookie("BITRESUME")
	// if err != nil {
	// 	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authentication token is missing"})
	// 	return
	// }

	// claims, err := utils.ParseJWT(cookie)
	// if err != nil {
	// 	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authentication token"})
	// 	return
	// }

	// // Extract roll number from claims
	// rollno, ok := claims["rollNo"].(string)
	// if !ok {
	// 	c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Roll number not found in token"})
	// 	return
	// }

	query := `
		insert into activity_list
		(
			faculty_name,
			faculty_id,
			activity_title,
			activity_type,
			description,
			start_date,
			end_date,
			linkorlocation,
			all_students,
			specific_rollno,
			year_type,
			target_dept,
			created_at
		) values (?,?,?,?,?,?,?,?,?,?,?,?,current_date)
	`

	_, err := config.DB.Exec(query, "Veerendra", "7376242AD336", activity_title, activity_type, description, start_date, end_date, linkorlocation, boolvalue, specific_rollno, year_type, target_dept)

	if err != nil {
		fmt.Print(err.Error())
		c.JSON(500, "could not insert to db")
		return
	}

	c.JSON(200, "Successful")
}

func GetActivityData(c *gin.Context) {
	// Retrieve JWT token from cookie
	// cookie, err := c.Cookie("BITRESUME")
	// if err != nil {
	// 	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authentication token is missing"})
	// 	return
	// }

	// // Parse JWT token to get claims
	// claims, err := utils.ParseJWT(cookie)
	// if err != nil {
	// 	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authentication token"})
	// 	return
	// }

	// // Extract roll number from claims
	// rollno, ok := claims["rollNo"].(string)
	// if !ok {
	// 	c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Roll number not found in token"})
	// 	return
	// }

	// Query to fetch activity data from the database
	rows, err := config.DB.Query(`
	SELECT 
		activity_title, activity_type, description, start_date, end_date, 
		linkorlocation, all_students, specific_rollno, year_type, target_dept 
	FROM activity_list 
	WHERE faculty_id = ? AND end_date >= CURDATE()`, "7376242AD336")

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch activity data from database"})
		return
	}
	defer rows.Close()

	var records []facultymodel.ManageActivities
	for rows.Next() {
		var r facultymodel.ManageActivities
		err := rows.Scan(
			&r.Activity_title, &r.Activity_type, &r.Description,
			&r.Start_date, &r.End_date, &r.Linkorlocation,
			&r.All_students, &r.Specific_rollno, &r.Year_type, &r.Target_dept,
		)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to read activity data"})
			return
		}
		records = append(records, r)
	}

	if err := rows.Err(); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Error while processing data from database"})
		return
	}
	c.JSON(http.StatusOK, records)
}
