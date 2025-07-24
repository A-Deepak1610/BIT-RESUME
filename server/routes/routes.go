package routes

import (
	auth "bitresume/api/auth"
	achievementgraph "bitresume/api/dashboard/achievement_graph"
	activitygraph "bitresume/api/dashboard/activity_graph"
	headerdetails "bitresume/api/dashboard/header_details"
	manageactivities "bitresume/api/faculty/ActivityTracker/ManageActivities"
	addevents "bitresume/api/faculty/AddEvents"
	pointshandlers "bitresume/api/pointsHandlers"
	certificates "bitresume/api/upload-view/Certificates"
	"bitresume/api/upload-view/internship"
	"bitresume/api/upload-view/paperpresentstion"
	"bitresume/api/upload-view/patents"
	"bitresume/api/upload-view/projects"
	"bitresume/api/upload-view/workshops"
	"bitresume/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine){
	authGroup := r.Group("/api/auth")
	authGroup.GET("/google/login", auth.GoogleLogin)
	authGroup.GET("/google/callback", auth.GoogleCallback)
	studentOnly := r.Group("/api")
	authGroup.GET("/me", auth.Me)
	authGroup.GET("/logout", auth.Logout)
	studentOnly.Use(middleware.AuthorizeRoles("student"))
	{
		studentOnly.POST("/points_logs/", pointshandlers.HandlePointlogs)
		studentOnly.POST("/points_logs/ps/attempts", pointshandlers.HandlePs)
		studentOnly.POST("/points_logs/ps/levels", pointshandlers.HandlePsLevelStatus)
		studentOnly.GET("/activity_graph/fetchData/:rollno", activitygraph.FetchActivityGraphData)
		studentOnly.GET("/achievement_graph/fetchData/:rollno", achievementgraph.HandleFetchAchievementGraph)
		studentOnly.GET("/achievement_graph/institute_avg/fetchData", achievementgraph.HandleFetchInstituteAvg)
		studentOnly.GET("/ps/attempts/:rollno", pointshandlers.HandleFetchPsAttempts)
		studentOnly.GET("/ps/levels_status/:rollno", pointshandlers.HandleFetchPsLevels)
		studentOnly.POST("/ps/mentor_mentee/", pointshandlers.HandleMentee)
		studentOnly.GET("/mentor/details/:rollno", pointshandlers.FetchMentorSkillStats)
		studentOnly.POST("/mentee/add", pointshandlers.HandleMentee)
		studentOnly.POST("/projects",projects.RecieveProjectData)
		studentOnly.POST("/patents",patents.ReceivePatentsData)
		studentOnly.POST("/internships",internship.ReceiveInternshipData)
		studentOnly.POST("/workshops",workshops.ReceiveWorkshopData)
		studentOnly.GET("/fetch/header_details/:rollno",headerdetails.FetchDataRank)
		studentOnly.GET("/mentor/institute_avg/fetchData", pointshandlers.FetchSkillWiseAvgMentees)
		studentOnly.GET("sem_wise_totaldays",pointshandlers.HandleSemDays)
		studentOnly.POST("/paperpresentation",paperpresentstion.ReceivePaperPresentationData)
		studentOnly.POST("/certificates/online-course",certificates.ReceiveCertificateData)
		studentOnly.POST("/certificates/events",certificates.ReceiveCertificateData)
		studentOnly.POST("/certificates/participation",certificates.ReceiveCertificateData)
	}
	facultyOnly := r.Group("/api")
	facultyOnly.Use(middleware.AuthorizeRoles("faculty"))
	{
		facultyOnly.GET("/manageactivities",manageactivities.GetActivityData)
	}
	// faculty page
	r.POST("/api/addevents/create",addevents.AddEvents)	
	r.POST("/api/manageactivities/createActivity",manageactivities.ReceiveActivityData)
}
